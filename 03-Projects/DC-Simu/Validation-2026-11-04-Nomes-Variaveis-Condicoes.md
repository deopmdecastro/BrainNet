---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED_NODE
created: 2026-11-04
updated: 2026-11-04
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, grafcet, transicao, condicao, variaveis, nomes, sinais]
---
# Validação 2026-11-04 — Nome da variável nas condições das transições

## Pedido
«Ao escolher uma variável nas condições das transições, em vez de usar o endereço (0.1, 0.2…), usar o nome da variável.»

Contexto lido antes de alterar código: `AGENTS.md`, [[Project-Brief]], [[Design-Principles]], [[Decision-Log]] e a iteração anterior [[Validation-2026-11-03-Transicoes-Estado-Entre-GRAFCETs]].

## Reaproveitado (não reescrito)
- `ConditionEditor` (seletor «Inserir variável» e autocompletar), `matchSignals`, `tokenAtCursor`.
- O analisador de condições já aceitava nomes simbólicos (`Start`, `bp_Avanca_A+`); só faltava ligá-los à tabela de variáveis.
- Padrão do leitor numérico (`setGrafcetNumericReader`) para o novo resolvedor de nomes.
- O método word do Ladder já resolvia nomes por tags: não foi alterado.

## Implementado no DC-Simu
- `engine.ts`: `setGrafcetSignalAliasResolver`; `read()` cai para o endereço do nome quando não existe chave com esse nome.
- `signals.ts`: `isUsableSignalName`, `signalAliasMap`, `signalReference`, `resolveSignalNames`, `resolveProgramSignalNames`; `signalUsage` e `signalAddressesInCondition` aceitam o mapa.
- `useSimStore.ts`: regista o resolvedor com as tags do PLC ativo (mapa em cache por referência da tabela).
- `ConditionEditor.tsx`: seletor e autocompletar inserem o nome e mostram o endereço ao lado; nota de ajuda.
- `GrafcetEditor.tsx` (aba Sinais): «Usar» insere a referência; uso conta nomes.
- `inputDetect.ts` / `GrafcetSimPanel.tsx`: o nome é a entrada real (`I0.1`), sem variável simbólica duplicada.
- `ladderSync.ts`: método dos bits converte nomes em endereços.

## Regra e limite
Insere-se o nome se for identificador simples e único. «Partida geral», «Ação», nomes repetidos, palavras reservadas e nomes iguais a endereços ou etapas (`X5`) inserem o endereço. Alternativa futura: nomes entre aspas no analisador.

## Verificações
- `npx tsc -b` sem erros.
- `npm test` — todos passam.
- `test:grafcet-signal-names` (novo, 50), `test:grafcet-signals` (32), `test:grafcet-dialogs` (31), `test:grafcet-links` (27 + 10), `test:grafcet-examples` (52), `test:grafcet-ladder-sync`, `test:style` — OK.
- `test:grafcet-ladder-word` **falha em «convergência E (MOVE −1)»**, também sem estas alterações: o commit `c499d4e` mudou o MOVE para 0 e o teste não foi atualizado. Pendente.

## Pendências
- Teste de UI com browser (`test:grafcet-ui`, Playwright) não executado; a asserção sobre «Partida geral» só mudou de mensagem.
- `vite build` não executado.
- Testar num projeto real com tags nomeadas e vários PLC.
- Não aprovado nem publicado em produção: o push para o repositório não é aprovação de lançamento.

[[Decision-Log]] · [[Design-Principles]]
