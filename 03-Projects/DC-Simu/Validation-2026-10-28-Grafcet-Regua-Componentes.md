---
project_id: BN-DCSIMU-001
type: validation
status: PARTIAL
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, grafcet, mobile, panels, ux]
---
# Validação 2026-10-28 · GRAFCET: régua de Componentes e setas do painel inferior

Commit da aplicação: `a641780` (dc-simu, `main`).

Origem: captura do telemóvel com o botão «Componentes» recolhido do GRAFCET e pedido para o alinhar com os outros painéis laterais.

| Sintoma | Correção |
| --- | --- |
| Recolhido, «Componentes» era um botão quadrado flutuante sobre o diagrama (≤ 1199 px), diferente da régua do Ladder, Esquema e editor 3D | Removidas as regras que o flutuavam (`grafcet-editor.css`). Passa a ser o `CollapsedPanelRail` padrão: régua vertical de 48 px, ícone + nome na vertical + seta, encostada à esquerda em toda a altura (`mobile-refine.css`, `:has(> .grafcet-toolbox-restore)` reserva 48 px ao corpo) |
| O inspetor do GRAFCET é uma gaveta no fundo até 800 px mas a seta apontava para os lados | `SidePanelHeader` ganhou `side="bottom"`: aberto aponta para baixo (recolher), fechado para cima (abrir). O GRAFCET usa `bottom` até 800 px e `right` acima |

Regra: **um painel recolhido usa sempre `CollapsedPanelRail`**; nunca um botão próprio. Setas: esquerda/direita para painéis laterais, cima/baixo para gavetas no fundo.

Verificações: `tsc`, `test:style`, `npm test` e `vite build` OK. **Render visual não verificado** (sem navegador no ambiente): confirmar a 390, 768 e 1024 px que a régua cobre a altura, que o diagrama e a gaveta ficam deslocados 48 px e que as setas trocam ao abrir/recolher.
