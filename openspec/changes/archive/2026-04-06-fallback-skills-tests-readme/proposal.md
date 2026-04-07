## Why

The package needs three remaining pieces before it can be published: (1) a fallback skills bundle so that `pulse init` and `pulse sync` can work fully offline when `code.claude.com` is unreachable, (2) comprehensive vitest tests for the four modules specified in the SDD (hook-manager, transformer-static, splitter, platform), and (3) a README with the nine mandatory sections defined in the SDD. Without the fallback bundle, users on flaky networks get no skills at all. Without tests, the package cannot be released with confidence. Without the README, users have no onboarding or reference documentation.

## What Changes

- Create `scripts/generate-fallback-skills.ts` that fetches all docs, transforms them with the static transformer, and writes pre-built `SKILL.md` files to `skills-fallback/` for offline use. This script runs via `npm run build:skills` and during `prepublishOnly`.
- Create `tests/hook-manager.test.ts` covering: merge with existing hooks without touching them, idempotent init (no duplicate hooks), remove only the `_pulse` entry.
- Create `tests/transformer-static.test.ts` covering: valid output with real docs, correct truncation to tokenBudget.
- Create `tests/splitter.test.ts` covering: `sections` strategy splits by H2, `manual` strategy respects defined headings.
- Create `tests/platform.test.ts` covering: correct OS detection, correct hook command per platform.
- Create `README.md` with all nine required sections: Installation in 10 seconds, What pulse does, Skills table, Team usage, CLI commands table, Sync mechanism, Configuration, Troubleshooting, Contributing.

## Capabilities

### New Capabilities
- `fallback-skills-bundle`: Generation script that fetches docs, applies static transformer, and writes pre-built SKILL.md files to skills-fallback/ for offline fallback during sync
- `hook-manager-tests`: Vitest test suite for hook-manager.ts verifying safe merge, idempotency, and clean removal
- `transformer-static-tests`: Vitest test suite for transformer-static.ts verifying valid output and tokenBudget truncation
- `splitter-tests`: Vitest test suite for splitter.ts verifying sections and manual split strategies
- `platform-tests`: Vitest test suite for platform.ts verifying OS detection and hook command generation
- `project-readme`: README.md with all nine required sections for user onboarding and reference

### Modified Capabilities

(none -- all artifacts in this change are new additions)

## Impact

- New files: `scripts/generate-fallback-skills.ts`, `skills-fallback/**/*.md`, `tests/hook-manager.test.ts`, `tests/transformer-static.test.ts`, `tests/splitter.test.ts`, `tests/platform.test.ts`, `README.md`
- Dependencies on: all core modules from changes 1-4 (skills-registry, fetcher, transformer-static, splitter, installer, hook-manager, platform, meta)
- The `skills-fallback/` directory is bundled in the npm package via the `files` field in `package.json`
- Build pipeline: `prepublishOnly` script now runs `build:skills` before publish
