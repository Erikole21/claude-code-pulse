## ADDED Requirements

### Requirement: Memory file location
The tutor memory SHALL be stored at `~/.claude/pulse/memory.json` in the user's home directory. It SHALL never be stored inside a repository. The directory SHALL be created automatically on first write.

#### Scenario: First write creates directory
- **WHEN** `writeMemory()` is called and `~/.claude/pulse/` does not exist
- **THEN** the directory is created recursively and `memory.json` is written

#### Scenario: Memory isolated from repo
- **WHEN** memory is written
- **THEN** the file path starts with the user's home directory, never with the current working directory

### Requirement: PulseUserMemory interface
The memory SHALL conform to the PulseUserMemory interface with fields: `name` (string), `language` (string), `joinedAt` (ISO string), `level` ("beginner"|"intermediate"|"advanced"), `levelUpdatedAt` (ISO string), `topics` (map of topicId to status/dates/notes), `frequentQuestions` (array with question/topic/count/lastAskedAt), `exercises` (map of exerciseId to status/dates/feedback), `nextSteps` (array with topicId/reason/suggestedAt), `lastSession` (date/duration/topicsCovered/endNote).

#### Scenario: Default memory for new user
- **WHEN** no memory file exists and `getDefaultMemory()` is called
- **THEN** it returns a PulseUserMemory with name="", language="en", level="beginner", empty topics/exercises/frequentQuestions/nextSteps

### Requirement: Read memory returns null when absent
The `readMemory()` function SHALL return `null` when the memory file does not exist or is unreadable.

#### Scenario: No memory file
- **WHEN** `readMemory()` is called and `~/.claude/pulse/memory.json` does not exist
- **THEN** it returns `null`

#### Scenario: Existing memory file
- **WHEN** `readMemory()` is called and the file exists with valid JSON
- **THEN** it returns the parsed PulseUserMemory object

### Requirement: Update memory with partial merge
The `updateMemory(patch)` function SHALL merge the patch over the existing memory (or defaults if none exists) without losing fields not included in the patch.

#### Scenario: Partial update preserves existing fields
- **WHEN** memory has `name: "Erik"` and `updateMemory({ level: "intermediate" })` is called
- **THEN** the resulting memory has both `name: "Erik"` and `level: "intermediate"`

### Requirement: Session logging
The `logSession()` function SHALL write session logs to `~/.claude/pulse/sessions/<YYYY-MM-DD>.json` with date, topicsCovered, endNote, and optional duration.

#### Scenario: Session log file created
- **WHEN** `logSession()` is called with topicsCovered and endNote
- **THEN** a JSON file is written in the sessions subdirectory named by the current date
