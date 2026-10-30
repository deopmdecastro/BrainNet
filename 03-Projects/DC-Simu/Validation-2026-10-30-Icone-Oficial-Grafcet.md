---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-30
updated: 2026-10-30
tags: [dc-simu, grafcet, icones, interface, validation]
---
# Ícone oficial do GRAFCET

O utilizador escolheu o símbolo de três nós ligados da imagem fornecida e pediu
a sua aplicação em todos os locais, seguida de commit e push.

Em `dc-simu/src/ui/icons.tsx`, `IconGrafcet` passou de `faStairs` para
`faDiagramProject`, o símbolo correspondente à imagem no conjunto Font Awesome
já instalado. Mantém tamanhos e cores dos controlos existentes.

Todos os consumidores de `IconGrafcet` recebem o símbolo: separadores e menus
da barra de ferramentas, painel lateral do Esquema, painel de etapas do
GRAFCET, indicador de etapas ativas e cartão da barra de estado. O estado vazio
em `src/grafcet/GrafcetEditor.tsx` passou também a usar `IconGrafcet` diretamente.
A importação de `faStairs` foi removida. A escolha está registada em
[[Design-Principles]].

## Verificações

- Aplicação: `npm test` e `npm run build` passaram. O build inclui TypeScript;
  manteve os avisos existentes de tamanho/importação de chunks.
- BrainNet: `npm test` passou com 45 testes; `npm run check` passou.
- `git diff --check` passou.
- Inspeção com a skill `agent-browser` num navegador isolado, com pedidos à API
  bloqueados: barra GRAFCET, painel de etapas e barra de estado mostram
  `diagram-project`; nenhuma ocorrência de `stairs` no DOM.
- Evidência visual: `runtime/grafcet-official-icon.png`, local e ignorada por Git.

Implementado e testado localmente. Commit e push dos dois repositórios
autorizados pelo pedido direto. A tarefa não inclui reinício Docker nem
publicação manual da instância em uso.

A aplicação foi enviada para `origin/main` no commit
`408e748e78b05ea246bdce0379e5fb27771e8b84`, com carimbo de release #117.

[[README|DC-Simu]]
