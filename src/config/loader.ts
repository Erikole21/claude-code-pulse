import { cosmiconfig } from 'cosmiconfig'

export interface PulseConfig {
  skills: string[]
  maxAge: number
  transformer: 'auto' | 'claude' | 'static'
  silent: boolean
}

const DEFAULTS: PulseConfig = {
  skills: ['critical', 'high'],
  maxAge: 86400,
  transformer: 'auto',
  silent: false,
}

const ALL_PRIORITIES: PulseConfig['skills'] = ['critical', 'high', 'medium']

/** Normalizes `skills` from cosmiconfig (supports scalar `"all"`). */
export function normalizeSkillsFilter(raw: unknown): PulseConfig['skills'] {
  if (raw === 'all') {
    return [...ALL_PRIORITIES]
  }
  if (Array.isArray(raw) && raw.every((x): x is string => typeof x === 'string')) {
    return raw.length > 0 ? raw : DEFAULTS.skills
  }
  return DEFAULTS.skills
}

export async function loadConfig(): Promise<PulseConfig> {
  const explorer = cosmiconfig('pulse')

  try {
    const result = await explorer.search()
    if (result && result.config) {
      const c = result.config as Partial<PulseConfig> & { skills?: unknown }
      const merged = { ...DEFAULTS, ...c }
      return {
        ...merged,
        skills: normalizeSkillsFilter(c.skills !== undefined ? c.skills : merged.skills),
      }
    }
  } catch {
    // ignore config load errors, use defaults
  }

  return { ...DEFAULTS }
}
