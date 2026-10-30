---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED
created: 2026-10-30
updated: 2026-10-30
tags: [brainnet, dc-simu, grafcet, zoom, actions]
---
# GRAFCET — nitidez do zoom e ligação entre ações

## Pedido e resultado

O utilizador reportou texto desfocado ao ampliar e ações que voltavam à etapa,
sobrepondo-se à ação existente. Pediu commit e push depois da correção.

Implementado e testado localmente:

- O SVG é desenhado à dimensão do zoom, mantendo o `viewBox` em unidades do
  diagrama. A camada exterior só desloca a vista; deixou de ampliar uma camada
  composta com `will-change: transform`. Texto e linhas mantêm nitidez a 500%.
- Ações anexadas têm um ponto de ligação acessível fora dos botões de editar e
  eliminar: por baixo em linha, à direita em coluna. Aceitam uma ação solta por
  fio, dois cliques, teclado ou arrasto do corpo sobre a caixa.
- `afterActionId` guarda a ligação gráfica dentro da mesma etapa. A ação seguinte
  acompanha a posição e o tamanho da anterior; as caixas encaixam sem se cobrirem.
  Inserir no meio conserva a ação seguinte. Ligar duas ações anexadas transfere
  a segunda para a etapa da primeira; ciclos são recusados.
- Encaixes automáticos consideram posições e medidas importadas. Eliminar ou
  desanexar a ação anterior conserva as restantes na etapa. Duplicar e copiar
  etapas remapeia os identificadores das ligações internas.
- JSON preserva a cadeia; SVG exportado mantém dimensões do diagrama,
  independentemente do zoom da vista. Minimap, navegação e Desfazer mantêm-se.

A ligação é gráfica: a etapa continua a determinar a ativação das suas ações.
Pelo menos uma das ações tem de estar anexada a uma etapa. A revisão obrigatória
do desenho ATEC continua ativa, pois o ficheiro contém ligações incompletas.

## Ficheiros

- `dc-simu/src/grafcet/GrafcetEditor.tsx`: zoom, pontos de ligação, gestos e histórico.
- `dc-simu/src/grafcet/actionLayout.ts`: disposição, cadeias e cópia de ações.
- `dc-simu/src/grafcet/engine.ts`: referência gráfica opcional da ação anterior.
- `dc-simu/src/grafcet/importFile.ts`: validação do novo campo opcional.
- `dc-simu/src/grafcet/selection.ts`: remapeamento na cópia de etapas.
- `dc-simu/src/styles/grafcet-editor.css`: remoção da composição forçada da camada.
- `dc-simu/scripts/grafcet-action-layout-smoke.ts`: regressões de disposição/cópia.
- `dc-simu/scripts/grafcet-actions-zoom-ui-smoke.mjs`: gestos e zoom no navegador.
- `dc-simu/package.json`: verificações de disposição incluídas em `test:grafcet-links`
  e novo comando `test:grafcet-actions-ui`.

## Verificação e evidência

| Verificação | Resultado |
| --- | --- |
| Aplicação: `npm test` | Passou |
| Aplicação: `npm run test:grafcet-links` | 27 verificações existentes e 10 novas passaram |
| Aplicação: `npm run test:grafcet-actions-ui`, com o CT ATEC | 26 verificações passaram |
| Aplicação: `npm run test:grafcet-construction-ui`, com o CT ATEC | 26 verificações passaram |
| Aplicação: `npm run test:pinch` | Passou, incluindo o gesto no DOM |
| Aplicação: `npm run test:style` | Passou |
| Aplicação: `npm run build` | Passou; avisos de chunks existentes |
| BrainNet: `npm test` | 45 testes passaram |
| BrainNet: `npm run check` | Passou |
| `git diff --check` | Passou |

Verificados os dois sentidos do fio, clique, teclado, arrasto, inserção no meio,
transferência entre etapas, recusa de ciclos, eliminação/Desfazer e JSON.
No ficheiro fornecido `Grafcet ATEC.ct`, as ações amarelas foram ligadas após as
verdes nas etapas 5 e 6 a 500%, sem sobreposição. Mantiveram-se os 16 textos e a
revisão pendente. Não ocorreram erros JavaScript nos percursos exercitados.

As capturas foram inspecionadas visualmente: texto e condições mantêm contornos
nítidos. A escala medida foi 5 píxeis por unidade do SVG, com matriz CSS de
translação sem escala.

Evidência local ignorada por Git em `runtime/grafcet-actions-zoom/`:
`grafcet-zoom-500.png`, `grafcet-actions-linked.png`,
`atec-step-5-zoom-500.png`, `atec-step-6-zoom-500.png`,
`actions-zoom-report.json` e `construction/`. Logs na pasta `dc-simu/runtime/`
com prefixo `actions-`. Os navegadores foram descartáveis, com APIs e origens
externas bloqueadas, sem modificar projetos ou dados reais da conta.

## Entrega

Commit e push autorizados pelo pedido direto do utilizador. A entrega inclui
também as melhorias pendentes da biblioteca documentadas em
[[Validation-2026-10-30-Biblioteca-3D-Seletores-Luzes]].
Aplicação enviada para `origin/main`: [fdf2cff — correções GRAFCET](https://github.com/deopmdecastro/dc-simu/commit/fdf2cffc89efdf82702d630137c35393ca151c81)
e `15f530f` — melhorias da biblioteca. Carimbo de release atualizado pelo hook
do projeto para **119**. Referência do submódulo atualizada nesta entrega.
Sem publicação, atualização Docker ou reinício da instância ativa.

[[README|DC-Simu]] · [[Design-Principles]]
