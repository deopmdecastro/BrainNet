---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, esquema-iec, commands, paginas, pageRef, iec]
---

# Esquema IEC — páginas e ligações entre folhas

## Pedido
Criar opção de gerar páginas dentro do editor de esquema IEC, e elementos que levam ou trazem corrente de uma página para outra.

## Entrega

### Páginas (folhas)
- Barra de páginas no topo do canvas: criar, renomear (clique na ativa), eliminar (só se vazia)
- Cada símbolo, cabo e texto guarda `page`
- Só se edita/visualiza a página ativa
- Persistência em `CommandsDiagram.pages`

### Ligação entre páginas (`pageRef`)
- Novo símbolo na biblioteca (família Alimentação): **Ligação entre páginas**
- Um borne; o **tag** é o nome da rede (X1, 24V, L1…)
- O mesmo nome noutra página une electricamente as redes na simulação
- Inspetor indica as páginas já ligadas pelo mesmo nome
- Durante a simulação, o símbolo mostra se a rede está sob tensão

### Ficheiros
- `src/commands/pages.ts` — modelo e operações de páginas
- `src/commands/model.ts` — `pageRef`, campos `page`, `pages`
- `src/commands/engine.ts` — união de redes por tag de `pageRef`
- `src/commands/symbols.tsx` — glifo do conector
- `src/commands/CommandsEditor.tsx` — barra e filtro por página
- `src/commands/CommandsSidebar.tsx` — inspetor
- `src/commands/editing.ts` / `commandsUi.ts` / `useSimStore.ts`

## Uso típico
1. Página 1: alimentação + disjuntor + `pageRef` com tag `L1`
2. Página 2: outro `pageRef` `L1` + circuito de comando/potência
3. Correr a simulação: a corrente propaga-se entre páginas pelo mesmo nome
