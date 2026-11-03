---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-03
updated: 2026-11-03
tags: [dc-simu, tablet, paineis, toolbar, ui, radius]
---
# Tarefa 2026-11-03 — Tablet = PC: painéis sem arredondamento

## Pedido

Melhorar a tela, a barra de ferramentas e os painéis laterais. Remover arredondamentos; no tablet abrir igual ao PC, adaptado.

## Diagnóstico

- `App.tsx` já trata tablet como layout de secretária (`isTabletDesktop` / `compactWorkspace`).
- `grafcet-editor.css` `@media (max-width: 1199px)` forçava gavetas absolutas com **border-radius 20px** e sombra — afectava janelas 768–1199 px (tablet/PC estreito) contra a regra do cofre (tablet = PC).
- `panel-drawer.css` já tinha `--pn-drawer-radius: 0` só em ≤767 px.

## Correção

1. Gaveta absoluta + cortina só em **≤767 px** (telemóvel).
2. **768+**: painéis em fluxo (como PC), `border-radius: 0`, sem sombra de gaveta.
3. Toolbar em ≤1199 continua com scroll horizontal se precisar (adaptação), sem mudar a anatomia dos painéis.
4. Reforço em `panel-drawer.css` para tablet/PC: cantos retos e bordas de separação.

## Ficheiros

- `src/styles/grafcet-editor.css`
- `src/styles/panel-system.css`
- `src/styles/panel-drawer.css`

## Critérios

- [x] No tablet/janela ≥768 px os painéis laterais não têm cantos arredondados.
- [x] Layout de painéis alinhado com PC (fixos, não overlay).
- [x] Telemóvel mantém gaveta, mas também sem radius 20px (cantos retos).
