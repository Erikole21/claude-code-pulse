## Context

La skill `cc-tutor` es la skill estática auto-activable del proyecto. Tiene id/name `cc-tutor`, vive en `src/static-skills/cc-tutor.md`, y se instala en `.claude/skills/cc-tutor/SKILL.md`. Es la única skill con `disableModelInvocation: false`, lo que permite que Claude la active automáticamente cuando la descripción hace match con la pregunta del usuario.

El renombre a `pulse` toca 7 archivos en el codebase más el archivo estático en sí. El skill index dinámico (generado en build y en sync) se appende al contenido de la skill, por lo que el filtro de exclusión también debe actualizarse.

## Goals / Non-Goals

**Goals:**
- Renombrar la skill de `cc-tutor` a `pulse` en todo el codebase (id, name, archivo fuente, referencias)
- Completar el contenido de la skill con: motivación proactiva, ideas según nivel/proyecto, y verificación obligatoria contra skills `cc-*`
- Mantener la auto-activación: `pulse` sigue siendo la única skill con `disableModelInvocation: false`
- Que el usuario pueda escribir "pulse" naturalmente y se active la skill

**Non-Goals:**
- Cambiar el sistema de memoria (`~/.claude/pulse/memory.json`) — ya funciona bien
- Modificar el flujo de sync/fetch/transform — no se toca
- Crear una skill separada adicional — es renombre, no duplicación
- Cambiar el learning path (`cc-learning-path`) — permanece igual

## Decisions

### 1. Renombre directo en lugar de alias

**Decisión:** Renombrar `cc-tutor` → `pulse` en todos los puntos (registry, archivo fuente, skill-index, fallback, greet, memory).

**Alternativa considerada:** Crear un alias o wrapper que delegue a `cc-tutor`. Descartado porque añade complejidad innecesaria — si el nombre oficial del producto es Pulse, la skill debe llamarse `pulse`.

**Impacto:** Es un BREAKING change para quien usaba `/cc-tutor`. Aceptable porque el proyecto está en v1.x y el cambio es intencional.

### 2. Archivo fuente: `pulse.md` en vez de `cc-tutor.md`

**Decisión:** Renombrar `src/static-skills/cc-tutor.md` → `src/static-skills/pulse.md`. Actualizar el mapa `STATIC_CONTENT_FILES` en `generate-fallback-skills.ts`.

**Alternativa considerada:** Mantener el archivo como `cc-tutor.md` y solo cambiar el id/name en el registry. Descartado porque crea confusión entre el nombre del archivo y el id de la skill.

### 3. Descripción optimizada para activación natural

**Decisión:** La descripción de `pulse` en el registry debe incluir la palabra "pulse" explícitamente para que Claude haga match cuando el usuario escribe "pulse" en la conversación. Ejemplo: `"Pulse — your Claude Code companion. Use when the user types 'pulse', asks for help, wants ideas, or needs guidance on Claude Code features."`.

**Alternativa considerada:** Depender solo del `name: pulse` en el frontmatter. Insuficiente porque la auto-activación de Claude usa la descripción para hacer matching semántico, no solo el nombre.

### 4. Contenido nuevo: motivación e ideas como secciones del skill

**Decisión:** Agregar al contenido de `pulse.md` dos secciones nuevas:
- **"Motivar y dar ideas"**: instrucciones para que Pulse sugiera proactivamente según nivel (beginner → siguiente paso natural, intermediate → automatizaciones, advanced → patrones avanzados)
- **"Verificación contra documentación"**: regla explícita de consultar las skills `cc-*` antes de responder, para no dar info obsoleta

Estas secciones se integran en el flujo existente del tutor (después del saludo y antes de las reglas de tutoría).

### 5. Skill index: cambiar filtro de `cc-tutor` a `pulse`

**Decisión:** En `skill-index.ts`, el filtro `s.id !== 'cc-tutor'` cambia a `s.id !== 'pulse'`. El índice se sigue appendeando solo a esta skill.

En `generate-fallback-skills.ts`, la condición `def.id === 'cc-tutor'` cambia a `def.id === 'pulse'`, y el mapa `STATIC_CONTENT_FILES` cambia la key de `'cc-tutor'` a `'pulse'` con valor `'pulse.md'`.

### 6. Greet actualiza referencias

**Decisión:** En `greet.ts`, el mensaje de bienvenida cambia `/cc-tutor` → `/pulse` y la referencia a la memoria cambia a "Read it only if the pulse skill activates".

### 7. Memory log actualiza referencia

**Decisión:** En `memory.ts`, el mensaje "Start a session with the cc-tutor skill" cambia a "Start a session with the pulse skill" (o "Start a session with /pulse").

## Risks / Trade-offs

**[BREAKING] Usuarios que usaban `/cc-tutor`** → Mitigación: documentar en README y changelog que `/cc-tutor` ahora es `/pulse`. El proyecto está en v1.x con pocos usuarios, el costo es bajo.

**[Token budget] Contenido más largo en `pulse.md`** → Mitigación: el `tokenBudget` de la skill es para la transformación (que no aplica a skills estáticas). El contenido se carga completo como skill. Mantener el contenido conciso — las secciones nuevas no deben exceder ~40 líneas adicionales.

**[Fallback desincronizado] `skills-fallback/cc-tutor/` vs `skills-fallback/pulse/`** → Mitigación: `pulse init --force` y `npm run build:skills` regeneran todo. Documentar en el upgrade path que se necesita `pulse init --force` después de actualizar.

## Open Questions

_(ninguna — el scope está claro)_
