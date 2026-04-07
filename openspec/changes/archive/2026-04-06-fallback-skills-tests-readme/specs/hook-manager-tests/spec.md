## ADDED Requirements

### Requirement: Merge with existing hooks
The test suite MUST verify that `addHook()` preserves all existing user-defined hooks in `.claude/settings.json` when adding the pulse hook entry.

#### Scenario: Existing hooks are preserved
- **WHEN** `addHook()` is called on a settings file that already contains user-defined `SessionStart` hooks
- **THEN** the resulting settings file SHALL contain all original user hooks unchanged plus the new `_pulse: true` hook entry appended at the end of the `SessionStart` array

#### Scenario: Settings file with other hook types preserved
- **WHEN** `addHook()` is called on a settings file that has hooks for other events (e.g., `PostToolUse`, `Stop`)
- **THEN** those other hook event arrays SHALL remain completely unchanged

### Requirement: Idempotent initialization
The test suite MUST verify that calling `addHook()` multiple times does not create duplicate pulse hook entries.

#### Scenario: No duplicate hooks after repeated init
- **WHEN** `addHook()` is called twice consecutively on the same settings file
- **THEN** the `SessionStart` array SHALL contain exactly one entry with `_pulse: true`

### Requirement: Remove only pulse entry
The test suite MUST verify that `removeHook()` removes only the `_pulse: true` entry and leaves all other hooks intact.

#### Scenario: Clean removal of pulse hook
- **WHEN** `removeHook()` is called on a settings file that has both user hooks and the pulse hook in `SessionStart`
- **THEN** only the entry with `_pulse: true` SHALL be removed
- **THEN** all other `SessionStart` hooks SHALL remain intact

#### Scenario: Empty SessionStart array removed
- **WHEN** `removeHook()` is called and the pulse hook is the only entry in `SessionStart`
- **THEN** the `SessionStart` key SHALL be removed entirely from the hooks object

#### Scenario: Remove on clean settings is safe
- **WHEN** `removeHook()` is called on a settings file that has no pulse hook
- **THEN** the settings file SHALL remain unchanged and no error SHALL be thrown
