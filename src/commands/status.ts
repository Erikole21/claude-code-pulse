import type { Command } from 'commander'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { SKILLS_REGISTRY } from '../config/skills-registry.js'
import { readMeta } from '../core/meta.js'
import { detectPlatform, isClaudeCliAvailable } from '../utils/platform.js'
import { log } from '../utils/logger.js'
import { getVersion } from '../version.js'

function relativeTime(isoDate: string): string {
  const ms = Date.now() - new Date(isoDate).getTime()
  if (isNaN(ms)) return 'unknown'

  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function checkHookInstalled(): boolean {
  const settingsPath = join(process.cwd(), '.claude', 'settings.json')
  try {
    const settings = JSON.parse(readFileSync(settingsPath, 'utf-8'))
    const hooks = settings?.hooks?.SessionStart
    if (!Array.isArray(hooks)) return false
    return hooks.some((h: Record<string, unknown>) => h._pulse === true)
  } catch {
    return false
  }
}

export function registerStatus(program: Command): void {
  program
    .command('status')
    .description('Show pulse status overview')
    .action(async () => {
      const meta = readMeta()
      const platform = detectPlatform()
      let claudeAvailable = false
      try {
        claudeAvailable = await isClaudeCliAvailable()
      } catch {
        // spawn may fail on some platforms
      }
      const hookInstalled = checkHookInstalled()
      const installed = Object.keys(meta.skills).length

      log(`  pulse v${getVersion()}`)
      log(`  Directory:          ${process.cwd()}`)
      log(`  Skills:             ${installed} / ${SKILLS_REGISTRY.length} installed`)

      if (meta.lastSync) {
        const syncTime = relativeTime(meta.lastSync)
        log(`  Last sync:          ${syncTime} (${meta.lastSyncStatus})`)
        if (meta.lastSyncStatus === 'failed' && meta.lastSyncError) {
          log(`  Last error:         ${meta.lastSyncError}`)
        }
      } else {
        log('  Last sync:          never')
      }

      log(`  Hook SessionStart:  ${hookInstalled ? '✓ installed' : '✗ not installed'}`)
      log(`  Claude CLI:         ${claudeAvailable ? '✓ available (transformer: claude)' : '✗ not available (transformer: static)'}`)
      log(`  Platform:           ${platform}`)
      log(`  firstSessionDone:   ${meta.firstSessionDone}`)
    })
}
