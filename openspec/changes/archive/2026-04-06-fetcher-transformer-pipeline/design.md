## Context

Change 1 provides `meta.ts` (ETag persistence), `platform.ts` (Claude CLI check), `skills-registry.ts` (skill definitions), and `logger.ts`. This change builds the data pipeline that transforms remote documentation into local skill files. It's the core engine that `pulse sync` will call.

## Goals / Non-Goals

**Goals:**
- Reliable HTTP fetching with bandwidth-efficient ETag caching
- Two transformer paths: AI-powered (Claude CLI) and deterministic (remark-based static)
- Clean orchestration with automatic fallback
- Flexible document splitting for multi-section skills

**Non-Goals:**
- Installer (writes files to disk) — that's change 3
- CLI commands that invoke the pipeline — change 4
- Offline fallback from bundled skills — change 5
- Configuration loading — already in change 1

## Decisions

### D1: undici for HTTP
Use `undici` (Node.js built-in from v18) instead of `node-fetch` or `axios`.
**Why**: Zero additional dependencies on Node 18+. Supports all needed features (headers, timeouts, conditional requests).
**Alternative considered**: `fetch()` global — available from Node 18 but with fewer control options for timeouts and retries.

### D2: Manual retry loop instead of retry library
Implement retry with a simple `for` loop and `setTimeout` backoff rather than using a library like `p-retry`.
**Why**: Only 2 retries needed. The logic is ~10 lines. Adding a dependency for this is overkill.

### D3: p-limit for concurrency
Use `p-limit` (tiny, well-maintained) to cap concurrent fetches at 4.
**Why**: Prevents overwhelming `code.claude.com` and avoids socket exhaustion. `p-limit` is the standard choice for this pattern.
**Alternative considered**: Manual semaphore — more code for no benefit.

### D4: Claude CLI via stdin pipe
Use `echo "prompt" | claude --print` via `child_process.execFile` rather than the Claude API.
**Why**: Leverages the user's existing Claude Code authentication. No API key management. The `--print` flag gives clean output without interactive UI. Using `claude-haiku-4-5-20251001` keeps cost minimal.

### D5: Remark AST manipulation for static transformer
Use `unified` + `remark-parse` to get an AST, filter nodes, then `remark-stringify` back to markdown.
**Why**: Precise control over what to keep/remove. AST-based approach is more reliable than regex for markdown manipulation. Already in the dependency list.

### D6: Token estimation as chars/4
Approximate token count as `string.length / 4`.
**Why**: Simple, fast, and close enough for budget enforcement. Exact tokenization would require a tokenizer library (tiktoken) which is heavy. The budget is a soft cap, not a billing limit.

## Risks / Trade-offs

- [Claude CLI piping may have escaping issues with special characters in markdown] → Use stdin pipe instead of command-line argument to avoid shell escaping problems. Write prompt to a temp file if needed.
- [code.claude.com may not support ETag/304] → Graceful degradation: if no ETag in response, always re-download. Pipeline still works, just without caching optimization.
- [Static transformer may produce lower quality than Claude] → Acceptable trade-off. Static is the fallback, not the primary path. It preserves all technical content (code, tables) which is what matters most.
- [p-limit is an external dependency] → Very small (< 1KB), widely used, no transitive deps. Worth it vs. manual implementation.
