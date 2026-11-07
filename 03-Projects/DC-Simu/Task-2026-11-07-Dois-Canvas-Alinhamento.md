---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_TYPECHECK_OK_NOT_VISUALLY_VERIFIED
created: 2026-11-07
updated: 2026-11-07
repos: [dc-simu, BrainNet]
tags: [dc-simu, toolbar, dois-canvas, alinhamento, ui]
---
# «Dois canvas» desalinhado do grupo das vistas

## Pedido
O botão «Dois canvas» aparecia desalinhado (mais curto e mais acima/abaixo) em relação ao grupo das vistas (3D Realista · Ladder · GRAFCET · Esquema IEC · Monitor) na 1.ª linha da barra.

## Contexto reutilizado
[[Task-2026-11-03-Tablet-Dois-Canvas-Icones-Gaps]] (tokens `--tb-gap-item`, regras do botão no tablet), [[Task-2026-11-03-Tablet-Dois-Canvas-Som-Capa]], [[Design-Principles]] (barras usam tokens comuns; uma barra não inventa medidas próprias) e [[2026-11-02-Reorganizacao-Barras-Ferramentas]]. Nada escrito de raiz: mudança mínima no botão existente e uma regra na folha `toolbar-spacing.css`.

## Causa
O `[role="tablist"]` tem `padding: 5px` + borda (≈ 42 px no PC; ≈ 50 px no tablet com separadores de 38 px). O botão tinha altura fixa (`h-[30px]`, e `38px` no tablet) dentro de `.dc-views-container`, que é flex sem `align-items`. O botão ficava alinhado ao topo e mais curto que o grupo.

## Alteração (dc-simu)
- `src/components/Toolbar.tsx`: o botão ganha a classe `dc-split-toggle`, `self-stretch min-h-[30px] justify-center` (em vez de `h-[30px]`) e `shadow-inner` em repouso, como o grupo.
- `src/styles/toolbar-spacing.css`: regra final `.dc-views-container > .dc-split-toggle { align-self: stretch; height: auto }` e, no tablet, `height: auto; min-height: 38px` em vez de `height: 38px`. O botão acompanha sempre a altura do grupo, sem números mágicos.

## Verificação
`npx tsc -b` e `npm run test:style`: OK. Não houve verificação visual (sem Chromium neste ambiente).

## Pendências (não verificado)
Confirmar no navegador, em 1024 / 1280 / 1440 px e no tablet, que «Dois canvas» tem o mesmo topo e a mesma base do grupo das vistas, também com a vista dividida ativa (azul).
