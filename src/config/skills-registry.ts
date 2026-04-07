export interface ManualSection {
  id: string
  heading: string
  description: string
}

export interface SkillDefinition {
  id: string
  sourceUrl: string | null
  name: string
  description: string
  splitStrategy?: 'none' | 'sections' | 'manual'
  manualSections?: ManualSection[]
  tokenBudget?: number
  priority: 'critical' | 'high' | 'medium'
  static?: boolean
}

export const SKILLS_REGISTRY: SkillDefinition[] = [

  // ── STATIC SKILLS (tutor and learning path) ──────────────────

  {
    id: 'cc-tutor',
    sourceUrl: null,
    name: 'cc-tutor',
    description:
      'Tutor interactivo de Claude Code. Úsame cuando el usuario parezca ' +
      'ser nuevo en Claude Code, pregunte cómo empezar, qué puede hacer, ' +
      'cómo funciona, o pida que lo guíes o enseñes. También respondo sobre ' +
      'hooks, MCP, sub-agents y features avanzadas. Detecto el idioma del ' +
      'usuario automáticamente y me adapto.',
    splitStrategy: 'none',
    tokenBudget: 900,
    priority: 'critical',
    static: true,
  },
  {
    id: 'cc-learning-path',
    sourceUrl: null,
    name: 'cc-learning-path',
    description:
      'Ruta de aprendizaje estructurada de Claude Code por niveles: ' +
      'beginner, intermediate y advanced. Úsame cuando el usuario quiera ' +
      'ver el currículo completo, saber qué aprender después, o pida un ' +
      'plan de estudio. Invócame con /cc-learning-path.',
    splitStrategy: 'none',
    tokenBudget: 700,
    priority: 'high',
    static: true,
  },

  // ── CRITICAL (from official docs) ────────────────────────────

  {
    id: 'cc-changelog',
    sourceUrl: 'https://code.claude.com/docs/en/changelog.md',
    name: 'cc-changelog',
    description:
      'Changelog y novedades recientes de Claude Code. Úsame cuando ' +
      'pregunten qué hay de nuevo, qué cambió en una versión, o qué ' +
      'features se agregaron recientemente.',
    splitStrategy: 'none',
    tokenBudget: 800,
    priority: 'critical',
  },
  {
    id: 'cc-hooks-events',
    sourceUrl: 'https://code.claude.com/docs/en/hooks.md',
    name: 'cc-hooks-events',
    description:
      'Tabla de todos los hook events de Claude Code: SessionStart, ' +
      'PreToolUse, PostToolUse, Stop, Notification, ConfigChange, ' +
      'FileChanged, CwdChanged, WorktreeCreate, Elicitation y más. ' +
      'Cuándo se dispara cada uno.',
    splitStrategy: 'manual',
    manualSections: [
      {
        id: 'cc-hooks-events',
        heading: 'Hook lifecycle',
        description: 'Tabla de eventos y cuándo se disparan',
      },
      {
        id: 'cc-hooks-config',
        heading: 'Configuration',
        description: 'Configuración de hooks en settings.json, matchers, campos',
      },
      {
        id: 'cc-hooks-io',
        heading: 'Hook input and output',
        description: 'Esquemas JSON de input/output, exit codes, decisiones',
      },
    ],
    priority: 'critical',
  },
  {
    id: 'cc-hooks-guide',
    sourceUrl: 'https://code.claude.com/docs/en/hooks-guide.md',
    name: 'cc-hooks-guide',
    description:
      'Guía práctica de hooks con ejemplos: notificaciones, auto-format, ' +
      'bloquear archivos, re-inyectar contexto, auto-approve.',
    splitStrategy: 'none',
    tokenBudget: 700,
    priority: 'critical',
  },
  {
    id: 'cc-mcp',
    sourceUrl: 'https://code.claude.com/docs/en/mcp.md',
    name: 'cc-mcp',
    description:
      'Configuración de MCP servers en Claude Code: instalar, scopes ' +
      '(local/project/user), autenticación OAuth, tool search, ' +
      'managed MCP, recursos y prompts MCP.',
    splitStrategy: 'sections',
    tokenBudget: 700,
    priority: 'critical',
  },
  {
    id: 'cc-settings',
    sourceUrl: 'https://code.claude.com/docs/en/settings.md',
    name: 'cc-settings',
    description:
      'Todas las opciones de configuración de Claude Code en settings.json: ' +
      'permisos, hooks, plugins, sandbox, env vars, precedencia de scopes.',
    splitStrategy: 'sections',
    tokenBudget: 700,
    priority: 'critical',
  },
  {
    id: 'cc-permissions',
    sourceUrl: 'https://code.claude.com/docs/en/permissions.md',
    name: 'cc-permissions',
    description:
      'Sistema de permisos de Claude Code: sintaxis de reglas, modos ' +
      '(auto, plan, bypassPermissions), tool-specific rules, wildcards.',
    splitStrategy: 'none',
    tokenBudget: 600,
    priority: 'critical',
  },

  // ── HIGH PRIORITY ─────────────────────────────────────────────

  {
    id: 'cc-sub-agents',
    sourceUrl: 'https://code.claude.com/docs/en/sub-agents.md',
    name: 'cc-sub-agents',
    description:
      'Configuración de sub-agents en Claude Code: frontmatter fields, ' +
      'modelos, tools disponibles, persistent memory, hooks en subagents.',
    splitStrategy: 'none',
    tokenBudget: 700,
    priority: 'high',
  },
  {
    id: 'cc-agent-teams',
    sourceUrl: 'https://code.claude.com/docs/en/agent-teams.md',
    name: 'cc-agent-teams',
    description:
      'Agent teams en Claude Code: coordinar múltiples sesiones, ' +
      'asignar tareas, hablar con teammates, display modes, token costs.',
    splitStrategy: 'none',
    tokenBudget: 600,
    priority: 'high',
  },
  {
    id: 'cc-skills-guide',
    sourceUrl: 'https://code.claude.com/docs/en/skills.md',
    name: 'cc-skills-guide',
    description:
      'Cómo crear y configurar Skills en Claude Code: frontmatter, ' +
      'invocation control, subagent skills, path-specific, bundled skills.',
    splitStrategy: 'none',
    tokenBudget: 600,
    priority: 'high',
  },
  {
    id: 'cc-memory',
    sourceUrl: 'https://code.claude.com/docs/en/memory.md',
    name: 'cc-memory',
    description:
      'CLAUDE.md y auto-memory en Claude Code: dónde poner archivos, ' +
      'import de archivos adicionales, rules directory, gestión para equipos.',
    splitStrategy: 'none',
    tokenBudget: 600,
    priority: 'high',
  },
  {
    id: 'cc-cli-reference',
    sourceUrl: 'https://code.claude.com/docs/en/cli-reference.md',
    name: 'cc-cli-reference',
    description:
      'Referencia completa CLI de Claude Code: flags, comandos, ' +
      'system prompt flags, opciones de headless.',
    splitStrategy: 'none',
    tokenBudget: 500,
    priority: 'high',
  },
  {
    id: 'cc-commands',
    sourceUrl: 'https://code.claude.com/docs/en/commands.md',
    name: 'cc-commands',
    description:
      'Comandos built-in de Claude Code: /batch, /debug, /loop, ' +
      '/simplify, /claude-api, /compact, /memory y más.',
    splitStrategy: 'none',
    tokenBudget: 500,
    priority: 'high',
  },
  {
    id: 'cc-model-config',
    sourceUrl: 'https://code.claude.com/docs/en/model-config.md',
    name: 'cc-model-config',
    description:
      'Configuración de modelos en Claude Code: aliases (opusplan, fast-mode), ' +
      'restrict model selection, extended context, env vars para pinning.',
    splitStrategy: 'none',
    tokenBudget: 500,
    priority: 'high',
  },

  // ── MEDIUM PRIORITY ────────────────────────────────────────────

  {
    id: 'cc-plugins',
    sourceUrl: 'https://code.claude.com/docs/en/plugins.md',
    name: 'cc-plugins',
    description:
      'Crear plugins para Claude Code: estructura, skills, LSP servers, ' +
      'MCP servers incluidos, distribución en marketplaces.',
    splitStrategy: 'none',
    tokenBudget: 600,
    priority: 'medium',
  },
  {
    id: 'cc-channels',
    sourceUrl: 'https://code.claude.com/docs/en/channels.md',
    name: 'cc-channels',
    description:
      'Channels en Claude Code: push events a sesiones activas, ' +
      'webhooks, alertas de CI, chat messages desde MCP server.',
    splitStrategy: 'none',
    tokenBudget: 500,
    priority: 'medium',
  },
  {
    id: 'cc-scheduled-tasks',
    sourceUrl: 'https://code.claude.com/docs/en/scheduled-tasks.md',
    name: 'cc-scheduled-tasks',
    description:
      'Tareas programadas en Claude Code: /loop, cron syntax, ' +
      'one-time reminders, gestión de tasks recurrentes.',
    splitStrategy: 'none',
    tokenBudget: 400,
    priority: 'medium',
  },
  {
    id: 'cc-headless',
    sourceUrl: 'https://code.claude.com/docs/en/headless.md',
    name: 'cc-headless',
    description:
      'Modo headless y Agent SDK de Claude Code: uso programático ' +
      'desde CLI, Python y TypeScript, output estructurado, bare mode.',
    splitStrategy: 'none',
    tokenBudget: 500,
    priority: 'medium',
  },
  {
    id: 'cc-sandboxing',
    sourceUrl: 'https://code.claude.com/docs/en/sandboxing.md',
    name: 'cc-sandboxing',
    description:
      'Sandboxing en Claude Code: filesystem isolation, network isolation, ' +
      'cómo habilitar, configurar paths permitidos, relación con permisos.',
    splitStrategy: 'none',
    tokenBudget: 400,
    priority: 'medium',
  },
  {
    id: 'cc-common-workflows',
    sourceUrl: 'https://code.claude.com/docs/en/common-workflows.md',
    name: 'cc-common-workflows',
    description:
      'Flujos de trabajo comunes en Claude Code: worktrees paralelos, ' +
      'git workflows, plan mode, extended thinking, pipe input/output.',
    splitStrategy: 'sections',
    tokenBudget: 700,
    priority: 'medium',
  },
  {
    id: 'cc-best-practices',
    sourceUrl: 'https://code.claude.com/docs/en/best-practices.md',
    name: 'cc-best-practices',
    description:
      'Best practices de Claude Code: dar contexto efectivo, gestionar ' +
      'contexto, course-correct, evitar patrones de fallo comunes.',
    splitStrategy: 'none',
    tokenBudget: 600,
    priority: 'medium',
  },
  {
    id: 'cc-github-actions',
    sourceUrl: 'https://code.claude.com/docs/en/github-actions.md',
    name: 'cc-github-actions',
    description:
      'Claude Code en GitHub Actions: setup, @claude mentions, ' +
      'configuración con Bedrock y Vertex, security considerations.',
    splitStrategy: 'none',
    tokenBudget: 500,
    priority: 'medium',
  },
]

export function filterByPriority(priorities: string[]): SkillDefinition[] {
  const expanded =
    priorities.length === 1 && priorities[0] === 'all'
      ? (['critical', 'high', 'medium'] as const)
      : priorities
  return SKILLS_REGISTRY.filter((s) => expanded.includes(s.priority))
}
