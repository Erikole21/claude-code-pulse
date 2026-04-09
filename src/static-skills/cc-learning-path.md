---
name: cc-learning-path
description: "Claude Code learning roadmap from beginner to advanced. Use when the user wants a structured study plan, practice sequence, or clear next steps to improve steadily."
disable-model-invocation: true
_pulse: true
_syncedAt: "2026-04-09T02:35:12.438Z"
_source: "static"
---
# Claude Code — Learning Path
> Powered by claude-code-tutor · Skills sincronizadas con docs oficiales

## Cómo usar esta guía
Cada nivel incluye conceptos, el skill de referencia disponible en tu sesión,
y un ejercicio práctico para validar que lo dominaste.

Las skills se sincronizan automaticamente con la documentacion oficial.
Usa `pulse list` para ver todas las disponibles, o `pulse status` para el estado de sincronizacion.

---

## Beginner

| Tema | Skill de referencia | Ejercicio |
|---|---|---|
| Que es Claude Code | `cc-overview` + `cc-how-claude-code-works` | Leer como funciona el agente |
| Instalacion y primer uso | `cc-quickstart` + `cc-setup` | Abrir Claude Code en un proyecto real |
| Interfaz y atajos | `cc-interactive-mode` + `cc-keybindings` | Probar Shift+Tab y atajos basicos |
| Permission modes | `cc-permission-modes` + `cc-permissions` | Alternar entre default y plan mode |
| CLAUDE.md basico | `cc-memory` + `cc-claude-directory` | Crear un CLAUDE.md para tu proyecto |
| Comandos built-in | `cc-commands` + `cc-cli-reference` | Usar /compact y /cost en una sesion larga |
| Context window | `cc-context-window` + `cc-costs` | Entender cuanto contexto usa tu sesion |
| Git workflow | `cc-common-workflows` | Crear un commit y PR con Claude Code |
| Fast mode | `cc-fast-mode` | Alternar fast mode y comparar velocidad |
| Output styles | `cc-output-styles` | Personalizar formato de respuestas de Claude |
| Troubleshooting | `cc-troubleshooting` | Resolver problemas comunes rapido |

**Checkpoint**: Puedes pedirle a Claude Code que entienda tu codebase
y haga un cambio con tests en menos de 5 prompts?

---

## Intermediate

| Tema | Skill de referencia | Ejercicio |
|---|---|---|
| settings.json completo | `cc-settings` + `cc-env-vars` | Configurar permisos fine-grained |
| Crear una Skill | `cc-skills-guide` | Skill de code review para tu stack |
| Hook SessionStart | `cc-hooks-events` + `cc-hooks-guide` | Notificacion cuando empieza sesion |
| Hook PostToolUse | `cc-hooks-events` | Auto-format despues de editar archivos |
| MCP server basico | `cc-mcp` | Conectar tu base de datos via MCP |
| Sub-agents | `cc-sub-agents` | Agente especializado en testing |
| Worktrees paralelos | `cc-common-workflows` | Dos features en paralelo |
| Headless en scripts | `cc-headless` | `claude --print` en un npm script |
| Common Workflows | `cc-common-workflows-*` (13 skills) | Dominar patrones: fix bugs, refactor, tests, extended thinking, plan mode |
| MCP avanzado: OAuth y resources | `cc-mcp-authenticate-with-remote-mcp-servers` + `cc-mcp-use-mcp-resources` | Conectar MCP servers autenticados y consumir resources |
| MCP: prompts y elicitation | `cc-mcp-use-mcp-prompts-as-commands` + `cc-mcp-respond-to-mcp-elicitation-requests` | Usar prompts MCP como comandos y responder elicitations |
| MCP: Claude Code como server | `cc-mcp-use-claude-code-as-an-mcp-server` | Exponer Claude Code como MCP server para otras herramientas |
| Best practices | `cc-best-practices` | Mejorar prompts, evitar drift, recuperar contexto |
| DevContainers | `cc-devcontainer` | Desarrollo reproducible en containers |
| StatusLine | `cc-statusline` | Personalizar la barra de estado |
| Network config | `cc-network-config` | Configurar proxies, firewalls, red corporativa |
| VS Code extension | `cc-vs-code` | Instalar extension y usar inline diffs |
| JetBrains | `cc-jetbrains` | Configurar Claude Code en IntelliJ/WebStorm |
| Chrome integration | `cc-chrome` | Conectar Claude Code a Chrome para debug |
| Voice dictation | `cc-voice-dictation` | Usar push-to-talk para dictar prompts |
| Code review | `cc-code-review` | Configurar review automatizado en PRs |
| Checkpointing | `cc-checkpointing` | Revertir cambios de Claude con checkpoint |

