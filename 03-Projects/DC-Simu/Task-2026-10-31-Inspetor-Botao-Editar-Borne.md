---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, inspetor, bornes, ui, sidebar]
---

# Botão «Editar» do borne cortado no inspetor

## Pedido
No painel Propriedades do componente, o botão **Editar** de cada borne aparecia truncado («Ed»).

## Causa
A linha do cabeçalho era um único `flex` com input + LabelLibrary + Select `flex-1` + cor + Editar + remover. Em painéis estreitos o Select ocupava o espaço e o botão era cortado pelo overflow.

## Correção
- `Sidebar.tsx`: cabeçalho em `.dc-inspector-terminal-head` com `.dc-inspector-terminal-fields` e `.dc-inspector-terminal-actions`.
- `index.css`: campos com `min-width: 0`; ações `flex: none` e `white-space: nowrap` no Editar.
- `mobile-refine.css`: em ecrã estreito, ações numa segunda linha a largura total.

Commit dc-simu: `d4ffd93`.
