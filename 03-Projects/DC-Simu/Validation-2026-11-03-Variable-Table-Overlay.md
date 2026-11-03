---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-11-03
updated: 2026-11-03
tags: [brainnet, dc-simu, variables, tags, canvas, grafcet, iec]
---
# Validação — Tabela de variáveis flutuante no canvas (GRAFCET + IEC)

## Pedido
Importar e editar a tabela de variáveis **dentro do canvas** do GRAFCET e do Esquema IEC: tabela **movível**, **editável** (não estática), com **tags de ativo/inativo** em tempo real.

## Solução
Componente partilhado `VariableTableOverlay` (`src/ui/VariableTableOverlay.tsx`):

| Capacidade | Detalhe |
| --- | --- |
| Arrastar | Cabeçalho com pointer capture; posição guardada em `localStorage` por contexto |
| Editar | Endereço, nome e comentário escrevem direto no store (`updateTag`) — o Ladder/GRAFCET usam a mesma tabela |
| Ativo | Bolinha verde/cinza a partir de `runtime.table` (e bits extra no GRAFCET) |
| Importar | `TagSheetActions` (Excel) — juntar ou substituir tags |
| Adicionar | Botões +I / +Q / +M |
| Filtros | Área I/Q/M/T/C + pesquisa |
| Abrir | Botão **Variáveis** na barra de páginas (GRAFCET e IEC); no GRAFCET também o «abrir tabela» do painel Sinais |

## Ficheiros
- `src/ui/VariableTableOverlay.tsx` · `e9825e2`
- `src/styles/variable-table-overlay.css` · `49fe31c`
- `src/grafcet/GrafcetEditor.tsx` · `7514c2c`
- `src/commands/CommandsEditor.tsx` · `079c8f8`

## Uso
1. No GRAFCET ou no Esquema IEC, clicar **Variáveis** junto a «Nova página».
2. Arrastar a janela pelo cabeçalho.
3. Editar células; em RUN as tags verdes mostram sinais ativos.
4. Usar os botões Excel da barra inferior para importar/exportar a tabela de tags.

Reutiliza a tabela de tags e o import Excel já existentes — não é uma cópia estática.

[[Design-Principles]] · [[Backlog]]
