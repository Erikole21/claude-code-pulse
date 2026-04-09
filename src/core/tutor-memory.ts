import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { homedir } from 'node:os'

export interface TopicProgress {
  status: 'pending' | 'in-progress' | 'completed'
  startedAt?: string
  completedAt?: string
  notes?: string
}

export interface FrequentQuestion {
  question: string
  topic?: string
  count: number
  lastAskedAt: string
}

export interface ExerciseEntry {
  status: 'pending' | 'in-progress' | 'completed'
  assignedAt?: string
  completedAt?: string
  feedback?: string
}

export interface NextStep {
  topicId: string
  reason: string
  suggestedAt: string
}

export interface LastSession {
  date: string
  duration?: number
  topicsCovered: string[]
  endNote: string
}

export interface PulseUserMemory {
  name: string
  language: string
  joinedAt: string
  level: 'beginner' | 'intermediate' | 'advanced'
  levelUpdatedAt: string
  topics: Record<string, TopicProgress>
  frequentQuestions: FrequentQuestion[]
  exercises: Record<string, ExerciseEntry>
  nextSteps: NextStep[]
  lastSession: LastSession | null
}

let baseDirOverride: string | null = null

export function setBaseDir(dir: string | null): void {
  baseDirOverride = dir
}

export function getBaseDir(): string {
  return baseDirOverride ?? join(homedir(), '.claude', 'pulse')
}

function memoryPath(): string {
  return join(getBaseDir(), 'memory.json')
}

export function getDefaultMemory(): PulseUserMemory {
  return {
    name: '',
    language: 'en',
    joinedAt: new Date().toISOString(),
    level: 'beginner',
    levelUpdatedAt: new Date().toISOString(),
    topics: {},
    frequentQuestions: [],
    exercises: {},
    nextSteps: [],
    lastSession: null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeMemory(raw: any): PulseUserMemory {
  const merged = { ...getDefaultMemory(), ...raw }

  // Normalize topics: handle { seen, date } shape → TopicProgress
  if (merged.topics && typeof merged.topics === 'object') {
    for (const [id, t] of Object.entries(merged.topics) as [string, any][]) {
      if (!t.status) {
        merged.topics[id] = {
          status: t.completed || t.completedAt ? 'completed' : t.seen || t.startedAt ? 'in-progress' : 'pending',
          startedAt: t.date || t.startedAt,
          completedAt: t.completedAt,
          notes: t.notes,
        }
      }
    }
  }

  // Normalize lastSession: handle { topic } → { topicsCovered }
  if (merged.lastSession) {
    const ls = merged.lastSession
    const topicsCovered = ls.topicsCovered
      ?? (ls.topic ? [ls.topic] : [])
    merged.lastSession = {
      date: ls.date ?? '',
      topicsCovered,
      endNote: ls.endNote ?? '',
      duration: ls.duration,
    }
  }

  // Normalize frequentQuestions: handle object map → array
  if (merged.frequentQuestions && !Array.isArray(merged.frequentQuestions)) {
    merged.frequentQuestions = Object.entries(merged.frequentQuestions).map(
      ([id, q]: [string, any]) => ({
        question: q.question ?? id,
        topic: q.topic,
        count: q.count ?? 1,
        lastAskedAt: q.lastAskedAt ?? q.lastAsked ?? '',
      }),
    )
  }

  // Normalize nextSteps: handle { step } → { topicId } and deduplicate
  if (Array.isArray(merged.nextSteps)) {
    const seen = new Set<string>()
    merged.nextSteps = merged.nextSteps
      .map((s: any) => ({
        topicId: s.topicId ?? s.step ?? '',
        reason: s.reason ?? '',
        suggestedAt: s.suggestedAt ?? '',
      }))
      .filter((s: NextStep) => {
        if (seen.has(s.topicId)) return false
        seen.add(s.topicId)
        return true
      })
  }

  return merged as PulseUserMemory
}

export async function readMemory(): Promise<PulseUserMemory | null> {
  try {
    const raw = await readFile(memoryPath(), 'utf-8')
    const parsed = JSON.parse(raw)
    const normalized = normalizeMemory(parsed)

    // If normalization changed anything, persist the clean version
    const cleanJson = JSON.stringify(normalized, null, 2) + '\n'
    if (cleanJson !== JSON.stringify(parsed, null, 2) + '\n') {
      const dir = getBaseDir()
      await mkdir(dir, { recursive: true })
      await writeFile(memoryPath(), cleanJson, 'utf-8')
    }

    return normalized
  } catch {
    return null
  }
}

export async function writeMemory(memory: PulseUserMemory): Promise<void> {
  const normalized = normalizeMemory(memory)
  const dir = getBaseDir()
  await mkdir(dir, { recursive: true })
  await writeFile(memoryPath(), JSON.stringify(normalized, null, 2) + '\n', 'utf-8')
}

export async function updateMemory(patch: Partial<PulseUserMemory>): Promise<PulseUserMemory> {
  const current = (await readMemory()) ?? getDefaultMemory()
  // Deep merge Record fields so patching a single topic doesn't wipe others
  const updated = { ...current, ...patch }
  if (patch.topics) {
    updated.topics = { ...current.topics, ...patch.topics }
  }
  if (patch.exercises) {
    updated.exercises = { ...current.exercises, ...patch.exercises }
  }
  await writeMemory(updated)
  return updated
}

export interface SessionLog {
  date: string
  topicsCovered: string[]
  endNote: string
  duration?: number
}

export async function logSession(log: SessionLog): Promise<void> {
  const sessionsDir = join(getBaseDir(), 'sessions')
  await mkdir(sessionsDir, { recursive: true })
  const filename = `${log.date}.json`
  await writeFile(join(sessionsDir, filename), JSON.stringify(log, null, 2) + '\n', 'utf-8')
}
