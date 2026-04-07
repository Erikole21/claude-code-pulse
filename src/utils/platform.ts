import { execFile } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'

export type Platform = 'windows' | 'unix' | 'wsl'

export function detectPlatform(): Platform {
  if (process.platform === 'win32') return 'windows'

  if (process.platform === 'linux' && existsSync('/proc/version')) {
    try {
      const version = readFileSync('/proc/version', 'utf-8')
      if (/microsoft/i.test(version)) return 'wsl'
    } catch {
      // ignore read errors
    }
  }

  return 'unix'
}

export function getHookCommand(): string {
  const platform = detectPlatform()

  if (platform === 'windows') {
    return 'npx.cmd pulse sync --if-stale 86400 --silent & npx.cmd pulse greet --once'
  }

  return 'npx pulse sync --if-stale 86400 --silent && npx pulse greet --once || true'
}

export function isClaudeCliAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    const cmd = process.platform === 'win32' ? 'claude.cmd' : 'claude'

    const child = execFile(cmd, ['--version'], { timeout: 5000 }, (err) => {
      if (err) {
        if (process.platform === 'win32' && cmd === 'claude.cmd') {
          // Try without .cmd extension on Windows
          execFile('claude', ['--version'], { timeout: 5000 }, (err2) => {
            resolve(!err2)
          })
          return
        }
        resolve(false)
        return
      }
      resolve(true)
    })

    child.on('error', () => resolve(false))
  })
}
