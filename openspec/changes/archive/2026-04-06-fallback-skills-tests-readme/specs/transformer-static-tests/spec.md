## ADDED Requirements

### Requirement: Valid output with real docs
The test suite MUST verify that the static transformer produces valid, clean Markdown output when given realistic documentation input containing headings, code blocks, tables, lists, JSX components, images, and internal links.

#### Scenario: JSX components removed
- **WHEN** the static transformer processes markdown containing JSX components such as `<Note>`, `<Tip>`, `<Steps>`
- **THEN** the output SHALL NOT contain any JSX component tags

#### Scenario: Code blocks preserved
- **WHEN** the static transformer processes markdown containing fenced code blocks
- **THEN** the output SHALL contain the code blocks with their content intact

#### Scenario: Tables preserved
- **WHEN** the static transformer processes markdown containing Markdown tables
- **THEN** the output SHALL contain the tables with their structure and content intact

#### Scenario: Headings preserved
- **WHEN** the static transformer processes markdown containing H1, H2, and H3 headings
- **THEN** the output SHALL contain all heading levels with their text intact

#### Scenario: Images removed
- **WHEN** the static transformer processes markdown containing image syntax
- **THEN** the output SHALL NOT contain any image references

#### Scenario: Internal links removed
- **WHEN** the static transformer processes markdown containing internal documentation links
- **THEN** the output SHALL NOT contain internal link references

### Requirement: Correct truncation to tokenBudget
The test suite MUST verify that the static transformer respects the `tokenBudget` limit by truncating output when the processed content exceeds the budget (approximated as characters / 4).

#### Scenario: Output within tokenBudget
- **WHEN** the static transformer processes a document with tokenBudget of 600
- **THEN** the output length SHALL NOT exceed 2400 characters (600 tokens * 4 chars/token)

#### Scenario: Large document truncated
- **WHEN** the static transformer processes a document that is significantly larger than the tokenBudget allows
- **THEN** the output SHALL be truncated to fit within the tokenBudget limit
- **THEN** the truncation SHALL preserve complete Markdown elements (not cut mid-heading or mid-code-block where possible)

#### Scenario: Small document not truncated
- **WHEN** the static transformer processes a document that is already within the tokenBudget
- **THEN** the output SHALL contain the full processed content without truncation
