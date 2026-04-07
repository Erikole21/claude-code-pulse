## ADDED Requirements

### Requirement: Claude CLI transformation
The Claude transformer SHALL pipe raw markdown through the locally authenticated `claude` CLI using: `echo "<PROMPT>" | claude --print --model claude-haiku-4-5-20251001 --max-tokens <tokenBudget>`. It SHALL verify CLI availability before attempting transformation.

#### Scenario: Successful transformation
- **WHEN** Claude CLI is available and responds within 30 seconds
- **THEN** the transformer returns the AI-generated skill markdown

#### Scenario: CLI not available
- **WHEN** `claude --version` fails or is not in PATH
- **THEN** the transformer returns `null` (triggering fallback to static)

#### Scenario: Transformation timeout
- **WHEN** the Claude CLI takes longer than 30 seconds
- **THEN** the process is killed and the transformer returns `null`

### Requirement: Transformation prompt
The prompt SHALL instruct Claude to: keep all code examples exactly as-is, keep all reference tables, convert prose to bullet points, remove navigation/breadcrumbs/see-also links, conserve syntax/parameters/edge cases, output in English, start directly with content (no frontmatter), and respect the tokenBudget.

#### Scenario: Code examples preserved in output
- **WHEN** the input contains code examples
- **THEN** the AI-generated output preserves them verbatim
