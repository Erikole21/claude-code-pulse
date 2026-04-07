import type { Command } from 'commander'
import { SKILLS_REGISTRY, type SkillDefinition } from '../config/skills-registry.js'
import { loadConfig } from '../config/loader.js'
import { fetchDoc } from '../core/fetcher.js'
import { transformSkill } from '../core/transformer.js'
import { install } from '../core/installer.js'
import { readMeta, writeMeta, isStale } from '../core/meta.js'
import { log, warn, setSilent } from '../utils/logger.js'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

interface SyncOptions {
  force?: boolean
  ifStale?: string
  silent?: boolean
  skills?: string[]
}

interface SyncResult {
  id: string
  action: 'updated' | 'skipped' | 'failed'
  transformer?: string
  error?: string
}

function getSkillsFallbackDir(): string {
  const thisFile = fileURLToPath(import.meta.url)
  const root = join(dirname(thisFile), '..', '..')
  return join(root, 'skills-fallback')
}

function loadStaticSkillContent(skillId: string): string {
  const fallbackDir = getSkillsFallbackDir()
  const skillPath = join(fallbackDir, skillId, 'SKILL.md')
  return readFileSync(skillPath, 'utf-8')
}

export async function syncCore(options: SyncOptions): Promise<SyncResult[]> {
  if (options.silent) {
    setSilent(true)
  }

  const config = await loadConfig()

  // Staleness check
  if (options.ifStale) {
    const maxAge = parseInt(options.ifStale, 10)
    if (!isNaN(maxAge) && !isStale(maxAge)) {
      setSilent(false)
      return []
    }
  }

  // Filter skills
  let skills: SkillDefinition[]
  if (options.skills && options.skills.length > 0) {
    skills = SKILLS_REGISTRY.filter((s) => options.skills!.includes(s.id))
  } else {
    const priorities = config.skills ?? ['critical', 'high']
    skills = SKILLS_REGISTRY.filter((s) => priorities.includes(s.priority) || priorities.includes('all'))
  }

  const meta = readMeta()
  const results: SyncResult[] = []
  let hasErrors = false

  log('Syncing skills...')

  for (const skill of skills) {
    try {
      if (skill.static) {
        // Static skills: install from bundled content
        const content = loadStaticSkillContent(skill.id)
        install([{ id: skill.id, content }])
        meta.skills[skill.id] = {
          syncedAt: new Date().toISOString(),
          transformedWith: 'fixed',
        }
        results.push({ id: skill.id, action: 'updated', transformer: 'fixed' })
        log(`  ✓ ${skill.id} (static)`)
        continue
      }

      if (!skill.sourceUrl) {
        results.push({ id: skill.id, action: 'skipped' })
        continue
      }

      // Fetch with ETag
      const etag = options.force ? undefined : meta.etags[skill.sourceUrl]
      const fetchResult = await fetchDoc(skill.sourceUrl, etag)

      if (!fetchResult.changed) {
        results.push({ id: skill.id, action: 'skipped', transformer: meta.skills[skill.id]?.transformedWith })
        log(`  · ${skill.id} unchanged (304)`)
        continue
      }

      // Update ETag
      if (fetchResult.etag) {
        meta.etags[skill.sourceUrl] = fetchResult.etag
      }

      // Transform
      const transformed = await transformSkill(skill, fetchResult.content)

      // Install
      install(transformed.map((t) => ({ id: t.id, content: t.content })))

      // Update per-skill meta
      for (const t of transformed) {
        meta.skills[t.id] = {
          syncedAt: new Date().toISOString(),
          transformedWith: t.transformedWith,
          etag: fetchResult.etag,
        }
      }

      results.push({ id: skill.id, action: 'updated', transformer: transformed[0]?.transformedWith })
      log(`  ✓ ${skill.id} updated`)
    } catch (err) {
      hasErrors = true
      const msg = err instanceof Error ? err.message : String(err)
      warn(`  ✗ ${skill.id} failed: ${msg}`)
      results.push({ id: skill.id, action: 'failed', error: msg })
    }
  }

  // Update meta
  meta.version = (await import('../core/meta.js')).readMeta().version
  meta.lastSync = new Date().toISOString()
  meta.lastSyncStatus = hasErrors
    ? (results.some((r) => r.action === 'updated') ? 'partial' : 'failed')
    : 'success'
  if (hasErrors) {
    const errors = results.filter((r) => r.action === 'failed').map((r) => r.error)
    meta.lastSyncError = errors.join('; ')
  } else {
    delete meta.lastSyncError
  }
  writeMeta(meta)

  // Show change table
  if (!options.silent && results.length > 0) {
    log('')
    log('  Skill ID                Action     Transformer')
    log('  ' + '─'.repeat(50))
    for (const r of results) {
      const id = r.id.padEnd(22)
      const action = r.action.padEnd(10)
      const transformer = r.transformer ?? ''
      log(`  ${id}  ${action} ${transformer}`)
    }
    log('')
  }

  setSilent(false)
  return results
}

export function registerSync(program: Command): void {
  program
    .command('sync')
    .description('Fetch, transform, and install skills')
    .option('--force', 'Ignore ETags, re-download everything')
    .option('--if-stale <seconds>', 'Only sync if last sync is older than N seconds')
    .option('--silent', 'Suppress all non-error output')
    .option('--skills <ids...>', 'Sync only specific skill IDs')
    .action(async (opts: SyncOptions) => {
      try {
        await syncCore(opts)
      } catch (err) {
        process.stderr.write(`Error: ${err instanceof Error ? err.message : err}\n`)
        process.exit(1)
      }
    })
}
