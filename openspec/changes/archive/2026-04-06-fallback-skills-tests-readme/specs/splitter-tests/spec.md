## ADDED Requirements

### Requirement: Sections strategy splits by H2
The test suite MUST verify that the splitter with `splitStrategy: 'sections'` divides a markdown document into separate chunks at each H2 (`##`) heading boundary.

#### Scenario: Document with multiple H2 sections
- **WHEN** the splitter processes a document with three H2 sections using `splitStrategy: 'sections'`
- **THEN** the splitter SHALL return three separate content chunks
- **THEN** each chunk SHALL start with its corresponding H2 heading

#### Scenario: Content before first H2 included
- **WHEN** the splitter processes a document that has content before the first H2 heading
- **THEN** the first chunk SHALL include the content before the first H2 heading

#### Scenario: Nested headings stay with parent H2
- **WHEN** the splitter processes a document where H2 sections contain H3 and H4 subheadings
- **THEN** the subheadings and their content SHALL remain within the same chunk as their parent H2

### Requirement: Manual strategy respects defined headings
The test suite MUST verify that the splitter with `splitStrategy: 'manual'` extracts sections based on the heading names specified in the skill's `manualSections` array.

#### Scenario: Extract sections by manual heading match
- **WHEN** the splitter processes a document with `splitStrategy: 'manual'` and `manualSections` defining three headings
- **THEN** the splitter SHALL return one chunk per defined manual section
- **THEN** each chunk SHALL contain the content from its matched heading to the next heading of equal or higher level

#### Scenario: Manual section IDs used for output identification
- **WHEN** the splitter returns chunks for a manual split
- **THEN** each chunk SHALL be associated with the `id` from its corresponding `manualSections` entry

#### Scenario: Heading not found in document
- **WHEN** the splitter processes a document with `splitStrategy: 'manual'` and one of the `manualSections` headings does not exist in the document
- **THEN** the splitter SHALL skip that section and return chunks only for the headings that were found
