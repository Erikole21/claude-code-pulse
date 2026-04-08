import { execFile } from 'node:child_process'
import { isClaudeCliAvailable } from '../utils/platform.js'
import { warn } from '../utils/logger.js'

const TRANSFORM_PROMPT = `You are a documentation condenser for Claude Code skills.
Transform the following markdown documentation into a concise skill reference.

Rules:
- Keep ALL code examples exactly as-is — do not modify, summarize, or omit any code block
- Keep ALL reference tables intact
- Convert prose paragraphs to concise bullet points
- Remove navigation elements, breadcrumbs, and "see also" links
- Conserve syntax details, parameters, edge cases, and caveats
- Output in English
- Start directly with the content — no frontmatter, no title like "# Skill"
- Respect the token budget — be concise but preserve technical accuracy
- Prioritize: code examples > tables > parameter lists > prose explanations
- IMPORTANT: This is a SUMMARY. If a question cannot be fully answered with this content, Claude should fetch the full official documentation instead of guessing.

Transform this documentation:`

let cachedCliAvailable: boolean | undefined

async function checkCliAvailable(): Promise<boolean> {
  if (cachedCliAvailable !== undefined) return cachedCliAvailable
  try {
    cachedCliAvailable = await isClaudeCliAvailable()
  } catch {
    cachedCliAvailable = false
  }
  return cachedCliAvailable
}

/**
 * Reset the CLI availability cache (for testing or new sync sessions).
 */
export function resetCliCache(): void {
  cachedCliAvailable = undefined
}

/**
 * Transform markdown using the Claude CLI.
 * Returns null if CLI is unavailable or transformation times out.
 */
export async function transformWithClaude(
  rawMarkdown: string,
  tokenBudget: number,
  sourceUrl?: string,
): Promise<string | null> {
  const available = await checkCliAvailable()
  if (!available) {
    warn('Claude CLI not available, skipping AI transformation')
    return null
  }

  const cmd = process.platform === 'win32' ? 'claude' : 'claude'
  const args = [
    '--print',
    '--model', 'claude-haiku-4-5-20251001',
    '--max-tokens', String(tokenBudget),
  ]

  const input = `${TRANSFORM_PROMPT}\n\n${rawMarkdown}`

  return new Promise((resolve) => {
    const child = execFile(cmd, args, {
      timeout: 30_000,
      maxBuffer: 1024 * 1024,
      encoding: 'utf-8',
    }, (err, stdout) => {
      if (err) {
        if (err.killed) {
          warn('Claude CLI transformation timed out (30s)')
        } else {
          warn(`Claude CLI transformation failed: ${err.message}`)
        }
        resolve(null)
        return
      }

      const result = stdout.trim()
      if (!result) {
        warn('Claude CLI returned empty output')
        resolve(null)
        return
      }

      if (sourceUrl) {
        resolve(result + `\n\n> **This content is a summary.** If you cannot answer the user's question with the information above, DO NOT guess or invent an answer. Instead, fetch the complete official documentation at: ${sourceUrl}`)
      } else {
        resolve(result)
      }
    })

    // Pipe the prompt via stdin
    if (child.stdin) {
      child.stdin.write(input)
      child.stdin.end()
    }
  })
}
