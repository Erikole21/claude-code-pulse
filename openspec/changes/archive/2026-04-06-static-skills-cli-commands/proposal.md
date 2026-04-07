## Why

The core utility modules (meta, platform, skills-registry) and infrastructure modules (fetcher, transformer, splitter, installer, hook-manager) are being established by prior changes. This change delivers the user-facing layer: the two static skill content files that provide the interactive tutor and learning path experiences, plus all six CLI commands that constitute the `pulse` command-line interface. Without these, the package has no entry points and users cannot initialize, sync, or manage their skills.

## What Changes

- Write `skills-fallback/cc-tutor/SKILL.md`: interactive tutor skill with auto language detection, level assessment via 2 questions, three learning tiers (Beginner/Intermediate/Advanced), tutoring rules, and frontmatter with `invocation: auto`, `_pulse: true`, `_static: true`
- Write `skills-fallback/cc-learning-path/SKILL.md`: structured learning path skill with table-based curriculum per level, exercise suggestions, skill cross-references, and frontmatter with `invocation: user`, `_pulse: true`, `_static: true`
- Implement `src/cli.ts`: main commander program definition with version, description, and all subcommand registrations
- Implement `src/commands/init.ts`: `pulse init [--force] [--yes] [--skills <ids...>]` — verify existing state, create `.claude/`, show skill list, confirm, run sync, inject hook, write meta
- Implement `src/commands/sync.ts`: `pulse sync [--force] [--if-stale <seconds>] [--silent] [--skills <ids...>]` — staleness check, fetch with ETag, transform, split, install, update meta
- Implement `src/commands/greet.ts`: `pulse greet [--once]` — output JSON with `additionalContext` for SessionStart hook, track `firstSessionDone`
- Implement `src/commands/list.ts`: `pulse list` — table display with skill ID, last sync, transformer used, status icons
- Implement `src/commands/status.ts`: `pulse status` — version, directory, skill counts, last sync, hook status, Claude CLI status, platform, firstSessionDone
- Implement `src/commands/uninstall.ts`: `pulse uninstall [--keep-hook] [--keep-skills]` — remove hook entry, delete `cc-*` skills with `_pulse: true`, delete meta file

## Capabilities

### New Capabilities
- `cc-tutor-skill`: Static SKILL.md content for the interactive Claude Code tutor with language detection, level assessment, and three learning tiers
- `cc-learning-path-skill`: Static SKILL.md content for the structured learning path with table-based curriculum and exercises per level
- `cli-program`: Main commander program entry point that registers all subcommands and provides version/help
- `cli-init`: The `pulse init` command for initializing pulse in a project directory
- `cli-sync`: The `pulse sync` command for fetching, transforming, and installing skills
- `cli-greet`: The `pulse greet` command for SessionStart hook welcome message injection
- `cli-list`: The `pulse list` command for displaying installed skills in a table
- `cli-status`: The `pulse status` command for showing overall pulse status
- `cli-uninstall`: The `pulse uninstall` command for removing pulse from a project

### Modified Capabilities

(none — static skills and CLI commands are new artifacts)

## Impact

- Creates 2 static skill files in `skills-fallback/` that are bundled with the package
- Creates 7 TypeScript source files in `src/` (`cli.ts` + 6 commands)
- All CLI commands depend on core modules from change 1 (meta, platform, skills-registry, logger) and infrastructure from changes 2-3 (fetcher, transformer, splitter, installer, hook-manager)
- The `cli.ts` entry point is the `bin` target referenced in `package.json` and built by tsup
- The `greet` command output format must match the Claude Code SessionStart hook JSON schema (`{ "additionalContext": "..." }`)
