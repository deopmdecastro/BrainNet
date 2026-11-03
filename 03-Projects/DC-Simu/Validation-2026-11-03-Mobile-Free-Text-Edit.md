---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-11-03
updated: 2026-11-03
tags: [brainnet, dc-simu, grafcet, mobile, touch, free-text]
---
# Validação — Edição de textos livres do GRAFCET no telemóvel

## Problema

No telemóvel (pointer coarse + ecrã estreito) não era fiável editar, apagar ou arrastar textos livres do GRAFCET. O segundo toque no texto já selecionado devia abrir o diálogo, mas o botão «Editar texto» da barra de formatação (TextStyleBar) chamava sempre `setEditingCommentId`, que tenta a caixa `foreignObject`/`textarea` no desenho — pouco fiável em iOS/Android para abrir o teclado. As áreas de toque dos textos eram pequenas e o limiar de «arrastar vs toque» era de 3 px, fácil de ultrapassar com o dedo.

## Alterações (dc-simu)

1. **TextStyleBar no GRAFCET** (`GrafcetEditor.tsx`): o `onEdit` passa a respeitar `phone` e abre `FreeTextDialog` (`setTextDialogId`) em vez da edição inline. O `onDone` limpa também o `textDialogId`.
2. **Hit area e limiar** (`GrafcetFreeText.tsx`):
   - `pad` maior quando `touchEdit` (mín. 12 px e factor 0,55 do tamanho da fonte) para alvos de toque mais generosos.
   - Limiar de movimento antes de considerar arrasto sobe de 3 px para 8 px em modo touch, para que um toque ligeiramente «sujo» ainda conte como clique e abra a edição no segundo toque.

Comportamento mantido:
- 1.º toque: seleciona (aparece a barra de formatação com «Editar texto» / eliminar).
- 2.º toque no texto já selecionado (ou o botão da barra): abre o diálogo «Editar texto» com teclado nativo.
- Arrasto continua a mover o texto; apagar pelo botão da barra ou pelo diálogo (texto vazio).

## Commits

- `ccc855409db7` — fix(grafcet): open free-text dialog from style bar on phone and clear dialog on done
- `b8a671540f7c` — fix(grafcet): larger touch hit area and softer move threshold for free texts on phone

## Verificação sugerida

1. Abrir um GRAFCET com textos livres (ex. import FluidSIM) num telemóvel real ou em DevTools com `PHONE_TOUCH_QUERY`.
2. Toque num texto → seleciona e mostra a barra.
3. Toque de novo no texto ou em «Editar texto» → diálogo abre, teclado aparece, guardar/apagar funciona.
4. Arrastar o texto (dedo com movimento > ~8 px) move-o sem abrir o diálogo.
5. Confirmar que em desktop a edição inline (foreignObject) e o duplo-clique continuam iguais.

## Notas

- A revisão de importação continua a bloquear apenas simulação/Ladder; a edição do desenho (incluindo textos) permanece disponível para corrigir erros.
- Outras interações (arrastar etapas/transições/linhas) usam as mesmas camadas de hit já existentes; se ainda houver fricção em alvos pequenos, o próximo passo é aumentar as zonas de agarrar das barras de transição e dos pontos de ligação no modo phone.

[[Design-Principles]] · [[Backlog]] · [[README]]
