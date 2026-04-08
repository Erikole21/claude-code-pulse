## MODIFIED Requirements

### Requirement: cc-tutor is the only auto-activable skill
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

### Requirement: cc-tutor description activates on Claude Code feature questions
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
