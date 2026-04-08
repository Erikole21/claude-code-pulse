import type { Command } from 'commander'
import { readMeta, writeMeta } from '../core/meta.js'

const FIRST_SESSION = `\
claude-code-tutor is active — your skills are synchronized with the official Claude Code docs.

- Use /pulse for an interactive guided tour of Claude Code features
- Use /cc-learning-path to see the full structured curriculum by level
- Skills auto-update daily via the SessionStart hook

Happy coding!`

const ALWAYS = `\
CRITICAL INSTRUCTION — You MUST activate the pulse skill (use the Skill tool with skill: "pulse") in these cases:
- The user mentions the word "pulse" in ANY form (e.g. "hey pulse", "en que vamos pulse", "pulse ayuda", "preguntale a pulse")
- The user asks for help learning Claude Code or is new to it
- The user asks about Claude Code features, configuration, or workflows
This is NOT optional. If the user says "pulse", activate the skill IMMEDIATELY.

The user has a pulse tutor memory at ~/.claude/pulse/memory.json. Read it only if the pulse skill activates.`

export function registerGreet(program: Command): void {
  program
    .command('greet')
    .description('Output welcome context for SessionStart hook')
    .option('--once', '(deprecated, ignored)')
    .action(() => {
      const meta = readMeta()

      let message: string
      if (!meta.firstSessionDone) {
        message = FIRST_SESSION + '\n\n' + ALWAYS
        meta.firstSessionDone = true
        writeMeta(meta)
      } else {
        message = ALWAYS
      }

      const output = JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'SessionStart',
          additionalContext: message,
        },
      })
      process.stdout.write(output + '\n')
    })
}
