## MODIFIED Requirements

### Requirement: Uninstall with optional memory purge
The `pulse uninstall` command SHALL accept an additional `--purge-memory` flag. Without this flag, the command SHALL never touch `~/.claude/pulse/`. With the flag, it SHALL delete the entire `~/.claude/pulse/` directory after prompting for user confirmation.

#### Scenario: Uninstall without purge-memory
- **WHEN** `pulse uninstall` is run without `--purge-memory`
- **THEN** `~/.claude/pulse/` is not touched; only repo-level pulse artifacts are removed

#### Scenario: Uninstall with purge-memory confirmed
- **WHEN** `pulse uninstall --purge-memory` is run and the user confirms
- **THEN** `~/.claude/pulse/` is deleted entirely along with repo-level artifacts

#### Scenario: Uninstall with purge-memory cancelled
- **WHEN** `pulse uninstall --purge-memory` is run and the user denies confirmation
- **THEN** `~/.claude/pulse/` is not deleted; repo-level uninstall proceeds normally
