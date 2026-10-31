---
project_id: BN-DCSIMU-001
type: validation
status: PREPARED
created: 2026-10-31
updated: 2026-10-31
repo: https://github.com/deopmdecastro/dc-simu
commits:
  - d98913f
tags: [dc-simu, esquema-iec, texto, referencia, modal, rotacao]
---

# Validação 2026-10-31 — Esquema IEC: modal de edição do nome do elemento

## Pedido
No Esquema IEC, duplo clique no nome do elemento (ex.: Q1) abre uma modal de edição de texto, semelhante à barra de formatação mas com outras propriedades, como a rotação.

## Implementação
- `src/commands/TagTextDialog.tsx` (novo): modal baseada em `PropertyDialog` com texto, tipo de letra, tamanho, estilo (B/I/U), rotação (número, slider e atalhos 0/90/−90/180/±15), cor (paleta + seletor), posição (cima/baixo/esquerda/direita/repor) e pré-visualização; aviso de referência duplicada; Ctrl+Enter guarda, Esc cancela.
- `CommandsEditor.tsx`: `onDoubleClick` do símbolo deteta `[data-cmd-tag]` (só com a ferramenta Selecionar e fora da simulação); conectores de página mantêm a modal de ligação.
- `model.ts` / `symbols.tsx`: `tagStyle` ganha `font`, `bold`, `italic`, `underline`, renderizados no SVG.
- `commands.css`: estilos da modal.

## Verificações
- Sintaxe TS/TSX dos ficheiros alterados. Build, typecheck completo e teste visual **não executados** (sem dependências neste ambiente).

## Pendências
- Testar no browser: duplo clique no nome, guardar/cancelar, desfazer (Ctrl+Z) e rotação no canvas.
- Publicação: push por fazer (token GitHub recusado).
