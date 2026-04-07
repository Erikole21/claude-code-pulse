## MODIFIED Requirements

### Requirement: Memory-aware tutor behavior
The cc-tutor skill SHALL read `~/.claude/pulse/memory.json` at session start and write updates at session end. On session start with existing memory, it SHALL greet the user by name and show their previous nextSteps. On first session (no memory), it SHALL ask for the user's name, detect their language, and initialize memory. On session end, it SHALL update topics, write an endNote summary, and set new nextSteps.

#### Scenario: Returning user session start
- **WHEN** the tutor activates and memory.json exists with name "Erik"
- **THEN** it greets "Hola Erik, ¿continuamos donde lo dejamos?" and shows previous nextSteps

#### Scenario: New user first session
- **WHEN** the tutor activates and no memory.json exists
- **THEN** it asks the user's name, detects their language, and calls `pulse memory --update` to initialize

#### Scenario: Session end saves state
- **WHEN** the user ends a session (says goodbye or session closes)
- **THEN** the tutor updates topics seen, writes endNote, updates nextSteps via `pulse memory --update`

### Requirement: Repeated question detection
The tutor SHALL track questions in `frequentQuestions`. When a user asks a question matching one already recorded, the tutor SHALL acknowledge it, increment the count, and explain with a different approach than before.

#### Scenario: Repeated question detected
- **WHEN** the user asks a question that matches an existing entry in frequentQuestions
- **THEN** the tutor says something like "Ya vimos esto — ¿qué parte sigue sin quedar clara?" and uses a different explanation approach

### Requirement: Memory CLI commands in skill
The cc-tutor SKILL.md SHALL include a reference section listing all available memory CLI commands that the tutor can use: `cat ~/.claude/pulse/memory.json`, `pulse memory`, `pulse memory --update`, `pulse memory --exercise`, `pulse memory --next-step`.

#### Scenario: Tutor has memory commands available
- **WHEN** the tutor skill is loaded
- **THEN** it includes instructions for reading and writing memory via CLI commands
