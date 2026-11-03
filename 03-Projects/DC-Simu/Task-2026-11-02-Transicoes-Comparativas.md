---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-02
updated: 2026-11-03
tags: [dc-simu, grafcet, transicao, comparacao]
---
# Transições comparativas entre GRAFCETs

## Objetivo
Melhorar a modal de propriedades de transição para documentar equivalências com transições de outros GRAFCETs, sem misturar a execução local com referências de revisão.

## Implementação
- `GrafcetTransition.comparisons` guarda uma lista compatível com projetos antigos.
- Cada referência permite nome do GRAFCET, transição equivalente, condição e nota.
- A modal permite adicionar/remover e editar referências; referências vazias não são persistidas.
- A simulação continua a avaliar apenas `condition`, `from` e `to` do GRAFCET atual.

## Contexto reutilizado
Seguidos `AGENTS.md`, `00-Dashboard/Home.md`, `00-Dashboard/Architecture.md`, `Design-Principles.md`, `Requirements.md`, `Backlog.md` e a validação anterior de condições/ligações/importação. O desenho mantém azul para ações, superfícies neutras, densidade técnica e ajuda contextual.

## Aceitação
- [x] `npm run typecheck`
- [x] `npm run test:grafcet-dialogs`
- [ ] `npm run test:grafcet-modals-ui`
- [x] `npm run build`
- [x] `git diff --check`
- [x] commit/push no `dc-simu`
- [x] commit/push no `BrainNet` com referência ao commit do submódulo

## Melhoria posterior da modal de criação — 2026-11-02
A modal de criação de projetos foi refinada no DC-Simu: largura maior no desktop, grelha de tipos em duas colunas, melhor agrupamento semântico, destaque de seleção e adaptação a uma coluna em ecrãs pequenos. Commit: `fa4206f`.

## Clipboard entre páginas — 2026-11-02
O DC-Simu passou a expor Ctrl+X no sistema de atalhos universal. IEC copia e corta a seleção; GRAFCET copia/cola subdiagramas e corta a seleção; Ladder copia/corta a network ativa e cola numa página Main, com ids novos e histórico por Ctrl+Z. Commit DC-Simu: `7230879`.

## Clarificação da sintaxe de estado — 2026-11-02
A modal passou a explicar diretamente: `G0 <> X9` significa que X9 está inativa; `G0 <=> X9` significa que X9 está ativa. O bloco mostra estas formas no título e junto ao seletor, e informa que `G0X9` sem operador é ambíguo/inválido. Commit DC-Simu: `14f000b`.

## G3 Manual — Cilindro A — 2026-11-02
Foi criado `examples/g3-manual-cilindro-a.json`, um GRAFCET manual autónomo baseado no esquema IEC 60848 fornecido. Inclui as ações `Y0_A+` na etapa 143 e `Y1_A-` na etapa 147, as receptividades `G0X4 * bp_Avança_A+`, `fc_a1 * bp_Avança_A+`, `fc_a0 * bp_Avança_A+ * G0<>X4`, e o ramo de sincronização com X9. Commit DC-Simu: `8dab20c`.

## Manuais B, C, D e E — 2026-11-02
Criados quatro GRAFCETs manuais autónomos em `examples/`: B (`Y2_B+`/`Y3_B-`), C (`Y4_C+`/`Y4_C-`), D (`Y5_D+`/`Y6_D-`) e E (`Y7_E+_Vacuo_On`/`Y8_E-_Vacuo_Off`). Cada um tem etapas de comando, confirmação, retorno e ciclo de repouso, usando comparações explícitas na modal. O manual C assinala que `Y4_C-`, `fc_c1` e `fc_c0` não estavam presentes no projeto de origem e foram incluídos como pontos de completar/ligar aos sinais reais. Commit DC-Simu: `2b66f02`.

## Transição C temporizada — 2026-11-02
O manual C foi corrigido: a transição de avanço passou a usar `T(2s) * fc_c1`, aguardando dois segundos e confirmando o fim de curso C1. O tempo pode ser alterado diretamente na condição da transição. Commit DC-Simu: `711ddd7`.

## Condição de estado vs. origem — 2026-11-02
O bloco «Estado de outra etapa» saiu da coluna estreita das Origens e passou a secção própria, «Estado de outras etapas», com uma frase guiada (`Só disparar se a etapa [nº] estiver [ativa|inativa]` → «Adicionar à condição»). A modal reconhece `G0 <=> X9`, `G0 <> X9`, `G0X9`, `X9` e `/X9` já escritos na condição; cada termo aparece como linha legível com alternância ativa/inativa, remoção e «Usar como origem». O texto explica que a etapa consultada não é desativada, ao contrário de uma origem; a pré-visualização separa «Estado consultado» das origens. A ajuda deixou de dizer que `G0X9` é inválido (o motor lê-o como X9 ativa). Commit DC-Simu: `f0cf6fc`.
- Testado: `typecheck`, `test:grafcet-dialogs` (31 OK), `build`, `git diff --check`; `test:grafcet-modals-ui` passa todas as verificações da transição (servidor Vite temporário sem Supabase, Edge), mas falha depois em `openImport` (clique intercetado pelos separadores do painel GRAFCET) — fora do âmbito desta alteração.

