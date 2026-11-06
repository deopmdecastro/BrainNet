---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-06
updated: 2026-11-06
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, grafcet, estampagem, atec, reset, cilindros, motores]
---
# GRAFCET Estampagem — Reset completo etapa a etapa (G3)

## Objetivo
Melhorar o GRAFCET nativo de Estampagem Industrial (ATEC): o G3 deixou de ser um único passo «Retorno + zerar» e passou a uma sequência completa de reset dos cilindros, motor de retorno e memórias.

## Alteração (código)
Ficheiro: `src/project/grafcetExamples.ts` · função `estampagem()`

**`nativeId`:** `grafcet-estampagem-industrial-v11` (reposição automática do projeto semeado se a versão anterior estiver instalada).

### G3 — etapas
| Etapa | Nome | Ações / condição de saída |
|-------|------|---------------------------|
| X40 | Reset em repouso (inicial) | — |
| X41 | Recolher gavetas | Espera `FC_Gaveta_Preta * FC_Gaveta_Branca * FC_Gaveta_Metal` |
| X42 | Recolher estampa e alimentador | Temporização `1s/X42` (sem sensor de fim de curso dedicado) |
| X43 | Retorno do transportador | `N` em `Q0.5` (Retorno) até `FC_Origem` |
| X44 | Zerar contadores e flags | `R` em `Cnt_Preta/Branca/Metal` e `Rampa_*_Cheia` (M0.1–M0.6) |
| X45 | Fim do reset | Sinaliza ao G0; volta a X40 quando `G0 <> X4` |

### Transições G3
- T1: X40 → X41 quando `G0 <=> X4`
- T2: X41 → X42 quando gavetas recolhidas
- T3: X42 → X43 após 1 s
- T4: X43 → X44 quando `FC_Origem`
- T5: X44 → X45 (imediato)
- T6: X45 → X40 quando G0 sai do modo reset

### G0
- T7 passa a esperar `G3 <=> X45` (em vez de X42).

### Notas e textos
- Nota «Como testar — manual e reset» atualizada com a sequência.
- Descrição do exemplo e cabeçalho de numeração (G3: 40–45) atualizados.
- Layout: etapas 40–45 empilhadas em x=1900.

## Comportamento esperado
1. G0 parado + impulso em `B_Reset` (com emergência OK) → G0 X4.
2. G3 percorre 41→45; no fim G0 volta a X0 (máquina parada).
3. Após emergência + rearme, o G0 entra em X4 e o mesmo reset completo corre.
4. Contadores de peças e flags de rampa cheia ficam a zero no fim do reset.

## Critérios
- [x] Sequência etapa a etapa dos atuadores principais (gavetas, estampa/alimentador, retorno).
- [x] Zerar contadores **e** flags de rampa.
- [x] G0 só sai do reset quando G3 chega a X45.
- [x] `nativeId` incrementado para forçar reseed.
- [ ] Validação visual/scan no DC-Simu (abrir projeto nativo Estampagem e testar B_Reset).

## Relacionado
[[Task-2026-11-06-Projeto-Nativo-Estampagem]] · [[Task-2026-11-06-Estampagem-5-GRAFCETs]] · [[Task-2026-11-06-Estampagem-Manual-Por-Atuador]] · [[Design-Principles]]
