---
type: validation
status: IMPLEMENTED_TESTED_LOCAL
created: 2026-11-22
updated: 2026-11-22
tags: [dc-simu, mecatronica, estampagem, atec, 3d, texto-procedural, validacao]
---
# Maquete ATEC: 22 componentes, CAD paramétrico e fotografia das estações

## Resultado

Implementado e testado localmente, sem publicação. O grupo «Mecatrónica» passa de 14
para **22 componentes**. Os 8 novos correspondem a equipamento que já existia na bancada
fotografada mas não era modelado (Cilindro 3 da gaveta, ilhas de eletroválvulas C1A/C2A,
S. OTICO, S. INDUTIVO, consola Siemens KTP700, pupitre de 6 operadores, torre de
sinalização e calhas técnicas). Os 14 anteriores foram refeitos com geometria e
texturas tiradas das fotos de 2026-11-04.

Cada componente mantém o contrato do grupo: aparece na biblioteca, tem inspetor,
tem volume 3D, recebe acabamento PBR procedural e **não** é um objeto de chapa
(`isPanelBound === false`).

## Componentes novos

| Tipo | Cotas (mm) | Bornes | Simulação |
| --- | --- | --- | --- |
| `mecDrawerCylinder` | 42 × 44 × 210 (Ø20 × 75) | `A`, `B`, `REC+`/`REC`, `AVA+`/`AVA` | Reed B2/B1 fecham com o curso em 0 % / 100 % |
| `mecValveIsland` | 92 × 44 × 56 | `P`, `A1`/`B1`, `A2`/`B2`, `Y1`, `Y2`, `0V` | Com `Y1`/`Y2` a 24 V a saída passa de Bn para An |
| `mecOpticalSensor` | 62 × 76 × 44 (M18) | `+24V`, `0V`, `OUT` | Comuta com tarugos claros e metálicos |
| `mecInductiveSensor` | 36 × 34 × 36 (M12) | `+24V`, `0V`, `OUT` | Comuta só com tarugo de alumínio |
| `mecHmiKtp700` | 234 × 286 × 86 | `L+`, `M`, `PN` | Ecrã apagado sem 24 V (fidelidade LCD) |
| `mecOperatorBox` | 168 × 66 × 114 | `+24V` + `EMERG`/`STOP` (NF) e `AUTO`/`REARME`/`CICLO`/`START` (NA) | Liga e desliga os contactos do pupitre |
| `mecSignalTower` | 58 × 330 × 58 | `G`, `Y`, `R`, `0V` | Nível segue a cablagem; sem fios segue o comando manual |
| `mecBenchDuct` | 700 × 35 × 45 (`axis: x \| z`) | — | Calha ranhurada com tampa opcional |

## Fidelidade às fotos

- **Cilindro 1 / 3 / 4 e prensa**: etiqueta impressa (`CILINDRO 1`, `CILINDRO 3`,
  `CILINDRO 4`), reeds com as etiquetas B8/B9, B2/B1 e B3/B4, reguladores de caudal
  unidirecionais nos racores e porca sextavada dupla na haste da prensa.
- **CILINDRO 2 / braço**: braço trapezoidal aligeirado com dois rasgos
  (`taperedArmGeometry`), correia dentada sob o disco, filtro em linha ZFC no circuito
  de vácuo e reeds B6/B7 no corpo do cilindro vertical.
- **M1 Portescap**: manga impressa «Portescap · ESCAP 28L28 · R32 19.5:1», borne
  branco de 2 polos, disco ótico de 4 pás e manga do encoder `RT3806-AB-400N`.
- **FC 2**: gaveta com alojamento quadrado fresado (`squarePocketBlockGeometry`,
  opcional por `pocketShape: 'square'`) e etiqueta na face frontal.
- **Rampas**: etiquetas `METALICA`, `PRETA` e `BRANCA` na aba da calha.
- **Calhas**: `slottedDuctGeometry` com dentes e tampa; a calha frontal leva a folha
  «PROJETO DESENVOLVIDO PELA TURMA ARMI 01.26-A M» (`plaque: 'atec'`).
