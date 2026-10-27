---
project_id: BN-DCSIMU-001
type: validation
status: ACTIVE
created: 2026-10-27
updated: 2026-10-27
tags: [brainet, dc-simu, ui, ux, canvas, barras-de-ferramentas, grafcet, esquema, adr-060]
---
# Validação 2026-10-27 — Sem cartões sobre o canvas (Esquema, 3D e GRAFCET)

Trabalho pedido por Deogracia de Castro, com três capturas de ecrã como prova: «Remover estes cards no
canvas — não quero que tenha esses cards nos canvas, fica nas barras de ferramentas apenas.»
(`IMG_5224.jpeg`: cartão de zoom «− 22 % + · Ajustar · Mapa»; `IMG_5225.jpeg`: coluna de quatro ícones
redondos — ajuda, enquadrar, cubo, estetoscópio; `IMG_5226.jpeg`: cartão largo «Cabo» com um botão «?»).
Executado no submódulo `03-Projects/DC-Simu/dc-simu`.

## Como foi observado

Chromium headless (Playwright) a 1440 × 900 e 390 × 844, `localStorage` descartável, `/api/*` e
`/version.json` bloqueados, projeto criado pelo diálogo do painel. Medições por `getBoundingClientRect`
e capturas em `/home/user/work/cards/final-{390,1440}-{esquema,grafcet}.png`.

## Problemas encontrados (antes)

| # | Onde | Observação |
| --- | --- | --- |
| 1 | Esquema 2D | Cartão `dc-wire-guide` («Desenhar fio») sobre o desenho, a repetir a ferramenta Cabo já escolhida. |
| 2 | Esquema 2D | Faixa `.schematic-hud` com malha, zoom e «Ajustar» por cima do esquema. |
| 3 | Painel 3D | Coluna inferior esquerda de quatro botões redondos (dicas, enquadrar, editar componente, diagnóstico) e cartão de contexto da ferramenta. |
| 4 | Painel 3D | Cartão de comando do componente selecionado (`.component-view-command`) e botão de dicas solto (`.panel3d-hint-toggle`). |
| 5 | GRAFCET | HUD `.grafcet-canvas-hud` com zoom, «Ajustar», «Mapa» e as estatísticas do programa. |

## Alterações implementadas

### `dc-simu`

- `src/ui/simUi.ts` — estado partilhado das dicas e do enquadramento: `hints`/`toggleHints`,
  `canvasHint`/`setCanvasHint` e `requestCanvasAction('fit' | 'focusSelection')` (evento
  `dcsimu:canvas-action`) com o atalho `useCanvasAction(handler)`.
- `src/grafcet/grafcetBus.ts` — o mesmo padrão para o GRAFCET: `minimapOn` (por omissão desligado),
  `stats` e as ações `toggleMinimap`/`fitView`.
- `src/schematic/SchematicView.tsx` — removidos `.schematic-hud`, o cartão `dc-wire-guide` e a coluna
  de ícones; o canvas publica a dica da ferramenta ativa (`Cabo: clique nos bornes…`,
  `Sonda: …`, `Apagar: …`) e obedece ao pedido de enquadramento. Os atalhos continuam no
  `ShortcutHelp editor="Esquema"`.
- `src/three/Panel3D.tsx` — o mesmo: dica publicada na barra, enquadramento por pedido, sem cartões
  `.panel3d-tool-context`, `.panel3d-hint-toggle` nem `.component-view-command`.
- `src/components/ComponentViewEditor.tsx` — removido o cartão de comando do canvas.
- `src/grafcet/GrafcetEditor.tsx` — removido o HUD flutuante; «Ajustar» e «Mapa» passam para a barra
  (`aria-label="Ajustar o diagrama à janela"` e `aria-label="Minimapa"` com `aria-pressed`), as
  estatísticas vão para a faixa de dicas da barra.
- `src/components/Toolbar.tsx` — novas entradas: editar componente 3D, editar bornes, dicas do canvas,
  enquadrar a seleção, ajustar o diagrama, minimapa e as estatísticas do GRAFCET.

### Verificações

- `npm run test:sem-cartoes-canvas` (novo, 29 verificações) — nenhum dos sete seletores de cartão tem
  área a 1440 px e a 390 px, com seleção e com a ferramenta Cabo; a barra mostra Componente, Bornes,
  Dicas, Enquadrar e a dica `Cabo:`; no GRAFCET «Ajustar» e «Mapa» estão na barra e o minimapa não
  aparece sem ser pedido; zero exceções de JavaScript.
- `npm run test:grafcet-ui`, `npm run test:toolbar-ui`, `npm run test:wire-options-ui`,
  `npm run test:barras-padrao` e `npm test` — verdes; `npx tsc --noEmit` sem erros.
- Capturas confirmadas a olho: sem cartões em nenhuma das quatro vistas; a barra do GRAFCET mostra
  «Ajustar», «Mapa» e `x etapas · y transições · z ações`.

## Decisão registada

[[Decision-Log|DC-ADR-060]]: nenhum comando flutua sobre um canvas; o que não cabe na largura da barra
vai para o `ToolMenu` (ADR-046).

## Pendências

- `grafcet-ui-smoke` precisou de três ajustes no próprio teste (botão «Organizar» tapado pelo painel de
  componentes, abertura do painel só quando fechado e o rótulo «Recolher ferramentas (Ctrl+B)»): a
  falha era do teste, não da barra.
- Restam regras CSS sem uso dos componentes removidos (`grafcet-editor.css`, `clean-mode.css`,
  `panel3d-editor.css`), a limpar sem alterar a aparência.
- O cartão largo «Cabo» de `IMG_5226.jpeg` fica coberto pela remoção do `dc-wire-guide`; confirmar em
  produção depois do próximo deploy.

[[Backlog|Pendências]] · [[Decision-Log|Decisões]] · [[Project-Brief|Briefing]].
