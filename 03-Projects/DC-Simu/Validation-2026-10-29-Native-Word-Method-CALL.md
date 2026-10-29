---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, native, ladder, grafcet, call, complete-restart, word-method]
---
# Validação 2026-10-29 — Ladder nativo: complete restart + FC + CALL

## Pedido
Criar o Ladder com complete restart, função MOVE para GRAFCET, função para saídas e Main com CALL.

## Estrutura (método registo de etapa / `grafcetToLadderWord`)
| Bloco | Conteúdo |
| --- | --- |
| **OB100 Complete restart** | MOVE 0 → MW* de comparação; MOVE etapa inicial → G0 (MW0) |
| **FC Grafcet** | Por transição: `[G0 == origem] · receptividade → MOVE destino → G0` |
| **FC Outputs** | Por saída: `[G0 == etapa] → (Q…)` KM1, H1, H2 |
| **Main [OB1]** | `CALL FC Grafcet` · `CALL FC Outputs` |

GRAFCET e entradas (EMERG/START/STOP) inalterados em relação à semente com cogumelo.

## Commit
`1d9f566` feat(native): word-method ladder — FC Grafcet, FC Outputs, OB100, Main CALL
