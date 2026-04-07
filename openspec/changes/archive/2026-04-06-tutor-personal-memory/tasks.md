## 1. Core Memory Module

- [x] 1.1 Create `src/core/tutor-memory.ts` with `PulseUserMemory` interface (name, language, joinedAt, level, levelUpdatedAt, topics, frequentQuestions, exercises, nextSteps, lastSession)
- [x] 1.2 Implement `getDefaultMemory()` returning a blank PulseUserMemory with sensible defaults
- [x] 1.3 Implement `readMemory()` that reads `~/.claude/pulse/memory.json`, returns `null` if missing
- [x] 1.4 Implement `writeMemory(memory)` that creates `~/.claude/pulse/` recursively if needed and writes JSON
- [x] 1.5 Implement `updateMemory(patch)` that shallow-merges patch over existing memory (or defaults)
- [x] 1.6 Implement `logSession(log)` that writes to `~/.claude/pulse/sessions/YYYY-MM-DD.json`

## 2. CLI Memory Command

- [x] 2.1 Create `src/commands/memory.ts` with commander subcommand registration and all flags: `--reset`, `--export`, `--import <file>`, `--update <json>`, `--exercise <id>`, `--status <status>`, `--next-step <desc>`, `--reason <reason>`
- [x] 2.2 Implement default action (no flags): formatted progress display showing identity, join date, topic progress, exercises, frequent questions, and next steps
- [x] 2.3 Implement `--reset`: prompt for confirmation, delete memory.json (not session logs)
- [x] 2.4 Implement `--export`: write memory.json contents to stdout as valid JSON
- [x] 2.5 Implement `--import <file>`: read file, validate JSON, replace memory.json
- [x] 2.6 Implement `--update '<JSON>'`: parse JSON string, validate, call updateMemory()
- [x] 2.7 Implement `--exercise <id> --status <status>`: update specific exercise entry with timestamps
- [x] 2.8 Implement `--next-step <desc> --reason <reason>`: append to nextSteps array with suggestedAt

## 3. CLI Integration

- [x] 3.1 Register `memory` command in `src/cli.ts` with all flags
- [x] 3.2 Add `--purge-memory` flag to `src/commands/uninstall.ts`
- [x] 3.3 Implement purge-memory logic: confirmation prompt, delete `~/.claude/pulse/` entirely if confirmed
- [x] 3.4 Ensure uninstall without `--purge-memory` never touches `~/.claude/pulse/`

## 4. Tutor Skill Update

- [x] 4.1 Update `skills-fallback/cc-tutor/SKILL.md` with "Memoria y continuidad" section: session start behavior (read memory, greet by name or ask name), session end behavior (update topics, endNote, nextSteps)
- [x] 4.2 Add repeated question detection instructions to the tutor skill
- [x] 4.3 Add "Comandos de memoria disponibles para el tutor" reference section listing all memory CLI commands

## 5. Config and Docs

- [x] 5.1 Add `.claude/pulse/` to `.gitignore`
- [x] 5.2 Add "Tu progreso con el tutor" section to README.md with memory commands reference

## 6. Tests

- [x] 6.1 Create `tests/tutor-memory.test.ts` with vitest, use temporary directory for isolation
- [x] 6.2 Test: `readMemory()` returns null when file does not exist
- [x] 6.3 Test: `writeMemory()` creates directory if missing and writes valid JSON
- [x] 6.4 Test: `updateMemory()` merges without losing existing fields
- [x] 6.5 Test: `logSession()` creates dated file in sessions subdirectory
- [x] 6.6 Test: `--update` with invalid JSON shows error and does not modify memory
- [x] 6.7 Test: `--export` produces JSON parseable by JSON.parse()
- [x] 6.8 Test: uninstall without `--purge-memory` leaves `~/.claude/pulse/` intact
