## 1. Project Scaffolding

- [x] 1.1 Create `package.json` with name, version, bin entry, ESM type, engines, scripts (build, dev, test, prepublishOnly), and all dependencies/devDependencies
- [x] 1.2 Create `tsconfig.json` with strict mode, ESM module resolution, target ES2022, outDir dist
- [x] 1.3 Create `tsup.config.ts` with entry `src/cli.ts`, ESM format, node18 target, shebang banner, clean output
- [x] 1.4 Create stub `src/cli.ts` with commander setup (empty program, just enough to verify build works)
- [x] 1.5 Run `npm install` and verify `npm run build` produces `dist/cli.js` with shebang

## 2. Logger Utility

- [x] 2.1 Create `src/utils/logger.ts` with `log()`, `error()`, `warn()`, and `success()` functions that respect a `silent` mode flag
- [x] 2.2 Export a `setSilent(value: boolean)` function and ensure silent mode suppresses all non-error output

## 3. Platform Detection

- [x] 3.1 Create `src/utils/platform.ts` with `detectPlatform()` returning `"windows"` | `"unix"` | `"wsl"`
- [x] 3.2 Implement WSL detection via `/proc/version` filesystem check for "microsoft" substring
- [x] 3.3 Implement `getHookCommand()` returning platform-appropriate command string (npx vs npx.cmd, && vs &, || true suffix)
- [x] 3.4 Implement `isClaudeCliAvailable()` async function with `execFile` and 5s timeout, Windows `claude.cmd` fallback

## 4. Pulse Metadata

- [x] 4.1 Create `src/core/meta.ts` with `PulseMeta` interface matching SDD specification
- [x] 4.2 Implement `readMeta()` that reads `.claude/skills/.pulse-meta.json`, returns defaults if file missing
- [x] 4.3 Implement `writeMeta(meta: PulseMeta)` that creates directory structure if needed and writes JSON
- [x] 4.4 Implement `isStale(maxAgeSeconds: number)` comparing `lastSync` to current time

## 5. Skills Registry

- [x] 5.1 Create `src/config/skills-registry.ts` with `SkillDefinition` interface (id, sourceUrl, name, description, splitStrategy, manualSections, tokenBudget, priority, static)
- [x] 5.2 Define all static skills in `SKILLS_REGISTRY`: `cc-tutor` and `cc-learning-path` with `static: true`, `sourceUrl: null`
- [x] 5.3 Define all critical-priority skills: cc-changelog, cc-hooks-events (with manualSections for 3-way split), cc-hooks-guide, cc-mcp, cc-settings, cc-permissions
- [x] 5.4 Define all high-priority skills: cc-sub-agents, cc-agent-teams, cc-skills-guide, cc-memory, cc-cli-reference, cc-commands, cc-model-config
- [x] 5.5 Define all medium-priority skills: cc-plugins, cc-channels, cc-scheduled-tasks, cc-headless, cc-sandboxing, cc-common-workflows, cc-best-practices, cc-github-actions
- [x] 5.6 Export a `filterByPriority(priorities: string[])` helper function

## 6. Config Loading

- [x] 6.1 Create `src/config/loader.ts` using cosmiconfig to search for `.pulserc.json` or `pulse` key in `package.json`
- [x] 6.2 Define `PulseConfig` interface with defaults: skills=["critical","high"], maxAge=86400, transformer="auto", silent=false
- [x] 6.3 Merge loaded config with defaults, export `loadConfig()` async function

## 7. Verification

- [x] 7.1 Verify `npm run build` succeeds and `dist/cli.js` is created
- [x] 7.2 Verify all modules export their expected interfaces and functions (manual import check)
- [x] 7.3 Verify `platform.ts` returns correct platform for the current OS
