# claude-code-pulse

Keep Claude Code alive. Fresh docs, built-in tutor, always in sync.

![Node >=18](https://img.shields.io/badge/node-%3E%3D18-339933)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178c6)
![Tests](https://img.shields.io/badge/tests-vitest-6e9f18)

## Installation

### Recommended (global install)

```bash
npm install -g claude-code-pulse
```

Then verify:

```bash
pulse --version
```

Global install makes the `pulse` command available system-wide, but you still need to initialize each repository where you want to use it:

```bash
pulse init
```

### Quick run (no global install)

```bash
npx pulse init
```

This command installs pulse skills in `.claude/skills`, runs an initial sync, and adds a safe `SessionStart` hook.

### How it works across repositories and new Claude sessions

- Global npm install adds the CLI binary only.
- `pulse init` configures the current repository only.
- Each repository must be initialized once.
- New Claude Code sessions in an initialized repository use that repo's `.claude` configuration and hooks automatically.
- In a brand-new repository, run `pulse init` first.

## What pulse does

- **Doc sync**: downloads Claude Code docs and keeps skills fresh.
- **Built-in tutor**: includes `cc-tutor` for guided help in-session.
- **Learning path**: includes `cc-learning-path` for structured onboarding.

## Skills

| ID | Description | Priority |
|---|---|---|
| `cc-tutor` | Interactive tutor to guide users and answer Claude Code questions. | `critical` |
| `cc-learning-path` | Structured multi-level learning path. | `high` |
| `cc-changelog` | Recent updates and changes in Claude Code. | `critical` |
| `cc-hooks-events` | Hook events table and when they trigger. | `critical` |
| `cc-hooks-guide` | Practical guide for implementing hooks. | `critical` |
| `cc-mcp` | MCP server setup and usage. | `critical` |
| `cc-settings` | `settings.json` reference and scopes. | `critical` |
| `cc-permissions` | Permission system and per-tool rules. | `critical` |
| `cc-sub-agents` | Sub-agent setup and usage. | `high` |
| `cc-agent-teams` | Coordinating multiple agents in teams. | `high` |
| `cc-skills-guide` | How to create and maintain skills. | `high` |
| `cc-memory` | Using `CLAUDE.md` and project memory. | `high` |
| `cc-cli-reference` | CLI commands and flags reference. | `high` |
| `cc-commands` | Built-in Claude Code commands. | `high` |
| `cc-model-config` | Model configuration and aliases. | `high` |
| `cc-plugins` | Plugin architecture and authoring. | `medium` |
| `cc-channels` | Channels and webhook workflows. | `medium` |
| `cc-scheduled-tasks` | Scheduled tasks with `/loop` and cron. | `medium` |
| `cc-headless` | Headless execution and SDK usage. | `medium` |
| `cc-sandboxing` | Sandboxing and isolation. | `medium` |
| `cc-common-workflows` | Common development workflows. | `medium` |
| `cc-best-practices` | Recommended practices and patterns. | `medium` |
| `cc-github-actions` | Claude Code integration with GitHub Actions. | `medium` |

## Team usage

If your team wants the same skills, commit the generated directories:

```text
.claude/skills/cc-*/
```

Pulse only manages skills marked with `_pulse: true`, so user-owned custom skills are preserved.

## CLI commands

| Command | Description | Key flags |
|---|---|---|
| `pulse init` | Initializes pulse in current project. | `--force`, `--yes`, `--skills <ids...>` |
| `pulse sync` | Fetches, transforms, and installs skills. | `--force`, `--if-stale <seconds>`, `--silent`, `--skills <ids...>` |
| `pulse greet` | Emits first-session tutor context. | `--once` |
| `pulse list` | Lists installed skills and freshness state. | _(none)_ |
| `pulse status` | Shows global pulse status and diagnostics. | _(none)_ |
| `pulse uninstall` | Removes pulse hook and pulse-managed skills. | `--keep-hook`, `--keep-skills`, `--purge-memory` |

## Your tutor progress

Pulse remembers your learning progress across sessions in `~/.claude/pulse/memory.json`.

| Command | Description |
|---|---|
| `pulse memory` | View your tutor progress summary |
| `pulse memory --reset` | Reset memory (keeps session logs) |
| `pulse memory --export` | Export memory as JSON |
| `pulse memory --import <file>` | Import memory from a JSON file |
| `pulse memory --update '<JSON>'` | Update specific memory fields |
| `pulse memory --exercise <id> --status <status>` | Update exercise status |
| `pulse memory --next-step "<desc>" --reason "<reason>"` | Add a next step |

Memory is stored locally and never leaves your machine. Use `pulse uninstall --purge-memory` to delete all memory data.

## Sync mechanism

- **ETag caching**: unchanged docs return `304` and are skipped.
- **Transformer pipeline**: tries Claude CLI transform first, then static fallback.
- **SessionStart hook**: runs daily stale-aware sync (`--if-stale 86400`) and one-time greet.

## Configuration

Create `.pulserc.json` in your project:

```json
{
  "skills": ["critical", "high"],
  "maxAge": 86400,
  "transformer": "auto",
  "silent": false
}
```

| Option | Default | Valid values | Description |
|---|---|---|---|
| `skills` | `["critical","high"]` | `["critical"]`, `["critical","high"]`, `["all"]`, etc. | Skill priorities to sync. |
| `maxAge` | `86400` | number (seconds) | Staleness threshold for auto-sync decisions. |
| `transformer` | `"auto"` | `"auto"`, `"static"` | Transformation mode. `auto` prefers Claude CLI. |
| `silent` | `false` | `true`, `false` | Suppress non-error output. |

## Troubleshooting

- **Hook does not run**: check `.claude/settings.json` has a `SessionStart` entry with `_pulse: true`.
- **Windows behavior**: pulse uses `npx.cmd` on native Windows and Unix format on WSL.
- **Skills look stale**: run `pulse sync --force` to bypass ETag cache.
- **Claude CLI unavailable**: pulse automatically falls back to static transformer.

## Contributing

- Improve static skill sources under `src/static-skills/`.
- Improve tutor and learning content in `cc-tutor.md` and `cc-learning-path.md`.
- Add/adjust tests in `tests/` when changing fetch, transform, split, or hook behavior.
