---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, native, grafcet, ladder, emergency, complete-reset]
---
# Validação 2026-10-28 — Projeto nativo com cogumelo e reset completo

## Pedido
Lógica do esquema (RT1 / B0 / B1 / K1 selo): acrescentar botão cogumelo, atualizar GRAFCET e gerar Ladder com complete reset, saídas.

## Implementação
- **B0** `emergencyButton` → I0.0 (NF, 1 em repouso)
- **B1** dual START/STOP → I0.1 (START), I0.2 (STOP)
- **Ladder N1:** EMERG · STOP · (START // KM1) → Q0.0; N2 H1; N3 H2
- **GRAFCET:** T1 `I0.0*I0.2*I0.1` → X1; T2 `!I0.0+!I0.2` → X0 (reset completo); X0=H2, X1=KM1+H1
- Seed `native-partida-direta-v2`; remove v1 e repõe conteúdo desatualizado

## Commit
`a2c164b` feat(native): emergency mushroom, complete-reset GRAFCET and ladder
