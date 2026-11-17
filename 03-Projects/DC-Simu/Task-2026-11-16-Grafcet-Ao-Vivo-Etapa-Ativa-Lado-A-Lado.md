---
project_id: BN-DCSIMU-001
type: task
status: COMPLETED
created: 2026-11-16
updated: 2026-11-16
tags: [brainet, dc-simu, task, grafcet, live, ui-ux]
---

# Task — 2026-11-16 — GRAFCET ao vivo no painel (foco na etapa ativa + dois GRAFCETs lado a lado)

## Contexto
No painel `Propriedades → GRAFCET` (gaveta inferior no telemóvel em `3D Realista` e `Esquema IEC`, e painel lateral direito em tablet/PC), o diagrama tinha ficado colapsado a `0 px` no telemóvel e não acompanhava automaticamente a etapa ativa nem apresentava dois GRAFCETs concorrentes lado a lado.

## Alterações efetuadas (`dc-simu` — release `#198` / `mwkl47cs`)
1. **`src/grafcet/liveFollow.ts`** (novo):
   - `resolveLiveGrafcetUnits(program)`: identifica automaticamente unidades independentes de GRAFCET — páginas `program.charts` (`G0`, `G1`, `G2`…), títulos `G<n> - …` na mesma página e sub-GRAFCETs topologicamente desconexos na mesma página (mantendo divergências/convergências em `E` numa única unidade).
   - `computeLiveUnitStatuses(...)` e `pickVisibleLiveUnits(...)`: calcula as etapas ativas (`X<n>`) e o alvo de foco por unidade; mostra 1 GRAFCET a toda a largura quando há 1 ativo, **2 GRAFCETs lado a lado** quando 2 (ou mais, priorizando os que avançaram e mudaram mais recentemente) estão ativos em simultâneo, e permite fixar manualmente qualquer `G<n>`.
2. **`src/grafcet/GrafcetLiveDock.tsx`** (novo) e **`src/components/RightDockPanel.tsx`**:
   - Devolve a visualização SVG real do GRAFCET no separador `GRAFCET` em PC, tablet e telemóvel (`3D Realista` / `2D` e `Esquema IEC`).
   - Botão permanente **`GRAFCET completo`** no cabeçalho (e atalho por painel no modo lado a lado) que abre a vista completa do GRAFCET já posicionada na página ativa (`activeChart` sincronizado sem reiniciar a simulação em `RUN`, com modal de recurso quando embutido).
   - Faixa de uma só linha `Auto` + `G0`, `G1`, `G2`… com indicador da etapa ativa (`X1`, `X22`, etc.) em projetos com múltiplos GRAFCETs.
   - Rodapé com estado da simulação, etapas ativas (`X<n>`) e botão **`A seguir` / `Centrar` / `Ver tudo`** (arrastar ou fazer pinça pausa temporariamente o seguimento e a transição seguinte retoma automaticamente).
3. **`src/grafcet/GrafcetEditor.tsx`**:
   - Câmara ao vivo (`computeLiveView`) centrada na(s) etapa(s) ativa(s), respetivas ações associadas e transição de saída, com deslize suave (`.is-gliding`) a cada mudança de etapa.
   - Suporte a `subsetStepIds`, `followStepIds`, `autoFollow`, `recenterSeq`, `splitCompact`, `hidePreviewChrome`, `hideAnnotations` e `onManualView`, marcadores SVG de seta com `id` por instância (`useId`) para renderizar 2 diagramas lado a lado sem conflito, e elevação automática da legenda da etapa quando a primeira ação associada tem condição/temporização superior.
4. **`src/styles/grafcet-editor.css`** e **`src/styles/mobile-refine.css`**:
   - Grelha `.grafcet-live-grid.is-dual` (`repeat(2, minmax(0, 1fr))`) e regras flex específicas para `.schematic-sim-dock-phone` e `.cmd-dock` no telemóvel, eliminando o colapso a `0 px` e mantendo cabeçalho, diagrama(s) e rodapé 100 % visíveis sem corte nem overflow horizontal.
5. **`scripts/grafcet-live-dock-smoke.ts`** e **`package.json`**:
   - Novo teste automatizado `npm run test:grafcet-live-dock` integrado em `test:ci`.

## Validação
- `tsc -b` + bundle ESM + transformação Vite (1471 módulos): OK (0 erros).
- `npm run test:grafcet-live-dock`: 6/6 OK.
- `npm run test:style`: OK (`no-accent-border: ok`).
- `npx tsx scripts/commands-touch-smoke.ts`: 22/22 OK.
- `npm run test:landing-editor`, `npm run test:grafcet-examples`, `npm run test:grafcet-links`, `npm run test:grafcet-signals`, `npm run test:grafcet-dialogs`, `npm run test:pdf-export` (18/18), `npm test`: todos OK.
- Playwright visual e interativo (0 `pageerror`, `overflow: false`):
  - Telemóvel `430×932` (`Partida direta com emergência` em `RUN`): `X0` enquadrado com `H2 PARADO` a verde e deslize automático para `X1` (`KM1` + `H1 MARCHA`); arrasto manual → `Centrar` → retoma automática para `A seguir` na transição seguinte.
  - Telemóvel `390×844` (normal e expandido `.is-tall`) e Desktop `1440×900`: 2 GRAFCETs ativos lado a lado tanto em multi-página (*Estampagem*: `G0 · X1` ao lado de `G2 · X22 → X27`, `180×127 px` cada no telemóvel e `190×485 px` cada no desktop) como em 2 ciclos desconexos na mesma página (`G0 · X1` ao lado de `G1 · X11`); clique no atalho de `G2` abre o editor completo diretamente em `est-g2` mantendo `RUN`.
