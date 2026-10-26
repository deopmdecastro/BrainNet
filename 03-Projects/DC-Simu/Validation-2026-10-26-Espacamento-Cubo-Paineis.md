---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_PARTIALLY_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, ui, ux, css, toolbar, cubo, paineis, ladder, grafcet]
---
# Espaçamento das barras, cubo de vistas e painéis — 2026-10-26

## Pedido

1. Mais espaço entre botões das barras.
2. Cubo de vistas do 3D cortado no topo pela barra.
3. Melhorar os dois painéis do editor de componentes, o painel de baixo do Ladder e o painel lateral do GRAFCET.

## Implementação (DC-Simu, só CSS)

- `toolbar-spacing.css` (novo): grupos segmentados com `gap` de 3 px e botões planos dentro da moldura; 10 px entre grupos.
- `clean-mode.css`: cubo com `top: 14px`, sem margem negativa; `below-command` ajustado para 62 px; edição frontal do 3D com 14 px.
- `panels-polish.css` (novo): cabeçalhos fixos e foco visível no editor de componentes; separadores do Ladder numa linha com deslocamento e ações fixas; cabeçalho fixo e secções separadas no painel do GRAFCET (≥ 701 px).
- Documentado em `docs/TOOLBAR-ATALHOS-SIMULACAO.md`.

## Evidência

| Verificação | Resultado |
| --- | --- |
| `npx tsc -b`, `npm test`, `test:style` | Passam |
| `vite build` | Concluído |
| Capturas e Playwright | Não executados: sem navegador neste ambiente |

## Estado

| Item | Estado |
| --- | --- |
| Espaçamento, cubo, polimento dos painéis | implementado (CSS) |
| Verificação visual | **pendente**: ajustar valores após ver no ecrã |
| Aprovação pelo responsável | pendente |
