# Maquete de estampagem e transferência — componentes 3D

**Data:** 2026-11-22 · **Commit:** `dc-simu@ca6d4c5` (`main`, rebaseado sobre `77122b6`)

## Pedido

Criar todos os componentes do relatório técnico «Maquete Didática de Estampagem e
Transferência Eletropneumática» (perfis, base, suportes, sensores, braço, motor…),
em 3D realista. Se um componente já existisse, devia ser reutilizado ou adaptado.

## O que já existia e foi reutilizado

| Relatório | Componente DC-Simu existente |
|---|---|
| Ilha de eletroválvulas | `pneumaticManifold` (Festo VTUG, 4 estações) |
| Sensor ótico S_OTICO | `photoSensor` |
| Sensor indutivo S_INDUTIVO | `proximitySensor` (M18 PNP) |
| PLC Siemens | `plcSiemensS71500Cpu1511c` / `plcSiemensS7300Cpu315` / LOGO! |
| Calhas de cablagem | `cableDuct` |
| Tubagem e racores | tubos pneumáticos, `pneumaticUnion` / `pneumaticElbow` / `pneumaticTee` |

## Componentes novos (14, grupo «Mecatrónica»)

As cotas são as **estimadas** do relatório (Tabela 1). Nenhum componente tem
fabricante atribuído: todos são identificados como «DC-Simu Mecatrónica».

| Tipo | Relatório | Simulação / bornes |
|---|---|---|
| `mecSlotPlate` | Base ranhurada 700 × 500 × 20, 20 ranhuras T, passo 25 | Botão «Montar maquete completa» |
| `mecAluProfile` | Perfil 30 × 30 / 40 × 40, tampas de topo e cantoneiras | — |
| `mecGravityMagazine` | Tubo 50 × 50 × 260, parede 3, rasgos 20 × 85, elevado 45 mm | Coluna de 6 tarugos e zona de recolha |
| `mecWorkpiece` | Tarugo Ø40 × 35 (alumínio, polímero branco, polímero escuro) | — |
| `mecDischargeRamp` | Calha 220 × 50, abas 20, 15°, pilar 110/95/80 | Recebe as peças triadas |
| `mecStampingTable` | Gaveta 120 × 80 × 45, rebaixo Ø42 | Peça por estampar ou estampada |
| `mecStampingPress` | Pórtico 300 (perfil 30), cilindro Ø32 × 50, prato Ø65, manómetro | A/B, SUP+/SUP, INF+/INF |
| `mecFeederCylinder` | Cilindro 1 Ø20 × 80, empurrador | A/B, REC+/REC, AVA+/AVA |
| `mecRotaryArm` | Disco Ø140 × 15, torre 160, braço 240, ventosa Ø25, roda cónica Ø60 | Z (descer), VAC, HOME+/HOME |
| `mecDcGearmotor` | Motor Ø36 × 95, pinhão Ø30 (2:1), encoder Ø30 | +24V, 0V, CW, CCW, A, B |
| `mecMicroSwitchRoller` | FC 1 com alavanca e rolete | C, NO, NC |
| `mecVacuumEjector` | Gerador de vácuo Venturi com silenciador | P → V |
| `mecDragChain` | Esteira porta-cabos articulada | — |
| `mecSupportBlock` | «Suportes e blocos maquinados» de elevação | — |

O mapa de E/S do relatório tem correspondência direta: `FC_CIL1_REC/AVA`
nos reeds do Cilindro 1, `FC_PRENSA_SUP/INF` nos da prensa, `S_HOME_BRACO`
no sensor 0° do manipulador, `ENC_A/ENC_B` no encoder, `K1_M1_HORARIO` e
`K2_M1_ANTIHOR` nas entradas CW/CCW, `Y3_BRACO_DESCE` na porta Z e `Y4_VACUO`
no ejetor.

## Hierarquia de pivôs (secção 5 do relatório)

Os grupos animados têm os nomes pedidos para exportação GLB:
`Maquete_Base` (base ranhurada), `Cilindro1_Haste`, `Prensa_Haste`,
`Braco_Torre_Rotacao` → filho `Braco_Articulacao_Z`, `Motor_Pinhao` e, adicionalmente,
`Encoder_Veio`. A verificação 8 de `test:mechatronics` impede que os nomes se percam.

## Decisão de cinemática (registada)

