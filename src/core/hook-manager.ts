import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { getHookCommand } from '../utils/platform.js'

interface CommandHook {
  type: 'command'
  command: string
}

interface HookMatcher {
  _pulse?: boolean
  matcher: string
  hooks: CommandHook[]
  [key: string]: unknown
}

interface Settings {
  hooks?: {
    SessionStart?: HookMatcher[]
    [key: string]: unknown
  }
  [key: string]: unknown
}

function settingsPath(): string {
  return join(process.cwd(), '.claude', 'settings.json')
}

function readSettings(): Settings {
  const path = settingsPath()
  try {
    return JSON.parse(readFileSync(path, 'utf-8'))
  } catch {
    return {}
  }
}

function writeSettings(settings: Settings): void {
  const path = settingsPath()
  const dir = dirname(path)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  writeFileSync(path, JSON.stringify(settings, null, 2) + '\n', 'utf-8')
}

function findPulseHookIndex(entries: Record<string, unknown>[]): number {
  return entries.findIndex((e) => e._pulse === true)
}

function isValidFormat(entry: Record<string, unknown>): boolean {
  return typeof entry.matcher === 'string' && Array.isArray(entry.hooks)
}

function buildPulseHook(): HookMatcher {
  return {
    _pulse: true,
    matcher: '',
    hooks: [{ type: 'command', command: getHookCommand() }],
  }
}

export function addHook(): void {
  const settings = readSettings()

  if (!settings.hooks) {
    settings.hooks = {}
  }

  if (!settings.hooks.SessionStart) {
    settings.hooks.SessionStart = []
  }

  const sessionStart = settings.hooks.SessionStart as Record<string, unknown>[]
  const idx = findPulseHookIndex(sessionStart)

  if (idx >= 0) {
    // Migrate old format to new if needed
    if (!isValidFormat(sessionStart[idx])) {
      sessionStart[idx] = buildPulseHook()
      writeSettings(settings)
    }
    return
  }

  sessionStart.push(buildPulseHook())
  writeSettings(settings)
}

export function removeHook(): void {
  const path = settingsPath()
  if (!existsSync(path)) return

  const settings = readSettings()
  if (!settings.hooks) return

  const sessionStart = settings.hooks.SessionStart as HookMatcher[] | undefined
  if (!sessionStart) return

  if (findPulseHookIndex(sessionStart) < 0) return

  const filtered = sessionStart.filter((e) => e._pulse !== true)

  if (filtered.length > 0) {
    settings.hooks.SessionStart = filtered
  } else {
    delete settings.hooks.SessionStart
  }

  if (Object.keys(settings.hooks).length === 0) {
    delete settings.hooks
  }

  writeSettings(settings)
}
