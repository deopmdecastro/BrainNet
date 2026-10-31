---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, 3d, torre-luz, pigtails, cabos]
---

# Torre de sinalização — cabos multi-cor por predefinição

## Pedido
Na torre de sinalização, os cabos devem sair pela base como na imagem (feixe colorido) e vir já como predefinição do componente.

## Implementação
- Template `towerLight`: R/Y/G/COM com `contact: 'lead'`, cores e `socket3D` (ponta livre ~45 mm).
- `REAL_TERMINALS.towerLight` igual à SB2-3011.
- `upgradeRealInterfacePositions`: migra bornes antigos para lead e acrescenta COM em falta.
- `LeadPigtails3D`: curva com queda e leque entre fios.

Commit dc-simu: `9a94b9d`. Relacionado: [[Task-2026-10-31-Cabos-Soltos-Torre-Sensor]].
