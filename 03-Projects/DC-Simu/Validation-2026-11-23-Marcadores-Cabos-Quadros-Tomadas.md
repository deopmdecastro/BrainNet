---
type: validation
status: IMPLEMENTED
created: 2026-11-23
updated: 2026-11-23
tags: [dc-simu, cabos, marcadores, anilhas, quadro, tomadas, organizacao]
---

# Marcadores de cabos nos quadros e tomadas (Passo 3)

## Pedido
Melhorar a organização dos cabos; usar marcadores de cabos (anilhas) — incluindo nos quadros e nas descidas para as tomadas.

## Solução
Ao montar a **Maquete Estampagem**, cada cabo gerado a partir de `stampingBenchWiring` passa a receber **duas anilhas amarelas** (estilo CAB3/WIC):

- Posição `t = 0.10` (perto da ponta de origem — quadro / borne)
- Posição `t = 0.90` (perto da ponta de destino — tomada / sensor / válvula)

O texto é derivado do `number` do cabo (ex.: `XS-MAQ:L`, `X21.3`, `COM+24V`), truncado a 10 caracteres e sem espaços, e expandido em anilhas individuais por `WireMarkers3D` / `expandWireMarkerRings`.

## Ficheiro
`src/store/useSimStore.ts` — construção de `benchWires` a partir de `BenchWireSpec`.

## Integração
- Commit dc-simu: `445158755f6c7241ee196c97e216775631b7a35a`
- Infraestrutura 3D já existente (`WireMarkers3D.tsx`, `wireMarkers.ts`) — apenas preenchimento dos dados.

## Nota
Cabos criados manualmente no editor continuam a poder receber marcadores pelo inspetor. Esta alteração cobre automaticamente a cablagem da maquete (QGD, QE1, tomadas, campo).

Estado: **implementado e publicado**. Revisão visual pendente (remontar a maquete para ver as anilhas).
