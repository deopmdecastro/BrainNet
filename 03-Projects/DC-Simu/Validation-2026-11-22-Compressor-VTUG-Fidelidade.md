---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED_PENDING_VISUAL_APPROVAL
created: 2026-11-22
updated: 2026-11-22
tags: [dc-simu, validação, compressor, maxxim, vtug, festo, pneumatica, fidelidade, capas, biblioteca]
---

# Validação 2026-11-22 — Compressor Maxxim 24 L e ilha Festo VTUG fiéis ao produto

## Âmbito

Os dois componentes desenhados (não-GLB) ainda crus — **airCompressor** (compressor Maxxim 24 L, referência visual image-1..3) e **pneumaticManifold** (ilha Festo VTUG, image-4..5) — reconstruídos com fidelidade de produto real, mais o alinhamento das capas da biblioteca e o levantamento dos restantes componentes desenhados.

## Problema

- `PneumaticManifold3D` era uma massa cinzenta de caixas sem identidade de produto (contraste com a foto Festo VTUG: placas pretas, tampas azuis, racores nickel, módulo IO, calha DIN).
- `AirCompressor3D` não tinha composição de produto (sem carenagem, sem tira de especificações, roda, para-lamas, mangueira trançada, tubo de cobre, manómetros, etc.).
- `airCompressor` usava `hmiScreenSizeMm` (280×200×150) em vez da dimensão física do produto.
- As capas da biblioteca não refletiam a geometria nova (sem caminho de captura para estes tipos procedurais).

## Alterações

### `src/three/pneumaticsModel.ts`
- `airCompressor`: `hmiScreenSizeMm` (280×200×150) → `AIR_COMPRESSOR_SIZE_MM` = 520×420×280 mm (comprimento × altura × largura da ficha). A propriedade `hmiScreenSizeMm` mantém-se para os tipos que a usam (manifold incluído — 260×120×180 mm).

### `src/three/PneumaticsDevices3D.tsx` — reescrita dos dois componentes
- **`PneumaticManifold3D`** (API preservada: `c`, `position`, `onToggleStation(idx)`; env vars `station${1..4}On`/`Manual`): calha DIN anodizada; 4 placas pretas de alumínio em relevo com parafusos, marcas de série e identificadores 1–4 em vermelho; fatias cinzentas intermédias com um furo de montagem; tampas azuis Festo (base escura + disco + anel + pino de comando); bloco terminal lateral (LEDs ligados, etiqueta "4 × 3/2 · 24 V DC", DIP); racores nickel 2× nas faces (base, pé em rampa com bloco hexagonal e anel) + 2×5 mm nas placas (anel preto, hex, tubo polido); módulo IO frontal (etiqueta "M12 · FESTO", LED verde, conector M12); etiquetas IEC P1·P2·A1·A2; dupla de agulhas em rodamoscas.
- **`AirCompressor3D`** (API preservada: `c`, `position`, `onToggleRun`, `onToggleCover`; env vars `running`, `coverOpen`, `tankPressureBar`, `outletPressureBar`): perfil de carenagem estilo SMC VM100 (ExtrudeGeometry com chanfro, bezel, grelhas, decalques verticais) + tira de especificações rotativa sobre o cilindro ("1.8 | 116 | 24 HP PSI LT"); tanque em azul-carregador com costura, selo "8 Bar" e logótipo MAXXIM em dupla camada; roda com oito raios, cubo hexagonal latão e anel ocre (alinhada com o meio do para-lamas, toro a 96 mm do eixo, sem interseção com o pé) + para-lamas azul inclinado sobre a roda; perna inclinada com pé articulado fechando o vão; bomba de cabeça dupla aletada com selo vermelho, volante azul e cobre; mangueira trançada em arco + tubo de cobre entre tanque e carenagem; dois manómetros com aro branco, mostrador `GaugeFace`, ponteira vermelha e central hex latão; nó vermelho com solenoides de ouro; acoplador latão com canal verde; caixa de pressostato preta com etiqueta AVISO, botão vermelho e LED vivo; puxador diagonal com sapatas; esgotamento latão e tampão de enchimento.
- Interações: clique-duplo na carenagem → `onToggleCover`; clique-duplo no pressostato → `onToggleRun`; LED vermelho acende quando `running`.

### Pipeline de captura de capas (comunicação entre subsistemas)
- **NOVO `src/three/proceduralKinds.ts`**: predicado partilhado `hasProceduralCapture(type)` — `conduits`, `wireTray`, `hydraulicFlowMeter`, `waterSupplyBox`, `airCompressor`, `pneumaticManifold`, `pneumaticTee`, `pneumaticUnion`, `pneumaticElbow`, `pneumaticY` (junções agora incluídas), reexportado por `proceduralCaptureObject`.
- `src/three/proceduralCaptureObject.tsx`: o `Snapshot` R3F renderiza os novos tipos; `createProceduralCaptureObject` tem ramo partilhado.
- `src/three/componentTurntable.ts`: `prepareObject` usa `hasProceduralCapture` (a lista `type === 'conduits' || …` duplicada foi eliminada).
- `src/schematic/cad3DImage.ts`: `getCad3DImage` tem captura 3D para os tipos procedurais (antes: `null` → "Sem modelo CAD").

