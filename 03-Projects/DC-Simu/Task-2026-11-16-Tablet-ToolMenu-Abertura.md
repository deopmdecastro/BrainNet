---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_TYPECHECK_OK_NOT_DEVICE_VERIFIED
created: 2026-11-16
updated: 2026-11-16
repos: [dc-simu, BrainNet]
tags: [dc-simu, tablet, toolbar, toolmenu, ui, rele-termico]
---
# Tablet: menus da barra de ferramentas abrem mal

## Pedido
Melhorar a barra de ferramentas no tablet («abre muito mal») e criar o botão de reset do relé térmico (roda para a direita ou esquerda).

## Contexto reutilizado
- [[Task-2026-11-03-Tablet-Barra-Igual-PC]] (tablet = layout PC escalado a 1280 px) e [[Task-2026-11-03-Tablet-Dois-Canvas-Icones-Gaps]] (barra em si, gaps e ícones): a barra já está resolvida, ficava por tratar o **menu que ela abre** (`ToolMenu`).
- Reset do relé térmico: já existe — [[Task-2026-11-02-Test-Reset-Rele-Termico]] e [[Task-2026-11-03-Repor-Reset-Rotativo-Rele-Termico]] (DC-ADR-091). Confirmado no código (`Panel3D.tsx`, cursor `ew-resize`) e com `test:thermal-controls` (21 PASS). **Nada reescrito.**

## Causa
No tablet o viewport é escalado a 1280 px, logo `useNarrowMenu` não ativa a folha e o `ToolMenu` abre como popover de rato:
1. `resize` fechava o menu sempre — a barra do Safari/zoom/escala do viewport disparam `resize` sem mudar a largura, e o menu desaparecia logo a seguir a abrir.
2. Itens de 32 px com texto de 12 px, depois da escala ficam minúsculos.
3. Posição calculada com `innerHeight/innerWidth`, não com a área visível real (`visualViewport`).
4. O foco automático no 1.º item fazia saltar o scroll.

## Alterações
- `src/ui/toolbarKit.tsx`: `resize` só fecha se a largura mudar (senão reposiciona); `focus({ preventScroll })`; posição pela `visualViewport`; largura 320 px e altura até 560 px no tablet; classe `is-tablet`.
- `src/styles/tool-menu.css`: bloco `html[data-tablet="true"] .tm-panel.is-tablet` — alvos de 44 px, texto 14 px, ícones 28 px, sem `:hover` colante, sem atalhos de teclado.
- Sem mudanças ao JSX das barras, ao motor, ao relé térmico nem ao telemóvel.

## Verificação
`tsc -b`, `test:style`, `test:thermal-controls`: PASS. Sem navegador/dispositivo neste sandbox.

## Pendências
Confirmar no tablet real (retrato e paisagem) que o menu **Mais/Projeto/Vista** abre, fica aberto ao aparecer/desaparecer a barra do Safari, cabe no ecrã e que o gesto de rodar o RESET do 3RU1116 funciona no 3D.
