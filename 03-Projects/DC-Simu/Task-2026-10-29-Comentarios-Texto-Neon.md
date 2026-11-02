---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, comments, notes, free-text, grafcet, 3d, neon, current-flow]
---
# Tarefa 2026-10-29 — Comentários em nota, texto livre e corrente em néon

Relacionado com [[Design-Principles]] e [[Decision-Log]] (DC-ADR-074).

## Pedido
Melhorar as duas formas de comentar (canvas e painel do projeto): cor, arrastar, campo de texto próprio em vez do nativo, design de nota, título no canvas e conversa ao clicar. Ferramenta de texto livre no Esquema 3D e no GRAFCET (clicar, arrastar, tipo de letra, tamanho…). Corrente a passar com néon na cor do cabo.

## Implementado (dc-simu `fe1c521`)
- `CanvasAnnotations3D.tsx`: notas autocolantes (6 cores) arrastáveis no plano do painel; no canvas fica o título + nº de mensagens; ao clicar abre a conversa (autor, hora, responder Ctrl+Enter, resolver, eliminar). Sem `window.prompt`.
- Texto livre no Esquema/3D (HTML na cena, nítido) e no GRAFCET (`GrafcetFreeText.tsx`, SVG): clicar para colocar, arrastar, duplo clique edita no sítio; `TextStyleBar.tsx` com tipo de letra, tamanho, cor, fundo, negrito/itálico/sublinhado e alinhamento; atalhos Del, Enter/F2, Ctrl+B/I/U, Esc.
- Botão «Texto» na barra do GRAFCET; comentários antigos do GRAFCET passam pelo mesmo componente.
- Painel de comentários do projeto com aspeto de nota por vista (chips em vez de seletores nativos).
- `NeonCurrent3D.tsx`: néon aditivo (núcleo + halo) na cor do cabo, impulsos a velocidade constante em mm; substitui as esferas e o halo amarelo.
- Modelo: `CanvasNote.messages/resolved`, `CanvasText`, estilos em `GrafcetComment`; persistência no projeto.

## Verificação
- Typecheck, `test:style` e `npm test`: OK.
- Percurso no browser (1440×900): criar nota, título, 2 mensagens, mudar cor, arrastar, colocar e formatar texto — capturado.
- Pendente: captura do néon em RUN (sessão interrompida), revisão em telemóvel, CI completo.

## Estado
Preparado · implementado · parcialmente testado. Push bloqueado (conta GitHub não ligada).
