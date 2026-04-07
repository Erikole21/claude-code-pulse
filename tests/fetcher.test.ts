import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { SkillDefinition } from '../src/config/skills-registry.js'
import { readMeta } from '../src/core/meta.js'

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}))

vi.mock('undici', () => ({
  request: requestMock,
}))

import { fetchAll, fetchDoc } from '../src/core/fetcher.js'

function mockResponse(statusCode: number, body: string, etag?: string) {
  return {
    statusCode,
    headers: etag ? { etag } : {},
    body: {
      text: vi.fn(async () => body),
    },
  }
}

describe('fetcher', () => {
  const originalCwd = process.cwd()
  let dir: string

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'pulse-fetcher-'))
    process.chdir(dir)
    requestMock.mockReset()
  })

  afterEach(() => {
    process.chdir(originalCwd)
    rmSync(dir, { recursive: true, force: true })
  })

  it('handles 304 and marks document as unchanged', async () => {
    requestMock.mockResolvedValue(mockResponse(304, ''))

    const result = await fetchDoc('https://example.com/doc.md', '"etag-old"')

    expect(requestMock).toHaveBeenCalledWith(
      'https://example.com/doc.md',
      expect.objectContaining({
        headers: { 'If-None-Match': '"etag-old"' },
      }),
    )
    expect(result.changed).toBe(false)
    expect(result.content).toBe('')
    expect(result.etag).toBe('"etag-old"')
  })

  it('persists returned etags into meta and runtime map', async () => {
    const url = 'https://example.com/guide.md'
    requestMock.mockResolvedValue(mockResponse(200, '# Title', '"etag-new"'))

    const skill: SkillDefinition = {
      id: 'cc-guide',
      sourceUrl: url,
      name: 'cc-guide',
      description: 'Guide',
      splitStrategy: 'none',
      tokenBudget: 300,
      priority: 'high',
    }
    const etags: Record<string, string> = {}

    const results = await fetchAll([skill], etags)

    expect(results).toHaveLength(1)
    expect(results[0].etag).toBe('"etag-new"')
    expect(etags[url]).toBe('"etag-new"')
    expect(readMeta().etags[url]).toBe('"etag-new"')
  })

  it('persists successful etags even when batch has failures', async () => {
    const okUrl = 'https://example.com/ok.md'
    const failUrl = 'https://example.com/fail.md'
    requestMock
      .mockResolvedValueOnce(mockResponse(200, 'ok', '"etag-ok"'))
      .mockRejectedValueOnce(new Error('network down'))
      .mockRejectedValueOnce(new Error('network down'))
      .mockRejectedValueOnce(new Error('network down'))

    const skills: SkillDefinition[] = [
      {
        id: 'ok',
        sourceUrl: okUrl,
        name: 'ok',
        description: 'ok',
        splitStrategy: 'none',
        priority: 'critical',
      },
      {
        id: 'fail',
        sourceUrl: failUrl,
        name: 'fail',
        description: 'fail',
        splitStrategy: 'none',
        priority: 'critical',
      },
    ]
    const etags: Record<string, string> = {}

    await expect(fetchAll(skills, etags)).rejects.toThrow('Failed to fetch 1 skill(s)')
    expect(etags[okUrl]).toBe('"etag-ok"')
    expect(readMeta().etags[okUrl]).toBe('"etag-ok"')
  })
})
