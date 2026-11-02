---
project_id: BN-DCSIMU-001
type: validation
status: VALIDATED
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, landing, performance, 3d, motor, glow, cabos, demo, lock, ci, validation]
---
# Validação 2026-10-29 — Landing leve, motor metálico sem card, cabos 3D, brilho no vidro, vistas e bloqueio da demo

Relacionado com [[Task-2026-10-29-Landing-Sim-Polish]], [[Design-Principles]] e [[Testing-Plan]].

**Commit `dc-simu`:** `5be6090` (`main`, push concluído · carimbo `#100`)

## Resumo executivo
Foram auditados, corrigidos e validados todos os pontos funcionais, visuais e de integração contínua entre o cofre **BrainNet** e o repositório **dc-simu**:

1. **Saúde operacional e CI (GitHub Actions):**
   - Corrigido o modelo da botoneira de emergência com chave (`emergencyButtonKeyP20ACR`) em `src/three/modelPaths.ts` e `src/three/actuatorHead.ts` (estava a apontar para `emergencyButtonP20AMR.glb` em vez de `emergencyButtonKeyP20ACR.glb`, fazendo falhar `test:terminal-geometry`).
   - Harmonizados `Toolbar.tsx`, `accountApi.ts` (`isLoopbackOfflineHost`) e os testes Playwright (`grafcet-ui-smoke.mjs`, `logo-editor-ui-smoke.mjs`), além de incluir `test:native-sim`, `test:native-wires-3d`, `test:landing-hero`, `test:landing-editor` e `test:landing-demo` em `test:ci`.
2. **Performance e leveza da Landing Page:**
   - Separação em *lazy chunks* (`React.lazy` + `Suspense`) de `LandingMotorHero`, `LandingEditorShowcase` e `InteractiveComponentThumb` em `src/landing/Landing.tsx` (`Landing.js` reduzido para `35,34 kB` / `7,45 kB` gzip).
   - `componentTurntable.ts` e `componentThumbnails.tsx` refatorados para reutilizar **um único contexto WebGL offscreen** partilhado, renderizando 1 fotograma estático para as miniaturas da biblioteca e gerando os 12 fotogramas de rotação apenas sob interação (`hover`/`focus`), com `IntersectionObserver` *latched* (`LandingGlbThumb`).
   - `Panel3D.tsx` com `frameloop="never"` fora do ecrã, `frameloop="demand"` em repouso (`STOP`) e `frameloop="always"` apenas durante `RUN` ou janelas curtas de sombras (`ShadowsOnDemand`).
3. **Motor 3D na primeira tela (Hero) — maior, metálico realista e sem cartão:**
   - Reconstrução de UVs por projeção cúbica (`ensureProjectedUvs`) e acabamento PBR de esmalte vermelho industrial SEW + aço maquinado (`motorEditorTextures.ts`) com iluminação `RoomEnvironment` em `LandingMotorHero.tsx` e `Panel3D.tsx`.
   - Enquadramento `FILL = 0.90` em `FitIsoCamera`, altura responsiva `clamp(390px, 44vw, 660px)` e remoção total de qualquer cartão, borda ou sombra de caixa (`.dx-hero-motor` com `background: transparent; border: 0; box-shadow: none`).
4. **Demonstração do simulador bloqueada contra edição e eliminação:**
   - Em `demoMode`, `SelectionBar` fica oculta, `Toolbar` substitui qualquer ícone `+` ambíguo no telemóvel pelo botão explícito `Abrir` / `Editor`, `App.tsx` oculta gavetas de biblioteca/propriedades, e `GrafcetEditor`, `LadderEditor`, `SchematicView`, `Panel3D` e `useSimStore` bloqueiam todas as mutações estruturais (apagar, mover, rodar, duplicar, editar etapas/transições/ações ou desenhar cabos), mantendo ativos apenas `RUN`/`STOP`, comutação de vistas e atuação de botões na simulação.
5. **Organização de cabos 3D e proteção absoluta da chapa de montagem:**
   - Encaminhamento ortogonal 3D em calhas horizontais entre filas DIN (`wireGeometry3D.ts`), saídas cardinais nos bornes traseiros/frontais, exclusão de calhas DIN (`!box.rail`) da caixa de obstáculos para evitar desvios diagonais, reserva volumétrica 3D completa do motor (`HARD_END_SKIRT = 0.58`) e *clamp* incondicional à frente da face frontal da chapa (`z >= wireFrontLimit`, com `z mínimo = -0.182 >= -0.250` e `cableCurve3D` protegido contra *overshoot* de Catmull-Rom).
6. **Vistas no simulador (motor isométrico apenas; restante em vista frontal):**
   - `Panel3D.tsx` e `SchematicView.tsx` abrem em vista frontal (`FRENTE 0° · 0°`), com `fitDistance` ajustado também ao FOV vertical para não cortar a base do motor em ecrãs largos.
   - `componentOrientation.ts`, `terminal3D.ts`, `panelBounds.ts` e `useSimStore.loadJSON` aplicam orientação isométrica (`{ x: 14, y: -35, z: 0 }`) **exclusivamente ao motor** (`motor3ph` / `motor1ph`), mantendo todos os restantes aparelhos em vista frontal (`0°, 0°, 0°`).
7. **Brilho das lâmpadas encostado à lente de vidro:**
   - `CatalogComponent3D.tsx`, `stateAnimator.ts`, `Panel3D.tsx` e `LandingShowcase.tsx` posicionam o sprite `GlowHalo` diretamente encostado à superfície exterior da lente (`surfaceOffset = +1,5 mm`, `depthWrite = false`), eliminando halos soltos no ar.

## Verificação técnica executada

### DC-Simu (`03-Projects/DC-Simu/dc-simu`)
- `npx tsc -b --noEmit`: **0 erros**.
- `npm run test:style`: **PASS** (`no-accent-border: ok`).
- `npm run test:terminal-geometry` (20 modelos, 142 bornes) & `npm run test:emergency-actuator` (42 verificações): **PASS**.
- `npm run test:native-wires-3d`: **5/5 PASS** (zero colisões com motor, `z mínimo -0.182 >= -0.250`, ponteiras e waypoints à frente da chapa, apenas motor isométrico).
- `npm run test:glow`: **32/32 PASS** (brilho encostado à lente em sinalizadores e botoneiras luminosas).
- `npm run test:landing-hero` (18/18), `npm run test:landing-editor` (63/63), `npm run test:landing-demo` (29/29) & `npm run test:motor` (13/13): **PASS**.
- `npm run test:server`: **177/177 PASS**.
- Playwright UI E2E contra servidor real (`http://127.0.0.1:5173`):
  - `npm run test:grafcet-ui`: **104/104 PASS**.
  - `npm run test:grafcet-construction-ui`: **18/18 PASS**.
  - `npm run test:logo-editor-ui`: **62/62 PASS**.
  - Inspeção visual em desktop (`1440×900`) e telemóvel (`390×844`) confirmando motor hero metálico grande sem cartão, demo sem controlos de apagar/editar em Esquema 3D e GRAFCET, cabos arrumados sem atravessar a chapa, brilho `H2` colado à lente e apenas `M1` em vista isométrica.

### BrainNet (raiz do cofre)
- `npm test`: **18/18 PASS**.
- `npm run check`: **0 erros** (frontmatter YAML normalizado e wikilinks verificados).
