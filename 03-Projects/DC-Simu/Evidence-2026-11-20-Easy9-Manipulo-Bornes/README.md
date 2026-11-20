# Easy9 Switch (EZ9S) — manípulo, acabamentos e bornes

Data: 2026-11-20 · commit `dc-simu` `9cef9be` (main)

## O que o utilizador reportou
«Ainda não me agarra os interruptores, a serigrafia parece-me bem, mas o manípulo,
acabamentos e bornes não estão corretos.» Serigrafia assinada — não foi tocada.

## Correções
1. **Manípulo (travessa vermelha).** O corte de cor pintava de vermelho todas as
   faces com z < 68 mm, apanhando o recesso branco do molde (z 62,4…65,5) e o leque
   das alavancas (até z 69,6 mm). Resultado: um bloco vermelho liso, sem leitura de
   manípulo. Critério passa a ser «chega à frente»: **vermelho só com z > 71 mm**.
   As faces da janela saem do corpo para `ez9s_lever_<n>`.
2. **Bornes.** O STEP já escava o degrau do borne e o poço do parafuso. O parafuso
   Pozidriv (cabo + cruz) assenta no fundo do poço a **z ≈ 38,6 mm**; foram removidos
   o aro e o disco opaco que estava à frente e que tapavam o parafuso (liam-se como
   mancha preta na face do degrau).
3. **Rótulo de catálogo.** Desceu de z 64,7 para **z 68,3 mm**, no filete sob o
   manípulo: em 64,7 ficava à frente dos bornes de saída e tapava-os.

## Auditorias
- `terminal-geometry-smoke` — PASS 58 modelos CAD.
- `terminal-seat-smoke` — PASS 314 bornes integrados, 43 correções «boca → cavidade».
- `imported-components`, `thermal-controls`, `siemens-plc`, `breaker-cut`,
  `panel-accessories`, `meters-schneider`, `builtin-sync` — todos PASS.
- `tsc -b --noEmit` limpo; `test:ci:fast` 16/19 (falhas `test`, `test:mechanical`,
  `test:industrial` pré-existentes).

## Evidência
`ez9-switchSchneiderEz9s1p-front.png`, `...-iso.png`,
`ez9-switchSchneiderEz9s4p-front.png`, `...-iso.png`,
`switchSchneiderEz9s4p.webp` (capa regenerada).
