## ADDED Requirements

### Requirement: SkillDefinition interface
The `skills-registry.ts` module SHALL export a `SkillDefinition` interface with fields: `id` (string), `sourceUrl` (string | null, null for static skills), `name` (string), `description` (string), `splitStrategy` (`"none"` | `"sections"` | `"manual"`, default `"none"`), `manualSections?` (array of `{id, heading, description}`), `tokenBudget` (number, default 600), `priority` (`"critical"` | `"high"` | `"medium"`), and `static?` (boolean, true for bundled-only skills).

#### Scenario: Interface completeness
- **WHEN** a SkillDefinition is created
- **THEN** it MUST have at minimum: `id`, `sourceUrl`, `name`, `description`, and `priority`

### Requirement: Complete skills registry
The `SKILLS_REGISTRY` array SHALL contain all skill definitions as specified in the SDD. It SHALL include: 2 static skills (`cc-tutor`, `cc-learning-path`), 7 critical-priority skills from docs (changelog, hooks-events, hooks-guide, mcp, settings, permissions), 7 high-priority skills (sub-agents, agent-teams, skills-guide, memory, cli-reference, commands, model-config), and 7 medium-priority skills (plugins, channels, scheduled-tasks, headless, sandboxing, common-workflows, best-practices, github-actions).

#### Scenario: Static skills have null sourceUrl
- **WHEN** accessing skills with `static: true`
- **THEN** their `sourceUrl` is `null`

#### Scenario: Dynamic skills have valid sourceUrls
- **WHEN** accessing skills with `static` not set or `false`
- **THEN** their `sourceUrl` matches pattern `https://code.claude.com/docs/en/*.md`

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
