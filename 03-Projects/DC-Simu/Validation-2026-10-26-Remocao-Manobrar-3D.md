---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_PARTIALLY_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, ui, ux, esquema-3d, simulacao]
---
# Remoção de «Selecionar / Manobrar» no Esquema 3D — 2026-10-26

## Pedido

Remover a alternância Selecionar ↔ Manobrar. Manobrar controlos e clicar em botões só deve ser possível com a simulação iniciada.

## Implementação

Ficheiro `src/three/Panel3D.tsx` (DC-Simu):

- Removido o estado `operate` e o botão «Manobrar» do cartão de contexto da ferramenta.
- `interactive` passa a depender só de `simulationMode` (ferramenta Selecionar ativa e fora do editor de orientação de vistas).
- Cartão de contexto: «Selecionar» fora da simulação; «Simulação» quando está ativa. O texto «Clique nos controlos para os acionar» sem simulação foi retirado.
- Teste `scripts/editor3d-ux-ui-smoke.mjs` atualizado: confirma que o botão não existe, que a simulação ativa permite acionar o disjuntor e que sair da simulação volta à seleção.

## Evidência

| Verificação | Resultado |
| --- | --- |
| `npx tsc -b` | Sem erros |
| `npm test` (smoke de lógica) | Passa |
| `test:editor3d-ui` (Playwright) | Não executado: navegadores Playwright indisponíveis neste ambiente |

## Estado

| Item | Estado |
| --- | --- |
| Remoção do Manobrar | implementado |
| Teste UI atualizado | preparado, não executado |
| Aprovação pelo responsável | pendente |
| Deploy | não verificado |

Pendências (pedido mais amplo, ainda por fazer):
- uniformizar barras do Ladder e do GRAFCET com `src/ui/toolbarKit.tsx` (Toolbar e editor 3D já o usam);
- rever botões de simulação e atalhos entre editores;
- revogar o token GitHub partilhado nesta sessão.
