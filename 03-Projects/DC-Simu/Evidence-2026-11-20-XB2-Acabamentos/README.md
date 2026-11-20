# Botoeiras KEOLEA KL-XB2 — acabamentos, clique e bornes

**Data:** 2026-11-20 · **Commit:** `dc-simu@b5719f3` (`main`)

## O que o utilizador reportou

«Melhorar acabamentos destes botões todos dessa marca para ser fiel, melhorar o
efeito de click, muda de cor ao clicar, e depois melhorar o borne também parece
que ficou parafusos soltos atrás.»

## Defeitos encontrados (medidos no GLB, não a olho)

| # | Defeito | Medição |
|---|---|---|
| 1 | Parafusos dos bornes a flutuar **4,1 mm atrás** da face traseira | cabeça do parafuso em z = −0,0…0,5 mm, face do bloco em z = 4,1 mm |
| 2 | Face traseira **cega**: poços dos bornes não existiam | `drill()` recebia coordenadas de mundo, mas `box()` está centrado em z = 16,5 → o corte caía no vazio |
| 3 | Aro Ø29 **à frente** do disco, atravessado pelo «espigão» de fixação | aro em z 52,6…54,1 · disco em z 53,3 · espigão em x 13,2 a atravessar o aro |
| 4 | Sem identificação de bornes | a face traseira não tinha os números 1/2 (NF) e 4/3 (NA) |
| 5 | Clique só com curso, sem som nem cor | `applyIndustrialState` não tocava no disco |

## Correções

- **Pilha frontal real** (da frente para trás): disco colorido flush dentro do
  aro cromado Ø29 → bainha 9,5 mm → porca sextavada de fixação (a peça que
  aperta o painel) → placa de zamak 30×30×10 → bloco de contactos 33 mm.
- **Bornes**: poço escavado em coordenadas locais (profundidade 5,2 mm), cabeça
  de fenda assente no fundo do poço com o veio para dentro do bloco, número do
  borne impresso ao lado de cada poço (`xb2-terminal-N.png`).
- **Clique**: o disco desce 2,00 mm e muda de cor (repouso → premido) em
  `applyIndustrialState`, com som de botoeira (`playClick('button')`) no
  `IndustrialDevice3D`. Sem inventar iluminação: o KL-XB2 só acende nas versões
  com lâmpada.
- Serigrafia das faces laterais eliminada (o texto estava a ser projectado nas
  faces ±Y, a atravessar o bloco).

## Verificação

- `applyIndustrialState` premido: curso 2,00 mm, cor `#2f9e3f → #1d6f2c`.
- Em repouso forçado (Admin, capas, fotografia) o disco fica sempre em repouso.
- `tsc -b --noEmit` limpo.
- `test:industrial` **164 PASS** — as 2 falhas ATV continuam a ser as
  pré-existentes (reproduzem-se com as alterações em stash).
- `test:industrial-iec` **77 PASS** · `test:terminal-geometry` 59 modelos / 335
  encaixes · `test:terminal-seat` 323 bornes na cavidade.
- `test:industrial-panel-ui` continua a parar na asserção GEYA pré-existente
  (`industrial-panel-ui-smoke.mjs:95`).
- Capas das 6 variantes regeneradas (`80/84`; as 4 em falta são as
  pré-existentes buttonNO/buttonNC/selector2/3).

## Evidência

- `xb2-vistas.png` — frente, isométrica, traseira e lateral do modelo novo.
- `capas-frente.png` — capas regeneradas (verde, vermelha, amarela, branca).
- `xb2-trASEIRA-ANTES.png` — antes: face cega, poços inexistentes.

## Limites declarados

Reconstrução cotada das fotografias e do desenho do fabricante; **não é CAD
oficial da KEOLEA**. A cor de pressão é uma convenção de simulação (o disco real
apenas desce), declarada em `sources.json`.
