## RENAMED Requirements

### Requirement: Tutor skill frontmatter
FROM: `cc-tutor/SKILL.md` with `name: cc-tutor`
TO: `pulse/SKILL.md` with `name: pulse`

## MODIFIED Requirements

### Requirement: Tutor skill frontmatter
The `pulse/SKILL.md` file SHALL include YAML frontmatter with `name: pulse`, `description` matching the registry description for the pulse skill, `_pulse: true`, and `_static: true`. The `disable-model-invocation` field SHALL be omitted (since pulse is auto-activable). The description SHALL mention "pulse", Claude Code guidance, ideas, and documentation-backed help.

#### Scenario: Frontmatter fields are present and correct
- **WHEN** the `pulse/SKILL.md` file is read
- **THEN** the frontmatter contains `name: pulse`, `_pulse: true`, `_static: true`, does NOT contain `disable-model-invocation`, and has a description referencing Pulse as a Claude Code companion

### Requirement: Memory-aware tutor behavior
The pulse skill SHALL read `~/.claude/pulse/memory.json` at session start BEFORE any other action. On session start with existing memory, it SHALL greet the user by name, show their previous `nextSteps`, and use `level` and `language` from memory. On first session (no memory), it SHALL ask for the user's name, WAIT for the response, detect their language, initialize memory, then assess level with max 2 questions before proceeding. The skill SHALL NEVER use Claude's native auto-memory system — `~/.claude/pulse/memory.json` is the only source of truth.

#### Scenario: Returning user session start
- **WHEN** the pulse skill activates and memory.json exists with name "Erik"
- **THEN** it reads memory first, greets "Hey Erik! Soy Pulse", shows previous nextSteps, and uses stored level and language

#### Scenario: New user first session
- **WHEN** the pulse skill activates and no memory.json exists
- **THEN** it introduces itself, asks the user's name, WAITS for the response, detects language, initializes memory via `pulse memory --update`, then asks max 2 level-assessment questions

#### Scenario: Level is persisted after assessment
- **WHEN** a new user answers the level-assessment questions
- **THEN** the skill updates memory with the determined level via `pulse memory --update '{"level":"<beginner|intermediate|advanced>"}'`

### Requirement: Progressive topic saving
The pulse skill SHALL save the user's progress IMMEDIATELY after explaining each topic, not at the end of the session. Each save SHALL update the topics seen and the last session info. If the topic suggests a natural next step, the skill SHALL also record it.

#### Scenario: Topic saved after explanation
- **WHEN** the skill finishes explaining a topic (e.g., "hooks")
- **THEN** it immediately runs `pulse memory --update '{"topics":{"hooks":{"seen":true,"date":"<today>"}}, "lastSession":{"date":"<today>","topic":"hooks"}}'`

#### Scenario: Next step recorded after topic
- **WHEN** a topic has a natural follow-up (e.g., after "hooks" → "mcp-servers")
- **THEN** the skill runs `pulse memory --next-step "<next-topic>" --reason "<why>"` immediately after saving the topic

#### Scenario: Session ends unexpectedly
- **WHEN** the user closes the terminal without saying goodbye
- **THEN** all topics explained so far are already persisted in memory because each was saved progressively

### Requirement: Level-aware next steps
The pulse skill SHALL suggest next steps that are appropriate for the user's current level. After resolving the user's question or when the user has no specific question, the skill SHALL proactively suggest what to learn or try next based on their level and topics already seen.

#### Scenario: Beginner next steps
- **WHEN** the user is at beginner level and has completed "basic-commands"
- **THEN** the skill suggests the next natural beginner topic (e.g., "permissions" or "claude-md") with a motivating message explaining why it's useful

#### Scenario: Intermediate next steps
- **WHEN** the user is at intermediate level and has completed "hooks"
- **THEN** the skill suggests advancing to a related topic (e.g., "mcp-servers") with a concrete example of what they could automate

#### Scenario: Advanced next steps
- **WHEN** the user is at advanced level
- **THEN** the skill suggests challenging patterns (e.g., "agent teams for parallel PR review") with a description of the concrete benefit

#### Scenario: No repeated suggestions
- **WHEN** suggesting a next step
- **THEN** the skill checks `topics` in memory and does NOT suggest topics already marked as `seen: true`

### Requirement: Proactive motivation and ideas
The pulse skill SHALL proactively motivate the user and suggest concrete ideas based on their level, project context, and progress. It SHALL NOT wait for the user to ask — after answering a question or on greeting, it SHALL offer a relevant idea or encouragement.

#### Scenario: Motivation on greeting for returning user
- **WHEN** a returning user activates the skill
- **THEN** the skill greets by name, acknowledges progress (e.g., "Ya dominas hooks!"), and offers an idea or next challenge

#### Scenario: Ideas for beginner
- **WHEN** a beginner user asks a question or has no specific question
- **THEN** the skill suggests the next natural step with encouraging language (e.g., "Ya que creaste tu CLAUDE.md, el siguiente poder es permissions. Te cuento?")

#### Scenario: Ideas for intermediate
- **WHEN** an intermediate user asks a question or has no specific question
- **THEN** the skill proposes a concrete automation or workflow relevant to their project (e.g., "Con hooks podrías auto-formatear cada vez que Claude edite un archivo. Quieres armarlo?")

