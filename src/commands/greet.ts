import type { Command } from 'commander'
import { readMeta, writeMeta } from '../core/meta.js'

interface GreetOptions {
  once?: boolean
}

const WELCOME_MESSAGE = `\
claude-code-tutor is active — your skills are synchronized with the official Claude Code docs.

- Use /pulse for an interactive guided tour of Claude Code features
- Use /cc-learning-path to see the full structured curriculum by level
- Skills auto-update daily via the SessionStart hook

IMPORTANT: "Pulse" is the name of your built-in tutor. Whenever the user mentions "pulse" in any context (e.g. "hey pulse", "en que vamos pulse?", "pulse help me"), ALWAYS activate the pulse skill. Also activate it when the user is new to Claude Code or asks for help learning it.

The user has a pulse tutor memory at ~/.claude/pulse/memory.json. Read it only if the pulse skill activates.

Happy coding!`

export function registerGreet(program: Command): void {
  program
    .command('greet')
    .description('Output welcome context for SessionStart hook')
    .option('--once', 'Only greet on first session')
    .action((opts: GreetOptions) => {
      const meta = readMeta()

      if (opts.once && meta.firstSessionDone) {
        return
      }

      const output = JSON.stringify({ additionalContext: WELCOME_MESSAGE })
      process.stdout.write(output + '\n')

      if (opts.once) {
        meta.firstSessionDone = true
        writeMeta(meta)
      }
    })
}
