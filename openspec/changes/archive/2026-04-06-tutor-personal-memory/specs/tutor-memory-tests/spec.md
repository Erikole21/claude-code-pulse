## ADDED Requirements

### Requirement: Memory CRUD tests
The test suite SHALL verify readMemory, writeMemory, updateMemory, and logSession functions against a temporary directory.

#### Scenario: readMemory returns null for missing file
- **WHEN** readMemory is called with no file present
- **THEN** it returns null

#### Scenario: writeMemory creates directory
- **WHEN** writeMemory is called and the target directory does not exist
- **THEN** the directory is created and the file is written successfully

#### Scenario: updateMemory merges without data loss
- **WHEN** memory has existing fields and updateMemory is called with a partial patch
- **THEN** existing fields not in the patch are preserved

#### Scenario: logSession writes dated file
- **WHEN** logSession is called
- **THEN** a file named YYYY-MM-DD.json is created in the sessions subdirectory

### Requirement: Uninstall safety tests
The test suite SHALL verify that uninstall respects the purge-memory flag boundary.

#### Scenario: Uninstall without purge-memory
- **WHEN** pulse uninstall is run without --purge-memory
- **THEN** ~/.claude/pulse/ directory is untouched

#### Scenario: Uninstall with purge-memory
- **WHEN** pulse uninstall --purge-memory is run
- **THEN** ~/.claude/pulse/ directory is deleted

### Requirement: CLI memory command tests
The test suite SHALL verify export produces valid JSON and update rejects invalid JSON.

#### Scenario: Export produces valid JSON
- **WHEN** pulse memory --export is run
- **THEN** stdout contains JSON parseable by JSON.parse()

#### Scenario: Invalid JSON update shows error
- **WHEN** pulse memory --update with malformed JSON is run
- **THEN** an error message is displayed and memory is unchanged