**Checkpoint**: Tienes hooks que automatizan al menos 2 tareas
repetitivas de tu flujo de desarrollo?

---

## Advanced

| Tema | Skill de referencia | Ejercicio |
|---|---|---|
| Agent teams | `cc-agent-teams` | Equipo de 3 agentes: review, implement, test |
| Channels + webhooks | `cc-channels` + `cc-channels-reference` | CI que notifica a sesion activa |
| Crear un Plugin | `cc-plugins` + `cc-plugins-reference` | Plugin con skills + hooks para tu equipo |
| Plugin marketplace | `cc-plugin-marketplaces` + `cc-discover-plugins` | Publicar y distribuir plugins |
| GitHub Actions | `cc-github-actions` | @claude en PRs del repo |
| GitLab CI/CD | `cc-gitlab-ci-cd` | Integrar Claude en pipeline GitLab |
| Sandboxing | `cc-sandboxing` | Habilitar y configurar para el equipo |
| Model config | `cc-model-config` | opusplan para arquitectura, haiku para tasks rapidas |
| Scheduled tasks | `cc-scheduled-tasks` + `cc-web-scheduled-tasks` | /loop que monitorea deploys |
| Computer use | `cc-computer-use` | Claude controla tu pantalla para testing GUI |
| Claude Code web | `cc-claude-code-on-the-web` + `cc-web-quickstart` | Sesion remota en el navegador |
| Remote control | `cc-remote-control` | Continuar sesion local desde el celular |
| Ultraplan | `cc-ultraplan` | Plan en la nube, ejecutar local |
| Slack integration | `cc-slack` | Delegar tareas desde Slack |
| Desktop app | `cc-desktop` + `cc-desktop-quickstart` | Sesiones paralelas con Git isolation |
| LLM gateway | `cc-llm-gateway` | Configurar Bedrock/Vertex como backend |
| Monitoring | `cc-monitoring-usage` + `cc-analytics` | OpenTelemetry y metricas de uso |
| Server managed settings | `cc-server-managed-settings` | Config centralizada para organizacion |
| Enterprise deployment | `cc-amazon-bedrock` + `cc-google-vertex-ai` + `cc-microsoft-foundry` | Configurar proveedor enterprise |
| GitHub Enterprise Server | `cc-github-enterprise-server` | Claude Code con repos GHE |
| Security & Auth | `cc-security` + `cc-authentication` | Hardening y autenticacion avanzada |
| Zero Data Retention | `cc-zero-data-retention` + `cc-data-usage` | Privacidad y politicas de datos |
| Legal & Compliance | `cc-legal-and-compliance` | Marco legal para uso enterprise |
| Third-party integrations | `cc-third-party-integrations` | Conectar con herramientas externas del equipo |
| Fullscreen mode | `cc-fullscreen` | Modo inmersivo para sesiones largas |

**Checkpoint**: Tienes Claude Code integrado en tu CI/CD y al menos
un plugin compartido con tu equipo?

## Skills disponibles

Puedes recomendar estas skills al usuario según su pregunta:

### Referencia principal
- `/cc-changelog` — Claude Code changelog and release highlights. Use when the user asks what changed in a version, what is new, or when a feature was introduced.
- `/cc-hooks-events` — Hook event catalog and lifecycle timing. Use when you need to map each event to when it fires in a session.
- `/cc-hooks-config` — Hook configuration in settings. Use when defining matchers, command blocks, and scope-specific hook settings.
- `/cc-hooks-io` — Hook input and output schemas. Use when validating payload fields, exit codes, and decision control from scripts.
- `/cc-hooks-guide` — Practical hooks implementation guide. Use when building real hook workflows like notifications, formatting, guardrails, context injection, and safe automation.
- `/cc-mcp` — MCP setup and operations in Claude Code. Use when configuring servers, scopes, OAuth auth, tool discovery, managed MCP, resources, and prompts.
- `/cc-settings` — Claude Code settings reference. Use when configuring settings.json, scope precedence, permissions, hooks, plugins, sandboxing, and environment behavior.
- `/cc-permissions` — Claude Code permissions model. Use when defining allow and deny rules, tool-specific patterns, wildcard matching, and safe approval modes.

