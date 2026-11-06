---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-06
updated: 2026-11-06
tags: [dc-simu, quadro, calha-tecnica, furos, bucim, juncoes, 3d]
---
# Furos no quadro a funcionar + pinos removidos nas junções de calhas

## Pedido
Garantir que a função de fazer furos no quadro funciona de verdade; melhorar a remoção dos pinos (dedos) onde as calhas se encontram para deixar passagem aos cabos.

## Contexto
- Estado e ações já existiam: `addPanelHole` / `updatePanelHole` / `removePanelHole` em `useSimStore`, desenho 2D em `PanelAccessories2D`.
- Junções perpendiculares (T/L/cruz) em `ductJunctions.ts` + `buildCableDuct` (3D) e `CableDuct2D` (Esquema) — [[Task-2026-11-05-Calha-Barras-Tamanho-Juncoes]].
- Furos do inspetor **não** eram desenhados no 3D do quadro.

## Alterações (dc-simu)

### Furos no quadro
- **3D (`PanelAccessories3D` / `Enclosure3D`)**: cada entrada de `state.holes` passa a desenhar na face correta (porta, topo, fundo, laterais, traseira):
  - disco escuro (cutout);
  - se há bucim (`glandType`): anel metálico + pequeno cilindro de bucim.
- Inspetor: botão «Fazer furo» com `IconPlus`; texto de estado vazio a referir Esquema + 3D.
- Store e 2D mantidos (já funcionavam).

### Pinos / passagem nas junções de calhas (`ductJunctions.ts`)
- `TOUCH_PX` 6 → **10** (encostos com pequena folga ainda abrem).
- **Margem de abertura** `OPENING_MARGIN_MM = 6`: a interseção alarga-se 6 mm de cada lado, para limpar os dedos/pinos junto à passagem (não só o vão exacto da outra calha).
- Aberturas continuam só em calhas **perpendiculares**; paralelas lado a lado não abrem (comportamento anterior).

## Validação sugerida
1. Quadro: criar furo em várias faces, com e sem bucim M20/M25; ver no Esquema e no 3D; remover e confirmar desaparecimento.
2. Calhas em T / L / cruz: verificar que a parede e os pinos abrem com margem visível no 3D e no Esquema (com e sem tampa).
3. `test:duct-resize` (smoke) deve continuar a passar (presença de aberturas, não largura exacta).

## Pendências
- Os cabos no 3D ainda tratam a calha como obstáculo sólido (encaminhamento automático não atravessa a abertura).
- Furos no 3D são indicadores/bucins; não subtraem volume real da chapa (CSG). Suficiente para montagem e leitura visual.
