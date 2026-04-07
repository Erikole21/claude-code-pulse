## ADDED Requirements

### Requirement: Memory progress display
Running `pulse memory` with no flags SHALL display a formatted summary of the user's tutor progress: identity (name, level, language), join date, last session, topic progress (completed/in-progress/pending), exercises status, frequent questions with counts, and recommended next steps.

#### Scenario: User has existing memory
- **WHEN** `pulse memory` is run and memory.json exists
- **THEN** a formatted summary is displayed with all sections populated from the memory data

#### Scenario: No memory exists
- **WHEN** `pulse memory` is run and no memory.json exists
- **THEN** a message is shown indicating no tutor sessions have been recorded yet

### Requirement: Memory reset
Running `pulse memory --reset` SHALL delete `memory.json` after prompting for confirmation. It SHALL NOT delete session logs.

#### Scenario: Reset with confirmation
- **WHEN** `pulse memory --reset` is run and the user confirms
- **THEN** `memory.json` is deleted and a confirmation message is shown

#### Scenario: Reset cancelled
- **WHEN** `pulse memory --reset` is run and the user denies
- **THEN** nothing is deleted

### Requirement: Memory export
Running `pulse memory --export` SHALL write the contents of `memory.json` to stdout as valid JSON.

#### Scenario: Export existing memory
- **WHEN** `pulse memory --export` is run and memory exists
- **THEN** the full memory JSON is written to stdout, parseable by `JSON.parse()`

### Requirement: Memory import
Running `pulse memory --import <file>` SHALL read the specified file and replace `memory.json` with its contents after validating it is valid JSON.

#### Scenario: Import valid backup
- **WHEN** `pulse memory --import backup.json` is run with a valid JSON file
- **THEN** memory.json is replaced with the imported content

#### Scenario: Import invalid file
- **WHEN** `pulse memory --import bad.txt` is run with invalid JSON
- **THEN** an error message is shown and memory.json is not modified

### Requirement: Memory partial update
Running `pulse memory --update '<JSON>'` SHALL parse the JSON string and merge it into the existing memory using `updateMemory()`.

#### Scenario: Update specific fields
- **WHEN** `pulse memory --update '{"level":"advanced"}'` is run
- **THEN** the level field is updated while all other fields are preserved

#### Scenario: Invalid JSON in update
- **WHEN** `pulse memory --update 'not json'` is run
- **THEN** an error message is shown and memory is not modified

### Requirement: Exercise status update
Running `pulse memory --exercise <id> --status <status>` SHALL update the specified exercise entry in memory.

#### Scenario: Mark exercise completed
- **WHEN** `pulse memory --exercise create-hook --status completed` is run
- **THEN** exercises["create-hook"].status is set to "completed" and completedAt is set to current ISO timestamp

### Requirement: Next step addition
Running `pulse memory --next-step <desc> --reason <reason>` SHALL append a new entry to the nextSteps array.

#### Scenario: Add next step
- **WHEN** `pulse memory --next-step "Learn agent-teams" --reason "Ready for advanced topics"` is run
- **THEN** a new entry is appended to nextSteps with topicId, reason, and current suggestedAt timestamp