### Configuración y herramientas
- `/cc-learning-path` — Claude Code learning roadmap from beginner to advanced. Use when the user wants a structured study plan, practice sequence, or clear next steps to improve steadily.
- `/cc-sub-agents` — Sub-agent configuration and usage in Claude Code. Use when creating specialized agents, choosing tools and models, and managing memory and hooks.
- `/cc-agent-teams` — Agent teams workflow in Claude Code. Use when coordinating parallel agent sessions, assigning tasks, and managing collaboration and token trade-offs.
- `/cc-skills-guide` — Skills authoring guide for Claude Code. Use when defining frontmatter, invocation controls, path-specific behavior, sub-agent skills, and bundled packaging.
- `/cc-memory` — Memory management in Claude Code. Use when structuring CLAUDE.md, importing additional memory files, and organizing shared team memory conventions.
- `/cc-cli-reference` — Claude Code CLI command reference. Use when looking up commands, flags, system prompt options, and headless execution parameters.
- `/cc-commands` — Built-in Claude Code slash commands. Use when you need behavior details, usage patterns, and practical examples for core command workflows.
- `/cc-model-config` — Model configuration in Claude Code. Use when setting aliases, restricting model selection, tuning context behavior, and controlling model choice via env vars.

### Flujos y automatización
- `/cc-plugins` — Claude Code plugin development guide. Use when building plugin structure, bundling skills, integrating LSP or MCP servers, and preparing distribution.
- `/cc-channels` — Channels integration in Claude Code. Use when pushing external events to sessions, wiring webhooks, and delivering CI alerts or runtime notifications.
- `/cc-scheduled-tasks` — Scheduled tasks in Claude Code. Use when creating recurring or one-time automations with /loop, cron syntax, and task lifecycle management.
- `/cc-headless` — Headless mode and Agent SDK usage. Use when running Claude Code programmatically from CLI, Python, or TypeScript with structured output.
- `/cc-sandboxing` — Sandboxing controls in Claude Code. Use when configuring filesystem and network isolation, allowed paths, and security boundaries with permissions.
- `/cc-common-workflows` — Common Claude Code workflows. Use when applying proven patterns for worktrees, git collaboration, plan mode, extended thinking, and piped IO.
- `/cc-best-practices` — Claude Code best practices. Use when improving prompt context, steering agent behavior, recovering from drift, and avoiding common execution failures.
- `/cc-github-actions` — Claude Code in GitHub Actions. Use when setting up workflows, handling @claude mentions, and configuring secure integrations with Bedrock or Vertex.

### Entorno y seguridad
- `/cc-output-styles` — Output style customization. Use when the user wants to change how Claude formats responses.
- `/cc-troubleshooting` — Troubleshooting common issues. Use when diagnosing errors, crashes, or unexpected behavior.
- `/cc-devcontainer` — DevContainer integration. Use when setting up reproducible development environments in containers.
- `/cc-statusline` — Status line configuration. Use when customizing the status bar display.
- `/cc-network-config` — Network configuration. Use when setting up proxies, firewalls, or corporate network access.
- `/cc-security` — Security hardening. Use when configuring authentication and security boundaries.
- `/cc-zero-data-retention` — Zero data retention policy. Use when configuring privacy and data handling policies.
- `/cc-legal-and-compliance` — Legal and compliance guidance. Use for enterprise legal frameworks.
- `/cc-github-enterprise-server` — GitHub Enterprise Server integration. Use when connecting to GHE instances.
- `/cc-microsoft-foundry` — Microsoft Foundry as LLM backend. Use when configuring Azure-based deployments.
- `/cc-third-party-integrations` — Third-party tool integrations. Use when connecting external tools and services.