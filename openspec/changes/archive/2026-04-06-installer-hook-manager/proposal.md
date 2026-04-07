## Why

The pulse CLI needs to physically write skill files into `.claude/skills/` and manage the `SessionStart` hook in `.claude/settings.json`. Without `installer.ts`, there is no way to create skill directories, write `SKILL.md` files, or track which skills are pulse-managed. Without `hook-manager.ts`, there is no way to safely inject or remove the auto-sync hook without corrupting user-defined hooks.

## What Changes

- Implement `src/core/installer.ts`: `install(skills)` creates directories and writes `SKILL.md` files under `.claude/skills/`, `isManaged(skillDir)` checks for `_pulse: true` frontmatter marker, `getInstalledSkills()` reads `.pulse-meta.json` for installed skill inventory. Never touches skills without the `_pulse: true` marker.
- Implement `src/core/hook-manager.ts`: `addHook()` reads/creates `.claude/settings.json`, checks for existing `_pulse: true` entry (skip if found), appends to `SessionStart` array without modifying other hooks. `removeHook()` filters out the `_pulse: true` entry and removes the `SessionStart` key if the array becomes empty.
- Both modules integrate with `meta.ts` (persistence) and `platform.ts` (hook command generation) from change 1.

## Capabilities

### New Capabilities
- `skill-installation`: Creating skill directories, writing SKILL.md files with _pulse:true frontmatter, verifying managed ownership, and reading installed skill inventory
- `hook-management`: Intelligent merge of SessionStart hook entry in .claude/settings.json, safe add/remove with _pulse:true marker, preserving user-defined hooks

### Modified Capabilities

(none — installer and hook-manager are new modules)

## Impact

- New files: `src/core/installer.ts`, `src/core/hook-manager.ts`
- Dependencies on: `meta.ts` (PulseMeta read/write), `platform.ts` (getHookCommand), `skills-registry.ts` (SkillDefinition interface)
- Affects: `pulse init` (calls install + addHook), `pulse uninstall` (calls removeHook), `pulse sync` (calls install to update skills)
- File system writes: `.claude/skills/<skill-id>/SKILL.md`, `.claude/settings.json`
