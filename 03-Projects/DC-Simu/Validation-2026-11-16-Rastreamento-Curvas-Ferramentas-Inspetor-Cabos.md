---
type: validation
status: VERIFIED_LOCAL
created: 2026-11-16
updated: 2026-11-16
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, cabos, curvas, inspetor, ui-ux, validation]
---

# Validação — Rastreamento de Curvas, Ferramentas de Construção e Inspetores de Cabos

## Resumo

Evolução integrada dos três pilares de cablagem do DC-SIMU (Esquema 2D, Vista 3D Realista, Esquema IEC e Editor de Componentes 3D), preservando o `wire-curves-v9`, a paridade PT-PT, o `Design-Principles.md` (zero cartões flutuantes sobre o canvas, zero bordas laterais de acento, bloqueio de edição em `RUN`/`PAUSA` segundo DC-ADR-086 e responsividade até `390 px`) e a compatibilidade integral com projetos existentes.

## Alterações implementadas (`dc-simu`)

1. **Rastreamento e geometria de curvas** (`src/schematic/wireGeometry.ts`, `src/three/wireGeometry3D.ts`, `src/admin/editor3d/wirePath.ts`, `src/project/nativeWireCurves.ts`, `src/project/nativeMotorMeter.ts`, `src/project/nativeProjects.ts`):
   - Concordâncias quadráticas `Q` suavizadas em cotovelos ortogonais/Manhattan (`roundedPath` + `sampleRoundedPolyline`), spline C¹ no modo `arc` e concordância limpa no modo `direct`.
   - Deslizamento de troços ortogonais em 2D (`wireSegmentHandles`, `slideOrthoSegment`), limpeza/alinhamento de pontos (`orthogonalizeWaypoints2D`, `simplifyWaypoints2D`), encaixe assistido (`snapDraftPoint2D`) e projeção de acessórios na curva (`fractionAtClosestPoint`).
   - Em 3D: preservação de `wire-curves-v9`, prolongamentos axiais nos bornes, métricas adaptativas de curvatura (`wireCurveMetrics3D` com `Rmín` recomendado pela IEC 60204-1), inserção intermédia (`sampleCurveInsertPoint3D`), `orthogonalizeWaypoints3D`, `simplifyWaypoints3D`, `snapControlPoint3D`, `buildDraftPreviewPoints3D` e avaliação de curvatura no Editor de Componentes (`evaluateWireCurvature`, `orthogonalizeTestPoints`).

2. **Ferramentas de construção e edição de cabos** (`src/three/WireDraw3D.tsx`, `src/three/Panel3D.tsx`, `src/schematic/SchematicView.tsx`, `src/store/useSimStore.ts`, `src/types/index.ts`, `src/ui/wireActionSlot.ts`):
   - Modos **Guias 90° / calha** (`orthoSnap`) e **Ligação contínua** (`chainMode`), encaixe magnético a calhas e eixos `X/Y/Z` e cartão de telemetria em direto no painel lateral (`WireDraftSideCard` via `wireDraftSlot`).
   - Edição 3D com contas intermédias de subdivisão (`WireMidpointBead3D`), **+ Ponto**, **Remover**, **Alinhar 90°**, **Simplificar**, **Auto 3D**, **Mover cabo**, **Religar/Soltar** por ponta e edição numérica `X/Y/Z` em `mm`.
   - Novas ações protegidas contra `RUN`/`PAUSA` e bloqueio do cabo: `reverseWire`, `copyWireToDefaults`, `selectBundleWires`, `applyWireEndPreset` (incluindo cores DIN 46228), `stampWireEndMarkers` e `refineWireCurve2D`.

3. **UI/UX dos painéis de inspeção e criação** (`src/ui/WireOptions.tsx`, `src/components/Sidebar.tsx`, `src/commands/CommandsSidebar.tsx`, `src/admin/editor3d/WireInspector.tsx`, `src/admin/editor3d/wireStyle.ts`, `src/components/SelectionBar.tsx`, `src/components/Toolbar.tsx`, `src/styles/wire-options.css`, `src/styles/panel3d-editor.css`):
   - Espécime SVG em tempo real (`CableSpecimen`) com bainha, veias decapadas HD 308 S2 e ponteiras reais, indicadores `Secção`, `Ø`, `Rmín` e `Iz` (IEC 60204-1), 4 modos de traçado, 13 cores + `AUTO`, 9 secções (`0,5–16 mm²`), formações multicondutor e 11 terminais.
   - Inspetor do cabo reorganizado em secções colapsáveis com cartões **A ⇄ B**, alternância automática entre pontos 2D e **Curva 3D**, gestão de chicotes e mapa visual de anilhas/espiral/mangas (`CableAccessoryMap`).
   - Inspetor IEC renovado com normalização de cores hexadecimais legadas para nomes PT-PT, navegação aos símbolos A/B e **Repor alinhamento central** (`wire.mid`).

## Evidências de verificação

- `tsc -b` (`0` erros), `npm run test:style` (`no-accent-border: ok`) e bundle ESM `esbuild --splitting` (`142` chunks, `0` avisos).
- `13/13` suites `tsx` verdes (incluindo `smoke.ts`, `wire-lacing-smoke.ts` e paridade do worker de roteamento 3D).
- Playwright UI: `wire-options-panel-ui-smoke.mjs` (`27/27`, contagem de terminais atualizada para `11` com `ferruleDouble`), `commands-wire-color-ui-smoke.mjs` (`8/8`), `selection-bar-ui-smoke.mjs` (`27/27`), `sim-select-3d-ui-smoke.mjs` (`18/18`), inspeção visual e responsividade sem overflow (`0 px`) em `390×844`, `768×1024`, `1024×768` e `1440×900`, com `0` erros JS/consola.
