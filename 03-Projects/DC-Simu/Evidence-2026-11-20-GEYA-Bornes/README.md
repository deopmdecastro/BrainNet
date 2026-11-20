# GEYA GRT8 — bornes fiéis à referência e variante M2

**Data:** 2026-11-20 · **Commit:** `dc-simu@d167d98` (`main`)

## O que o utilizador reportou

As capturas do painel 3D do projeto «Teste» mostravam o temporizador GEYA com
faixas escuras no corpo e sem identificação dos bornes. Pedido: «os bornes e
parafusos não estão fiéis à referência, deixar fiel, observar quais bornes tem
cada um e corrigir» e «verificar o número de saídas e entradas deste relé».

## Causas encontradas (medidas no GLB e no painel, não por inspeção visual)

1. **Reentrância a meio da frente.** O perfil do corpo
   (`profile` em `scripts/build-industrial-devices.mjs`) tinha o troço
   `[-7.5,37] → [-7.5,58]`, ou seja um degrau de 7,5 mm para dentro entre
   y 37 e 58 mm. Isso abria uma faixa escura a meio do aparelho e deixava a
   chapa da serigrafia a flutuar 7,5 mm à frente da parede real.
2. **Divisórias fora do corpo.** As paredes entre bornes eram caixas de 16 mm
   de profundidade centradas a z 45 mm, com o degrau a acabar em z 38 mm: saíam
   15 mm para fora e liam-se como duas barbatanas soltas (as «setas» brancas das
   capturas).
3. **Sem legendas.** As faces dos degraus não tinham A1/S/A2 nem 15/16/18
   impressos — o produto real tem-nas por cima de cada poço.

## Correções

- Frente contínua de y 2,5 a 92,5 mm (sem a reentrância).
- Divisórias dentro do volume do corpo, uma por borne.
- Uma fila de bornes por degrau, com janela oblonga, parafuso cativo Pozidriv e
  etiqueta impressa (`geya-screw-label-*.png`) por cima de cada poço:
  **A1 S A2** em cima, **15 16 18** em baixo.
- Novo `timerGeyaGrt8M2` (2×SPDT) com **9 bornes**: A1/S/A2, 15/16/18 e
  25/26/28, degrau inferior mais alto para as duas filas, serigrafia
  `GRT8-M2` própria, associação IEC 60617-7, pontes de contacto
  (15→18/16 e 25→28/26), simulação, controlos e LEDs.

## Contagem de entradas/saídas (conferida no manual GRT8-M p.1)

| Modelo | Alimentação/comando | Inversores | Bornes |
| --- | --- | --- | --- |
| GRT8-M1 (1×SPDT) | A1, S, A2 | 15/16/18 | 6 |
| GRT8-M2 (2×SPDT) | A1, S, A2 | 15/16/18 + 25/26/28 | 9 |

O M1 já estava correto (6 bornes); faltava a variante de dois inversores, que é
a que aparece na fotografia do manual junto do M1.

## Verificação

`tsc -b --noEmit` limpo. `test:industrial` 164/166 — as duas falhas ATV
(«mains supply powers controls…», «actual store scan…») reproduzem-se com as
alterações em stash, são pré-existentes. `test:industrial-iec` 77 PASS.
`test:industrial-panel-ui` sem exceções React/WebGL (a falha de clique no
seletor de escala reproduz-se igualmente em stash). Capas M1/M2/B1 regeneradas
(80/84; as 4 em falta são as pré-existentes buttonNO/buttonNC/selector2/3).

## Evidência

`geya-m1-iso.png` (M1 com as legendas), `geya-m2-frontal.png` e
`geya-m2-iso.png` (M2 com as duas filas), e as vistas frontais das capas
`geya-m1-frontal.webp` / `geya-m2-frontal.webp`.
