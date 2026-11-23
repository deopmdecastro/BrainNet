---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-23
updated: 2026-11-23
tags: [dc-simu, estampagem, atec, qe1, s7-300, cablagem, compressor]
---
# QE1 com ilha S7-300 e cablagem do guião 1185 (dc-simu `97cd090d`)

## Pedido
Três correções na maquete, a partir das fotos do telemóvel e da bancada real:

1. **Compressor** — os tubos e os manómetros não podem parecer flutuar; o pressostato, os
   manómetros, o regulador e o engate têm de assentar em racores/suportes.
2. **Quadro de baixo (QE1)** — fonte de alimentação azul realista, relé de segurança e PLCs DI,
   DO e AI, todos montados e ligados dentro do quadro (de preferência o modelo do guião).
3. **Cablagem** — ligar as entradas e as saídas conforme o guião.

## Resultado

### Compressor (Maxxim 24 L)
- O grupo de ar deixou de estar solto atrás da carenagem. Passa a ter:
  uma **consola de chapa** com dois pés apoiados no tampo do tanque, um **coletor de latão**
  com quatro tomadas e um **racor por aparelho** (entrada do tanque, pressostato,
  manómetro de tanque, regulador com manómetro de saída e engate rápido).
- Novos traçados com **luva de aperto nas duas pontas** (`RigidTube`): a mangueira trançada sai
  do engate do regulador e acaba num **engate rápido com suporte em L** no tanque; a linha de
  cobre sai do pressostato e entra num **boss soldado** no tampo.
- O logótipo MAXXIM já não derruba a cena quando a textura falta (lettering de reserva).
- **Som próprio**: corpo do motor + batida do pistão + sibilino de admissão, modulados pela
  pressão do tanque (`setCompressorSound`, chamado no fim de cada scan).

### QE1 — quadro de campo sob a mesa
- Quadro **560 × 660 × 220 mm** com três filas em calha DIN TS35 e quatro calhas técnicas:
  - **Fila A** — fonte azul do catálogo `powerSupplyProauto24A` (G1) · relé de segurança
    Allen-Bradley MSR127TP (KS1) · K1/K2 do motor M1.
  - **Fila B** — réguas X20 (24 V/0 V/PE) e X21…X26.
  - **Fila C** — **ilha Siemens S7-300**: CPU 315-2 PN/DP (6ES7315-2EH14) + SM321 DI 32
    (6ES7321-1BL00) + SM322 DO 32 (6ES7322-1BL00) + SM334 AI4/AO2 (6ES7334-0CE01).
- Cotas tiradas do fundo com folga explícita entre o aparelho mais alto de cada fila e a calha
  seguinte (fonte 124,5 mm · bornes 66 mm · S7-300 125 mm). Verificado por script: nenhuma peça
  sai do quadro e os quatro módulos não se sobrepõem.

### Cablagem conforme o guião ATEC 1185
- As réguas passaram a usar os **endereços do guião** (antes eram Q0.x/Q1.x):
  - **X21** = I0.0 C1_Recuado · I0.1 C1_Avancado · I0.2 C3_Avancado · I0.3 C3_Recuado ·
    I0.4 C4_Recuado · I0.5 C4_Avancado · I0.6 Sensor_Cor · I0.7 FC_Estampagem ·
    I1.0 FC_Alimentador · I1.1 Sensor_Metal · I1.2 C2_Avancado · I1.3 C2_Recuado ·
    I1.4 B_Start · I1.5 B_Stop · **I1.6 Sel_Auto** · **I1.7 Seguranca_OK**.
  - **X22** = Q4.0 Y6_Cil1_Av · Q4.1 Y7_Cil1_Rec · Q4.2 Y5_Cil2_Rec · Q4.3 reserva ·
    Q4.4 Y4_Cil2_Av · Q4.5 Y8_Ventosa_On · Q4.6 Y9_Ventosa_Off · Q4.7 Y2_Cil3_Rec ·
    Q5.0 Y1_Cil3_Av · Q5.1 Y3_Cil4_Estampa · Q5.2 K1_M1_Esq · Q5.3 K2_M1_Dir ·
    Q5.4/Q5.5/Q5.6 LEDs amarelo/verde/vermelho.
