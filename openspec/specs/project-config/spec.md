## ADDED Requirements

### Requirement: ESM TypeScript package structure
The package SHALL be configured as an ESM-only TypeScript project targeting Node.js 18+. The `package.json` SHALL define `"type": "module"`, a `bin` entry mapping `pulse` to `./dist/cli.js`, and use `tsup` for building with the `#!/usr/bin/env node` banner.

#### Scenario: Build produces executable CLI
- **WHEN** `npm run build` is executed
- **THEN** `dist/cli.js` is created with a shebang line and ESM format targeting node18

### Requirement: cosmiconfig-based project configuration
The package SHALL support project-level configuration via `.pulserc.json` loaded by cosmiconfig. The config SHALL support fields: `skills` (priority filter: `"critical"`, `"high"`, `"medium"`, or `"all"`), `maxAge` (staleness threshold in seconds, default 86400), `transformer` (`"auto"`, `"claude"`, or `"static"`), and `silent` (boolean).

#### Scenario: Default config when no .pulserc.json exists
- **WHEN** no `.pulserc.json` file is found in the project
- **THEN** the system uses defaults: skills=`["critical","high"]`, maxAge=86400, transformer=`"auto"`, silent=false

#### Scenario: Custom config is loaded
- **WHEN** a `.pulserc.json` with `{"skills":"all","maxAge":3600}` exists
- **THEN** those values override defaults while `transformer` and `silent` retain defaults

### Requirement: Development tooling
The package SHALL include `vitest` for testing and `tsx` for direct TypeScript execution during development. Scripts SHALL include: `build`, `dev`, `test`, and `prepublishOnly`.

#### Scenario: Test runner is available
- **WHEN** `npm test` is executed
- **THEN** vitest runs all test files matching `tests/**/*.test.ts`
