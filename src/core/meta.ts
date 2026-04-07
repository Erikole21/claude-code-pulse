import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { getVersion } from '../version.js'

export interface SkillMeta {
  syncedAt: string
  transformedWith: 'claude' | 'static' | 'fixed'
  etag?: string
}

export interface PulseMeta {
  version: string
  lastSync: string
  lastSyncStatus: 'success' | 'partial' | 'failed'
  lastSyncError?: string
  firstSessionDone: boolean
  skills: Record<string, SkillMeta>
  etags: Record<string, string>
}

function metaPath(): string {
  return join(process.cwd(), '.claude', 'skills', '.pulse-meta.json')
}

function defaultMeta(): PulseMeta {
  return {
    version: getVersion(),
    lastSync: '',
    lastSyncStatus: 'failed',
    firstSessionDone: false,
    skills: {},
    etags: {},
  }
}

export function getMetaPath(): string {
  return metaPath()
}

export function readMeta(): PulseMeta {
  const path = metaPath()
  try {
    const raw = readFileSync(path, 'utf-8')
    return { ...defaultMeta(), ...JSON.parse(raw) }
  } catch {
    return defaultMeta()
  }
}

export function writeMeta(meta: PulseMeta): void {
  const path = metaPath()
  const dir = dirname(path)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  writeFileSync(path, JSON.stringify(meta, null, 2) + '\n', 'utf-8')
}

export function isStale(maxAgeSeconds: number): boolean {
  const meta = readMeta()
  if (!meta.lastSync) return true

  const lastSyncTime = new Date(meta.lastSync).getTime()
  if (isNaN(lastSyncTime)) return true

  const elapsed = (Date.now() - lastSyncTime) / 1000
  return elapsed > maxAgeSeconds
}
