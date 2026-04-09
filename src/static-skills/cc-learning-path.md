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

**Checkpoint**: Tienes Claude Code integrado en tu CI/CD y al menos
un plugin compartido con tu equipo?
