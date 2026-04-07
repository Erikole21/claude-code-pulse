## Why

With the project scaffolding and core utilities in place (change 1), the next critical piece is the data pipeline: fetching documentation from `code.claude.com` and transforming it into optimized SKILL.md files. This is the core value proposition of pulse — without it, there are no skills to install.

## What Changes

- Implement `src/core/fetcher.ts`: HTTP fetcher with ETag caching, 304 handling, retry with exponential backoff, concurrency limiting (4 simultaneous), and llms.txt URL verification
- Implement `src/core/transformer-static.ts`: Remark-based markdown cleanup (remove JSX, images, internal links; keep headings, tables, code blocks; truncate to tokenBudget)
- Implement `src/core/transformer-claude.ts`: Claude CLI-based intelligent transformation with prompt engineering, 30s timeout, graceful failure returning null
- Implement `src/core/transformer.ts`: Orchestrator that tries Claude CLI first, falls back to static, applies splitting, and prepends standard frontmatter
- Implement `src/core/splitter.ts`: Document splitting by H2 sections or manual heading definitions

## Capabilities

### New Capabilities
- `doc-fetcher`: HTTP fetching with ETag caching, conditional requests (304 Not Modified), retry logic, and concurrency control for downloading Claude Code documentation
- `static-transformer`: Remark-based markdown transformation that cleans documentation into concise skill files while preserving code examples, tables, and reference material
- `claude-transformer`: AI-powered transformation using the locally authenticated Claude CLI (haiku model) to produce higher-quality skill summaries with intelligent content prioritization
- `transform-orchestrator`: Coordination layer that selects the best transformer, applies document splitting strategies, and generates standardized frontmatter for all skills
- `doc-splitter`: Document splitting engine supporting section-based (H2) and manual heading-based strategies for breaking large documents into focused skill files

### Modified Capabilities

(none — no existing specs to modify)

## Impact

- Adds runtime dependency on `undici` for HTTP fetching
- Adds `unified`, `remark-parse`, `remark-stringify` for markdown processing
- Requires `claude` CLI to be in PATH for the Claude transformer (graceful fallback if missing)
- Depends on `meta.ts` (change 1) for ETag persistence and `skills-registry.ts` for skill definitions
- All CLI commands (change 4) depend on this pipeline for sync operations
