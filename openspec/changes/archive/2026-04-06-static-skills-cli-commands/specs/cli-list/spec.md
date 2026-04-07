## ADDED Requirements

### Requirement: Skills table display
`pulse list` SHALL display a table with columns: Skill ID, Last Sync (timestamp), Transformer (claude/static/fixed), and Status (icon-based).

#### Scenario: Table with installed skills
- **WHEN** `pulse list` is executed and skills are installed
- **THEN** a table is displayed with one row per skill showing ID, last sync time, transformer type, and status icon

### Requirement: Status icons
The Status column SHALL use icons to indicate skill state: a check mark for fresh skills (synced within maxAge), a warning icon for stale skills (synced but older than maxAge), and an error icon for missing skills (in registry but not installed).

#### Scenario: Fresh skill status
- **WHEN** a skill was synced less than 24 hours ago
- **THEN** the status column shows a check mark icon

#### Scenario: Stale skill status
- **WHEN** a skill was synced more than 24 hours ago
- **THEN** the status column shows a warning icon

#### Scenario: Missing skill status
- **WHEN** a skill is in the registry but not installed on disk
- **THEN** the status column shows an error icon

### Requirement: All registry skills shown
`pulse list` SHALL show all skills from the SKILLS_REGISTRY, including those that are not yet installed. Missing skills SHALL be shown with empty sync/transformer fields and the error status icon.

#### Scenario: Uninstalled skills appear in list
- **WHEN** some skills from the registry are not installed
- **THEN** they appear in the table with missing status and empty sync details
