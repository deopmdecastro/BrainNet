---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, editor3d, glb, texturas]
---

# Fix: GLB branco no editor de componentes

## Causa
O Painel 3D aplicava finishCadMaterial; o editor não. overrideMaterial branco sem mapas apagava texturas do CAD.

## Correção
finishGlbTree no loadGlbAssets, preload de texturas ao abrir, guard contra override branco.
