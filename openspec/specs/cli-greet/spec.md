## ADDED Requirements

### Requirement: JSON output for SessionStart hook
`pulse greet` SHALL output a JSON object to stdout with the structure `{ "additionalContext": "<message>" }`. This format is required by the Claude Code SessionStart hook to inject context into the session. No other output SHALL be written to stdout.

#### Scenario: JSON output format
- **WHEN** `pulse greet` is executed and conditions are met for output
- **THEN** stdout contains exactly one JSON object with an `additionalContext` string field

#### Scenario: No extraneous stdout
- **WHEN** `pulse greet` produces output
- **THEN** the only stdout content is the JSON object (no log messages, no decorations)

### Requirement: Welcome message content
The `additionalContext` message SHALL include: that pulse is active and skills are synchronized, how to invoke the tutor (`/cc-tutor`), how to view the learning path (`/cc-learning-path`), and that skills auto-update daily.

#### Scenario: Welcome message includes key information
- **WHEN** the welcome JSON is output
- **THEN** the `additionalContext` field mentions pulse being active, `/cc-tutor`, `/cc-learning-path`, and daily auto-updates

### Requirement: --once flag with firstSessionDone tracking
`pulse greet --once` SHALL only produce output if `firstSessionDone` is `false` in the meta file. After outputting the welcome message, it SHALL set `firstSessionDone` to `true` in the meta file.

#### Scenario: First session greeting
- **WHEN** `--once` is passed and `firstSessionDone` is `false`
- **THEN** the welcome JSON is output and `firstSessionDone` is set to `true` in meta

#### Scenario: Subsequent session with --once
- **WHEN** `--once` is passed and `firstSessionDone` is `true`
- **THEN** no output is produced and the command exits with code 0

### Requirement: Greet without --once
When `--once` is not passed, `pulse greet` SHALL always output the welcome JSON regardless of the `firstSessionDone` state.

#### Scenario: Greet without --once always outputs
- **WHEN** `pulse greet` is executed without `--once` and `firstSessionDone` is `true`
- **THEN** the welcome JSON is still output