#### Scenario: Ideas for advanced
- **WHEN** an advanced user asks a question or has no specific question
- **THEN** the skill challenges with advanced patterns (e.g., "Has probado agent teams donde uno revisa y otro implementa tests? Es brutal para PRs grandes.")

#### Scenario: Project-aware suggestions
- **WHEN** the user is in a real project directory
- **THEN** the skill may analyze the project type and suggest relevant skills or workflows (e.g., "En un proyecto React, un hook PostToolUse con ESLint te ahorra mucho")

### Requirement: Documentation-verified responses
The pulse skill SHALL verify all Claude Code information against the installed `cc-*` skills before responding. It SHALL NEVER invent, assume, or speculate about Claude Code features. If unsure, it SHALL consult the relevant skill first and say so. It SHALL prefer saying "no tengo esa info confirmada" over giving potentially incorrect or outdated information.

#### Scenario: User asks about a feature
- **WHEN** the user asks about a Claude Code feature (e.g., "how do hooks work?")
- **THEN** the skill identifies the relevant `cc-*` skill (e.g., `cc-hooks-guide`), consults it, and responds with verified information

#### Scenario: Feature info is uncertain
- **WHEN** the skill is not sure about a feature detail
- **THEN** it says "Déjame verificar eso..." and consults the appropriate skill before answering

#### Scenario: No relevant skill installed
- **WHEN** the user asks about a feature and no matching `cc-*` skill is installed
- **THEN** the skill informs the user and suggests running `pulse sync --force` to update skills

#### Scenario: Recent changes
- **WHEN** the user asks about something very recent
- **THEN** the skill consults `cc-changelog` for the latest information

### Requirement: Language detection instruction
The tutor skill content SHALL instruct Claude to detect the user's language from their first message and respond in that language for the entire session, without asking the user which language they prefer.

#### Scenario: Language detection behavior
- **WHEN** the pulse skill is activated
- **THEN** the skill content instructs to detect language automatically and respond in the user's language without asking

### Requirement: Three learning tiers
The pulse skill SHALL structure learning content in three tiers: Beginner, Intermediate, and Advanced. Beginner SHALL cover installation, first session, basic commands, permission modes, CLAUDE.md, and git workflow. Intermediate SHALL cover settings.json, skills, hooks, MCP, sub-agents, worktrees, headless mode, and /loop. Advanced SHALL cover agent teams, channels, plugins, GitHub Actions, sandboxing, model config, scheduled tasks, and LLM gateway.

#### Scenario: Beginner tier content
- **WHEN** the skill content is read
- **THEN** the Beginner tier includes installation, first session, basic commands (/help, /compact, /cost, /memory), permission modes, CLAUDE.md basics, and git workflow

#### Scenario: Intermediate tier content
- **WHEN** the skill content is read
- **THEN** the Intermediate tier includes settings.json, skills creation, hooks (SessionStart, PostToolUse, Stop), MCP servers, sub-agents, worktrees, headless mode, and /loop

#### Scenario: Advanced tier content
- **WHEN** the skill content is read
- **THEN** the Advanced tier includes agent teams, channels, plugins, GitHub Actions, sandboxing, model config, scheduled tasks, and LLM gateway

### Requirement: Repeated question detection
The pulse skill SHALL track questions in `frequentQuestions`. When a user asks a question matching one already recorded, the skill SHALL acknowledge it, increment the count, and explain with a different approach than before.

#### Scenario: Repeated question detected
- **WHEN** the user asks a question that matches an existing entry in frequentQuestions
- **THEN** the skill says something like "Ya vimos esto — qué parte sigue sin quedar clara?" and uses a different explanation approach

### Requirement: Memory CLI commands in skill
The pulse SKILL.md SHALL include a reference section listing all available memory CLI commands that the tutor can use: `cat ~/.claude/pulse/memory.json`, `pulse memory`, `pulse memory --update`, `pulse memory --exercise`, `pulse memory --next-step`.

#### Scenario: Tutor has memory commands available
- **WHEN** the pulse skill is loaded
- **THEN** it includes instructions for reading and writing memory via CLI commands

### Requirement: Tutoring rules
The pulse skill SHALL include rules for tutoring behavior: use concrete examples and real commands, ask follow-up questions after each topic, prioritize solving specific problems before teaching, verify against `cc-*` skills before affirming anything about Claude Code, and consult `cc-changelog` for recent changes. The skill SHALL reference the dynamically generated "Skills disponibles" section appended to its content for recommending skills to the user.

#### Scenario: Tutoring rules are specified
- **WHEN** the skill content is read
- **THEN** it contains rules for concrete examples, follow-up questions, problem-first approach, documentation verification, and cross-references to the dynamic skill index

#### Scenario: Tutoring rules reference dynamic index
- **WHEN** the skill content is read
- **THEN** it contains a reference to the "Skills disponibles" section for recommending skills

## REMOVED Requirements

### Requirement: Level assessment with two questions
**Reason**: Merged into the new "Memory-aware tutor behavior" requirement which covers the full session-start flow including level assessment.
**Migration**: The level assessment logic (max 2 questions) is now part of the memory-aware behavior requirement.

### Requirement: Session end saves state
**Reason**: Replaced by "Progressive topic saving" which saves after EACH topic instead of only at session end.
**Migration**: The skill now saves progressively. An optional endNote on explicit goodbye is part of the progressive saving flow.
