---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-10-27
updated: 2026-10-27
tags: [dc-simu, ui, panels, landing, simulation-dock, wirepanel, mobile]
---
# Validação 2026-10-27 — docks + Landing (painéis e CTAs)

## 1. WirePanel e docks
| Componente | Antes | Agora |
| --- | --- | --- |
| `SimulationDock` | `<header class="schematic-sim-dock-head">` + IconPlay sem import | `SidePanelHeader` (ESQUEMA / Simulação / estado no detail) |
| `WirePanel` | `ce-wirepanel-head` ad-hoc | `SidePanelHeader` (CABOS / Cabos de teste, collapsed) |

CSS ajustado em `schematic-editor.css` e `catalog-editor.css` para a anatomia `dc-side-panel-*`.

## 2. Landing — viewports estreitos
- ≤560px: hero e banda CTA com botões a 100% de largura, min-height 48px.
- ≤720px: showcase 3D mais alto, controlos com fundo legível e botões ≥44px; hero prioriza o viewport 3D acima do texto.

## Estado
Implementado no código; typecheck/smoke pendente nesta sessão. Aprovado: pendente do utilizador.
