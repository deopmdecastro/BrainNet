---
project_id: BN-DCSIMU-001
type: validation
status: PARTIAL
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, panels, drawer, mobile, ux, grafcet, ladder, esquema]
---
Commit da aplicação: `f368d80`.

# Validação 2026-10-28 · Gavetas laterais padronizadas

Origem: 4 capturas (IMG_5286–5289) dos painéis abertos no telemóvel. Cada um abria de forma diferente.

| Painel | Antes | Agora |
| --- | --- | --- |
| Esquema · Biblioteca | Folha de ecrã inteiro por cima das barras | Gaveta esquerda |
| Esquema · GRAFCET e objetos | Folha de ecrã inteiro | Gaveta direita |
| GRAFCET · Componentes | Gaveta esquerda ~287 px | Gaveta esquerda |
| Ladder · Projeto | Gaveta esquerda ~287 px | Gaveta esquerda |
| Ladder · Elementos | Gaveta direita com cabeçalho recuado 10 px (padding do painel) | Gaveta direita, cabeçalho de lado a lado |

## Especificação única (`src/styles/panel-drawer.css`, carrega por último)

- ≤ 1199 px; largura `--pn-drawer-w` = `min(340px, 88vw)`; gaveta por baixo das barras do projeto e de ferramentas (`top:0; bottom:0` no espaço de trabalho), nunca ecrã inteiro.
- Cantos arredondados 16 px no lado de dentro; sombra `--pn-drawer-shadow`; borda de 1 px no lado de dentro; animação de entrada 0,18 s (desligada com `prefers-reduced-motion`).
- Cortina única `--pn-drawer-scrim`: tocar fora fecha (`.dc-mobile-backdrop`, `.ladder-pane-scrim`, `.grafcet-toolbox-backdrop`).
- Cabeçalho comum `SidePanelHeader` com a seta de recolher sempre visível.
- Alterações de apoio: `App.tsx` deixa de aplicar `dc-mobile-fullscreen-panel` e passa `width="100%"` à `Sidebar` em modo compacto (`Sidebar` aceita `number | string`); `index.css` deixa de esconder a cortina do Esquema.

Regra: **um novo painel lateral entra na lista de `panel-drawer.css`; não se escrevem regras de largura, sombra ou cortina por painel.**

## Verificações

`tsc`, `test:style`, `npm test` e `vite build` OK. Nenhum script de smoke depende das classes removidas. **Render visual não verificado** (sem navegador no ambiente): confirmar a 390, 768 e 1024 px, nos cinco painéis, a mesma largura, a cortina, o toque fora e a seta de recolher; confirmar também que os cartões da Biblioteca do Esquema cabem em 340 px.
