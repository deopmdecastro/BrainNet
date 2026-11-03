---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_BUILD_OK_NOT_VISUALLY_VERIFIED
created: 2026-11-03
updated: 2026-11-03
repos: [dc-simu, BrainNet]
tags: [dc-simu, tablet, toolbar, gaps, icons, dois-canvas]
---
# Tablet: «Dois canvas» visível, módulos só com ícone e gaps das barras

## Pedido
O botão «Dois canvas» continuava escondido no tablet pelos grupos dos módulos (vistas) e pelo cartão do simulador na 1.ª linha. Pôr só ícones nos módulos e dar gaps melhores aos botões das barras em todas as telas.

## Contexto reutilizado
[[Task-2026-11-03-Tablet-Dois-Canvas-Som-Capa]] (transporte deixou de ser `sticky`), [[Task-2026-11-03-Tablet-Barra-Igual-PC]] (tablet = PC), [[Design-Principles]] (tablet: alvos 38 px, `is-tight`/`is-dense`), [[Validation-2026-10-28-Barras-Espacamento-Scroll]] (6/12 px). Nada escrito de raiz: só uma folha final em `src/styles/toolbar-spacing.css`, sem alterar o JSX.

## Causa
No tablet o viewport é escalado a 1280 px, logo os breakpoints `xl`/`lg` mostravam todos os rótulos (Novo/Abrir/Salvar/BOM/PDF, nomes das vistas, Run, Clean). O grupo das vistas era `flex: 1 1 0` com deslize interno e encolhia, deixando «Dois canvas» fora de vista.

## Alterações (`toolbar-spacing.css`)
- **Tablet (`html[data-tablet="true"]`):** vistas, Projeto, «Dois canvas» e transporte só com ícone (nome no título e `aria-label`; selo de estado e diagnóstico mantêm-se). Alvos de 38–42 px. O grupo das vistas passa a `flex: 1 0 auto; min-width: max-content; overflow: visible`, por isso nunca é encolhido nem deslizado por dentro.
- **Gaps em todas as telas:** tokens `--tb-gap-item` (8 / 7 / 6 px) e `--tb-gap-group` (16 / 14 / 12 px) e `--tb-edge` (16 / 14 / 12 px), por breakpoint (>1100, ≤1100, ≤700). Aplicados a linha 1, linha 2, Ladder, GRAFCET, grupos segmentados, Projeto, vistas, transporte, `ToolInlineItems`, separadores e margem do «Dois canvas». Linha 1 com 8 px entre linhas quando quebra.
- Telemóvel compacto (`header-refine.css`, `gap: 0 !important` no transporte) preservado de propósito.

## Verificação
`npm run test:style` e `vite build`: OK. Sem navegador/dispositivo aqui.

## Pendências (não verificado)
Confirmar no tablet real (e em 1024/1280/1440 px no PC) que «Dois canvas» aparece entre as vistas e o transporte, e que a 2.ª linha continua a deslizar sem cortes com os novos gaps. Rever o toque nos ícones de 38 px.
