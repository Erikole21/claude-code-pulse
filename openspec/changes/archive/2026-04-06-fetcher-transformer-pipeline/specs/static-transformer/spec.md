## ADDED Requirements

### Requirement: Markdown cleanup with remark
The static transformer SHALL parse raw markdown with `remark-parse`, remove JSX components (`<Note>`, `<Tip>`, `<Steps>`, etc.), images, and internal documentation links. It SHALL preserve: H1-H3 headings, tables, code blocks, and lists.

#### Scenario: JSX components removed
- **WHEN** input markdown contains `<Note>`, `<Tip>`, or `<Steps>` JSX tags
- **THEN** those elements are removed from the output while surrounding content is preserved

#### Scenario: Code blocks preserved
- **WHEN** input markdown contains fenced code blocks
- **THEN** the code blocks appear identically in the output

#### Scenario: Tables preserved
- **WHEN** input markdown contains reference tables
- **THEN** the tables appear identically in the output

### Requirement: Token budget truncation
The static transformer SHALL truncate output to stay within the skill's `tokenBudget`. Token estimation SHALL use `chars / 4` as the approximation. Truncation SHALL occur at a section boundary (heading level) when possible.

#### Scenario: Output within budget
- **WHEN** cleaned markdown is under tokenBudget * 4 characters
- **THEN** the full content is returned

#### Scenario: Output exceeds budget
- **WHEN** cleaned markdown exceeds tokenBudget * 4 characters
- **THEN** content is truncated at the nearest heading boundary to fit within budget
