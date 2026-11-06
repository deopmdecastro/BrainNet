---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-06
updated: 2026-11-06
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, grafcet, estampagem, pages, charts]
---
# Estampagem — uma página por GRAFCET

## Entrega (`nativeId` → **v15**)
O exemplo deixa de desenhar G0–G15 no mesmo canvas e passa a usar `program.charts`:

| Página | Conteúdo |
|--------|----------|
| G0 - Controlo | X0–X5 |
| G1 - Emergência | X10–X11 |
| G2 - Automático | X20–X31 |
| G3 - Reset | X40–X45 |
| G4–G15 | Um manual por atuador/lâmpada |

- Etapas e transições com `chart` atribuído.
- Layout local por página (já não coordenadas lado a lado).
- Títulos `G<n> - …` em cada página → numeração `G0<=>X1` inalterada.
- Todas as páginas correm em simultâneo no motor (IEC 60848).

## Uso
Aba **Páginas** no editor GRAFCET para navegar entre G0…G15.
