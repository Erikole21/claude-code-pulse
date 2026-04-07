import type { ManualSection } from '../config/skills-registry.js'
import { warn } from '../utils/logger.js'

export interface SplitResult {
  id: string
  content: string
}

/**
 * Split a document according to the given strategy.
 */
export function splitDocument(
  content: string,
  strategy: 'none' | 'sections' | 'manual',
  manualSections?: ManualSection[],
): SplitResult[] {
  switch (strategy) {
    case 'sections':
      return splitBySections(content)
    case 'manual':
      return splitByManual(content, manualSections ?? [])
    case 'none':
    default:
      return [{ id: '', content }]
  }
}

function splitBySections(markdown: string): SplitResult[] {
  const lines = markdown.split('\n')
  const sections: SplitResult[] = []
  const preambleLines: string[] = []
  let currentHeading: string | null = null
  let currentLines: string[] = []

  for (const line of lines) {
    const h2Match = line.match(/^## (.+)/)
    if (h2Match) {
      if (currentLines.length > 0) {
        if (currentHeading === null) {
          preambleLines.push(...currentLines)
        } else {
          sections.push({
            id: toKebabCase(currentHeading),
            content: currentLines.join('\n').trim(),
          })
        }
      }

      currentHeading = h2Match[1].trim()
      if (preambleLines.length > 0) {
        currentLines = [...preambleLines, '', line]
        preambleLines.length = 0
      } else {
        currentLines = [line]
      }
      continue
    }

    currentLines.push(line)
  }

  if (currentLines.length === 0) {
    return sections
  }

  if (currentHeading === null) {
    return [{ id: 'document', content: currentLines.join('\n').trim() }]
  }

  sections.push({
    id: toKebabCase(currentHeading),
    content: currentLines.join('\n').trim(),
  })

  return sections
}

function splitByManual(markdown: string, manualSections: ManualSection[]): SplitResult[] {
  const results: SplitResult[] = []

  for (let i = 0; i < manualSections.length; i++) {
    const section = manualSections[i]
    const startIdx = findHeadingIndex(markdown, section.heading)

    if (startIdx === -1) {
      warn(`Heading not found: "${section.heading}" — skipping section ${section.id}`)
      continue
    }

    // Find end: next manual section's heading or end of document
    let endIdx = markdown.length
    if (i + 1 < manualSections.length) {
      const nextIdx = findHeadingIndex(markdown, manualSections[i + 1].heading)
      if (nextIdx !== -1) {
        endIdx = nextIdx
      }
    }

    const content = markdown.slice(startIdx, endIdx).trim()
    results.push({ id: section.id, content })
  }

  return results
}

function findHeadingIndex(markdown: string, heading: string): number {
  // Search for the heading as a markdown heading at any level
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`^#{1,6}\\s+${escapedHeading}`, 'm')
  const match = regex.exec(markdown)
  return match ? match.index : -1
}

function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
