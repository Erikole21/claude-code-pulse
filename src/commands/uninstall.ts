import type { Command } from 'commander'
import { readdirSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { createInterface } from 'node:readline'
import { removeHook } from '../core/hook-manager.js'
import { isManaged } from '../core/installer.js'
import { getMetaPath } from '../core/meta.js'
import { getBaseDir } from '../core/tutor-memory.js'
import { log, success } from '../utils/logger.js'

interface UninstallOptions {
  keepHook?: boolean
  keepSkills?: boolean
  purgeMemory?: boolean
}

export function registerUninstall(program: Command): void {
  program
    .command('uninstall')
    .description('Remove pulse from the current project')
    .option('--keep-hook', 'Leave the SessionStart hook in place')
    .option('--keep-skills', 'Leave installed skill files in place')
    .option('--purge-memory', 'Also delete tutor memory (~/.claude/pulse/)')
    .action(async (opts: UninstallOptions) => {
      // Remove hook
      if (!opts.keepHook) {
        removeHook()
        log('  ✓ SessionStart hook removed')
      } else {
        log('  · SessionStart hook kept (--keep-hook)')
      }

      // Remove pulse-managed skills
      if (!opts.keepSkills) {
        const skillsDir = join(process.cwd(), '.claude', 'skills')
        if (existsSync(skillsDir)) {
          let removed = 0
          const entries = readdirSync(skillsDir, { withFileTypes: true })
          for (const entry of entries) {
            if (!entry.isDirectory()) continue
            if (!entry.name.startsWith('cc-')) continue

            const dirPath = join(skillsDir, entry.name)
            if (isManaged(dirPath)) {
              rmSync(dirPath, { recursive: true, force: true })
              removed++
              log(`  ✓ Removed ${entry.name}`)
            }
          }
          if (removed === 0) {
            log('  · No pulse-managed skills found')
          }
        }
      } else {
        log('  · Skills kept (--keep-skills)')
      }

      // Remove meta file
      const metaPath = getMetaPath()
      if (existsSync(metaPath)) {
        rmSync(metaPath)
        log('  ✓ Meta file removed')
      }

      // Purge memory if requested
      if (opts.purgeMemory) {
        const pulseDir = getBaseDir()
        if (existsSync(pulseDir)) {
          const rl = createInterface({ input: process.stdin, output: process.stdout })
          const yes = await new Promise<boolean>((resolve) => {
            rl.question('Delete all tutor memory and session logs? (y/N) ', (answer) => {
              rl.close()
              resolve(answer.trim().toLowerCase() === 'y')
            })
          })
          if (yes) {
            rmSync(pulseDir, { recursive: true, force: true })
            log('  ✓ Tutor memory purged')
          } else {
            log('  · Tutor memory preserved (cancelled)')
          }
        } else {
          log('  · No tutor memory found')
        }
      }

      log('')
      success('pulse has been uninstalled.')
    })
}
