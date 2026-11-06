---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-06
updated: 2026-11-06
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, grafcet, estampagem, layout, espacamento]
---
# GRAFCET Estampagem — separar os quatro GRAFCETs no canvas

## Problema
G0, G1 e G2 continuavam colados: linhas de transição e etiquetas do G0 entravam na zona do G1; o G2 começava demasiado perto das ações do G1.

## Correção (`nativeId` → **v13**)

| Bloco | Posição aproximada | Vão face ao anterior |
|-------|--------------------|----------------------|
| G0 Controlo | x 140–620 | — |
| G1 Emergência | x **1100** | ~480 px |
| G2 Automático | spine **1800**, ramos 1480 / 1800 / 2120 | ~450 px após G1 |
| G3 Reset | x **2650** | ~400 px após ramo Metal do G2 |

- Textos de hierarquia/rampas descidos para baixo do G0 (y 680+).
- Manuais em y **1880** / **2320**; `notesX` = 3100.
- Títulos G0–G3 alinhados aos novos centros.

## Critérios
- [x] Quatro GRAFCETs visualmente independentes, sem sobreposição de etapas.
- [x] Espaço livre entre G0↔G1↔G2↔G3 para ler transições e ações.
- [ ] Confirmar no DC-Simu após reseed (v13).

[[Task-2026-11-06-Estampagem-Layout-Organizar]] · [[Design-Principles]]
