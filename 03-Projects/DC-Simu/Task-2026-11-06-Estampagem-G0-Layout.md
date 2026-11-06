---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-06
updated: 2026-11-06
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, grafcet, estampagem, g0, layout]
---
# GRAFCET Estampagem — G0 Controlo legível

## Problema
No G0 as etapas 1 (Auto), 3 (Manual) e 4 (Reset) estavam na mesma linha com ~240 px: as caixas de ação e as receptividades T1–T3 sobrepunham-se. A emergência (X5) partilhava a altura da etapa 2.

## Correção (`nativeId` → **v14**)
- Modos: **1 @ x80 · 3 @ x420 · 4 @ x760** (≥ 340 px)
- **X5 emergência** centrada abaixo (y 800), separada do ciclo
- G1 em **x1300**; G2 spine 2000; G3 em 2900
- Descrições T1–T3 no canvas: `→ Auto` / `→ Manual` / `→ Reset` (condição completa mantém-se)
- Textos longos (hierarquia/rampas) abaixo de X5

[[Task-2026-11-06-Estampagem-Layout-Separar-Grafcets]]
