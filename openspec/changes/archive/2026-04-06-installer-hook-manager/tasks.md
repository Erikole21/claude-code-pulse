## 1. Installer Module

- [x] 1.1 Create `src/core/installer.ts` with `install(skills)` function that creates `.claude/skills/<id>/SKILL.md` with `_pulse: true` frontmatter prepended to content
- [x] 1.2 Implement `isManaged(skillDir)` that parses SKILL.md frontmatter and returns true only if `_pulse: true` is present
- [x] 1.3 Implement `getInstalledSkills()` that reads `.pulse-meta.json` via meta.ts and returns array of installed skill IDs
- [x] 1.4 Add skip logic in `install()` to check `isManaged()` before overwriting — skip skills where SKILL.md exists without `_pulse: true`

## 2. Hook Manager Module

- [x] 2.1 Create `src/core/hook-manager.ts` with `addHook()` function that reads/creates `.claude/settings.json` and appends `{ "_pulse": true, "command": getHookCommand() }` to `hooks.SessionStart` array
- [x] 2.2 Implement idempotency check in `addHook()` — skip if `_pulse: true` entry already exists in SessionStart
- [x] 2.3 Implement `removeHook()` that filters out `_pulse: true` entry from SessionStart, removes empty SessionStart key, and removes empty hooks object
- [x] 2.4 Handle edge cases: missing settings file on remove (no-op), missing `.claude/` directory on add (create recursively)

## 3. Tests

- [x] 3.1 Write tests for `installer.ts`: install single/multiple skills, frontmatter format, isManaged detection, skip user skills, getInstalledSkills
- [x] 3.2 Write tests for `hook-manager.ts`: addHook to empty/existing settings, idempotent add, removeHook preserving user hooks, cleanup empty keys, no-op on missing file
