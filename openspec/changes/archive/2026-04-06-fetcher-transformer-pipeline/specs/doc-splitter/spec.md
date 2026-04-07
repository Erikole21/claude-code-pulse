## ADDED Requirements

### Requirement: Section-based splitting
When `splitStrategy` is `"sections"`, the splitter SHALL divide the document at H2 (`##`) boundaries. Each section becomes a separate skill file named by its heading (kebab-cased).

#### Scenario: Document with 3 H2 sections
- **WHEN** a document has 3 H2 headings and splitStrategy is "sections"
- **THEN** 3 separate content blocks are produced, each starting from its H2 heading

### Requirement: Manual heading-based splitting
When `splitStrategy` is `"manual"`, the splitter SHALL use the `manualSections` array from the skill definition. Each entry specifies an `id`, `heading` (text to search for), and `description`. Content from one heading to the next is extracted as a section.

#### Scenario: Hooks document manual split
- **WHEN** the cc-hooks-events skill is split with manualSections defining 3 headings
- **THEN** 3 sections are produced with ids `cc-hooks-events`, `cc-hooks-config`, `cc-hooks-io`

#### Scenario: Heading not found
- **WHEN** a manualSections heading is not found in the document
- **THEN** that section is skipped with a warning (not an error)

### Requirement: No splitting
When `splitStrategy` is `"none"` (default), the splitter SHALL return the document as-is in a single-element array.

#### Scenario: No split passthrough
- **WHEN** splitStrategy is "none"
- **THEN** the full document is returned as a single entry