### Capas da biblioteca regeneradas (`public/component-covers/`)
- `airCompressor`, `pneumaticManifold` e `pneumaticTee`, `pneumaticUnion`, `pneumaticElbow`, `pneumaticY` (placeholders manuais substituídos por captura real 3/4, fechando a pendência de [Validation-2026-11-22-Unioes-PushIn-Entrada-Reservatorio](Validation-2026-11-22-Unioes-PushIn-Entrada-Reservatorio.md)) — comando `COVERS_CHANNEL=bundled COVERS_URL=http://127.0.0.1:5207 node scripts/build-component-covers.mjs --only <tipos>`.

### Correção de dimensões
- Bug: `pneumaticComponentSizeMm('airCompressor')` devolvia 280×200×150 mm → objetos pequenos demais no Painel 3D (`terminal3D.ts:109`) e turntable. Agora 520×420×280 mm.

### Ferramentas de regressão (novo)
- `scripts/pneumatics-fidelity-ui-smoke.mjs` (+ entrada `test:pneumatics-fidelity-ui` em `package.json`): Playwright sobre o `panelFixture` — posiciona os dois componentes, valida a contagem de malhas e ausência de erros de runtime, captura frente+isométrico e falha se as capturas não forem estáveis (`animation-frame-equality`). Evidências: [dc-simu/docs/validation/compressor-vtug-fidelity](dc-simu/docs/validation/compressor-vtug-fidelity) (4 PNG + `results.json`).

## Levantamento — restantes componentes desenhados (não-GLB)

Folha de contato capturada com o mesmo fixture: `pneumaticFrl`, `pneumaticValve52`, `pneumaticCylinder`, `pneumaticVacuumCup`, `electricCylinderEpcs`, `pneumaticGuidedCylinder`, `hydraulicValve`, `hydraulicTee`, `waterSupplyBox`, `hydraulicFlowMeter`, `floatSwitch`, `waterPump`, `waterTank` — **todos já com nível de fidelidade de produto** (etiquetas de fabricante, materiais PBR por `cadSurface`/`catalogMaterials`, decalques). Os únicos crus eram o compressor e a ilha VTUG, agora reconstruídos.

## Resultado dos testes

- `npx tsc -b --noEmit` limpo.
- `npm run test:ci:fast` = 19/21 OK — falham `test:terminal-geometry` e `test:terminal-seat`, pré-existentes (confirmadas com `git stash`).
- `npx tsx scripts/cover-version-smoke.ts` = ok.
- `scripts/build-component-covers.mjs --check`: apenas as 4 capas do baseline em falta (`buttonNO`, `buttonNC`, `selector2`, `selector3`).
- `npm run build` não completa no sandbox de 2 GB (OOM do vite em `transforming…` no baseline e na árvore alterada — limitação ambiental; o `tsc -b` do mesmo comando passa). O pipeline CI de 7 GB constrói normalmente.
- `npm test` do cofre: 0 falhas; `npm run check` mantém o baseline de 105 erros (links `./dc-simu/…` que resolvem com o submódulo verificado, frontmatter de READMEs de evidências, 2 links do skill gsap) + os `dc-simu/docs/validation/compressor-vtug-fidelity/…` desta nota (mesmo padrão das validações anteriores; resolvem com o submódulo atualizado).

## Ficheiros

- `dc-simu/src/three/PneumaticsDevices3D.tsx` (reescrita `AirCompressor3D`, `PneumaticManifold3D`)
- `dc-simu/src/three/pneumaticsModel.ts` (dimensões `airCompressor`)
- `dc-simu/src/three/proceduralKinds.ts` (NOVO)
- `dc-simu/src/three/proceduralCaptureObject.tsx`, `dc-simu/src/three/componentTurntable.ts`, `dc-simu/src/schematic/cad3DImage.ts` (pipeline de captura)
- `dc-simu/public/component-covers/` (6 tipos regenerados)
- `dc-simu/scripts/pneumatics-fidelity-ui-smoke.mjs`, `dc-simu/scripts/lib/panel-fixture.mjs` (partilhado com o smoke mecânico)
- `dc-simu/docs/validation/compressor-vtug-fidelity/` (4 PNG + results.json)

## Referências

- [Validation-2026-11-22-Unioes-PushIn-Entrada-Reservatorio](Validation-2026-11-22-Unioes-PushIn-Entrada-Reservatorio.md)
- [Design-Principles](Design-Principles.md) (capas = fotografia de produto 3/4; mesmo estúdio em capas/esquema/Painel 3D)
- Imagens de referência do pedido: renders compressor Maxxim 24 L e foto real (1.8 HP · 116 PSI · 24 LT · 8 Bar); render ilha Festo VTUG e foto real do produto.

## Estado

- [x] Dimensão física do compressor corrigida
- [x] `PneumaticManifold3D` com identidade Festo VTUG
- [x] `AirCompressor3D` com identidade Maxxim 24 L (inclui roda/para-lamas alinhados, tira de especificações, perna com pé)
- [x] Capas da biblioteca regeneradas para os 6 tipos (fotografia 3/4 transparente)
- [x] Regressão UI: `test:pneumatics-fidelity-ui` (frentes + isométrico estáveis)
- [x] Levantamento dos restantes componentes desenhados (não-GLB): sem outros crus
- [ ] Aprovação visual