## Projeto ATEC com manuais G3–G7 — 2026-11-02
`examples/grafcet-atec-com-manuais.json` junta ao projeto ATEC (G0 controlo, G1 funcionamento, G2 reset) os GRAFCETs manuais G3–G7 dos cilindros A–E, no padrão do desenho «G3 - Manual - Cilindro A»: repouso (141/151/161/171/181), avanço por `G0X4 * bp_Avanca_<k>+`, recuo por fim de curso + botão, saída do manual por `G0<>X4` e etapa de emergência por transição-fonte `G0X9`, libertada por `/G0X9`. T9, T26 e T28 passaram a transições-fonte (antes não disparavam). O motor passou a aceitar `bp_A+ + …` (sufixo + seguido de OU) e a ler sinais com maiúsculas e minúsculas. Commit DC-Simu: `14ab92f`.
- Testado: `npm test` (com 2 verificações novas), `typecheck`, `test:grafcet-examples`, `test:grafcet-dialogs`, `test:grafcet-signals`, `test:fluidsim`; simulação do cenário manual A/B, saída do manual, emergência e rearme. `test:grafcet-links` já falhava antes (posição de ações).
- Pendências: `fc_c0/fc_c1`, `fc_d0/fc_d1` e `Vacuo_OK` não existem no projeto de origem; `Y7_E+_Vacuo_On`/`Y8_E-_Vacuo_Off` são nomes inválidos para o motor (já vinham de G1/G2); botão por nível reinicia o ciclo se ficar premido; disposição no desenho não verificada visualmente.

## Dependências de estado entre GRAFCETs e nova modal — 2026-11-03
A modal deixou de ser uma lista de campos e passou a ter três blocos claros: identidade + receptividade na mesma linha, ligações (origens → destinos, limitadas às etapas da página) e «Depende do estado de etapas», que substitui o antigo «Estado de outras etapas». As equivalências documentais passaram a cartões compactos recolhíveis, com remoção por registo.

A funcionalidade pedida ficou no motor: `G1 <=> X11` / `G1 <> X11` leem a etapa 11 da **página G1** (G0 = primeira página), com contagem de etapas por grafo e queda para a numeração global quando a página ou a etapa não existem — os projetos e importações anteriores continuam válidos. `stepStateReferences` é a leitura única das referências de estado (modal, validação e avaliação).

Commit DC-Simu: `2ea1e8f`. Detalhe, verificações e pendências: [[Validation-2026-11-03-Transicoes-Estado-Entre-GRAFCETs]].

## «Só se»: condição de estado da origem entre GRAFCETs — 2026-11-03
Nova propriedade `guard` na transição (ex.: `G3 <> X149`): estado de etapas de qualquer GRAFCET/página, juntado à receptividade com E no motor, na validação e no Ladder. A transição-fonte deixa de aparecer como «POR LIGAR» e mostra a condição por cima, como no FluidSIM. Na modal, «Só se» fica no cartão Origens (GRAFCET → etapa → ativa/inativa), com sugestão automática para transições-fonte. O editor valida o programa inteiro e filtra o Diagnóstico por página. Projeto ATEC convertido para uma página por GRAFCET (G0–G7), textos `Gk <> Xn` passados a `guard` e barra vazia T41 removida; ficheiro em `Downloads/dc-simu-atec-paginas.json`. Testado: `npm test` (+2), `typecheck`, `build`, `test:grafcet-dialogs/examples/signals/ladder-sync`, `test:fluidsim`, `grafcet-modals-ui-smoke` (61 PASS; falha conhecida em `openImport`), simulação manual/emergência/rearme. Pendente: `Y7_E+_Vacuo_On`/`Y8_E-_Vacuo_Off` inválidos (5 erros). Commit DC-Simu: `8b9a9ef`.

## GRAFCETs pelos títulos na mesma página — 2026-11-03
O motor reconhece G0, G1… pelos textos de título `G<n> - …` (também `:`/`·`); cada etapa pertence ao título mais próximo acima/à esquerda na sua página. Sem títulos, as páginas continuam a numerar G0, G1… Referências `G1X75`, `G3 <> X149`, a lista de GRAFCETs da modal e o indicador «Ligações Gn» seguem os títulos. Projeto ATEC de novo numa só página (`Downloads/dc-simu-atec-pagina-unica.json`), com as condições de estado mantidas. Testado: `npm test` (+2), `typecheck`, `build`, testes GRAFCET, `grafcet-modals-ui-smoke` (61 PASS), simulação e captura da modal com G0–G7. Commit DC-Simu: `722dc95`.

> Verificação 2026-11-03: itens marcados confirmados nesta sessão (commits `8b9a9ef`, `722dc95`, `5b71f7c`). `test:grafcet-modals-ui`: 61 verificações da modal passam; o passo final de importação (`openImport`) ainda falha — pendente.
