# skills-registry

## Purpose

Defines the canonical `SKILLS_REGISTRY` and `SkillDefinition` shape used by doc fetch, transformation, fallback generation, and CLI filtering.

## Requirements

### Requirement: SkillDefinition interface
The `skills-registry.ts` module SHALL export a `SkillDefinition` interface with fields: `id` (string), `sourceUrl` (string | null, null for static skills), `name` (string), `description` (string, ≤250 chars, English, natural language), `splitStrategy` (`"none"` | `"sections"` | `"manual"`, default `"none"`), `manualSections?` (array of `{id, heading, description}` where each description is unique and ≤250 chars), `tokenBudget` (number, default 600), `priority` (`"critical"` | `"high"` | `"medium"`), `static?` (boolean, true for bundled-only skills), and `disableModelInvocation?` (boolean, default `true` — set to `false` only for cc-tutor).

#### Scenario: Interface completeness
- **WHEN** a SkillDefinition is created
- **THEN** it MUST have at minimum: `id`, `sourceUrl`, `name`, `description`, and `priority`

#### Scenario: disableModelInvocation defaults
- **WHEN** a SkillDefinition does not specify `disableModelInvocation`
- **THEN** the transformer SHALL treat it as `true` (model invocation disabled by default)

### Requirement: Skill descriptions follow official Claude Code conventions
All skill descriptions in `SKILLS_REGISTRY` SHALL be written in English, use natural language, and be ≤250 characters. Descriptions SHALL front-load the key use case using patterns like "Use when..." as documented in the official Claude Code skills specification (https://code.claude.com/docs/en/skills.md).

#### Scenario: Description length limit
- **WHEN** any `SkillDefinition.description` is measured
- **THEN** it SHALL be at most 250 characters long

#### Scenario: Description language and format
- **WHEN** any `SkillDefinition.description` is read
- **THEN** it SHALL be written in English using natural language (NOT `TRIGGER when:` / `DO NOT TRIGGER when:` format)

### Requirement: pulse is the only auto-activable skill
The `pulse` skill SHALL be the only skill where `disableModelInvocation` is explicitly set to `false`. All other skills SHALL have `disableModelInvocation: true` or omit the field (which defaults to `true`). This ensures pulse's description is the only one consuming Claude Code's skill description budget (~8,000 chars), guaranteeing it is never truncated.

#### Scenario: pulse is auto-activable
- **WHEN** the `pulse` SkillDefinition is read
- **THEN** `disableModelInvocation` SHALL be explicitly `false`

#### Scenario: All other skills disable model invocation
- **WHEN** any SkillDefinition other than `pulse` is read
- **THEN** `disableModelInvocation` SHALL be `true`

#### Scenario: Total description budget
- **WHEN** all auto-activable skills' descriptions are summed
- **THEN** the total SHALL be well under 8,000 characters (only pulse contributes)

### Requirement: pulse description activates on Claude Code feature questions
The `pulse` skill description SHALL explicitly mention "Pulse" and key Claude Code features (hooks, MCP, skills, settings, permissions, sub-agents) so that Claude's skill matching loads it when users type "pulse" or ask about any of these topics in any language. The description SHALL also mention guidance, ideas, and help to trigger on general assistance requests.

#### Scenario: User types "pulse"
- **WHEN** a user types "pulse" in conversation
- **THEN** Claude SHALL load the pulse skill because the description mentions "Pulse"

#### Scenario: User asks about hooks
- **WHEN** a user asks "how do hooks work?" or "cómo funcionan los hooks?"
- **THEN** Claude SHALL load the pulse skill because the description mentions "hooks"

#### Scenario: Description under limit
- **WHEN** the pulse description is measured
- **THEN** it SHALL be ≤250 characters

### Requirement: manualSection descriptions are unique and specific
Each entry in a skill's `manualSections` array SHALL have a unique `description` field that specifically describes the content of that section, NOT a copy of the parent skill's description.

#### Scenario: Hooks manual sections have distinct descriptions
- **WHEN** the `cc-hooks-events` skill's `manualSections` are read
- **THEN** each section (`cc-hooks-events`, `cc-hooks-config`, `cc-hooks-io`) SHALL have a different description

#### Scenario: Manual section description relevance
- **WHEN** a `manualSection` description is read
- **THEN** it SHALL describe the specific content covered by that section

### Requirement: Complete skills registry
The `SKILLS_REGISTRY` array SHALL contain all skill definitions as specified in the SDD. It SHALL include: 2 static skills (`pulse`, `cc-learning-path`), 7 critical-priority skills from docs (changelog, hooks-events, hooks-guide, mcp, settings, permissions), 7 high-priority skills (sub-agents, agent-teams, skills-guide, memory, cli-reference, commands, model-config), and 7 medium-priority skills (plugins, channels, scheduled-tasks, headless, sandboxing, common-workflows, best-practices, github-actions).

#### Scenario: Static skills have null sourceUrl
- **WHEN** accessing skills with `static: true`
- **THEN** their `sourceUrl` is `null`

#### Scenario: Dynamic skills have valid sourceUrls
- **WHEN** accessing skills with `static` not set or `false`
- **THEN** their `sourceUrl` matches pattern `https://code.claude.com/docs/en/*.md`

#### Scenario: pulse replaces cc-tutor in registry
- **WHEN** the SKILLS_REGISTRY is read
- **THEN** there is an entry with `id: 'pulse'`, `name: 'pulse'`, `static: true`, `priority: 'critical'`, `disableModelInvocation: false`
- **AND** there is NO entry with `id: 'cc-tutor'`

### Requirement: Manual split sections for hooks
The `cc-hooks-events` skill SHALL use `splitStrategy: "manual"` with three `manualSections`: `cc-hooks-events` (Hook lifecycle), `cc-hooks-config` (Configuration), and `cc-hooks-io` (Hook input and output). This produces three separate skill files from a single source document.

#### Scenario: Hooks skill splits into three
- **WHEN** the hooks skill definition is read
- **THEN** `manualSections` contains exactly 3 entries with ids: `cc-hooks-events`, `cc-hooks-config`, `cc-hooks-io`

### Requirement: Registry filtering by priority
Consumers SHALL be able to filter `SKILLS_REGISTRY` by priority level. The default filter (from `.pulserc.json`) includes `"critical"` and `"high"`. Using `"all"` includes `"medium"` as well.

#### Scenario: Filter critical and high
- **WHEN** filtering with `["critical", "high"]`
- **THEN** medium-priority skills are excluded from the result

### Requirement: Merge discovered skills with registry
The `skills-registry` module SHALL export a function `mergeWithDiscovered(discovered: SkillDefinition[]): SkillDefinition[]` that returns the full `SKILLS_REGISTRY` array concatenated with the discovered skills array. Duplicate ids (where a discovered skill has the same id as a registry skill) SHALL be excluded -- registry entries always take precedence.

#### Scenario: No duplicates
- **WHEN** discovered skills contain `cc-chrome` and `cc-voice-dictation` and neither exists in `SKILLS_REGISTRY`
- **THEN** the merged result includes all registry skills plus both discovered skills

#### Scenario: Duplicate id excluded
- **WHEN** a discovered skill has `id: 'cc-permissions'` which already exists in `SKILLS_REGISTRY`
- **THEN** the discovered entry is excluded and the curated registry entry is kept

#### Scenario: Empty discovered list
- **WHEN** the discovered skills array is empty
- **THEN** the merged result equals `SKILLS_REGISTRY` unchanged

### Requirement: Skill index includes discovered skills
The `generateSkillIndex()` function SHALL accept an optional array of discovered skills and include them in the generated index appended to the pulse skill. Discovered skills SHALL appear in a separate section labeled "Additional docs" after the curated skills.

#### Scenario: Index with discovered skills
- **WHEN** `generateSkillIndex` is called with 3 discovered skills
- **THEN** the output includes a section listing those 3 skills after the curated ones

#### Scenario: Index without discovered skills
- **WHEN** `generateSkillIndex` is called without discovered skills
- **THEN** the output only includes curated registry skills (backwards compatible)
