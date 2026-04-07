## ADDED Requirements

### Requirement: PulseMeta persistence
The `meta.ts` module SHALL read and write a `.pulse-meta.json` file located at `.claude/skills/.pulse-meta.json` relative to the working directory. The file SHALL conform to the PulseMeta interface: `version`, `lastSync` (ISO string), `lastSyncStatus` (`"success"` | `"partial"` | `"failed"`), `lastSyncError?`, `firstSessionDone` (boolean), `skills` (map of skill ID to sync info), and `etags` (map of URL to ETag string).

#### Scenario: Write and read metadata
- **WHEN** the meta module writes a PulseMeta object
- **THEN** it is persisted as JSON at `.claude/skills/.pulse-meta.json` and can be read back identically

#### Scenario: File does not exist yet
- **WHEN** the meta file does not exist and a read is attempted
- **THEN** the module returns a default PulseMeta with `version` set to package version, `lastSync` empty, `lastSyncStatus: "failed"`, `firstSessionDone: false`, empty `skills` and `etags`

### Requirement: Staleness check
The `isStale(maxAgeSeconds)` function SHALL compare `lastSync` with the current time and return `true` if the difference exceeds `maxAgeSeconds`, or if `lastSync` is empty/missing.

#### Scenario: Metadata is stale
- **WHEN** `lastSync` is 25 hours ago and `maxAgeSeconds` is 86400
- **THEN** `isStale(86400)` returns `true`

#### Scenario: Metadata is fresh
- **WHEN** `lastSync` is 1 hour ago and `maxAgeSeconds` is 86400
- **THEN** `isStale(86400)` returns `false`

#### Scenario: No previous sync
- **WHEN** `lastSync` is empty or undefined
- **THEN** `isStale(any)` returns `true`

### Requirement: First session tracking
The meta module SHALL track `firstSessionDone` flag. `pulse init` SHALL set it to `false`. After `pulse greet --once` executes successfully, it SHALL be set to `true`.

#### Scenario: Init sets firstSessionDone to false
- **WHEN** a new `.pulse-meta.json` is created by init
- **THEN** `firstSessionDone` is `false`
