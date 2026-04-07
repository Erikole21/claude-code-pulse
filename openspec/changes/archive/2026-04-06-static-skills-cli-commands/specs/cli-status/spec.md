## ADDED Requirements

### Requirement: Version display
`pulse status` SHALL display the package version read from package.json.

#### Scenario: Version shown
- **WHEN** `pulse status` is executed
- **THEN** the output includes the pulse package version

### Requirement: Directory display
`pulse status` SHALL display the current working directory.

#### Scenario: Directory shown
- **WHEN** `pulse status` is executed
- **THEN** the output includes the current working directory path

### Requirement: Skills count
`pulse status` SHALL display the count of installed skills out of the total available in the registry (e.g., "18 / 23 installed").

#### Scenario: Skills count shown
- **WHEN** `pulse status` is executed with some skills installed
- **THEN** the output shows installed count vs total registry count

### Requirement: Last sync information
`pulse status` SHALL display the time of the last sync as a relative time (e.g., "2 hours ago") and the sync status (success/partial/failed). If the last sync failed, it SHALL also show the error message.

#### Scenario: Successful last sync
- **WHEN** the last sync was successful
- **THEN** the output shows relative time and "success" status

#### Scenario: Failed last sync with error
- **WHEN** the last sync failed
- **THEN** the output shows relative time, "failed" status, and the error message

### Requirement: Hook status
`pulse status` SHALL check `.claude/settings.json` for a SessionStart hook entry with `_pulse: true` and display whether the hook is installed or not.

#### Scenario: Hook is installed
- **WHEN** the SessionStart hook with `_pulse: true` exists in settings.json
- **THEN** the output shows hook as installed with a check mark

#### Scenario: Hook is not installed
- **WHEN** no SessionStart hook with `_pulse: true` exists
- **THEN** the output shows hook as not installed with an error mark

### Requirement: Claude CLI status
`pulse status` SHALL check if the `claude` CLI is available and display the result, indicating which transformer mode will be used (claude or static).

#### Scenario: Claude CLI available
- **WHEN** `claude --version` succeeds
- **THEN** the output shows Claude CLI available with "transformer: claude"

#### Scenario: Claude CLI not available
- **WHEN** `claude --version` fails
- **THEN** the output shows Claude CLI not available with "transformer: static"

### Requirement: Platform display
`pulse status` SHALL display the detected platform (unix, windows, or wsl).

#### Scenario: Platform shown
- **WHEN** `pulse status` is executed
- **THEN** the output includes the detected platform

### Requirement: firstSessionDone display
`pulse status` SHALL display the current value of the `firstSessionDone` flag from the meta file.

#### Scenario: firstSessionDone shown
- **WHEN** `pulse status` is executed
- **THEN** the output includes the firstSessionDone value (true or false)
