---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_TESTED_NODE
created: 2026-11-06
updated: 2026-11-06
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, grafcet, estampagem, atec, manual, atuadores, lampadas, nativo]
---
# Estampagem ATEC — manual por cilindro, motor e lâmpada

## Pedido
Melhorar o GRAFCET do projeto nativo de estampagem, organizado como o exemplo `dc-simu-atec_4.json` (um GRAFCET manual por atuador, títulos `G<n> - …`), com **manual de cada cilindro ou motor e de cada luz**.

## Contexto lido antes de alterar código
[[Task-2026-11-06-Estampagem-5-GRAFCETs]], [[Task-2026-11-06-Projeto-Nativo-Estampagem]], [[Task-2026-11-06-Grafcet-Painel-ES-INT-NO-NC]], [[Validation-2026-11-03-Transicoes-Estado-Entre-GRAFCETs]], [[Validation-2026-11-04-Nomes-Variaveis-Condicoes]], [[Design-Principles]] e `src/project/grafcetExamples.ts`. Referência de estrutura: o JSON ATEC do utilizador (G0 controlo, G1 funcionamento, G2 reset e G3–G7 manuais por cilindro/vácuo, com ciclo toque→liga, toque→desliga e etapa de emergência).

## Reaproveitado (sem motor novo)
Helpers `step/initial/link/placed`, `guard` («Só se») `G0 <=> X3`, ligações `wireless`, nomes de tags, flanco `^Nome` do motor, `SimulationSignals` no separador E/S (já implementado) para os botões `Man_*` com INT/NO/NC.

## Estrutura final (16 GRAFCETs)
| GRAFCET | Conteúdo |
| --- | --- |
| G0 Controlo · G1 Emergência · G2 Automático · G3 Reset | inalterados (etapas 0–5 · 10–11 · 20–31 · 40–42) |
| G4–G10 Manual | Alimentador (50–51) · Transportador rotativo (52–53) · Cilindro de estampa (54–55) · Gaveta Preta (56–57) · Gaveta Branca (58–59) · Gaveta Metálica (60–61) · Retorno à origem (62–63) |
| G11–G15 Manual | Lâmpada verde (70–71) · alarme (72–73) · azul (74–75) · branca (76–77) · vermelha (78–79) |

Cada manual tem 2 etapas (par = repouso inicial, ímpar = ligado) e duas transições:
- **T1** `^Man_X` com guarda `G0 <=> X3` — toque liga.
- **T2** `^Man_X + G0 <> X3` (sem linha) — novo toque desliga; sair do manual ou emergência (G0 → X5) desliga também.
- Estampa e gavetas acrescentam o intertravamento de posição: T1 `^Man_X * Pos_*`, T2 `… + !Pos_*` (desliga se a posição se perder).

Novos botões (I2.6 `Man_Retorno`, I2.7 `Man_L_Verde`, I3.0 `Man_L_Alarme`, I3.1 `Man_L_Azul`, I3.2 `Man_L_Branca`, I3.3 `Man_L_Vermelha`), todos `push`; painel virtual passa a 32 entradas. `nativeId` → `grafcet-estampagem-industrial-v10` (no Supabase atualiza a cópia v9, ver `supabaseBackend.ts`).

## Layout
Cada uma das 16 páginas usa o organizador em estilo clássico: sequência vertical, ramos alinhados em colunas, ações à direita e retornos de ciclo pela esquerda. As notas auxiliares ficam abaixo da envolvente real de cada página. A disposição não altera etapas, ações, condições ou destinos.

## Ficheiros (dc-simu)
`src/project/grafcetExamples.ts` · `examples/grafcet-estampagem-industrial.json` (47 etapas, 70 transições, 47 tags; campos de projeto preservados) · `scripts/grafcet-examples-smoke.ts`.

## Verificações
- `npx tsc -b` sem erros.
- `test:grafcet-examples` **128 OK** (89 antes): 16 GRAFCETs, 6/2/12/3 + 2×12 etapas, um manual por cada saída Q (12), um título por atuador/lâmpada, cada manual liga/mantém/desliga com toque, intertravamentos Pos_Estampa/Pos_Deposito (bloqueia, liga, desliga ao perder), vários manuais em simultâneo, sair do manual e emergência desligam tudo, `Man_*` ignorado fora do manual, rearme+reset → paragem.
- `test:grafcet-dialogs` (31), `-signals` (32), `-signal-names` (50), `-links` (10), `-ladder-sync`, `-io-panel` (7), `test:style` OK.
- O JSON passa em `readGrafcetFile` (47 etapas, 0 avisos).
- Atualização 2026-11-06: `test:grafcet-examples` passou com 129 verificações do exemplo e 170 de organização; `npm run build` concluiu.

## Comportamento a conhecer
- **L_Verde** (Pronto, G2 em repouso, ligada sempre) e **L_Azul** (G0 em X3 acende-a) já estão acesas por outro GRAFCET em modo manual; os seus manuais (G11, G13) avançam para a etapa 71/75 mas a saída não muda de aspeto. As outras três lâmpadas e todos os atuadores mudam visivelmente. Decisão pendente do utilizador: condicionar L_Verde ao modo automático?
- O Diagnóstico mantém os avisos estáticos «saída comandada por várias etapas» (agora também nas lâmpadas), por os GRAFCETs serem exclusivos pelo G0.

## Pendências / não verificado
- **Sem validação visual**: a disposição não foi revista em ecrã nem em largura móvel.
- Estado: implementado e testado ao nível de código, **não aprovado** em ecrã nem validado em produção.

[[Design-Principles]] · [[Decision-Log]]

## Atualização — organização do GRAFCET nativo (2026-11-06)

O `nativeId` atual é `grafcet-estampagem-industrial-v22`; o ficheiro `examples/grafcet-estampagem-industrial.json` fica sincronizado com o gerador.

No G16, as duas ações condicionadas pelo mesmo botão de rampa ficam lado a lado, em três grupos (Preta, Branca e Metálica), em vez de uma coluna longa. Ambas continuam condicionadas pelo respetivo `Reset_Rampa_*`; só a disposição muda.

No manual por atuador, a etapa ativa já não repete o nome do equipamento como legenda junto da condição da ação; o nome continua no título da página e na caixa da ação, evitando a colisão visível na imagem de referência.

Verificações atuais: `npm run test:grafcet-examples` (129 verificações do exemplo e 170 de organização) e `npm run build` concluídos. A apresentação ainda não foi aprovada visualmente no editor.