Com as cotas estimadas, o braço articula a 209 mm da base. O prato de um
cilindro montado por baixo da travessa ficaria a 126 mm, e o braço atravessaria
o cilindro ao chegar à prensa. Foram feitas duas adaptações:

1. **O cilindro da prensa fica por cima da travessa** e a haste atravessa-a. O
   prato recolhido fica 46 mm abaixo da travessa, a 224 mm da base, acima do
   braço.
2. **As estações ficam à mesma cota (172 mm, topo da peça)**. Para isso usam-se
   os «suportes e blocos maquinados» do relatório (bloco de 129 mm sob o
   magazine e o Cilindro 1, bloco de 100 mm sob a gaveta). O curso de 50 mm da
   prensa chega então ao topo da peça na gaveta.

## Verificações

- `npm run test:mechatronics`: 8 verificações (a 8.ª cobre os pivôs GLB). Cobrem a biblioteca, as cotas,
  os contactos, o ciclo de peças, o motor/encoder, a simulação real
  (FRL → 5/2 → Cilindro 1, ejetor → ventosa) e a montagem.
- `npm run test:mechatronics-ui`: 18 verificações no Painel 3D. Os 14 modelos
  são desenhados. A ventosa em baixo encosta ao tarugo na recolha e na gaveta
  (−1,6 mm de compressão do fole, desvio de 1,5 mm). O prato recolhido fica
  4,7 mm acima do braço. Sem exceções React/WebGL.
- `npx tsc -b`, `npm run test:hooks` (eslint) e `npm test`: OK, repetidos após o rebase
  sobre `77122b6` (WAGO 221 / BALLUFF). Conflitos em `manifest.json`, `types/index.ts`,
  `proceduralKinds.ts` e `release-stamp.json` resolvidos mantendo os dois lados.
- `npm run test:ci:fast`: 20/22. As falhas em `test:terminal-geometry` e
  `test:terminal-seat` (bornes do Murrelektronik MICO) **já existiam** no
  commit anterior `648963e`. Foi confirmado num worktree limpo.
- `test:library-covers-ui` falha ao abrir o painel inicial («Novo projeto»).
  Também **já existia** em `648963e`.

## Capturas

- `maquete-montada.png`: montagem completa no Painel 3D.
- `ventosa-recolha.png`: ventosa em baixo sobre o tarugo na zona de recolha.
- `ventosa-prensa.png`: o braço passa por baixo do prato e a ventosa fica sobre a gaveta.

## Pendências

- A cablagem e a tubagem da maquete não são criadas pelo botão de montagem.
- Os sensores ótico e indutivo existentes não seguem automaticamente a peça na
  zona de recolha: são acionados à mão no inspetor.
- O componente é colocado sem rotação. As rampas e o Cilindro 1 têm direção fixa
  (descida/avanço para +X).
- Não foi feita publicação nem deploy.

## Atualização da mesma data: 22 componentes

O grupo «Mecatrónica» passou de 14 para 22 tipos. Os 8 novos são equipamento que já
estava na bancada fotografada: `mecDrawerCylinder` (Cilindro 3 · B2/B1),
`mecValveIsland` (Festo 2× 5/2 · C1A/C2A), `mecOpticalSensor` (S. OTICO · B11),
`mecInductiveSensor` (S. INDUTIVO), `mecHmiKtp700` (Siemens KTP700 Basic em bastidor
30 × 30), `mecOperatorBox` (6 operadores Ø22), `mecSignalTower` (3 níveis LED) e
`mecBenchDuct` (calhas ranhuradas perimetrais).

Os 14 anteriores foram refeitos com geometria e texturas tiradas das fotos de
2026-11-04: braço trapezoidal com dois rasgos, correia dentada e filtro ZFC no
manipulador, mangas impressas Portescap/RT3806 no motor, disco ótico de 4 pás, gaveta
com alojamento quadrado, etiquetas `CILINDRO 1/3/4`, `FC 1/2` e `METALICA`/`PRETA`/
`BRANCA`, e a folha «PROJETO DESENVOLVIDO PELA TURMA ARMI 01.26-A M» na calha frontal.

Capturas novas nesta pasta: `maquete-22-componentes.png` (montagem completa),
`hmi-ktp700.png`, `pupitre-6-operadores.png`, `ilha-valvulas-c1a.png`,
`cilindro-3-gaveta.png`, `torre-sinalizacao.png` e `sensor-otico-b11.png`.

Detalhe completo em `Validation-2026-11-22-Maquete-ATEC-22-Componentes.md`.
