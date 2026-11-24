---
type: validation
status: IMPLEMENTED
created: 2026-11-24
updated: 2026-11-24
tags: [dc-simu, maquete, estampagem, rampas, motor, cilindros, composicao]
---

# Composição da maquete: rampas paralelas e alinhadas, motor M1 a engrenar no braço

## Pedido (2026-11-24g)
- «Organizar os componentes da maquete desta composição (6 fotografias IMG_5940–5944 + vista de cima). Há coisas por melhorar na maquete 3D: cilindros, motores, rampas alinhadas, etc.»

## Comparação com as fotografias
| Elemento | Fotografia | 3D antes | Ação |
|---|---|---|---|
| Rampas METALICA / PRETA / BRANCA | três calhas de inox **iguais, paralelas, lado a lado**, bocas alinhadas | comprimentos 170/180/140 mm, pilares 110/95/80 mm, bocas desencontradas em leque | **corrigido** |
| Motor M1 | deitado, eixo apontado à torre, pinhão cónico engrenado na roda branca | rodado 90° — o pinhão apontava para a traseira, longe da roda | **corrigido** |
| Cilindro 1 (alimentador) | atrás do magazine, empurra para a recolha | conforme | sem alteração |
| Cilindro 3 (gaveta FC 2) | à direita da gaveta, haste para o pórtico | conforme | sem alteração |
| Cilindro 4 (prensa B3/B4) | pórtico com manómetro | conforme | sem alteração |
| HMI, coluna luminosa, magazine, braço | | posições conformes | sem alteração |

## Solução (`stampingBench.ts`)
- Rampas: `BENCH_RAMP_LENGTHS_MM = [150, 150, 150]`, `BENCH_RAMP_PILLAR_MM = 105`; as três bocas na mesma linha (a da rampa mais próxima do braço − 22 mm) e à mesma altura; ordem METALICA (240°, junto à HMI) · PRETA (270°) · BRANCA (300°). A boca de cada uma continua por baixo da ventosa no seu ângulo — a peça cai e escorrega.
- Motor M1 sem rotação: eixo do motor no eixo do braço, pinhão cónico na roda da torre.

## Verificação
- `test:mechatronics` 14/14 (descarga física em cada rampa para os três materiais; fora das rampas a peça perde-se).
- `test:bench-routing` **64/64** (+5: rampas iguais/paralelas/alinhadas, ordem a partir da HMI, ≥ 20 mm entre abas, rampa termina antes da HMI, motor apontado ao braço).
- `npm test` OK · `test:maquetes` 10 · `test:sockets` 17 · guião 76 · `tsc` 0 erros.

## Evidências
`Evidence-2026-11-24g-Composicao-Rampas-Motor/` — `01-antes-rampas-desalinhadas.png` / `02-depois-rampas-paralelas.png` · `03-depois-rampas-detalhe.png` · `04-antes-motor.png` / `05-depois-motor-pinhao-na-roda.png` · `06-depois-vista-de-topo.png`.

## Commits
- dc-simu `506aca4c` — fix(maquete): rampas iguais, paralelas e alinhadas e motor M1 com o pinhão na roda cónica.

## Pendências
- Os corpos dos cilindros (Ø20 inox com reguladores e sensores) e o motorredutor já seguem as fotografias; um refinamento de geometria (tampas roscadas, porcas da haste) fica como passo seguinte se for pedido.
- Projetos guardados mantêm as rampas antigas; remontar a maquete aplica a nova composição.
