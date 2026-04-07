# transform-orchestrator

## Purpose

Orchestrates the transformation pipeline by selecting the appropriate transformer (Claude or static), generating frontmatter, and producing final skill files.

## Requirements

### Requirement: Transformer selection cascade
The orchestrator SHALL first attempt the Claude CLI transformer. If it returns `null` (CLI unavailable or timeout), it SHALL fall back to the static transformer. For skills with `static: true`, it SHALL use the fixed content directly without fetching or transforming.

#### Scenario: Claude transformer succeeds
- **WHEN** Claude CLI is available and transformation succeeds
- **THEN** `transformedWith` is `"claude"`

#### Scenario: Claude fails, static fallback
- **WHEN** Claude CLI transformer returns null
- **THEN** the static transformer is used and `transformedWith` is `"static"`

#### Scenario: Static skill uses fixed content
- **WHEN** the skill definition has `static: true`
- **THEN** no fetch or transform occurs, `transformedWith` is `"fixed"`

### Requirement: Frontmatter generation
The orchestrator SHALL prepend YAML frontmatter to every generated SKILL.md with fields: `name` (skill id), `description` (from registry), `invocation: auto`, `_pulse: true`, `_syncedAt` (ISO timestamp), `_source` (URL or "static").

#### Scenario: Frontmatter structure
- **WHEN** a skill is transformed
- **THEN** the output starts with `---\n` followed by all required frontmatter fields and ends with `---\n` before the content

### Requirement: TransformedSkill result
The orchestrator SHALL return `TransformedSkill[]` where each entry has: `id` (string), `filename` (path like `.claude/skills/cc-hooks-events/SKILL.md`), `content` (full SKILL.md with frontmatter), `transformedWith` (`"claude"` | `"static"` | `"fixed"`).

#### Scenario: Single skill result
- **WHEN** a skill with `splitStrategy: "none"` is transformed
- **THEN** exactly one TransformedSkill is returned

#### Scenario: Split skill results
- **WHEN** a skill with `splitStrategy: "manual"` and 3 sections is transformed
- **THEN** three TransformedSkill entries are returned, one per section
