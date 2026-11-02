---
project_id: BN-DCSIMU-001
type: validation
status: PARTIAL
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, toolbar, spacing, scroll, mobile, desktop, ux]
---
Commit da aplicação: `b8b6017`.

# Validação 2026-10-28 · Barras de ferramentas: espaçamento e scroll ao trocar de vista

Origem: 4 capturas do telemóvel (Esquema, Ladder, GRAFCET, editor de componentes). Botões demasiado juntos e, ao trocar de vista, a barra mantinha o scroll horizontal da anterior.

| Pedido | Resolução |
| --- | --- |
| Mais espaço entre botões, mobile e desktop | `toolbar-spacing.css` (bloco final): dentro dos grupos (`.dc-seg`) 3 → 6 px com 3 px de moldura; entre grupos 8 → 12 px (`--toolbar-gap`); separadores 6 → 8 px de margem; transporte da simulação 4 → 6 px; faixa do editor de componentes 8 → 12 px; ≤ 800 px a segunda faixa passa de 6 para 10 px. No `Toolbar.tsx` os grupos de ficheiro e do seletor de vistas passam de `gap-0.5`/`gap-1` a `gap-1.5` |
| Trocar Esquema ↔ Ladder ↔ GRAFCET deixa a barra a meio | `Toolbar.tsx`: ao mudar `mode`, as duas faixas (`.dc-toolbar-main`, incluindo `.dc-views-container`, e `.dc-toolbar-row2`) fazem `scrollTo({ left: 0 })` de imediato e outra vez no frame seguinte, depois de a nova vista pintar os botões. A barra arranca sempre no lado esquerdo, onde está o seletor de vistas |

As alturas das faixas e dos controlos (46/40/30 px) não mudam; `barra-padrao-ui-smoke` verifica alturas e raios, não intervalos.

Verificações: `tsc`, `test:style`, `npm test` e `vite build` OK. **Render visual e smokes de browser não executados** (sem navegador no ambiente): confirmar a 390 e a 1280 px que nada ficou cortado onde antes cabia e que, ao trocar de vista com a barra deslocada, ela volta ao início. As barras deslizam, por isso o maior espaçamento só aumenta o scroll em ecrãs estreitos.
