## ADDED Requirements

### Requirement: Install skills to project directory
The `installer.ts` module SHALL write skill files to `.claude/skills/<skill-id>/SKILL.md` relative to `process.cwd()`. The `install(skills)` function SHALL accept an array of `{ id: string, content: string }` objects, create the directory for each skill (recursively), prepend `_pulse: true` frontmatter to the content, and write the resulting SKILL.md file.

#### Scenario: Install a single skill
- **WHEN** `install([{ id: "cc-hooks-events", content: "# Hook Events\n..." }])` is called
- **THEN** the file `.claude/skills/cc-hooks-events/SKILL.md` is created with frontmatter containing `_pulse: true` followed by the provided content

#### Scenario: Install multiple skills
- **WHEN** `install([{ id: "cc-mcp", content: "..." }, { id: "cc-settings", content: "..." }])` is called
- **THEN** both `.claude/skills/cc-mcp/SKILL.md` and `.claude/skills/cc-settings/SKILL.md` are created with `_pulse: true` frontmatter

#### Scenario: Overwrite existing pulse-managed skill
- **WHEN** `install([{ id: "cc-mcp", content: "updated content" }])` is called and `.claude/skills/cc-mcp/SKILL.md` already exists with `_pulse: true` frontmatter
- **THEN** the file is overwritten with the new content and `_pulse: true` frontmatter

#### Scenario: Directory structure created recursively
- **WHEN** `install()` is called and `.claude/skills/` does not yet exist
- **THEN** the full directory path `.claude/skills/<skill-id>/` is created recursively before writing the file

### Requirement: Pulse frontmatter marker
The installer SHALL prepend YAML frontmatter with `_pulse: true` to every SKILL.md file it writes. The frontmatter block SHALL be delimited by `---` lines. This marker identifies the skill as pulse-managed.

#### Scenario: Frontmatter format
- **WHEN** a skill is installed with content "# My Skill\nSome content"
- **THEN** the written file starts with `---\n_pulse: true\n---\n` followed by the original content

### Requirement: Managed skill detection
The `isManaged(skillDir)` function SHALL read the SKILL.md file in the given directory, parse the YAML frontmatter block (between `---` delimiters), and return `true` only if `_pulse: true` is present in the frontmatter.

#### Scenario: Pulse-managed skill detected
- **WHEN** `isManaged(".claude/skills/cc-mcp")` is called and the SKILL.md contains `_pulse: true` in its frontmatter
- **THEN** the function returns `true`

#### Scenario: User-created skill not detected as managed
- **WHEN** `isManaged(".claude/skills/my-custom-skill")` is called and the SKILL.md has no `_pulse: true` in its frontmatter
- **THEN** the function returns `false`

#### Scenario: Skill directory without SKILL.md
- **WHEN** `isManaged("some/dir")` is called and no SKILL.md file exists in that directory
- **THEN** the function returns `false`

### Requirement: Never touch user skills
The installer SHALL NEVER modify, overwrite, or delete skill files that do not have `_pulse: true` in their frontmatter. If a skill directory exists but contains a SKILL.md without the `_pulse: true` marker, the installer SHALL skip that skill.

#### Scenario: Skip user-owned skill with same ID
- **WHEN** `install([{ id: "my-skill", content: "..." }])` is called and `.claude/skills/my-skill/SKILL.md` exists without `_pulse: true` frontmatter
- **THEN** the file is NOT overwritten and the skill is skipped

### Requirement: Get installed skills inventory
The `getInstalledSkills()` function SHALL read `.pulse-meta.json` and return the list of skill IDs currently tracked as installed by pulse.

#### Scenario: Read installed skills from metadata
- **WHEN** `getInstalledSkills()` is called and `.pulse-meta.json` contains skills `cc-mcp` and `cc-hooks-events`
- **THEN** the function returns `["cc-mcp", "cc-hooks-events"]`

#### Scenario: No metadata file exists
- **WHEN** `getInstalledSkills()` is called and `.pulse-meta.json` does not exist
- **THEN** the function returns an empty array
