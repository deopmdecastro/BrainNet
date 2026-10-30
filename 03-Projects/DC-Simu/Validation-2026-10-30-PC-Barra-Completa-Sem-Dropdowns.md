---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_BUILD_OK_UI_SMOKE_PENDING
created: 2026-10-30
updated: 2026-10-30
tags: [dc-simu, toolbar, tablet, pc, paridade, ui, ux]
---
# PC e tablet com a barra completa (sem dropdowns de telemóvel)

## Pedido

O tablet devia abrir igual ao PC, e não o contrário. No PC a barra aparecia como num tablet/telemóvel, com as ferramentas escondidas em menus «Ferramentas / Painéis / Mais» (dropdowns).

## Causa

A paridade de 2026-10-30 ([[Validation-2026-10-30-Inspecao-Plataforma-Tablet-Barras]]) deixou dois gatilhos de barra compacta que também apanhavam o PC:

1. `Toolbar.tsx`: `useNarrowMenu('(max-width: 1279px) …')` — qualquer janela de PC abaixo de 1280 px (ecrãs com escala 150 %/175 %, janelas não maximizadas) recebia o layout de telemóvel.
2. `useOverflowCompact` (`ui/toolbarKit.tsx`): compactava a barra sempre que a medição de transbordo desse > 1 px, o que acontecia em ecrãs de 1280–1500 px. O mesmo no editor de componentes 3D (`ComponentEditor3D.tsx`, limite de 1024 px).

## Alteração

- `Toolbar.tsx`: `compactBar` só em telemóvel (`(max-width: 743px)` ou `PHONE_TOUCH_QUERY`); removida a compactação por transbordo.
- `ComponentEditor3D.tsx`: mesma regra (`COMPACT_VIEW_QUERY`), sem `useOverflowCompact`.
- Em PC e tablet a barra completa mostra todas as ferramentas; o que não cabe desliza na horizontal com a barra de deslocamento padrão (CSS `clean-mode.css`, `nowrap` + `overflow-x:auto`), nada fica inacessível.
- O tablet continua a receber `width=1280` por meta viewport, por isso vê o mesmo layout que o PC.
- `scripts/tablet-parity-ui-smoke.mjs`: passa a exigir ausência de `.dc-toolbar-compact`/`.dc-compact-menu` em PC e tablet e que o excedente só deslize.

## Verificação

| Verificação | Estado |
| --- | --- |
| `tsc -b` | passou |
| `vite build` | passou |
| `test:tablet-parity-ui` (Playwright) | **não executado**: o ambiente sem rede não consegue descarregar o Chromium. Executar localmente com `vite preview` |

## Pendências

- Correr o smoke de paridade e confirmar visualmente em PC (1366, 1280, 1100 px) e tablet.
- Os painéis Ladder/GRAFCET ainda passam a gaveta abaixo de 1199 px em janelas de PC estreitas; decidir se também devem ficar fixos.
- `useOverflowCompact` ficou sem uso; remover em limpeza futura se ninguém o reutilizar.
