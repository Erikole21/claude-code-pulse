# project-readme

## Purpose

Requirements for the root project README content and structure.

## Requirements

### Requirement: Installation in 10 seconds section
The README SHALL include an "Installation in 10 seconds" section as the first content section, with `npx pulse init` as the primary instruction.

#### Scenario: Quick start present
- **WHEN** a user reads the README
- **THEN** the first content section SHALL show how to install pulse with a single command (`npx pulse init`)

### Requirement: What pulse does section
The README SHALL include a "What pulse does" section explaining the three main features: doc sync, built-in tutor, and learning path.

#### Scenario: Core features explained
- **WHEN** a user reads the "What pulse does" section
- **THEN** they SHALL find descriptions of automatic doc synchronization, the interactive tutor (`cc-tutor`), and the structured learning path (`cc-learning-path`)

### Requirement: Skills table section
The README SHALL include a "Skills" section with a complete table listing all skills from the SKILLS_REGISTRY, including their ID, description, and priority level.

#### Scenario: All skills listed
- **WHEN** a user reads the skills table
- **THEN** the table SHALL list every skill defined in `SKILLS_REGISTRY` with its id, description, and priority

### Requirement: Team usage section
The README SHALL include a "Team usage" section explaining how to commit `.claude/skills/cc-*` directories to share skills with the team.

#### Scenario: Team sharing instructions
- **WHEN** a user reads the team usage section
- **THEN** they SHALL find instructions to commit `.claude/skills/cc-*` to version control for team-wide access

### Requirement: CLI commands table section
The README SHALL include a "CLI commands" section with a table of all pulse commands (init, sync, greet, list, status, uninstall) and their descriptions and key flags.

#### Scenario: All commands documented
- **WHEN** a user reads the CLI commands table
- **THEN** the table SHALL include entries for `pulse init`, `pulse sync`, `pulse greet`, `pulse list`, `pulse status`, and `pulse uninstall` with descriptions and notable flags

### Requirement: Sync mechanism section
The README SHALL include a section explaining how the sync mechanism works, covering ETag caching, the Claude CLI transformer with static fallback, and the SessionStart hook.

#### Scenario: Sync details present
- **WHEN** a user reads the sync mechanism section
- **THEN** they SHALL understand the ETag-based caching, the transformer pipeline (Claude CLI with static fallback), and how the SessionStart hook triggers daily sync

### Requirement: Configuration section
The README SHALL include a "Configuration" section documenting all `.pulserc.json` options: skills, maxAge, transformer, and silent.

#### Scenario: All config options documented
- **WHEN** a user reads the configuration section
- **THEN** they SHALL find documentation for each `.pulserc.json` option with its default value and valid values

### Requirement: Troubleshooting section
The README SHALL include a "Troubleshooting" section covering common issues: hook not working, Windows-specific issues, stale skills, and Claude CLI not available.

#### Scenario: Common issues addressed
- **WHEN** a user encounters a problem
- **THEN** the troubleshooting section SHALL address: hook not functioning, Windows-specific behavior, skills showing as stale, and static transformer fallback when Claude CLI is unavailable

### Requirement: Contributing section
The README SHALL include a "Contributing" section explaining how to improve the static skills and the tutor content.

#### Scenario: Contribution guidance present
- **WHEN** a user wants to contribute
- **THEN** the contributing section SHALL explain how to modify static skill content and improve the tutor
