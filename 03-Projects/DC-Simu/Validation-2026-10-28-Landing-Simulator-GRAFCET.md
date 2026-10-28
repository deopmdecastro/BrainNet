---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, landing, showcase, grafcet, ladder, 3d]
---
# Validação 2026-10-28 — Simulador da landing (3D + Ladder + GRAFCET)

## Pedido
Melhorar o simulador da landing: UI/UX, equipamentos atualizados (motor, luzes, botões, disjuntores, disjuntor-motor, fonte, PLC), interações liga/desliga, luzes e LCD; criar GRAFCET da simulação e mostrar na landing; Ladder com movimento/pan.

## Implementado (commit `fd2a292`)
### LandingShowcase (3D)
- Equipamentos: fonte, botoeira START/STOP, H1/H2, LOGO!, **disjuntor 2P**, **disjuntor-motor PKZM C-10**, contactor KM1, motor M1.
- Interações: RUN / PLC STOP / START / STOP; clique na botoeira; luzes emissivas; estado no overlay e legenda.
- Hero passa a ser interativo (estado PLC/motor partilhado com controlos).

### EditorAnatomy (demo do editor)
- Separador **GRAFCET** com diagrama ao vivo X0 ↔ X1 (START I2 / STOP I1), ações KM1·H1 e H2.
- Separador Ladder: pan horizontal das networks (`cursor: grab`, touch pan-x).
- Separador Visualização 3D: mesmo showcase com controlos.

### CSS
- Estilos `.dx-grafcet-demo*`, controlos de toque no showcase, tabs com scroll em mobile.

## Como validar
1. Abrir https://dc-simu.vercel.app/?limpar-cache
2. Hero: RUN/STOP/START e observar H1/H2 + motor.
3. Secção editor: tabs Ladder · GRAFCET · Visualização 3D com o mesmo circuito.

## Estado
Implementado · Deploy automático via Vercel · Aprovado: pendente feedback.
