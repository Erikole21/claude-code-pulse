## Why

The claude-code-pulse project needs its foundational structure before any feature modules can be built. This change establishes the project scaffolding (package.json, tsconfig, tsup config) and implements the core utility modules that every other module depends on: metadata persistence, platform detection, logging, and the skills registry. Without these, no fetcher, transformer, installer, or CLI command can function.

## What Changes

- Initialize the npm package with TypeScript, ESM, and tsup build pipeline
- Implement `src/core/meta.ts`: PulseMeta interface, read/write `.pulse-meta.json`, `isStale()` check
- Implement `src/utils/platform.ts`: OS detection (Windows/Unix/WSL), hook command generation (`npx` vs `npx.cmd`), Claude CLI availability check
- Implement `src/utils/logger.ts`: Logging utility for CLI output
- Implement `src/config/skills-registry.ts`: `SkillDefinition` interface and `SKILLS_REGISTRY` array with all 23 skill definitions (critical, high, medium priority)
- Add `.pulserc.json` schema support via cosmiconfig

## Capabilities

### New Capabilities
- `project-config`: Package configuration, TypeScript setup, build pipeline (tsup), and cosmiconfig-based `.pulserc.json` support
- `pulse-metadata`: PulseMeta interface for persisting sync state, ETags, skill status, and staleness checks in `.pulse-meta.json`
- `platform-detection`: OS detection (Windows native, Unix, WSL), platform-appropriate hook command generation, and Claude CLI availability checking
- `skills-registry`: SkillDefinition interface and the complete SKILLS_REGISTRY array defining all skills with their source URLs, split strategies, token budgets, and priorities

### Modified Capabilities

(none — this is the first change, no existing specs)

## Impact

- Creates the entire project directory structure under `src/`
- Adds dependencies: `commander`, `undici`, `unified`, `remark-parse`, `remark-stringify`, `cosmiconfig`, `tsx`
- Adds dev dependencies: `typescript`, `tsup`, `vitest`, `@types/node`
- All subsequent changes (fetcher, transformer, installer, CLI) depend on the modules created here
