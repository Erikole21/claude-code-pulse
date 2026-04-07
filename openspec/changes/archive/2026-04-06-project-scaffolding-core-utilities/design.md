## Context

This is a greenfield TypeScript CLI package. No existing code exists yet. The SDD (`claude-code-pulse-SDD.md`) provides detailed module specifications. This change establishes the foundation that all subsequent changes build upon: the build pipeline, config system, and four core utility modules.

## Goals / Non-Goals

**Goals:**
- Establish a working TypeScript + ESM + tsup build that produces an executable `pulse` CLI
- Implement `meta.ts`, `platform.ts`, `logger.ts`, and `skills-registry.ts` as stable internal APIs
- Support cosmiconfig-based `.pulserc.json` configuration
- Ensure all modules are independently testable

**Non-Goals:**
- CLI commands (change 4)
- Fetcher, transformer, splitter, installer (changes 2-3)
- Hook management (change 3)
- Static skill content files (change 4)
- Tests, README, fallback skills (change 5)

## Decisions

### D1: ESM-only package
Use `"type": "module"` throughout. All imports use `.js` extensions in compiled output. tsup targets `node18` with `format: ['esm']`.
**Why over CJS**: Node 18+ supports ESM natively. Avoids dual-package complexity. All dependencies (commander, cosmiconfig, unified) support ESM.

### D2: Meta file location at `.claude/skills/.pulse-meta.json`
Store metadata alongside the installed skills rather than at project root.
**Why**: Keeps all pulse artifacts in one place. Easy to gitignore or commit as a unit. Avoids polluting the project root.

### D3: WSL detection via /proc/version
Check `fs.existsSync('/proc/version')` and read for "microsoft" substring.
**Why over other methods**: Reliable across WSL1 and WSL2. No external commands needed. The `process.platform` returns `"linux"` on WSL, so filesystem check is necessary.
**Alternative considered**: Environment variable `WSL_DISTRO_NAME` — less reliable, not always set.

### D4: Claude CLI check with child_process
Use `execFile('claude', ['--version'])` with a 5s timeout. On Windows, also try `claude.cmd`.
**Why**: Simple, reliable. The 5s timeout prevents hanging if the CLI exists but is misconfigured. Using `execFile` (not `exec`) avoids shell injection.

### D5: Skills registry as a static array
Define all skills as a typed constant array in source code, not in a config file.
**Why**: Skills are tied to known docs URLs and split strategies that require code-level understanding. Type safety catches missing fields at compile time. Changes to the registry require a package update — this is intentional for consistency.

### D6: Logger as thin wrapper
`logger.ts` wraps `console.log`/`console.error` with a `silent` mode controlled by config. No external logging library.
**Why**: The CLI is simple enough that structured logging adds no value. The `--silent` flag (used by the hook) just needs to suppress output.

## Risks / Trade-offs

- [WSL detection reads filesystem] → Minimal risk; `/proc/version` read is fast and safe. Falls back to Unix behavior if detection fails.
- [Meta file in `.claude/skills/` may not exist yet] → `meta.ts` will create the directory structure if needed before writing.
- [cosmiconfig adds a dependency for simple config] → Worth it for standard config file discovery (`.pulserc.json`, `pulse` key in `package.json`, etc.). Small dependency.
- [No config validation at load time] → Use TypeScript types and provide sensible defaults for missing fields. Full validation can be added later if needed.
