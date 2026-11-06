---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-06
updated: 2026-11-06
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, grafcet, simtick, 1hz, ui]
---
# Correção — lâmpada 1HZ não piscava no canvas / E/S

## Causa
O motor (`evalCondition('1HZ')` + `simTimeMs`) alternava `Q1.2` corretamente a cada 500 ms. A UI lia `runtime.table` por referência estável; a tabela é mutada in-place e o `pushRuntime` só publica um novo objeto `runtime` + `simTick`. Quem não subscrevia `simTick` não re-renderizava.

## Correção
Subscrição a `simTick` em:
- `GrafcetEditor.tsx` (caixas de ação verdes no canvas)
- `VirtualIoPanel.tsx` (lâmpadas Q)
- `GrafcetSimPanel.tsx` / `GrafcetSimDock.tsx`

Padrão já usado em `MonitorPanel`, `PlcSignalPanel`, `SchematicView`, `Panel3D`.

## Teste
1. Estampagem: G0 em X2 («A terminar ciclo»).
2. Ação «AUTO a piscar» / `L_Branca` deve alternar ~1 Hz no canvas e no painel E/S.
