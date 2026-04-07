import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { loadConfig, normalizeSkillsFilter } from '../src/config/loader.js'

describe('normalizeSkillsFilter', () => {
  it('expands "all" to three priorities', () => {
    expect(normalizeSkillsFilter('all')).toEqual(['critical', 'high', 'medium'])
  })

  it('keeps non-empty arrays', () => {
    expect(normalizeSkillsFilter(['critical'])).toEqual(['critical'])
  })

  it('falls back to defaults for invalid input', () => {
    expect(normalizeSkillsFilter('bogus')).toEqual(['critical', 'high'])
    expect(normalizeSkillsFilter(123)).toEqual(['critical', 'high'])
    expect(normalizeSkillsFilter([])).toEqual(['critical', 'high'])
  })
})

describe('loadConfig', () => {
  const originalCwd = process.cwd()
  let dir: string

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'pulse-loader-'))
    process.chdir(dir)
  })

  afterEach(() => {
    process.chdir(originalCwd)
    rmSync(dir, { recursive: true, force: true })
  })

  it('loads skills "all" and maxAge from .pulserc.json', async () => {
    writeFileSync(join(dir, '.pulserc.json'), JSON.stringify({ skills: 'all', maxAge: 3600 }))
    const cfg = await loadConfig()
    expect(cfg.skills).toEqual(['critical', 'high', 'medium'])
    expect(cfg.maxAge).toBe(3600)
    expect(cfg.transformer).toBe('auto')
    expect(cfg.silent).toBe(false)
  })
})
