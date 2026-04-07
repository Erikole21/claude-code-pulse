## 1. Fallback Skills Generation Script

- [x] 1.1 Create `scripts/generate-fallback-skills.ts` with main function that imports SKILLS_REGISTRY, fetcher, transformer-static, and splitter
- [x] 1.2 Implement iteration over all registry skills: fetch source docs for non-static skills, use fixed content for static skills (cc-tutor, cc-learning-path)
- [x] 1.3 Implement static transformer application and splitter logic (sections splits by H2, manual splits by manualSections headings)
- [x] 1.4 Implement frontmatter generation (name, description, invocation, _pulse, _syncedAt, _source) and SKILL.md file writing to `skills-fallback/<skill-id>/SKILL.md`
- [x] 1.5 Implement error handling: log warning and skip on individual fetch failure, exit 0 if at least one skill generated, exit 1 if zero
- [x] 1.6 Verify `npm run build:skills` executes the script and produces the `skills-fallback/` directory with all expected subdirectories

## 2. Hook Manager Tests

- [x] 2.1 Create `tests/hook-manager.test.ts` with vitest, set up mock filesystem for `.claude/settings.json`
- [x] 2.2 Write test: addHook() preserves existing user-defined SessionStart hooks and other hook event arrays
- [x] 2.3 Write test: addHook() called twice produces exactly one _pulse entry (idempotency)
- [x] 2.4 Write test: removeHook() removes only the _pulse entry, leaves user hooks intact
- [x] 2.5 Write test: removeHook() removes SessionStart key when pulse was the only entry
- [x] 2.6 Write test: removeHook() on settings with no pulse hook is a safe no-op

## 3. Transformer Static Tests

- [x] 3.1 Create `tests/transformer-static.test.ts` with vitest, define inline markdown fixtures with headings, code blocks, tables, JSX, images, and links
- [x] 3.2 Write test: output does not contain JSX components (<Note>, <Tip>, <Steps>)
- [x] 3.3 Write test: code blocks are preserved intact in output
- [x] 3.4 Write test: tables are preserved intact in output
- [x] 3.5 Write test: headings (H1, H2, H3) are preserved in output
- [x] 3.6 Write test: images and internal links are removed from output
- [x] 3.7 Write test: output respects tokenBudget (chars / 4 approximation), large doc is truncated
- [x] 3.8 Write test: small document within budget is not truncated

## 4. Splitter Tests

- [x] 4.1 Create `tests/splitter.test.ts` with vitest, define inline markdown fixtures with multiple H2 sections and nested headings
- [x] 4.2 Write test: sections strategy splits document into correct number of chunks at H2 boundaries
- [x] 4.3 Write test: content before first H2 is included in first chunk
- [x] 4.4 Write test: nested H3/H4 headings stay within their parent H2 chunk
- [x] 4.5 Write test: manual strategy extracts sections by defined heading names and returns correct IDs
- [x] 4.6 Write test: manual strategy skips headings not found in document

## 5. Platform Tests

- [x] 5.1 Create `tests/platform.test.ts` with vitest, mock process.platform and filesystem for /proc/version
- [x] 5.2 Write test: detectPlatform() returns "windows" when process.platform is "win32"
- [x] 5.3 Write test: detectPlatform() returns "unix" for "darwin" and for "linux" without WSL
- [x] 5.4 Write test: detectPlatform() returns "wsl" when "linux" and /proc/version contains "microsoft"
- [x] 5.5 Write test: getHookCommand() returns npx.cmd with & for windows
- [x] 5.6 Write test: getHookCommand() returns npx with && and || true for unix and wsl

## 6. README

- [x] 6.1 Create `README.md` with project title, tagline, and badges
- [x] 6.2 Write "Installation in 10 seconds" section with `npx pulse init` as primary command
- [x] 6.3 Write "What pulse does" section covering doc sync, tutor, and learning path
- [x] 6.4 Write "Skills" section with complete table of all SKILLS_REGISTRY entries (id, description, priority)
- [x] 6.5 Write "Team usage" section explaining how to commit .claude/skills/cc-* for sharing
- [x] 6.6 Write "CLI commands" table with all six commands, descriptions, and key flags
- [x] 6.7 Write "Sync mechanism" section covering ETag caching, transformer pipeline, and SessionStart hook
- [x] 6.8 Write "Configuration" section documenting all .pulserc.json options with defaults
- [x] 6.9 Write "Troubleshooting" section covering hook issues, Windows, stale skills, Claude CLI unavailable
- [x] 6.10 Write "Contributing" section explaining how to improve static skills and tutor content

## 7. Verification

- [x] 7.1 Run `npm run test` and verify all four test files pass
- [x] 7.2 Run `npm run build:skills` and verify skills-fallback/ is populated
- [x] 7.3 Verify README contains all nine required sections
