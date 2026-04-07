# platform-tests

## Purpose

Test-suite requirements for platform detection and hook command generation.

## Requirements

### Requirement: Correct OS detection
The test suite MUST verify that `detectPlatform()` correctly identifies the current operating system as `"windows"`, `"unix"`, or `"wsl"`.

#### Scenario: Windows detection
- **WHEN** `process.platform` is `"win32"`
- **THEN** `detectPlatform()` SHALL return `"windows"`

#### Scenario: Unix detection on macOS
- **WHEN** `process.platform` is `"darwin"`
- **THEN** `detectPlatform()` SHALL return `"unix"`

#### Scenario: Unix detection on Linux
- **WHEN** `process.platform` is `"linux"` and `/proc/version` does not contain "microsoft"
- **THEN** `detectPlatform()` SHALL return `"unix"`

#### Scenario: WSL detection
- **WHEN** `process.platform` is `"linux"` and `/proc/version` exists and contains "microsoft" (case-insensitive)
- **THEN** `detectPlatform()` SHALL return `"wsl"`

### Requirement: Correct hook command per platform
The test suite MUST verify that `getHookCommand()` returns the correct platform-specific command string.

#### Scenario: Windows hook command
- **WHEN** the detected platform is `"windows"`
- **THEN** `getHookCommand()` SHALL return a command using `npx.cmd` with `&` separator

#### Scenario: Unix hook command
- **WHEN** the detected platform is `"unix"`
- **THEN** `getHookCommand()` SHALL return a command using `npx` with `&&` separator and `|| true` suffix

#### Scenario: WSL hook command uses Unix format
- **WHEN** the detected platform is `"wsl"`
- **THEN** `getHookCommand()` SHALL return the same command format as Unix (using `npx` with `&&` and `|| true`)
