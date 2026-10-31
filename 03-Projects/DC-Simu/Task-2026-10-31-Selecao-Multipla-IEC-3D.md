---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, ui, selecao, marquee, commands, panel3d]
---

# Seleção múltipla — esquema IEC e canvas 3D

## Pedido
No canvas 3D e no esquema IEC, poder selecionar vários elementos (clicar e arrastar) e movê-los em conjunto.

## Implementação
- IEC: marquee, multi-seleção Shift/Ctrl, arrasto em grupo, delete/rotate no conjunto.
- 3D: arrasto em grupo; marquee com **Shift + arrastar** no fundo; Ctrl/Shift+clique.

Commit dc-simu: `505c675`.
