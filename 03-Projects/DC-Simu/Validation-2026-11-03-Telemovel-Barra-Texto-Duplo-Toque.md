---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED_PARTIAL
created: 2026-11-03
updated: 2026-11-03
repo: https://github.com/deopmdecastro/dc-simu
commits:
  - d165add
tags: [dc-simu, telemovel, toque, texto-livre, duplo-toque, grafcet, barra-texto]
---
# Telemóvel — editar textos, duplo toque e ligações

## Pedido
No telemóvel não conseguia editar textos, apagar, arrastar linhas ou componentes; permitir editar os textos livres do GRAFCET.

Contexto relido: [[Design-Principles]], [[Validation-2026-11-03-Grafcet-Toque-Duplo-Arrastar]], [[Validation-2026-11-03-Manuais-Paralelo-Texto-Livre-Telemovel]], [[Validation-2026-11-01-Texto-IEC-Igual-GRAFCET]].

## Método novo: toque real em Chromium
As notas anteriores ficaram «sem navegador». Desta vez: Chromium 153 (pacote npm `@sparticuz/chromium`) + Playwright com `hasTouch`/`isMobile` (390×844) e eventos de toque reais por CDP (`Input.dispatchTouchEvent`: toque, arrasto e pinça de dois dedos) sobre o GRAFCET ATEC (54 etapas). Renderização por software, bem mais lenta que um telemóvel.

## Diagnóstico (reproduzido)
- **A barra de formatação tapava o texto.** `TextStyleBar` flutua no topo do canvas e a 390 px quebrava em duas linhas (≈126 px, quase 30 % da área). Um texto na zona de cima ficava por baixo: o 2.º toque caía em «alinhar à direita» em vez de abrir a edição.
- **Duplo toque dependente da velocidade do render.** `useDoubleTap` media o intervalo com `performance.now()` no momento em que o handler corre. Com 54 etapas o 1.º toque (seleção) atrasa o 2.º handler ~300 ms e o par saía fora dos 350 ms.
- **Ligações com zona de toque fina** (16 u invisíveis).
- Já funcionavam: toque/segundo toque/arrasto do texto livre (com o texto à vista), diálogo de edição, toque e arrasto de etapas, copiar/eliminar no painel inferior.

## Implementado (`dc-simu` d165add)
- `TextStyleBar.tsx` (partilhada por GRAFCET, Esquema IEC e 3D): no telemóvel, uma linha de 50 px — **Editar texto · Formatar · Eliminar · Concluir** (40 px); «Formatar» abre a barra completa, que recolhe pelo selo.
- `useDoubleTap.ts`: usa `event.timeStamp` (hora real do toque); intervalo 350 → 450 ms.
- `mobile-refine.css`: ligações do GRAFCET com zona de toque de 30 u; dicas de teclado (Esc, Ctrl+Enter) escondidas nos diálogos em toque.

## Verificações
- `tsc -b` limpo; `npm test` ✅; `test:style` ✅; `test:grafcet-dialogs` 31 ✅; `double-tap-smoke` 14 (novo: render lento não anula o duplo toque); `free-text-touch-smoke` 3; `pinch-zoom-smoke` 10.
- Chromium com toque: barra compacta (50 px, 1 linha); «Editar texto» abre o diálogo; duplo toque numa etapa não selecionada abre a modal (envio em lote para timestamps realistas); toque a 13 px de uma ligação seleciona-a (antes fora da zona).

## Não verificado
- iOS Safari / Android reais (teclado, `touch-action`, callout). O harness não consegue gerar um duplo toque rápido com o thread ocupado: provado por teste unitário.
- Arrasto de linhas já selecionadas (cantos/segmentos) e de ações; «×» de 12 px no canvas; Esquema IEC, 3D e Ladder com toque real.
- `commands-touch-smoke` continua a falhar (anterior a estas alterações).
