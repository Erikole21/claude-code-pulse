## 1. Static Skill Content Files

- [x] 1.1 Create `skills-fallback/cc-tutor/SKILL.md` with frontmatter (`name: cc-tutor`, `invocation: auto`, `_pulse: true`, `_static: true`, description) and full tutor content: language detection, 2-question level assessment, three learning tiers (Beginner/Intermediate/Advanced), tutoring rules
- [x] 1.2 Create `skills-fallback/cc-learning-path/SKILL.md` with frontmatter (`name: cc-learning-path`, `invocation: user`, `_pulse: true`, `_static: true`, description) and full learning path content: table-based curriculum per level, checkpoints, skills listing, exercise references

## 2. CLI Program Entry Point

- [x] 2.1 Create `src/cli.ts` with commander program: name `pulse`, version from package.json, description, register all six subcommands (init, sync, greet, list, status, uninstall), call `program.parse()`
- [x] 2.2 Wire commander error handling and help formatting

## 3. Sync Command

- [x] 3.1 Create `src/commands/sync.ts` with `--force`, `--if-stale <seconds>`, `--silent`, `--skills <ids...>` options
- [x] 3.2 Implement staleness check: when `--if-stale` is passed, read meta and exit silently if not stale
- [x] 3.3 Implement main sync loop: iterate registry skills (filtered if `--skills` passed), skip static skills for fetch, call fetcher with ETag, call transformer (with fallback), call splitter, call installer
- [x] 3.4 Implement static skill handling: for `static: true` skills, install from bundled `skills-fallback/` content
- [x] 3.5 Implement meta update after sync: write lastSync, lastSyncStatus, per-skill info, ETags
- [x] 3.6 Implement change table output (when not `--silent`): show skill ID, action (updated/skipped/failed), transformer used

## 4. Greet Command

- [x] 4.1 Create `src/commands/greet.ts` with `--once` option
- [x] 4.2 Implement `--once` logic: read meta, check `firstSessionDone`, exit silently if true
- [x] 4.3 Implement JSON output: write `{ "additionalContext": "<welcome message>" }` to stdout with no other stdout content
- [x] 4.4 Implement welcome message content: pulse active, `/cc-tutor` invocation, `/cc-learning-path` reference, daily auto-updates
- [x] 4.5 Implement firstSessionDone update: set to `true` in meta after outputting welcome

## 5. Init Command

- [x] 5.1 Create `src/commands/init.ts` with `--force`, `--yes`, `--skills <ids...>` options
- [x] 5.2 Implement already-initialized check: look for `.pulse-meta.json`, show status and exit if exists (unless `--force`)
- [x] 5.3 Implement directory creation: ensure `.claude/` and `.claude/skills/` exist
- [x] 5.4 Implement skills preview and confirmation prompt (skip with `--yes`)
- [x] 5.5 Implement full sync execution by calling sync core function with `--force` equivalent
- [x] 5.6 Implement hook injection via hook-manager after sync
- [x] 5.7 Implement meta initialization with `firstSessionDone: false`
- [x] 5.8 Implement summary output: skill count, hook status, next sync timing, commit suggestion

## 6. List Command

- [x] 6.1 Create `src/commands/list.ts` with no additional options
- [x] 6.2 Implement table display: read meta and registry, show Skill ID, Last Sync, Transformer, Status columns
- [x] 6.3 Implement status icons: check mark (fresh), warning (stale), error (missing) based on sync age and installation state

## 7. Status Command

- [x] 7.1 Create `src/commands/status.ts` with no additional options
- [x] 7.2 Implement version display from package.json
- [x] 7.3 Implement directory, skills count (installed/total), last sync (relative time + status), and error display
- [x] 7.4 Implement hook status check: read `.claude/settings.json` for `_pulse: true` entry
- [x] 7.5 Implement Claude CLI availability check via `isClaudeCliAvailable()` and transformer mode display
- [x] 7.6 Implement platform display via `detectPlatform()` and firstSessionDone from meta

## 8. Uninstall Command

- [x] 8.1 Create `src/commands/uninstall.ts` with `--keep-hook` and `--keep-skills` options
- [x] 8.2 Implement hook removal: call hook-manager `removeHook()` unless `--keep-hook`
- [x] 8.3 Implement skills removal: scan `.claude/skills/cc-*` directories, check each SKILL.md for `_pulse: true` frontmatter, delete only matching ones (unless `--keep-skills`)
- [x] 8.4 Implement meta file deletion: remove `.pulse-meta.json`
- [x] 8.5 Verify safety: ensure no skill without `_pulse: true` is ever touched

## 9. Verification

- [x] 9.1 Verify `npm run build` produces `dist/cli.js` with shebang and all commands registered
- [x] 9.2 Verify `pulse --help` lists all six subcommands
- [x] 9.3 Verify static skill files have correct frontmatter and content structure
- [x] 9.4 Verify `pulse greet` outputs valid JSON with `additionalContext` field only on stdout
