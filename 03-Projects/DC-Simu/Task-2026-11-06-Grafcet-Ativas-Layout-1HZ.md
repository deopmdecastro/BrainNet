---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-06
updated: 2026-11-06
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, grafcet, pages, 1hz, layout]
---
# Correção — ativas «?», layout G0 e highlight 1HZ (v16)

## Problemas
1. Com várias páginas, o painel mostrava `ativas: ?, ?, X1` — resolvia IDs só nas etapas da página atual.
2. Caixas de ação no G0 ainda cobriam etapas (espaçamento < 280 px).
3. Ação destacava verde só pelo bit da tabela (mesmo endereço em X1 e X2), sem exigir etapa ativa — o 1HZ em X2 competia visualmente com a saída contínua de X1.

## Correções
- Etiquetas de etapas ativas: `program.steps` (todas as páginas).
- `actionOn` = etapa ativa **e** bit a 1 → 1HZ/2HZ visíveis na etapa certa.
- Layout G0: modos a x 80 / 420 / 760; G2 ramos 100 / 400 / 700; G1 ações em coluna.
