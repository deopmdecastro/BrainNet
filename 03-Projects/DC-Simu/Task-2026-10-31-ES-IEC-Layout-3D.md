---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, commands, esquema-iec, e-s, simulation-dock, layout, ui]
---

# Layout E/S do esquema IEC = painel 3D

## Pedido
O layout do painel de entradas e saídas do esquema IEC (lateral direita, separador E/S) deve ser o mesmo do 3D.

## Diagnóstico
- 3D / Esquema físico: `SimulationDock` embedded → barra `sim-embed-bar` (estado RUN/STOP/PAUSA + `SimTransportControls`) e corpo com `VirtualIoPanel` / `PlcSignalPanel` (`vio-panel`, `vio-head`, grelha de células).
- Esquema IEC: `CommandsIoPanel` usava `dc-cmd-dock` + `SimBar` própria (botões «Simular» distintos) e lista `dc-cmd-devices` em linhas, visualmente diferente.

## Implementação
- `src/commands/CommandsPanels.tsx`: `CommandsIoPanel` reestruturado com a casca do 3D:
  - `schematic-sim-dock is-embedded` + `sim-embed-bar` + `gdock-state` + `SimTransportControls` (Run/Pausa/Passo/Stop/Reiniciar mapeados para start/pause/tick/stop).
  - Corpo `vio-panel is-compact` com `vio-help` em STOP, secções Entradas/Saídas em `vio-cols` / `vio-head` / células `vio-cell`.
  - Ações (premir, abrir, disparar…) e estados (bobina, motor, lâmpada) mantidos na lógica existente (`coilSince`, `delays`, motores).
- `src/styles/commands.css`: estilos `.dc-cmd-io` / `.dc-cmd-device-cell` para células e rodapé alinhados ao vio.

## Aceitação
- [x] Barra superior de E/S IEC idêntica em estrutura à do 3D (estado + transporte).
- [x] Entradas/saídas em cartões tipo `vio-cell`, não lista solta antiga.
- [ ] Validação visual no browser.
