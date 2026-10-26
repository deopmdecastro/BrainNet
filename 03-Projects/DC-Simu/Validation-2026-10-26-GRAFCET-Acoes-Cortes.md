---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, qa, grafcet, ux]
---
# GRAFCET — portos nas ações e linhas cortadas — 2026-10-26

## Pedido
1. Verificar que o ambiente está operacional.
2. Dar às ações os círculos de ligação em cada face (arrastar para ligar a outro elemento), como já existe nas etapas e nas transições.
3. Perceber porque as linhas que ligam etapas e transições aparecem cortadas (captura do utilizador: laço de retorno à esquerda e linha final em baixo terminam abruptamente na borda do diagrama).
4. Listar melhorias possíveis.

## Linha de base (antes de alterar)
`npm ci`, `tsc -b` e `npm run test:ci` passam em Node v22.22.2.

## Causa das linhas cortadas
O `<svg>` do diagrama tem `viewBox` igual a `0 0 largura altura`, e um `<svg>` embebido em HTML corta por omissão o que fica fora dessa caixa (`overflow: hidden`). A largura e a altura eram calculadas só a partir de etapas, transições soltas e ações soltas; os pontos de quebra das linhas (`linkBends`) não contavam. Laços de retorno e desvios que passam para lá desse retângulo (ou para coordenadas negativas) ficavam cortados na borda.

## Alterações (`src/grafcet/GrafcetEditor.tsx`)
- Os pontos de `linkBends` passam a contar para a largura/altura do diagrama.
- O `<svg>` passa a `overflow: visible` (a área visível continua limitada pelo canvas), por isso nada é cortado mesmo com coordenadas negativas.
- Ações soltas: portos `action-in` nas quatro faces (esquerda, direita, topo, base), sempre visíveis em edição, fora da simulação e fora do modo de deslocar vista; estilo discreto em repouso e realçado ao selecionar, passar, focar, Ligar ou durante um fio. Reutiliza `renderWirePort`, `startQuickWire`, `hitWireTarget` e `completeWire`.
- O fio parte da face escolhida (`PortRef.side`). Largar o fio de uma etapa (porto de ação) sobre qualquer face ou sobre o corpo da ação liga-a. O porto de ação da etapa fica marcado como compatível durante o fio.
- Removido o porto antigo (só visível na ferramenta Ligar, à esquerda).

## Evidência
| Verificação | Resultado |
| --- | --- |
| `npm run test:ci` antes da alteração | passa |
| `tsc -b`, `npm run build` depois | passam |
| `test`, `test:grafcet-links` (27), `test:grafcet-dialogs` (30), `test:grafcet-signals` (32), `test:pinch`, `test:style` | passam |

## Pendente
- Verificação visual em browser real: sem Chromium no sandbox (download do Playwright bloqueado). Ver UI-VISUAL-01. Confirmar no telemóvel que o laço de retorno já não é cortado e que os quatro portos da ação se arrastam bem.
- Enquadrar (`Ajustar`) e minimapa continuam a ignorar coordenadas negativas das quebras; tratar se o utilizador arrastar laços para fora do canto superior esquerdo.
- Deploy na Vercel não executado por mim.
