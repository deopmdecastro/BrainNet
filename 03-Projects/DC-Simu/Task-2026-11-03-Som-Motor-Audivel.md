---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-03
updated: 2026-11-03
tags: [dc-simu, sfx, motor, audio]
---
# Tarefa 2026-11-03 — Som do motor audível em marcha

## Pedido

O motor ainda não tinha som ao funcionar; quer efeito sonoro do motor a trabalhar.

## Correção

- `unlockAudio()` no clique em **Run** (desbloqueia Web Audio no mesmo gesto).
- Zumbido mais forte (dois parciais saw+triangle, volume ~0,035–0,145).
- Mantém som no arranque e na desaceleração via `rpmVisual`.
- Silencia em STOP.

Commit aplicação: ver `main` após esta entrega (`sfx` + `useSimStore`).
