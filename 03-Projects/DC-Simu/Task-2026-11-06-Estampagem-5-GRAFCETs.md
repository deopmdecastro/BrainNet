---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_TESTED_NODE
created: 2026-11-06
updated: 2026-11-06
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, grafcet, estampagem, atec, g0, emergencia, automatico, reset, manual, wireless, nomes-tags]
---
# Estampagem ATEC — 5 GRAFCETs (controlo, emergência, automático, reset, manual)

## Pedido
Melhorar o GRAFCET do projeto de estampagem: um GRAFCET para cada função (controlo, emergência, automático, reset e manual), com comparações entre GRAFCETs, transições sem linhas, e **nomes das tags** nas transições em vez de endereços; organização melhor.

## Contexto lido antes de alterar código
[[Task-2026-11-05-GRAFCET-Estampagem-Industrial]], [[Task-2026-11-06-Projeto-Nativo-Estampagem]], [[Validation-2026-11-03-Transicoes-Estado-Entre-GRAFCETs]], [[Validation-2026-11-03-ATEC-Textos-Comparacao-Condicoes]], [[Validation-2026-11-04-Nomes-Variaveis-Condicoes]], [[Design-Principles]].

## Reaproveitado (nada de motor novo)
- Títulos `G<n> - …` na mesma página (`grafcetGraphs`), comparações `G0 <=> X1` / `G0 <> X1` na receptividade e o campo `guard` («Só se») para o estado da origem.
- `wireless` (ligação por referência, IEC 60848) para voltas ao repouso, emergência e abortos.
- Nomes de variáveis nas condições (`signalAliasMap`), tabela de sinais do exemplo e helpers `step/link/placed` de `src/project/grafcetExamples.ts`.

## Estrutura (hierarquia IEC 60848: o G0 comanda os outros)
| GRAFCET | Etapas | Papel |
| --- | --- | --- |
| G0 Controlo | 0 Parada · 1 Automático · 2 A terminar ciclo · 3 Manual · 4 Reset · 5 Emergência | modos de marcha; `B_Start * Modo_Auto * Emergencia` → X1; `Modo_Manual` → X3; `B_Reset` → X4 |
| G1 Emergência | 10 Segurança OK · 11 Emergência | `!Emergencia` → X11; `Emergencia * Rearme` → X10 (alarme 2 Hz + luz vermelha) |
| G2 Automático | 20–31 | ciclo completo; tempos Preta 5 s · Branca 6 s · Metálica 8 s; `guard: G0 <=> X1` no arranque |
| G3 Reset | 40–42 | `G0 <=> X4` → repõe origem (Retorno + zera contadores) até `FC_Origem` |
| G4 Manual | 50–51 | `G0 <=> X3` → botões `Man_*` com intertravamento de posição |

- Emergência: `G1 <=> X11` leva qualquer estado do G0 a X5; rearmada (`G1 <=> X10`) o G0 faz reset automático (X4) antes de voltar à paragem (`G3 <=> X42`).
- Abortos: o G2 só corre com o G0 em X1/X2 — `G0 <> X1 * G0 <> X2` devolve cada etapa 21–31 à 20 (transições sem linha). A terminar ciclo sem peça (`G0 <=> X2 * !Peca_Presente`) volta ao repouso.
- Numeração das etapas distinta por GRAFCET (0–5 · 10–11 · 20–31 · 40–42 · 50–51), para `G2 <=> X20` e os temporizadores `5s/X24` serem inequívocos.

## Correção encontrada: endereços inválidos
O exemplo anterior usava `I0.8…I0.15`, `Q0.8…Q0.11` — **inválidos** no formato byte.bit (bit 0–7), por isso as tags com esses endereços nunca resolviam nome→endereço. Passou a `I1.0…I1.7` (C1_FC_8…15), `Q1.0…Q1.3`; as novas entradas manuais/reset ficam em `I1.3` (B_Reset) e `I2.0…I2.5` (`Man_*`). A coluna física «%I0.8…» mantém-se nos comentários.

## Ficheiros (dc-simu)
- `src/project/grafcetExamples.ts` — `estampagem()` reescrita; `nativeId` → `grafcet-estampagem-industrial-v9` (repõe o projeto semeado).
- `examples/grafcet-estampagem-industrial.json` — regenerado a partir do código (25 etapas, 48 transições, 41 tags).
- `scripts/grafcet-examples-smoke.ts` — contagem corrigida para 4 exemplos (já falhava) e cenário completo da Estampagem.

## Verificações
- `npx tsc -b` sem erros.
- `test:grafcet-examples` — **89 verificações OK**: 5 GRAFCETs, 6/2/12/3/2 etapas, zero endereços nas transições, todos os nomes existem na tabela, ciclo preto (5 s), automático contínuo, terminar ciclo, manual com intertravamento, emergência → rearme → reset.
- `test:grafcet-dialogs` (31), `test:grafcet-signals` (32), `test:grafcet-signal-names` (50), `test:grafcet-links` (10), `test:grafcet-ladder-sync`, `test:style` — OK.
- O JSON passa em `readGrafcetFile` (25 etapas, sem avisos).

## Pendências / não verificado
- **Sem validação visual**: o browser não pôde ser instalado neste ambiente, por isso as posições (cinco GRAFCETs lado a lado) e a pré-visualização das transições sem linha **não foram vistas no ecrã**; usar «Organizar» se for preciso ajustar.
- `vite build` e testes Playwright não executados.
- O Diagnóstico mantém avisos estáticos «saída comandada por várias etapas» (Q0.0–Q0.6, Q1.2) por partilhar atuadores entre GRAFCETs exclusivos pela hierarquia (auto/reset/manual); o teste aceita só esses avisos. Ideia futura: tornar essa regra consciente da exclusão por `G0 <=> Xn`.
- Rampas cheias (M0.4–M0.6) continuam a ser memórias manuais do HMI; falta ligar a contadores reais.
- Não aprovado nem publicado em produção: o push não é aprovação de lançamento.

[[Design-Principles]] · [[Decision-Log]]
