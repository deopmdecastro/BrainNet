---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, esquema-iec, comentarios, texto, anotacoes]
---

# Esquema IEC — comentários e textos livres

## Pedido
Add função de comentários também dentro do IEC e textos soltos também.

## Entrega
- Barra de ferramentas do Esquema IEC: **Comentário** e **Texto**
- Comentários: notas com conversa (`CanvasNote`, `view: 'commands'`), arrastar, cores, resolver — por página
- Textos livres: colocar com clique, editar (duplo clique), formatar (barra de estilo), apagar — por página
- `CanvasNoteView` inclui `'commands'`; notas/textos têm `page?` alinhado às folhas do esquema

## Ficheiros
- `src/commands/CommandsAnnotations.tsx`
- `src/commands/CommandsEditor.tsx`
- `src/components/Toolbar.tsx`
- `src/types/index.ts`
- `src/ui/textStyle.ts`
- `src/styles/commands.css`
