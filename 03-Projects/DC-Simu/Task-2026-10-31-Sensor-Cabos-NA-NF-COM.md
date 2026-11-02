---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, 3d, sensor, pigtails, fotoeletrico]
---

# Sensor fotoelétrico — cabos COM / NA / NF por predefinição

## Pedido
Igual à torre: o sensor (XUKT / fotoelétrico) deve trazer cabos soltos **NA**, **NF** e **COM**.

## Implementação
- Terminais COM (preto), NA (castanho), NF (azul) com `contact: 'lead'`.
- Lógica: repouso COM–NF; deteção COM–NA.
- Upgrade de rótulos antigos (V+/OUT/NO → NA, etc.).
- Commit dc-simu: `2a178f5`.
