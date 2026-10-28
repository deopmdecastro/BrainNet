---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, landing, motor, fan, grafcet, interaction]
---
# Validação 2026-10-28 — Motor com pás, GRAFCET do editor, interações reais

## Pedido
Melhorar texturas; motor com pás; interação real dos dispositivos; GRAFCET com o mesmo layout e lógica do editor (incluindo move).

## Implementado (`5eb8479`)
- MotorShaftFan3D na landing (pás a rodar com rpmVisual).
- Materiais CAD com maior envMapIntensity.
- Cliques: LOGO! RUN/STOP; botoeira PLC→START→STOP.
- LandingGrafcetDemo: autoLayout + caixas do editor; pan e zoom.
- Estado partilhado Ladder / GRAFCET / 3D.
