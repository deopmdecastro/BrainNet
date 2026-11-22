---
type: validation
status: IMPLEMENTED
created: 2026-11-22
updated: 2026-11-22
tags: [dc-simu, maquete, estampagem, esteiras, calhas, juncoes, cabos]
---
# Esteiras: junções 3D automáticas, fundo cortado e cabos contínuos

## Pedido

- Usar a função automática das calhas DIN também nas esteiras: remover material e permitir passagem, com acessórios de união calculados automaticamente.
- Cabos e tubos apareciam interrompidos.
- Verificar porque a calha parecia cortada.

## Causa

1. `ductJunctionOpenings` só usava `schematicX/Y` (placeholders na maquete). As esteiras da nave têm `panel3DPosition` + `viewOrientation` e nunca geravam aberturas T/L/+.
2. O fundo da esteira era um único `box` a todo o comprimento — mesmo com `endTrim` o fundo invadia a união.
3. `TrayCableBundle` desenhava cilindros com `lengthMm - 30`, criando um vão de 15 mm em cada ponta → interrupção visual nas junções.
4. As patilhas de encaixe nas pontas continuavam a desenhar-se mesmo quando a ponta estava aparada.

## Correção (dc-simu `fab14a4`)

### `src/schematic/ductJunctions.ts`
- Caminho **3D** para `cableTrayStraight` com `panel3DPosition`: eixos de comprimento/largura a partir da orientação Euler XYZ, distâncias em mm (`1 u = 100 mm`).
- Deteta perpendiculares, abre parede no T e marca `endTrim` na ponta do ramal.
- `closedFloorSpans`: qualquer `endTrim` remove o fundo (já não exige top+bottom).

### `src/three/StructuresDevices3D.tsx`
- Fundo segmentado com `closedFloorSpans`.
- Patilhas só em pontas **livres** (sem `endTrim`).
- Cabos/tubos com `fullRun` (apenas 4 mm de rebaixo por ponta) para continuidade visual nas uniões.

## Limitações

- Ainda não se inserem componentes de acessório (luva/união metálica) como objectos independentes — o corte geométrico + continuidade dos cabos cobre o pedido visual. Se for preciso o peça de união explícita (como na fotografia de referência), pode acrescentar-se num passo seguinte a partir das mesmas aberturas.
- A matriz Euler assume ordem XYZ do Three.js; orientações compostas extremas devem ser validadas visualmente.

## Verificação

- TypeScript do ficheiro isolado coerente com os tipos existentes.
- Push: `origin/main` em `fab14a4`.
- Revisão visual necessária no Painel 3D após o build (maquete ATEC com esteira de parede + riser + descidas).

Estado: **implementado e publicado**.
