---
project_id: BN-DCSIMU-001
type: validation
status: COMPLETE
created: 2026-10-30
updated: 2026-10-30
tags: [brainnet, dc-simu, grafcet, importacao, ux]
---
# Condições, edição de ligações e revisão da importação GRAFCET

## Pedido e resultado

Melhorar a experiência de edição do GRAFCET importado, aceitar condições como
`G0 <> X9`, apresentar corretamente ações negadas como `/1Hz` e permitir mover
transições/linhas e inserir pontos de ligação.

Foi implementado:

- A expressão `G0 <> X9` é interpretada como comparação com a etapa X9 inativa
  no GRAFCET atual. Também são aceites as comparações equivalentes e combinações
  booleanas já reconhecidas pelo editor. Referências a outros GRAFCETs continuam
  assinaladas para revisão, pois o runtime simula um GRAFCET de cada vez.
- Ações negadas, incluindo `/1Hz`, são desenhadas com traço superior.
- A barra da transição pode ser arrastada para reposicionar a ligação. O botão
  visível **Adicionar nó** cria um ponto intermédio; a pega pode ser arrastada
  para ajustar a linha. Duplo clique na linha também cria um nó. A edição é
  persistida em `linkBends` e o botão está documentado na ajuda com Enter/Espaço.
- Os pontos de captura de entrada/saída da transição foram afastados da barra;
  assim, continuam utilizáveis para criar ligações sem interceptar o gesto de
  arrastar a própria barra.
- O diálogo de importação mostra contagens, avisos agrupados por tema e estado
  de revisão, mantém ações claras no rodapé e gere foco/acessibilidade.
  Avisos de ações soltas aparecem em “Ações e qualificadores”. Cancelar mantém
  o programa atual; a importação só é aplicada após confirmação.

## Ficheiros principais

- `dc-simu/src/grafcet/engine.ts`, `ConditionEditor.tsx` e `ActionSymbol.tsx`:
  avaliação/ajuda de condições e representação da negação.
- `dc-simu/src/grafcet/GrafcetEditor.tsx` e `GrafcetShortcutsDialog.tsx`:
  arrasto, criação e edição de nós nas linhas.
- `dc-simu/src/grafcet/GrafcetImportReview.tsx`, `dc-simu/src/ui/dialogs.tsx` e
  `dc-simu/src/ui/PropertyDialog.tsx`: revisão da importação e gestão de foco.
- Testes de interface e regressão em `dc-simu/scripts/` e `dc-simu/src/`.

## Verificação

- `npm test`, `npm run typecheck`, `npm run test:fluidsim`,
  `npm run test:grafcet-dialogs`, `npm run test:style`,
  `npm run test:grafcet-links`, `npm run test:grafcet-construction-ui`,
  `npm run test:grafcet-modals-ui` e `npm run build` passaram na validação da
  implementação. A construção/importação passou com 26 verificações no browser;
  a modal passou os testes de desktop e móvel.
- `git diff --check` passou.
- Avaliação visual independente: PASS, sem problemas materiais. A captura
  regenerada documenta o botão **Adicionar nó**.
- As capturas de browser e o relatório de avaliação ficam em `dc-simu/runtime/`
  e na pasta temporária local; não são incluídos no Git.

## Estado da entrega

Implementado e testado localmente. A importação conserva os avisos necessários
para revisão manual. Não foi feito deploy nem reinício de Docker.

[[README|Índice do projeto DC-Simu]] · [[Testing-Plan|Plano de validação]]
