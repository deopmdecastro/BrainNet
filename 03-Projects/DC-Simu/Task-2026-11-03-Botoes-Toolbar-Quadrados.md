---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-03
updated: 2026-11-03
tags: [dc-simu, ui, toolbar, mobile, botoes, quadrado]
---
# Tarefa 2026-11-03 — Botões da barra quadrados (não retângulos)

## Pedido

Nos controlos da barra (GRAFCET / projeto no telemóvel): botões «esticados para cima» (retângulo vertical). Querer **quadrados**, não retângulos.

## Diagnóstico

Em modo compacto / toque grosso, várias regras fixavam `min-height` maior que `min-width`:

- `header-refine.css`: `.dc-toolbar-compact > .dc-seg > button` → 36×40
- abas de vista ≤600 px → 34×38
- transporte compacto em `mobile-refine.css` → min-width 36 com altura 40
- coarse: só `min-height: 36` nos `.dc-tool-btn` sem largura igual

## Correção

- Ícones só (undo/redo/ferramentas/transporte/vistas): `width = height`, `aspect-ratio: 1`, padding 0, centrados.
- «Simulação» e outros com texto (`dc-sim-tool`, `tm-trigger`) mantêm largura automática.
- Cabeçalho: `account-project-action` quadrado (10 px de raio); primary com texto continua largo.
- Alvo de toque ~36–40 px, alinhado com Design-Principles (≥34 px).

## Ficheiros

- `src/styles/header-refine.css`
- `src/styles/mobile-refine.css`

## Publicação

- dc-simu `main` (commit desta entrega).
