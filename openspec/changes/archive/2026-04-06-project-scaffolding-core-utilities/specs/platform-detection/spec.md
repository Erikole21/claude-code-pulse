## ADDED Requirements

### Requirement: OS platform detection
The `platform.ts` module SHALL detect three platform types: `"windows"` (native Windows, not WSL), `"unix"` (macOS, Linux), and `"wsl"` (Windows Subsystem for Linux). WSL SHALL be detected by checking if `/proc/version` exists and contains `"microsoft"` (case-insensitive). WSL SHALL be treated as Unix for command generation.

#### Scenario: Native Windows detection
- **WHEN** running on Windows without WSL
- **THEN** platform is detected as `"windows"`

#### Scenario: WSL detection
- **WHEN** `/proc/version` exists and contains "microsoft"
- **THEN** platform is detected as `"wsl"`

#### Scenario: Unix detection
- **WHEN** running on macOS or Linux (not WSL)
- **THEN** platform is detected as `"unix"`

### Requirement: Hook command generation
The `getHookCommand()` function SHALL return the appropriate shell command for the SessionStart hook based on the detected platform. Windows native SHALL use `npx.cmd` with `&` separator. Unix and WSL SHALL use `npx` with `&&` and `|| true` suffix to ensure failures never block Claude Code startup.

#### Scenario: Windows hook command
- **WHEN** platform is `"windows"`
- **THEN** returns `"npx.cmd pulse sync --if-stale 86400 --silent & npx.cmd pulse greet --once"`

#### Scenario: Unix/WSL hook command
- **WHEN** platform is `"unix"` or `"wsl"`
- **THEN** returns `"npx pulse sync --if-stale 86400 --silent && npx pulse greet --once || true"`

### Requirement: Claude CLI availability check
The `isClaudeCliAvailable()` async function SHALL attempt to execute `claude --version` with a 5-second timeout. On Windows, it SHALL also check for `claude.cmd`. It SHALL return `true` if the command succeeds, `false` otherwise.

#### Scenario: Claude CLI is installed
- **WHEN** `claude --version` executes successfully within 5 seconds
- **THEN** `isClaudeCliAvailable()` returns `true`

#### Scenario: Claude CLI is not available
- **WHEN** `claude --version` fails or times out
- **THEN** `isClaudeCliAvailable()` returns `false`
