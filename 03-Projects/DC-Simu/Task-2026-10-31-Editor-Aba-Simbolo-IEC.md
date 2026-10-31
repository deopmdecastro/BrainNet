---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, admin, editor-3d, iec, 60617, simbolo, simulacao, catalogo]
---

# Editor de componentes — aba «Símbolo IEC»

## Pedido
Criar no editor de componentes uma aba para edição de símbolos IEC, com capacidade de simular e ferramentas para editar ou criar símbolos.

## Entrega
Nova aba **Símbolo IEC** no inspetor do Editor 3D (`ComponentEditor3D`), grupo «Componente».

### Funcionalidades
1. **Associação**
   - Símbolo principal (`CatalogMeta.iecSymbol` + `definition.iec.primary`)
   - Símbolos relacionados (chips por família da paleta IEC)
2. **Pré-visualização**
   - SVG ao vivo com `CmdSymbol` / IEC 60617
3. **Simulação**
   - Repouso, fechado/ligado, energizado, aceso, disparado
   - Progresso de temporizador (0–100 %)
   - Atalho para o modo Simular do editor 3D
4. **Biblioteca**
   - Todos os `CmdKind` agrupados como no Esquema IEC
   - «Usar» como principal · «Editar cópia» cria símbolo personalizado
5. **Símbolos personalizados**
   - Novo do zero ou a partir de um base
   - Nome, prefixo IEC 81346, base de desenho
   - Bornes (rótulo, X, Y), pólos condutores, caixa de seleção
   - Guardados em `ComponentDefinition.iec.symbols`

### Ficheiros
- `src/admin/editor3d/tabsIec.tsx` — aba
- `src/admin/editor3d/editorStore.ts` — `InspectorTab` + `'iec'`
- `src/admin/editor3d/InspectorNavigation.tsx` — navegação
- `src/admin/editor3d/ComponentEditor3D.tsx` — render
- `src/catalog/types.ts` — `IecDef`, `IecSymbolDef`, `iecRelated`
- `src/catalog/definition.ts` — `normalizeDefinition` preserva `iec`
- `src/styles/catalog-editor.css` — estilos da aba
- `src/electrical/iecAssociation.ts` — lê `iecRelated`

## Aceitação
- [x] Aba visível no editor de componentes
- [x] Escolher e gravar símbolo principal e relacionados
- [x] Pré-visualizar e simular estados do símbolo
- [x] Criar/editar símbolos personalizados (bornes, pólos, caixa)
- [ ] (futuro) Desenho vectorial livre do glifo (paths) além da base CmdKind
- [ ] (futuro) Publicar símbolos personalizados na paleta global do Esquema IEC

## Relacionado
- [[Task-2026-10-31-Associacao-3D-Simbolo-IEC]]
- IEC-ASSOC-01 no backlog
