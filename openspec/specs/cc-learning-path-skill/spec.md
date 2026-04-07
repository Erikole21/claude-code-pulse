## ADDED Requirements

### Requirement: Learning path skill frontmatter
The `cc-learning-path/SKILL.md` file SHALL include YAML frontmatter with `name: cc-learning-path`, `description` referencing structured learning path by levels, `invocation: user`, `_pulse: true`, and `_static: true`.

#### Scenario: Frontmatter fields are present and correct
- **WHEN** the `cc-learning-path/SKILL.md` file is read
- **THEN** the frontmatter contains `name: cc-learning-path`, `invocation: user`, `_pulse: true`, `_static: true`, and a description about structured learning path by levels

### Requirement: Table-based curriculum per level
The learning path SHALL organize content in three levels (Beginner, Intermediate, Advanced) using markdown tables with columns for Topic, Reference Skill, and Exercise.

#### Scenario: Beginner level table
- **WHEN** the Beginner section is read
- **THEN** it contains a table with topics including installation, permission modes, CLAUDE.md, built-in commands, and git workflow, each with a reference skill and a practical exercise

#### Scenario: Intermediate level table
- **WHEN** the Intermediate section is read
- **THEN** it contains a table with topics including settings.json, creating skills, hook events (SessionStart, PostToolUse), MCP servers, sub-agents, worktrees, and headless mode, each with reference skills and exercises

#### Scenario: Advanced level table
- **WHEN** the Advanced section is read
- **THEN** it contains a table with topics including agent teams, channels, plugins, GitHub Actions, sandboxing, model config, and scheduled tasks, each with reference skills and exercises

### Requirement: Level checkpoints
Each level section SHALL end with a checkpoint question that helps the user self-assess whether they have mastered that level before progressing.

#### Scenario: Beginner checkpoint
- **WHEN** the Beginner section is read
- **THEN** it ends with a checkpoint about being able to use Claude Code for a codebase change with tests

#### Scenario: Intermediate checkpoint
- **WHEN** the Intermediate section is read
- **THEN** it ends with a checkpoint about having hooks that automate repetitive tasks

#### Scenario: Advanced checkpoint
- **WHEN** the Advanced section is read
- **THEN** it ends with a checkpoint about CI/CD integration and shared plugins

### Requirement: Available skills listing
The learning path SHALL include a section listing all available synchronized skills in the session, providing a quick reference for the user.

#### Scenario: Skills listing section
- **WHEN** the learning path content is read
- **THEN** it contains a section listing all `cc-*` skill IDs that are synchronized by pulse

### Requirement: Exercise references to skills
Each exercise in the tables SHALL be actionable and reference the specific skill that provides detailed documentation for that topic.

#### Scenario: Exercise references correct skill
- **WHEN** a table row has a reference skill column
- **THEN** the reference skill matches an existing skill ID from the skills registry (e.g., `cc-permissions`, `cc-hooks-events`, `cc-mcp`)
