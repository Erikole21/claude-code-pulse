## Why

The cc-tutor skill currently has no memory between sessions — every conversation starts from zero. Users must re-explain their name, level, and what they were working on. This makes the tutor feel impersonal and wastes time. Adding persistent memory in the user's home directory (`~/.claude/pulse/`) lets the tutor greet by name, resume where they left off, track topic progress, detect repeated questions, and recommend next steps — turning it into a true personal learning companion.

## What Changes

- **New file** `src/core/tutor-memory.ts`: Read/write/update/logSession functions for `~/.claude/pulse/memory.json` with PulseUserMemory interface (identity, level, topics, frequentQuestions, exercises, nextSteps, lastSession)
- **New file** `src/commands/memory.ts`: `pulse memory` CLI command with subflags: `--reset`, `--export`, `--import <file>`, `--update '<JSON>'`, `--exercise <id> --status <status>`, `--next-step <desc> --reason <reason>`
- **Modified file** `src/commands/uninstall.ts`: Add `--purge-memory` flag to optionally delete `~/.claude/pulse/` with confirmation
- **Modified file** `src/cli.ts`: Register the new `memory` command
- **Modified file** `skills-fallback/cc-tutor/SKILL.md`: Add "Memoria y continuidad" section with session start/end behavior and memory CLI commands reference
- **New file** `tests/tutor-memory.test.ts`: Tests for read/write/update/logSession, uninstall safety, export validity
- **Modified file** `.gitignore`: Add `.claude/pulse/`
- **Modified file** `README.md`: Add "Tu progreso con el tutor" section

## Capabilities

### New Capabilities
- `tutor-memory`: Persistent user memory system in `~/.claude/pulse/` — PulseUserMemory interface, read/write/update/logSession functions, session history logging
- `cli-memory`: The `pulse memory` command for viewing progress, resetting, exporting/importing, updating fields, managing exercises and next steps
- `tutor-memory-tests`: Vitest test suite for tutor-memory.ts and the memory CLI interactions

### Modified Capabilities
- `cli-uninstall`: Adding `--purge-memory` flag that optionally deletes `~/.claude/pulse/` with confirmation prompt
- `cc-tutor-skill`: Adding memory-aware behavior — session start reads memory, session end writes updates, repeated question detection, memory CLI commands reference

## Impact

- New directory `~/.claude/pulse/` created in user's home (not in repo)
- New `sessions/` subdirectory for session logs
- `.gitignore` updated to exclude `.claude/pulse/`
- No new dependencies — uses only `node:fs/promises`, `node:os`, `node:path`
- Uninstall behavior extended but non-breaking (new flag is opt-in)
- cc-tutor skill content expanded with memory instructions
