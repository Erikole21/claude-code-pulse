## Context

The core utility modules (meta.ts, platform.ts, logger.ts, skills-registry.ts) and infrastructure modules (fetcher.ts, transformer.ts, transformer-claude.ts, transformer-static.ts, splitter.ts, installer.ts, hook-manager.ts) are being established by prior changes. This change builds the user-facing layer on top of that foundation: two static skill content files and all six CLI commands that constitute the `pulse` binary.

The SDD (`claude-code-pulse-SDD.md`) provides detailed specifications for each command's flags, flow, and output format. The CLI uses `commander` for argument parsing and all commands follow the same pattern of importing core modules and orchestrating them.

## Goals / Non-Goals

**Goals:**
- Write the two static skill SKILL.md files with correct frontmatter and content matching the SDD exactly
- Implement a main `cli.ts` entry point using commander that registers all six subcommands
- Implement all six CLI commands (init, sync, greet, list, status, uninstall) with their full flag sets
- Ensure `greet` outputs valid JSON matching the Claude Code SessionStart hook schema
- Ensure commands use the logger module and respect `--silent` mode where applicable

**Non-Goals:**
- Core module implementation (meta.ts, platform.ts, etc.) — prior changes
- Fetcher, transformer, splitter, installer, hook-manager — prior changes
- Tests for CLI commands — change 5
- README documentation — change 5
- Fallback skills generation script — change 5

## Decisions

### D1: Commander with action handlers in separate files
Each command lives in its own `src/commands/<name>.ts` file exporting a function that receives the commander `Command` object. `cli.ts` imports and registers each.
**Why**: Keeps each command self-contained and testable. Matches the SDD directory structure. Avoids a monolithic CLI file.

### D2: Static skills in skills-fallback/ directory
The `cc-tutor/SKILL.md` and `cc-learning-path/SKILL.md` files live under `skills-fallback/` as plain markdown files bundled with the npm package.
**Why**: The installer copies them from here during `pulse init`/`pulse sync`. They are also used as fallback content when the network is unavailable. The SDD specifies this directory structure.

### D3: Greet outputs raw JSON to stdout
`pulse greet` prints a single JSON object `{ "additionalContext": "..." }` to stdout with no other output. All informational messages go to stderr or are suppressed.
**Why**: Claude Code's SessionStart hook reads stdout as structured JSON. Any non-JSON output would break the hook. The `additionalContext` field is injected into the session context.

### D4: Init orchestrates sync + hook-manager
`pulse init` does not duplicate sync logic. It calls the sync command's core function internally, then uses hook-manager to inject the SessionStart hook.
**Why**: Avoids code duplication. Ensures init and standalone sync produce identical results. The SDD specifies init should "execute sync completo."

### D5: Uninstall uses _pulse frontmatter marker
`pulse uninstall` only removes skills whose SKILL.md frontmatter contains `_pulse: true`. It reads each skill's frontmatter before deletion.
**Why**: Critical safety requirement from the SDD — user-created skills must never be touched. The `_pulse: true` marker is the contract between installer and uninstaller.

### D6: List and status use simple console table formatting
Both commands format output using aligned text (padded columns) rather than an external table library.
**Why**: Avoids adding a dependency for two simple displays. The output is for human consumption in a terminal, not machine parsing.

## Risks / Trade-offs

- [Greet JSON output mixed with other stdout] → Mitigated by routing all non-JSON output through logger to stderr when greet is running.
- [Init fails midway leaving partial state] → Acceptable risk for v1. Meta file tracks sync status. User can re-run `pulse init --force` to recover.
- [Commander version compatibility] → Using commander as specified in SDD. Widely stable API across minor versions.
- [Static skill content becomes outdated] → By design, static skills (tutor, learning-path) contain pedagogical structure, not docs content. They reference other skills for current information. Updates ship with package versions.
