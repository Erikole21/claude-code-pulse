## ADDED Requirements

### Requirement: Hook removal
`pulse uninstall` SHALL remove the SessionStart hook entry with `_pulse: true` from `.claude/settings.json`. If the SessionStart array becomes empty after removal, the key SHALL be deleted entirely. This step SHALL be skipped if `--keep-hook` is passed.

#### Scenario: Hook removed
- **WHEN** `pulse uninstall` is executed without `--keep-hook`
- **THEN** the `_pulse: true` entry is removed from SessionStart hooks in settings.json

#### Scenario: Empty SessionStart cleaned up
- **WHEN** the pulse hook was the only SessionStart entry
- **THEN** the SessionStart key is removed from settings.json entirely

#### Scenario: Keep hook flag
- **WHEN** `--keep-hook` is passed
- **THEN** the SessionStart hook entry is left intact

### Requirement: Skills removal with _pulse marker
`pulse uninstall` SHALL delete all skill directories under `.claude/skills/` whose `SKILL.md` frontmatter contains `_pulse: true`. This means deleting `cc-*` directories that were installed by pulse. This step SHALL be skipped if `--keep-skills` is passed.

#### Scenario: Pulse skills removed
- **WHEN** `pulse uninstall` is executed without `--keep-skills`
- **THEN** all `cc-*` skill directories with `_pulse: true` in their SKILL.md frontmatter are deleted

#### Scenario: User skills preserved
- **WHEN** `.claude/skills/` contains skills without `_pulse: true` in their frontmatter
- **THEN** those skills are NOT deleted by uninstall

#### Scenario: Keep skills flag
- **WHEN** `--keep-skills` is passed
- **THEN** no skill directories are deleted

### Requirement: Meta file removal
`pulse uninstall` SHALL delete `.claude/skills/.pulse-meta.json`.

#### Scenario: Meta file deleted
- **WHEN** `pulse uninstall` is executed
- **THEN** `.pulse-meta.json` is removed from `.claude/skills/`

#### Scenario: Meta file already missing
- **WHEN** `.pulse-meta.json` does not exist
- **THEN** the command completes without error

### Requirement: Safety guarantee for non-pulse skills
`pulse uninstall` SHALL NEVER delete or modify any skill that does not have `_pulse: true` in its SKILL.md frontmatter. This is a critical safety invariant.

#### Scenario: Non-pulse skill is untouched
- **WHEN** `.claude/skills/my-custom-skill/SKILL.md` exists without `_pulse: true`
- **THEN** it is never read, modified, or deleted by uninstall
