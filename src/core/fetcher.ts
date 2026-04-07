import { request } from 'undici'
import pLimit from 'p-limit'
import type { SkillDefinition } from '../config/skills-registry.js'
import { readMeta, writeMeta } from './meta.js'
import { log, warn } from '../utils/logger.js'

export interface FetchResult {
  url: string
  content: string
  changed: boolean
  etag: string | undefined
  fetchedAt: string
}

const REQUEST_TIMEOUT = 10_000
const MAX_RETRIES = 2
const CONCURRENCY = 4

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Fetch a single document with ETag conditional request support.
 * Retries up to 2 times with exponential backoff on failure.
 */
export async function fetchDoc(url: string, etag?: string): Promise<FetchResult> {
  const headers: Record<string, string> = {}
  if (etag) {
    headers['If-None-Match'] = etag
  }

  let lastError: Error | undefined

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = 1000 * 2 ** (attempt - 1) // 1s, 2s
      await sleep(delay)
    }

    try {
      const res = await request(url, {
        headers,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      })

      if (res.statusCode === 304) {
        return {
          url,
          content: '',
          changed: false,
          etag,
          fetchedAt: new Date().toISOString(),
        }
      }

      if (res.statusCode < 200 || res.statusCode >= 300) {
        throw new Error(`HTTP ${res.statusCode} fetching ${url}`)
      }

      const content = await res.body.text()
      const newEtag = res.headers['etag'] as string | undefined

      return {
        url,
        content,
        changed: true,
        etag: newEtag ?? etag,
        fetchedAt: new Date().toISOString(),
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt < MAX_RETRIES) {
        warn(`Fetch attempt ${attempt + 1} failed for ${url}, retrying...`)
      }
    }
  }

  throw lastError ?? new Error(`Failed to fetch ${url}`)
}

/**
 * Fetch all skills concurrently with a limit of 4 simultaneous requests.
 */
export async function fetchAll(
  skills: SkillDefinition[],
  etags: Record<string, string>,
): Promise<FetchResult[]> {
  const limit = pLimit(CONCURRENCY)

  const fetchable = skills.filter((s) => s.sourceUrl && !s.static)

  const tasks = fetchable.map((skill) =>
    limit(async () => {
      const url = skill.sourceUrl!
      log(`  Fetching ${skill.id}...`)
      try {
        const result = await fetchDoc(url, etags[url])
        if (result.changed) {
          log(`  ✓ ${skill.id} updated`)
        } else {
          log(`  · ${skill.id} unchanged (304)`)
        }
        return result
      } catch (err) {
        warn(`  ✗ ${skill.id} failed: ${err instanceof Error ? err.message : err}`)
        throw err
      }
    }),
  )

  const settled = await Promise.allSettled(tasks)
  const results: FetchResult[] = []
  const errors: Error[] = []

  for (const item of settled) {
    if (item.status === 'fulfilled') {
      results.push(item.value)
      continue
    }
    errors.push(item.reason instanceof Error ? item.reason : new Error(String(item.reason)))
  }

  persistEtags(results, etags)

  if (errors.length > 0) {
    throw new Error(`Failed to fetch ${errors.length} skill(s): ${errors[0].message}`)
  }

  return results
}

function persistEtags(results: FetchResult[], etags: Record<string, string>): void {
  try {
    const meta = readMeta()
    let hasUpdates = false

    for (const result of results) {
      if (!result.etag) continue
      if (meta.etags[result.url] === result.etag) continue

      meta.etags[result.url] = result.etag
      etags[result.url] = result.etag
      hasUpdates = true
    }

    if (hasUpdates) {
      writeMeta(meta)
    }
  } catch (err) {
    warn(`Failed to persist ETags: ${err instanceof Error ? err.message : String(err)}`)
  }
}
