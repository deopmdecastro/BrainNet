---
project_id: BN-DCSIMU-001
type: validation
status: PUBLISHED
created: 2026-10-31
updated: 2026-10-31
repo: https://github.com/deopmdecastro/dc-simu
commits:
  - 57d3e43
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
- 2026-10-31 (publicação): `tsc -b` sem erros, `vite build` OK e `npm test` (smoke) «TODOS OS TESTES PASSARAM» sobre o dc-simu `main` com os 3 commits aplicados.
- Teste visual em browser **ainda por fazer** (as linhas «não executados» abaixo referem-se ao ambiente anterior).
- Sintaxe TS/TSX dos ficheiros alterados. Build, typecheck completo e teste visual **não executados** (sem dependências neste ambiente).

## Pendências
- Testar no browser: duplo clique no nome, guardar/cancelar, desfazer (Ctrl+Z) e rotação no canvas.
- Publicado em `deopmdecastro/dc-simu` `main` (cb32a08..57d3e43); submódulo do cofre atualizado.
