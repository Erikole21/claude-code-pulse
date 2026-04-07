## 1. Fetcher Module

- [x] 1.1 Create `src/core/fetcher.ts` with `FetchResult` interface and `fetchDoc(url, etag?)` function using undici
- [x] 1.2 Implement ETag conditional requests: send `If-None-Match` header, handle 304 response returning `{ changed: false, content: '' }`
- [x] 1.3 Implement 10-second timeout per request and retry logic (2 retries with exponential backoff)
- [x] 1.4 Implement `fetchAll(skills, etags)` with p-limit concurrency of 4 simultaneous requests
- [x] 1.5 Add `npm install p-limit` dependency

## 2. Static Transformer

- [x] 2.1 Create `src/core/transformer-static.ts` with `transformStatic(rawMarkdown, tokenBudget)` function
- [x] 2.2 Implement remark AST pipeline: parse with remark-parse, walk tree to remove JSX nodes, images, and internal links
- [x] 2.3 Implement token budget truncation at section boundaries using chars/4 approximation
- [x] 2.4 Implement section-based output for `splitStrategy: 'sections'` (split by H2)

## 3. Claude Transformer

- [x] 3.1 Create `src/core/transformer-claude.ts` with `transformWithClaude(rawMarkdown, tokenBudget)` function
- [x] 3.2 Implement the TRANSFORM_PROMPT constant with all SDD-specified rules
- [x] 3.3 Implement stdin piping to `claude --print --model claude-haiku-4-5-20251001 --max-tokens <budget>` via child_process
- [x] 3.4 Implement 30-second timeout with process kill and null return on failure
- [x] 3.5 Cache `isClaudeCliAvailable()` result once per sync session

## 4. Splitter

- [x] 4.1 Create `src/core/splitter.ts` with `splitDocument(content, strategy, manualSections?)` function
- [x] 4.2 Implement `'sections'` strategy: split at H2 boundaries, return array of `{ id, content }` sections
- [x] 4.3 Implement `'manual'` strategy: extract content between specified headings, assign ids from manualSections
- [x] 4.4 Implement `'none'` strategy: return single-element array with full content
- [x] 4.5 Handle edge case: heading not found in manual strategy (warn and skip)

## 5. Orchestrator

- [x] 5.1 Create `src/core/transformer.ts` with `transformSkill(def, rawContent)` function returning `TransformedSkill[]`
- [x] 5.2 Implement cascade logic: static:true → fixed, else try claude → fallback to static
- [x] 5.3 Implement frontmatter generation with all required fields (name, description, invocation, _pulse, _syncedAt, _source)
- [x] 5.4 Wire splitter after transformation for skills with split strategies
- [x] 5.5 Generate correct filenames: `.claude/skills/<id>/SKILL.md` per TransformedSkill

## 6. Verification

- [x] 6.1 Verify fetcher handles a real HTTP request (can test with a known URL)
- [x] 6.2 Verify static transformer produces valid markdown from a sample input
- [x] 6.3 Verify orchestrator generates proper frontmatter with _pulse: true
- [x] 6.4 Verify splitter produces correct number of sections for manual strategy
