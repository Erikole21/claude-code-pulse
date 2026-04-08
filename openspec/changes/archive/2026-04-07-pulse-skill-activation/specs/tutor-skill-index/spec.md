## MODIFIED Requirements

### Requirement: Skill index generator utility
The system SHALL provide a utility function `generateSkillIndex(registry: SkillDefinition[]): string` in `src/core/skill-index.ts` that generates a markdown section listing all available skills from the registry. Each entry SHALL include the skill's `/name` invoke command and its description. Skills SHALL be grouped by priority (critical, high, medium). The generator SHALL exclude the `pulse` skill from the index (since pulse is the consumer of the index, not a reference skill).

#### Scenario: Index includes all registry skills except pulse
- **WHEN** `generateSkillIndex()` is called with the full `SKILLS_REGISTRY`
- **THEN** the output contains one entry per skill (excluding `pulse`) with `/skill-id` and description

#### Scenario: Index does NOT include pulse
- **WHEN** the generated index is read
- **THEN** there is NO entry for `/pulse` in the output

#### Scenario: Skills are grouped by priority
- **WHEN** the generated index is read
- **THEN** critical-priority skills appear first, then high, then medium, each under a labeled subsection

#### Scenario: Manual-split skills list each section
- **WHEN** a skill has `manualSections` (e.g., cc-hooks-events with 3 sections)
- **THEN** the index lists each section separately with its own `/section-id` and section-specific description

#### Scenario: Section-split skills list the parent only
- **WHEN** a skill has `splitStrategy: "sections"` without `manualSections`
- **THEN** the index lists only the parent `/skill-id` (not each generated sub-skill, since section IDs are dynamic)
