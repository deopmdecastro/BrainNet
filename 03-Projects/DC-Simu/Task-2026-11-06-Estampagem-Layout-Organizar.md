---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-06
updated: 2026-11-06
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, grafcet, estampagem, layout, acoes, organizacao]
---
# GRAFCET Estampagem — organização do layout (etapas e ações)

## Problema
No canvas, caixas de ação ficavam por cima das etapas e as linhas de transição dos ramos Preta/Branca/Metal cruzavam-se de forma ilegível. Causa principal: colunas paralelas a apenas **160 px** de distância, enquanto cada ação ocupa ~140 px à direita da etapa.

## Correção (`grafcetExamples.ts` · `estampagem()`, `nativeId` → **v12**)

### Espaçamento horizontal (G2)
Ramos de estampagem e depósito: **1060 / 1340 / 1620** (≥ 280 px entre colunas). As ações deixam de invadir a etapa vizinha.

### Espaçamento vertical
- G2 spine: passos de ~160 px; ramos a y 780 e 1180; retorno a 1400.
- G3: X44 (6 ações R) com mais altura até X45 em y 1080.
- Manuais descidos para y **1680** (atuadores) e **2120** (lâmpadas), para não colidir com o G2.

### `actionLayout: 'column'`
- Etapas **28, 29, 30** (depositar + incremento contador).
- Etapa **44** (seis resets R de contadores e flags de rampa).

### G0 / G1 / títulos
Colunas do G0 ligeiramente mais abertas; títulos e notas reposicionados; `notesX` = 2400.

## Critérios
- [x] Ações não cobrem o número/descrição da etapa.
- [x] Ramos Preta | Branca | Metal legíveis sem sobreposição.
- [x] Manuais abaixo do G2, sem sobrepor o ciclo automático.
- [x] `nativeId` v12 força reseed do projeto nativo.
- [ ] Confirmar visualmente no DC-Simu (reabrir o projeto Estampagem).

## Relacionado
[[Task-2026-11-06-Estampagem-Reset-Completo]] · [[Task-2026-11-06-Estampagem-5-GRAFCETs]] · [[Design-Principles]]
