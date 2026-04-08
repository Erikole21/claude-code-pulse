## Why

La skill `cc-tutor` ya hace el trabajo de tutor: lee memoria, saluda por nombre, detecta idioma, enseña por niveles. Pero el nombre natural del producto es "Pulse", no "cc-tutor". Además, le falta: motivar proactivamente al usuario, dar ideas según su nivel y proyecto, y verificar siempre contra la documentación actualizada de las skills `cc-*` antes de responder. En vez de crear una segunda skill duplicada, lo correcto es renombrar `cc-tutor` a `pulse` y completar su contenido con estas capacidades.

## What Changes

- Renombrar la skill estática de `cc-tutor` a `pulse`: el archivo fuente pasa de `src/static-skills/cc-tutor.md` a `src/static-skills/pulse.md`, el id y name en el registry cambian a `pulse`
- Completar el contenido de la skill con: motivación proactiva, sugerencia de ideas según nivel/proyecto, y regla de verificar siempre contra las skills `cc-*` instaladas antes de responder (para no dar info obsoleta)
- Actualizar todas las referencias internas que apuntan a `cc-tutor`: skill index (excluir `pulse` en vez de `cc-tutor`), fallback bundle, hook greet, y cualquier otra referencia en el código
- La skill sigue siendo la única con `disableModelInvocation: false` para auto-activarse cuando el usuario escriba "pulse" o pregunte sobre Claude Code

## Capabilities

### New Capabilities
_(ninguna — es evolución de una capability existente)_

### Modified Capabilities
- `cc-tutor-skill`: Renombrar a `pulse`, completar contenido con motivación proactiva, ideas por nivel/proyecto, y verificación contra documentación. El archivo fuente cambia de `cc-tutor.md` a `pulse.md`
- `skills-registry`: Cambiar id/name de `cc-tutor` a `pulse` en la entrada estática auto-activable
- `tutor-skill-index`: Excluir `pulse` (en vez de `cc-tutor`) del índice generado

## Impact

- **Archivos renombrados**: `src/static-skills/cc-tutor.md` → `src/static-skills/pulse.md`
- **Archivos modificados**: `src/config/skills-registry.ts`, `src/core/skill-index.ts`, `scripts/generate-fallback-skills.ts` (si referencia cc-tutor), `src/commands/greet.ts` (si referencia cc-tutor)
- **Skills instaladas**: `.claude/skills/cc-tutor/` deja de existir, se reemplaza por `.claude/skills/pulse/`
- **Backward compatibility**: **BREAKING** para usuarios que invocaban `/cc-tutor` explícitamente — ahora es `/pulse`. El cambio es intencional y alineado con el branding del producto
