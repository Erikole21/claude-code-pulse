## 1. Renombrar skill estática

- [x] 1.1 Renombrar `src/static-skills/cc-tutor.md` a `src/static-skills/pulse.md`
- [x] 1.2 En `src/config/skills-registry.ts`: cambiar la entrada estática de `id: 'cc-tutor'`, `name: 'cc-tutor'` a `id: 'pulse'`, `name: 'pulse'`. Actualizar la `description` para incluir "Pulse" y mencionar guidance, ideas, y help. Mantener `disableModelInvocation: false`

## 2. Completar contenido de la skill

- [x] 2.1 En `src/static-skills/pulse.md`: actualizar la identidad — nombre Pulse, personalidad motivadora, principio de verificación contra docs `cc-*`
- [x] 2.2 En `src/static-skills/pulse.md`: agregar sección "Motivar y dar ideas" con instrucciones por nivel (beginner → siguiente paso natural, intermediate → automatizaciones concretas, advanced → patrones avanzados) e ideas project-aware
- [x] 2.3 En `src/static-skills/pulse.md`: reforzar el guardado progresivo — instrucción explícita de guardar con `pulse memory --update` INMEDIATAMENTE después de cada tema explicado, incluyendo topics vistos, lastSession, y next-step cuando aplique
- [x] 2.4 En `src/static-skills/pulse.md`: agregar lógica de next steps por nivel — después de resolver la pregunta, sugerir siguiente tema no visto consultando `topics` en memoria, con mensaje motivador

## 3. Actualizar referencias internas

- [x] 3.1 En `src/core/skill-index.ts`: cambiar filtro `s.id !== 'cc-tutor'` a `s.id !== 'pulse'`
- [x] 3.2 En `scripts/generate-fallback-skills.ts`: cambiar key `'cc-tutor': 'cc-tutor.md'` a `'pulse': 'pulse.md'` en `STATIC_CONTENT_FILES`, y cambiar condición `def.id === 'cc-tutor'` a `def.id === 'pulse'`
- [x] 3.3 En `src/commands/greet.ts`: actualizar `WELCOME_MESSAGE` — cambiar `/cc-tutor` a `/pulse` y "cc-tutor skill" a "pulse skill"
- [x] 3.4 En `src/commands/memory.ts`: cambiar mensaje "Start a session with the cc-tutor skill" a "Start a session with /pulse"

## 4. Tests

- [x] 4.1 Actualizar tests existentes del skills-registry para verificar que `pulse` existe con `disableModelInvocation: false` y que no existe `cc-tutor`
- [x] 4.2 Actualizar tests del skill-index para verificar que excluye `pulse` (no `cc-tutor`) del índice generado
- [x] 4.3 Verificar que `npm run build` compila sin errores
- [x] 4.4 Verificar que `npm test` pasa todos los tests

## 5. Regenerar fallback y verificar

- [x] 5.1 Ejecutar `npm run build:skills` para regenerar `skills-fallback/` con la skill `pulse` en vez de `cc-tutor`
- [x] 5.2 Verificar que `skills-fallback/pulse/SKILL.md` existe y contiene el frontmatter correcto (`name: pulse`, sin `disable-model-invocation`)
- [x] 5.3 Verificar que `skills-fallback/cc-tutor/` ya NO existe
- [x] 5.4 Ejecutar `pulse init --force --yes` en un proyecto de prueba y verificar que `.claude/skills/pulse/SKILL.md` se instala correctamente

## 6. Actualizar documentación

- [x] 6.1 En `README.md`: cambiar todas las referencias de `cc-tutor` a `pulse` (tabla de skills, ejemplos, sección contributing)
- [x] 6.2 En `README.md`: actualizar la descripción de la skill en la tabla de skills para reflejar el nuevo rol (compañero + tutor + motivador)
