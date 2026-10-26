---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, qa, grafcet, ux]
---
# GRAFCET — círculos de ligação sempre visíveis nas etapas — 2026-10-26

## Pedido
Em cada face da etapa deve aparecer um círculo; ao clicar e arrastar, uma linha liga a outro elemento (referência: etapas 1, M2 e 3 com círculos no topo, na base e à direita).

## Estado anterior
Os portos já existiam (`renderWirePort`: entrada no topo, saída na base, porto de ação à direita), mas só eram desenhados com a etapa selecionada, em hover ou com a ferramenta Ligar. Sem hover (telemóvel), não eram descobríveis.

## Alteração
- Portos das etapas (inclui macroetapas e etapas iniciais) sempre visíveis em modo de edição, fora da simulação e fora do modo de deslocar vista.
- Estilo discreto em repouso (círculo pequeno vazado); realçado ao selecionar, passar, focar, usar Ligar ou durante um fio.
- Lógica de arrasto, compatibilidade e criação de transições mantida (`startQuickWire`, `hitWireTarget`, `completeWire`).

Código: `src/grafcet/GrafcetEditor.tsx` (grupo `grafcet-step-ports`) e `src/styles/grafcet-construction.css`.

## Evidência
| Verificação | Resultado |
| --- | --- |
| `tsc -b`, `vite build` | passam |
| `npm test`, `test:grafcet-dialogs`, `test:grafcet-links`, `test:grafcet-signals`, `test:pinch`, `test:style` | passam |
| BrainNet `npm test`, `npm run check` | passam |

## Pendente
- Verificação visual em browser real (sem Chromium no sandbox; `test:grafcet-construction-ui` não executado). Ver UI-VISUAL-01.
- Porto da face direita liga a ações soltas, não a etapas; a face esquerda não tem porto. Decidir se se pretende outro comportamento.
- Deploy na Vercel não executado por mim.
