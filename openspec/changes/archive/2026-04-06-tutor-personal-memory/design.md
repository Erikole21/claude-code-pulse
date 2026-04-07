## Context

The cc-tutor skill provides interactive tutoring for Claude Code but currently has no memory between sessions. The user's detailed description specifies the exact PulseUserMemory interface, CLI commands, file locations, and tutor behavior modifications. This change adds persistent memory in the user's home directory (`~/.claude/pulse/`), completely separate from any repository.

## Goals / Non-Goals

**Goals:**
- Persistent user memory at `~/.claude/pulse/memory.json` with complete learning state
- Session logging to `~/.claude/pulse/sessions/YYYY-MM-DD.json`
- Full CLI for memory management (`pulse memory` with multiple subflags)
- Memory-aware tutor that resumes context, tracks repeated questions, and recommends next steps
- Safe uninstall with opt-in `--purge-memory`

**Non-Goals:**
- Cloud sync of memory (everything is local)
- Multi-user memory (one memory per OS user)
- Encryption of memory file (it's local and non-sensitive)
- Schema migration system (v1, keep it simple)

## Decisions

### D1: Home directory storage (`~/.claude/pulse/`)
Store memory in the user's home directory, not in the repository.
**Why**: Memory is personal (name, level, progress) and should follow the user across repos. Using `~/.claude/` aligns with Claude Code's own config location. Adding `pulse/` subdirectory avoids conflicts.
**Alternative considered**: `~/.pulse/` — rejected because it doesn't group with Claude Code's existing config.

### D2: Shallow merge for updateMemory
Use `{ ...current, ...patch }` (shallow merge) rather than deep merge.
**Why**: The user's spec shows simple top-level field updates (`pulse memory --update '{"level":"intermediate"}'`). For nested fields like `topics` and `exercises`, dedicated functions (`--exercise`, `--next-step`) handle specific mutations. Deep merge would risk unexpected behavior with arrays (e.g., `frequentQuestions`).

### D3: Async fs/promises throughout
Use `node:fs/promises` (async) instead of sync fs operations.
**Why**: The memory module may be called during CLI commands that also do network I/O. Async keeps things non-blocking. Unlike `meta.ts` (which uses sync for simplicity in hot paths), memory operations are user-initiated and can afford async.

### D4: Session logs as separate files
Write one JSON file per day in `sessions/` rather than appending to a single file.
**Why**: Easy to browse, easy to clean up old sessions, no file locking concerns. The date-based naming makes it trivial to find a specific session.

### D5: Tutor reads memory via `cat` command
The tutor skill instructs Claude to read memory via `cat ~/.claude/pulse/memory.json` rather than a custom tool.
**Why**: Claude Code already has the Bash tool available. Using `cat` is the simplest approach — no new tool registration needed, works immediately.

### D6: No new dependencies
The entire feature uses only Node.js built-ins: `node:fs/promises`, `node:os`, `node:path`.
**Why**: Memory operations are simple file I/O. No need for database, validation library, or config parser.

## Risks / Trade-offs

- [Shallow merge may lose nested data on careless --update] → Mitigated by providing dedicated commands for exercises and nextSteps. Document that `--update` is for top-level fields.
- [Session log files accumulate over time] → Acceptable. Each file is ~500 bytes. Even 365 days = ~180KB. Can add cleanup later if needed.
- [Tutor relies on shell commands for memory access] → This is the Claude Code paradigm. If Bash tool is restricted by permissions, the tutor gracefully falls back to no-memory behavior.
- [No file locking for concurrent writes] → Extremely unlikely: only one Claude Code session per repo at a time. If it happens, last-write-wins is acceptable for user preferences.
