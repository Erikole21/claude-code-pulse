## Context

This is the fifth and final change for the claude-code-pulse package. Changes 1-4 implemented all core modules (platform, meta, skills-registry, fetcher, transformer-static, transformer-claude, transformer orchestrator, splitter, installer, hook-manager, CLI commands, and static skill content). This change adds the remaining three pieces required for a publishable package: the fallback skills bundle, the test suite, and the README.

The SDD specifies that `skills-fallback/` contains pre-built SKILL.md files generated at build time, used when `code.claude.com` is unreachable. Four test files are required covering hook-manager, transformer-static, splitter, and platform. The README must have nine specific sections.

## Goals / Non-Goals

**Goals:**
- Create `scripts/generate-fallback-skills.ts` that produces `skills-fallback/` directory with pre-built SKILL.md files
- Write all four required vitest test suites with the scenarios defined in the SDD
- Write `README.md` with all nine mandatory sections
- Ensure fallback skills are generated during `npm run build:skills` and `prepublishOnly`

**Non-Goals:**
- Modifying any existing core modules (changes 1-4)
- Adding new CLI commands
- Integration or end-to-end tests beyond the four specified test files
- Publishing the package to npm

## Decisions

### D1: generate-fallback-skills.ts uses the static transformer exclusively
The fallback generation script always uses `transformer-static.ts`, never the Claude CLI transformer. This ensures deterministic, reproducible output regardless of whether the developer has Claude CLI authenticated.
**Why over using Claude CLI**: Build reproducibility is critical for npm packages. Different developers would get different fallback content if Claude CLI were used. The static transformer produces consistent output from the same input.

### D2: Test strategy uses vitest mocking for filesystem and platform
Tests mock `fs` operations and `process.platform` rather than performing real filesystem writes or requiring a specific OS. This allows all tests to run on any platform.
**Why over real filesystem**: Tests must be fast, isolated, and CI-friendly. Real filesystem tests would need cleanup, could conflict with concurrent runs, and platform tests cannot run on all three OS targets from a single machine.
**Alternative considered**: Temporary directories with cleanup. Rejected for slower execution and flaky cleanup on Windows.

### D3: transformer-static tests use inline fixture markdown
Rather than fetching real docs from `code.claude.com` during tests, use inline markdown fixtures that represent realistic doc content (headings, code blocks, tables, JSX components).
**Why over live fetching**: Tests must be offline-capable, fast, and deterministic. Live fetching introduces network dependency and flakiness.

### D4: README structure follows SDD section order exactly
The nine sections are written in the exact order specified in the SDD to maintain consistency with project documentation standards.

### D5: skills-fallback/ is gitignored but npm-published
The `skills-fallback/` directory is generated at build time and included in the npm package via the `files` field in `package.json`. It is not committed to git since it can always be regenerated.
**Why**: Avoids bloating the git repository with generated content. The `prepublishOnly` script ensures it exists before `npm publish`.

## Risks / Trade-offs

- [Fallback skills may become stale relative to live docs] → Acceptable because fallback is only used when network is unavailable. The `prepublishOnly` script regenerates them on each publish, so they are at most as old as the latest package version.
- [Inline test fixtures may drift from actual doc format] → Mitigated by making fixtures representative of real patterns (H2 sections, code blocks, tables, JSX components). If doc format changes significantly, fixtures should be updated.
- [Static transformer output may not perfectly match what Claude CLI would produce] → This is by design. The fallback is a safety net, not a quality match. Users with Claude CLI get better skills; fallback ensures something works offline.
- [Tests mock filesystem which may miss real OS-specific issues] → Mitigated by the platform detection tests that verify correct branching logic. True cross-platform issues would need CI on multiple OS targets (out of scope for this change).
