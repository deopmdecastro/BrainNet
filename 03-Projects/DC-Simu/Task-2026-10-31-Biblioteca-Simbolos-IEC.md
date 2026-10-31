---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, admin, editor-3d, biblioteca, iec, simbolos]
---

# Bibliotecas do editor — símbolos IEC

## Pedido
Nas bibliotecas do editor, adicionar também bibliotecas dos símbolos IEC.

## Entrega
O painel lateral **Bibliotecas** (antes só «Biblioteca de bornes») passou a ter duas abas:

1. **Bornes** — perfis e chips existentes (`TerminalLibrary`)
2. **Símbolos IEC** — biblioteca completa IEC 60617 (`IecSymbolLibrary`)

### Biblioteca de símbolos IEC
- Pesquisa por nome, código, hint ou prefixo
- Filtro por família (alimentação, proteção, botões, contactores…)
- Miniatura SVG de cada `CmdKind`
- Ações: **Usar** (principal), **+ Rel.** (relacionado), **cópia** (símbolo personalizado)
- Lista dos personalizados do componente atual
- Ao abrir a aba «Símbolo IEC» do inspetor, a biblioteca muda automaticamente para «Símbolos IEC»
- Botão «Biblioteca IEC» na secção de associação da aba Símbolo IEC

### UI
- Botão da barra: «Bibliotecas» (bornes + símbolos IEC)
- Menu «Mais»: entrada «Bibliotecas»

## Ficheiros
- `src/admin/editor3d/IecSymbolLibrary.tsx`
- `src/admin/editor3d/ComponentEditor3D.tsx` — `LibraryPanel` com separadores
- `src/admin/editor3d/tabsIec.tsx` — atalho para a biblioteca
- `src/styles/catalog-editor.css`

## Relacionado
- [[Task-2026-10-31-Editor-Aba-Simbolo-IEC]]
- [[Task-2026-10-31-Associacao-3D-Simbolo-IEC]]
