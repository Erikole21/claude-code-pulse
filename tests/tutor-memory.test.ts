import { mkdtempSync, rmSync, existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { Command } from 'commander'
import { spawnSync } from 'node:child_process'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  readMemory,
  writeMemory,
  updateMemory,
  logSession,
  getDefaultMemory,
  setBaseDir,
} from '../src/core/tutor-memory.js'
import { registerMemory } from '../src/commands/memory.js'
import { registerUninstall } from '../src/commands/uninstall.js'

async function runMemoryCommand(args: string[]): Promise<void> {
  const program = new Command()
  registerMemory(program)
  await program.parseAsync(['node', 'test', 'memory', ...args])
}

async function runUninstallCommand(args: string[]): Promise<void> {
  const program = new Command()
  registerUninstall(program)
  await program.parseAsync(['node', 'test', 'uninstall', ...args])
}

describe('tutor-memory', () => {
  let dir: string
  let workspaceDir: string
  let originalCwd: string

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'pulse-memory-'))
    workspaceDir = mkdtempSync(join(tmpdir(), 'pulse-workspace-'))
    originalCwd = process.cwd()
    process.chdir(workspaceDir)
    setBaseDir(dir)
    process.exitCode = 0
  })

  afterEach(() => {
    process.chdir(originalCwd)
    setBaseDir(null)
    vi.restoreAllMocks()
    rmSync(dir, { recursive: true, force: true })
    rmSync(workspaceDir, { recursive: true, force: true })
    process.exitCode = 0
  })

  it('readMemory returns null when file does not exist', async () => {
    const result = await readMemory()
    expect(result).toBeNull()
  })

  it('writeMemory creates directory if missing and writes valid JSON', async () => {
    const subDir = join(dir, 'nested', 'path')
    setBaseDir(subDir)
    const memory = getDefaultMemory()
    memory.name = 'Test'
    await writeMemory(memory)

    const filePath = join(subDir, 'memory.json')
    expect(existsSync(filePath)).toBe(true)

    const raw = readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw)
    expect(parsed.name).toBe('Test')
  })

  it('updateMemory merges without losing existing fields', async () => {
    const initial = getDefaultMemory()
    initial.name = 'Erik'
    initial.language = 'es'
    await writeMemory(initial)

    const updated = await updateMemory({ level: 'intermediate' })
    expect(updated.name).toBe('Erik')
    expect(updated.language).toBe('es')
    expect(updated.level).toBe('intermediate')
  })

  it('updateMemory works when no memory exists', async () => {
    const updated = await updateMemory({ name: 'New User' })
    expect(updated.name).toBe('New User')
    expect(updated.level).toBe('beginner')
  })

  it('logSession creates dated file in sessions subdirectory', async () => {
    const date = '2026-04-06'
    await logSession({
      date,
      topicsCovered: ['hooks', 'mcp'],
      endNote: 'Learned about hooks and MCP',
    })

    const sessionsDir = join(dir, 'sessions')
    expect(existsSync(sessionsDir)).toBe(true)

    const filePath = join(sessionsDir, `${date}.json`)
    expect(existsSync(filePath)).toBe(true)

    const raw = readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw)
    expect(parsed.date).toBe(date)
    expect(parsed.topicsCovered).toEqual(['hooks', 'mcp'])
    expect(parsed.endNote).toBe('Learned about hooks and MCP')
  })

  it('--update with invalid JSON shows error and does not modify memory', async () => {
    const initial = getDefaultMemory()
    initial.name = 'Erik'
    await writeMemory(initial)

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    await runMemoryCommand(['--update', 'not json'])
    expect(process.exitCode).toBe(1)
    expect(errorSpy).toHaveBeenCalled()

    const memory = await readMemory()
    expect(memory!.name).toBe('Erik')
  })

  it('--export writes JSON parseable by JSON.parse', async () => {
    const initial = getDefaultMemory()
    initial.name = 'Erik'
    initial.level = 'advanced'
    await writeMemory(initial)

    const chunks: string[] = []
    vi.spyOn(process.stdout, 'write').mockImplementation(((chunk: string | Uint8Array) => {
      chunks.push(chunk.toString())
      return true
    }) as typeof process.stdout.write)

    await runMemoryCommand(['--export'])
    const parsed = JSON.parse(chunks.join(''))
    expect(parsed.name).toBe('Erik')
    expect(parsed.level).toBe('advanced')
  })

  it('uninstall without --purge-memory leaves pulse directory intact', async () => {
    await writeMemory(getDefaultMemory())
    expect(existsSync(join(dir, 'memory.json'))).toBe(true)

    await runUninstallCommand(['--keep-hook', '--keep-skills'])
    expect(existsSync(dir)).toBe(true)
    expect(existsSync(join(dir, 'memory.json'))).toBe(true)
  })

  it('uninstall with --purge-memory deletes pulse directory when confirmed', async () => {
    const homeDir = mkdtempSync(join(tmpdir(), 'pulse-home-'))
    const pulseDir = join(homeDir, '.claude', 'pulse')
    mkdirSync(pulseDir, { recursive: true })
    writeFileSync(join(pulseDir, 'memory.json'), JSON.stringify(getDefaultMemory(), null, 2), 'utf-8')
    expect(existsSync(pulseDir)).toBe(true)

    const tsxCliPath = join(originalCwd, 'node_modules', 'tsx', 'dist', 'cli.mjs')
    const cliPath = join(originalCwd, 'src', 'cli.ts')
    const result = spawnSync(
      process.execPath,
      [tsxCliPath, cliPath, 'uninstall', '--keep-hook', '--keep-skills', '--purge-memory'],
      {
        cwd: workspaceDir,
        env: { ...process.env, USERPROFILE: homeDir, HOME: homeDir },
        input: 'y\n',
        encoding: 'utf-8',
      }
    )

    if (result.error) throw result.error
    rmSync(homeDir, { recursive: true, force: true })
    expect(result.status).toBe(0)
    expect(existsSync(pulseDir)).toBe(false)
  })
})