- **HMI**: moldura SIEMENS/SIMATIC HMI, ecrã `Start Center` ou página de processo,
  teclas F1–F8, caixa traseira ventilada, etiqueta `6AV2 123-2GB03-0AX0`, ficha 24 V
  laranja e cabo PROFINET.

## Bancada

`stampingBenchLayout()` passou a devolver 25 itens: mantém magazine/Cilindro 1/FC 1,
manipulador, M1, gaveta, prensa, 3 rampas, ejetor, esteira e blocos de elevação, e
acrescenta o S. INDUTIVO embutido na zona de recolha, o S. OTICO num suporte em L à
frente da recolha, o Cilindro 3 sobre a base a apontar à gaveta, as duas ilhas C1A/C2A,
a torre no canto traseiro esquerdo, a consola KTP700 no canto traseiro direito, o
pupitre junto à calha frontal, as quatro calhas perimetrais e o poste de perfil 40 × 40.

Duas decisões de montagem, para caber no volume da base (700 × 500):

1. O **S. OTICO** fica em pé na base, à frente do magazine, com `facing: 'x-'` a apontar
   à zona de recolha (o suporte não sai da base e não atravessa o Cilindro 1).
2. O **Cilindro 3** fica deitado na base, em frente do pórtico, com `facing: 'z-'`; a
   forquilha entra na face da gaveta. Encostado à mesa da prensa (z ≈ −284 mm) sairia
   da base.

## Verificações

| Verificação | Resultado observado |
| --- | --- |
| `npm run test:mechatronics` | 13 verificações aprovadas (22 componentes, cotas, contactos, ciclo completo, motor/encoder, simulação real, montagem dentro da base, hierarquia de pivôs, alcance radial) |
| `npm run test:mechatronics-ui` | 31 verificações aprovadas no Painel 3D; os 22 modelos são desenhados, a ventosa encosta ao tarugo na recolha (−0,2 mm) e na gaveta (−0,3 mm), o curso vertical é 18,0 mm sem desvio e o prato recolhido fica 34,6 mm acima do braço; sem exceções React/WebGL |
| `npm run test:builtin-sync` | 1332 verificações OK (204 integrados, 84 com GLB) |
| `npm run test:style` | Aprovado |
| `npm run test:device-lcd` | 76 verificações aprovadas |
| `npm run test:library-covers-ui` | Aprovado, repetido duas vezes (157 capas, nenhum GLB pedido pela biblioteca) |
| Capas `build-component-covers.mjs` | 22 capas e 22 vistas frontais regeradas a partir dos novos modelos |
| `npx eslint` nos ficheiros alterados | 0 avisos |
| `tsc` sobre o subgrafo alterado | 0 erros (ver nota) |
| Cofre: `npm test` | Ver secção seguinte |

### Nota sobre `tsc -b`

O ambiente de trabalho tem 2 GB de RAM e não tem swap: `npm run typecheck` (`tsc -b`)
morre por falta de memória antes de terminar. Foi por isso verificado o subgrafo
alterado com um `tsconfig` temporário que inclui `MechatronicsDevices3D.tsx`,
`mechatronicsSymbols.tsx`, `MechatronicsControls.tsx`, `stampingBench.ts`,
`mechatronicsGeometry.ts`, `mechatronicsModel.ts` e `vite-env.d.ts` — 0 erros, e esse
subgrafo arrasta `useSimStore`, `engine`, `factory` e o catálogo. O `tsc -b` completo
fica pendente de uma máquina com mais memória.

## Capturas

Em `Evidence-2026-11-22-Maquete-Estampagem/`:

- `maquete-22-componentes.png`: montagem completa com os 22 tipos.
- `hmi-ktp700.png`, `pupitre-6-operadores.png`, `ilha-valvulas-c1a.png`,
  `cilindro-3-gaveta.png`, `torre-sinalizacao.png`, `sensor-otico-b11.png`: pormenores
  dos componentes novos.

## Pendências

- A cablagem e a tubagem continuam a não ser criadas pelo botão «Montar maquete».
- `test:library-covers-ui` e `--check` das capas continuam a acusar
  `buttonNO`, `buttonNC`, `selector2` e `selector3` sem capa: **já acontecia antes**
  desta alteração.
- Não foi feita publicação nem deploy.
