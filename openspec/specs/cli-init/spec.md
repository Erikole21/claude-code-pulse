## ADDED Requirements

### Requirement: Already initialized detection
`pulse init` SHALL check if pulse is already initialized by looking for `.pulse-meta.json`. If already initialized and `--force` is not set, it SHALL display the current status and exit without changes.

#### Scenario: Already initialized without --force
- **WHEN** `.pulse-meta.json` exists and `--force` is not passed
- **THEN** the command displays current status and exits with code 0

#### Scenario: Already initialized with --force
- **WHEN** `.pulse-meta.json` exists and `--force` is passed
- **THEN** the command proceeds with re-initialization

### Requirement: Directory creation
`pulse init` SHALL verify that `.claude/` directory exists and create it if missing, along with `.claude/skills/`.

#### Scenario: .claude directory does not exist
- **WHEN** `.claude/` does not exist in the working directory
- **THEN** the command creates `.claude/` and `.claude/skills/`

### Requirement: Skills preview and confirmation
`pulse init` SHALL display the list of skills that will be installed with their priorities before proceeding. It SHALL prompt for confirmation unless `--yes` is passed.

#### Scenario: User confirms installation
- **WHEN** skills are displayed and user confirms
- **THEN** the command proceeds to sync

#### Scenario: Skip confirmation with --yes
- **WHEN** `--yes` flag is passed
- **THEN** the command skips the confirmation prompt and proceeds directly

#### Scenario: User declines installation
- **WHEN** skills are displayed and user declines
- **THEN** the command exits without installing anything

### Requirement: Skills filter option
`pulse init` SHALL accept an optional `--skills <ids...>` flag to limit which skills are installed instead of the full registry.

#### Scenario: Init with specific skills
- **WHEN** `--skills cc-tutor cc-hooks-events` is passed
- **THEN** only those two skills are installed

### Requirement: Full sync execution
After confirmation, `pulse init` SHALL execute a full sync (equivalent to `pulse sync --force`) to fetch, transform, and install all applicable skills.

#### Scenario: Sync runs during init
- **WHEN** init proceeds past confirmation
- **THEN** all skills from the registry (or filtered set) are fetched, transformed, and installed

### Requirement: Hook injection
After successful sync, `pulse init` SHALL inject the SessionStart hook into `.claude/settings.json` using the hook-manager module.

#### Scenario: Hook is injected
- **WHEN** sync completes successfully
- **THEN** a SessionStart hook entry with `_pulse: true` is added to `.claude/settings.json`

### Requirement: Meta file initialization
`pulse init` SHALL write `.pulse-meta.json` with `firstSessionDone: false` and the sync results.

#### Scenario: Meta file created
- **WHEN** init completes
- **THEN** `.pulse-meta.json` exists with `firstSessionDone: false` and sync metadata

### Requirement: Summary output
After completion, `pulse init` SHALL display a summary including: number of skills installed, hook status, next sync timing, and a suggestion to commit `.claude/skills/cc-*` for team sharing.

#### Scenario: Summary is displayed
- **WHEN** init completes successfully
- **THEN** output shows skill count, hook added confirmation, next sync in 24h, and commit suggestion
