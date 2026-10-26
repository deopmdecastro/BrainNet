---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, editor-componentes, ui, ux, toolbar, painel]
---
# Editor de componentes: toolbar igual às outras barras + painéis alinhados — 2026-10-26

## Pedido
- Melhorar UI/UX no editor de componentes: **barra de ferramentas igual às outras barras** do simulador; afinações em **Componente › Propriedades do componente** e **Elementos · Modelo e interface física**.

## Resultado (`src/styles/catalog-editor.css`, camada final)
- Ribbon: primária em branco, secundária em fundo suave, separadores 1×16 px e botões com o raio da shell; chips de tecla (`[1][2][3]`) ocultos dos botões — ficam só no tooltip (como no Ladder/GRAFCET/esquema).
- Painel de elementos: título com a hierarquia tipográfica da app (12 px/650 + subtítulo 10 px), contador em pill suave, filtro «Objetos/Bornes/…» convertido no segmento suave (fundo cinza + pill branca no ativo) usado noutros filtros.
- Propriedades do componente: cartão de contexto (símbolo 30×32, raio 8), rótulos em versalete 9,5 px espaçado, campos 12,5 px com raio 8 e textarea coerente.

## Verificação operacional
- `npm ci` · `tsc -b` OK · 16 suites (style, sheets, ladder-*, grafcet-*, server, interactables, motion, excel, pdf-export, flow-cover, project-names) OK.

## Evidência
- Commit dc-simu `50eba8c` (carimbo #65), push verificado (`REMOTE` = `LOCAL`).

## Pendências
- Inspeção visual do utilizador (em compacto ≤ 1100 px os botões sobem a 34 px por decisão anterior — reavaliar se quiser 26 px também em telemóvel).

## Estado
- Preparado: sim · Implementado: sim · Testado: sim (automático) · Aprovado: pendente (utilizador).