- O SM322 expõe o bloco **Q4.x/Q5.x** (`S7300_SM322_FIRST_BYTE`), de modo que o borne do módulo,
  o borne da régua e a tag do GRAFCET dizem o **mesmo endereço**.
- Troço que faltava **dentro** do quadro: régua → borne do módulo (16 DI + 15 DO), +24 V/0 V em
  L+/M dos quatro módulos e o **laço de segurança** (X20 → A1, X24 → S11, contacto 13 → X21.16).
- Resultado: **116 cabos** na maquete, **sem pontas órfãs**.

## Verificação
- `npx tsc --noEmit` restrito ao subgrafo (compressor, bancada, cablagem, S7-300, áudio): **0 erros**.
  (`tsc -b` completo continua a morrer por OOM no sandbox.)
- Script de inspeção da bancada: peças dentro do quadro, sem sobreposição de módulos.
- Script de cablagem: 116 cabos, 41 interiores ao QE1, 0 pontas sem peça.
- Índices I/Q da régua comparados com `grafcetExamples.ts` (`estampagemGuiao`): **coincidem**.
- Render do compressor e dos módulos S7-300 inspecionado em harness de dev (removido depois).

## Correção de registo
- O commit `11d0b56b` publicou o `PneumaticsDevices3D.tsx` **truncado** (598 de 2270 linhas, só o
  compressor e o suporte do FRL). Ficheiro restaurado de `f5ab2c0f` e recuperado neste commit —
  os 13 componentes pneumáticos voltam a existir.

## Pendências
- Falta validar em bancada: os LEDs I1.6/I1.7 no GRAFCET já correspondem ao seletor Auto/Manual e
  ao contacto do relé de segurança, mas o teste automático `test:estampagem-guiao` não cobre a
  passagem do contacto físico do KS1.
- Os módulos S7-300 ocupam 164 mm dos 520 mm da calha C: sobra espaço para o módulo de contagem
  se se quiser contar peças por hardware em vez de M0.3–M1.0.

---

## Build de produção (2026-11-23, 11:14 UTC)

O `npm run build` falhava no Vercel no passo `test:maquettes-build` (entre o `tsc -b` e o
`vite build`), não por TypeScript. Três causas, em três commits:

- **`f7dbc3da`** — `test:maquettes-build` comparava com o literal `161`; a ilha S7-300 levou a
  maquete a **117 peças / 168 componentes / 59 tipos**. Os testes passam a calcular as contagens
  na fonte. Corrigida também uma regressão minha: `stopCompressorSound` usava `window.setTimeout`
  e rebentava em Node, derrubando qualquer teste que chamasse `silenceAll()`.
  E a cablagem inválida: `Q4.1 → CPV10:Y7` (o CPV10 tem Y0–Y6 + VON/VOFF, não tem Y7) — o cabo
  era descartado em silêncio. As réguas mantêm os endereços do guião e as tags passam a nomear a
  função no aparelho real: estação 1 = Cil1 (Y0/Y1), 2 = Cil2 (Y2/Y3), 3 = Cil3 (Y4/Y5),
  4 = Cil4 mono (Y6), 5 = vácuo (VON/VOFF).
- **`f6883301`** — os «✕ 3 ⚠ 6» da barra de estado. Os 3 erros: os bornes dos sinalizadores iIL
  1P eram `io`/`io` (X2 é o neutro; a versão 3P já o declarava `neutral`); os cabos de 0 V estavam
  marcados `power` e o validador acusava fase-no-neutro; e a fonte PS1 estava montada sem um único
  cabo. Agora PS1 é alimentada a 230 V pela tomada da maquete (XS-MAQ `OUT.L`/`OUT.N`) e entrega
  +24 V / 0 V / PE ao X20. Estado: **0 erros · 2 avisos** (o canal `+V2`/`-V2` da fonte, livre).
- **Deploy**: `dc-simu.vercel.app` passou a servir o bundle `index-DyL2gKoM.js` às 11:16:50 —
  contém `Cil1_Avanc` e já não contém `Y7_Cil1_Rec`.

Nota: `vite build` não corre no sandbox de desenvolvimento (2 GB, «Killed» em transforming) —
já falhava antes destes commits; no Vercel passa com folga. `test:qgd` falha por falta de
backend, também já antes destas alterações.
