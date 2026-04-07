## ADDED Requirements

### Requirement: Commander program setup
The `src/cli.ts` file SHALL create a commander `Program` with name `pulse`, version read from `package.json`, and description `"Keep Claude Code alive. Fresh docs, built-in tutor, always in sync."`. It SHALL register all six subcommands: init, sync, greet, list, status, uninstall.

#### Scenario: Program metadata
- **WHEN** `pulse --version` is executed
- **THEN** it outputs the version from package.json

#### Scenario: Help output lists all commands
- **WHEN** `pulse --help` is executed
- **THEN** it lists init, sync, greet, list, status, and uninstall as available commands

### Requirement: Subcommand registration
Each subcommand SHALL be imported from its own file under `src/commands/` and registered on the main program. The module structure SHALL match: `init.ts`, `sync.ts`, `greet.ts`, `list.ts`, `status.ts`, `uninstall.ts`.

#### Scenario: Each command is independently importable
- **WHEN** a command module is imported
- **THEN** it exports a function that registers the command on a commander program instance

### Requirement: Entry point shebang
The built `dist/cli.js` SHALL include `#!/usr/bin/env node` as its first line so it can be executed directly as a CLI binary.

#### Scenario: Built file has shebang
- **WHEN** `npm run build` completes
- **THEN** `dist/cli.js` starts with `#!/usr/bin/env node`
