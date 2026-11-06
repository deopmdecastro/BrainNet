---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-06
updated: 2026-11-06
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, grafcet, estampagem, atec, pausa, rampas]
---
# Estampagem — fecho dos gaps do guião ATEC (v17)

## Implementado
| Gap | Solução |
|-----|---------|
| Pausar | G0 **X6**; `B_Pause` (latch); G2 com `guard: G0 <> X6` |
| STOP imediato | `B_Stop` → G0 X0; abort G2 (`G0 <> X1 * <> X2 * <> X6`) |
| Parar suave | mantém `!Modo_Auto` → X2 |
| 2 peças = rampa cheia | 1.ª → `Cnt_*`; 2.ª → `Rampa_*_Cheia` |
| Reset rampas independente | **G16** etapa 80 com R condicionais `Reset_Rampa_*` |

## Tags novas
`I3.4 B_Pause` · `I3.5 B_Stop` · `I3.6–I4.0 Reset_Rampa_*`

## Fora de âmbito (inalterado)
Mapeamento 1:1 RS403/409 e HMI gráfico completo do formando.
