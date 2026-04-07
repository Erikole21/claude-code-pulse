## ADDED Requirements

### Requirement: Tutor skill frontmatter
The `cc-tutor/SKILL.md` file SHALL include YAML frontmatter with `name: cc-tutor`, `description` matching the SDD tutor description, `invocation: auto`, `_pulse: true`, and `_static: true`. The description SHALL mention language detection, level adaptation, and coverage of hooks, MCP, sub-agents, and advanced features.

#### Scenario: Frontmatter fields are present and correct
- **WHEN** the `cc-tutor/SKILL.md` file is read
- **THEN** the frontmatter contains `name: cc-tutor`, `invocation: auto`, `_pulse: true`, `_static: true`, and a multi-line description referencing interactive tutoring and language detection

### Requirement: Language detection instruction
The tutor skill content SHALL instruct Claude to detect the user's language from their first message and respond in that language for the entire session, without asking the user which language they prefer.

#### Scenario: Language detection behavior
- **WHEN** the tutor skill is activated
- **THEN** the skill content instructs to detect language automatically and respond in the user's language without asking

### Requirement: Level assessment with two questions
The tutor skill SHALL instruct Claude to assess the user's experience level using a maximum of two questions before providing guidance. The first question SHALL determine if the user is new to Claude Code. The second question (if needed) SHALL ask which features they already use.

#### Scenario: New user assessment
- **WHEN** a user has never used Claude Code before
- **THEN** the tutor asks at most 2 assessment questions before guiding at the Beginner level

#### Scenario: Experienced user assessment
- **WHEN** a user already uses Claude Code
- **THEN** the tutor asks what features they use frequently and adjusts depth accordingly

### Requirement: Three learning tiers
The tutor skill SHALL structure learning content in three tiers: Beginner, Intermediate, and Advanced. Beginner SHALL cover installation, first session, basic commands, permission modes, CLAUDE.md, and git workflow. Intermediate SHALL cover settings.json, skills, hooks, MCP, sub-agents, worktrees, headless mode, and /loop. Advanced SHALL cover agent teams, channels, plugins, GitHub Actions, sandboxing, monitoring, managed settings, and LLM gateway.

#### Scenario: Beginner tier content
- **WHEN** the skill content is read
- **THEN** the Beginner tier includes installation, first session, basic commands (/help, /compact, /cost, /memory), permission modes, CLAUDE.md basics, and git workflow

#### Scenario: Intermediate tier content
- **WHEN** the skill content is read
- **THEN** the Intermediate tier includes settings.json, skills creation, hooks (SessionStart, PostToolUse, Stop), MCP servers, sub-agents, worktrees, headless mode, and /loop

#### Scenario: Advanced tier content
- **WHEN** the skill content is read
- **THEN** the Advanced tier includes agent teams, channels, plugins, GitHub Actions, sandboxing, OpenTelemetry monitoring, managed settings, and LLM gateway

### Requirement: Tutoring rules
The tutor skill SHALL include rules for tutoring behavior: use concrete examples and real commands, ask follow-up questions after each topic, prioritize solving specific problems before teaching, suggest `/cc-learning-path` for the full curriculum, reference other `cc-*` skills for detailed information, and consult `cc-changelog` for recent changes.

#### Scenario: Tutoring rules are specified
- **WHEN** the skill content is read
- **THEN** it contains rules for concrete examples, follow-up questions, problem-first approach, cross-references to cc-learning-path and other cc-* skills
