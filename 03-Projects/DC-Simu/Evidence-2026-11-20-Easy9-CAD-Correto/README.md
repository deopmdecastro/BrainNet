# Easy9 Switch (EZ9S) — bornes e manípulo com o CAD do próprio produto

Data: 2026-11-20 · commit `dc-simu` `a7c6ad9` (main) · substitui a tentativa `9cef9be`

## O que o utilizador reportou
«Ainda está mal os bornes e parafusos: no corte tem 8 parafusos e bornes em cima, e
mais outros 8 em baixo, parece que foi reaproveitado um corte neutro e fase para fazer
tudo. Manípulo também está muito diferente.»

## Causa raiz
O STEP que alimentava os três GLB **não era do Easy9 Switch**. `MCADFD0001285` é da
gama **iSW/SW**: o molde tem duas cabeças de borne por polo em cima e duas em baixo e
uma alavanca branca lisa. Num 4P isso dá 8 + 8 parafusos. Nenhum ajuste de posição,
cor ou profundidade de túnel corrigia o defeito — a geometria era de outro aparelho.

## Correção
Novo CAD oficial, descarregado da ficha de cada referência:

| modelo | referência | STEP |
|---|---|---|
| 1P | EZ9S16163 | MCADFD0002242 |
| 2P | EZ9S16263 | MCADFD0002243 |
| 4P | EZ9S16491 | MCADFD0002245 |

Cada um traz, **por polo e por face, um único parafuso Pozidriv** (`VIS_7D`), a
alavanca vermelha real (`MANETTE`, com o entalhe oval no lábio) e a travessa que liga
os polos (`EXTENSION_MANETTE_02`). As peças do STEP são repartidas por função —
`ez9s_body_<n>`, `dcsimu_handle_<n>`, `dcsimu_handle_bridge`, `ez9s_clip_<n>`,
`ez9s_screw_<face>_<n>` — sem reconstrução por caixas.

Bornes: o ponto de ligação passa a assentar no **poço real do molde** (canal de
10 × 16 mm, fundo a 18,5 mm da face, a 25 mm da traseira), com o recuo de 1/3 da
profundidade que já se usa nos outros aparelhos. Não se acrescenta liner nem disco
escuro — um cilindro de Ø9 mm a sair da face lia-se como um tarugo preto.

## Outros acertos

- Referencial nominal `18 mm/polo × 84,5 × 75,1`; o envelope medido do CAD fica em
  `measuredSizeMm` (1P: 17,85 × 84,5 × 74,26) e a malha nunca é esticada para caber.
- Charneira do manípulo na aresta de topo do conjunto vermelho; a travessa passa a
  estar na lista de nós que rodam.
- Serigrafia reancorada: parede frontal do molde a 66,5 mm da traseira; faixa de
  catálogo no filete entre o degrau e a parede (63,4…66,3 mm sobre a calha).
- Cabeças de parafuso em aço claro (eram discos escuros lidos como buracos).

## Verificação
`terminal-geometry` PASS (58 CAD, 326 encaixes) e `terminal-seat` PASS (314 bornes),
nos três modelos. `meters-schneider`, `builtin-sync`, `imported-components`,
`breaker-cut`, `cad-surface` e `editor3d-functional` PASS. Typecheck limpo;
`test:ci:fast` 16/19 com as mesmas falhas pré-existentes. Capas e vistas frontais
dos três regeneradas.

## Evidência
`ez9s-1p-iso.png`, `ez9s-2p-iso.png`, `ez9s-4p-iso.png` (as três vistas 3/4 do GLB
final), `step-2242-modulo.png` (módulo bruto do STEP, para comparar), e as capas
`switchSchneiderEz9s{1p,2p,4p}.webp`.
