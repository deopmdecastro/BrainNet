---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-05
updated: 2026-11-05
tags: [dc-simu, bornes, regua, 3d, agrupar]
---
# Régua de bornes: agrupar e encostar no 3D

## Pedido
«Criou os bornes mas não juntou todos e nem agrupou.» Reaproveita a criação de vários bornes (`createTerminalStrip`, dc-simu `c6e6c03`) e os grupos de seleção (`selectionGroups`, Ctrl+G).

## Causa
- A criação não gerava grupo: os bornes ficavam soltos.
- O passo era certo no Esquema (0 px, encostados), mas o 3D põe cada aparelho na posição do Esquema (1,5 px/mm) e o símbolo PTI 6 ocupa 76 px (≈ 50 mm) para um corpo real de 8,15 mm: no 3D ficavam a ~50 mm uns dos outros.

## Resultado (dc-simu `690d6dd`)
- `createTerminalStrip` cria o grupo (`groupIds`, vista `schematic`) e dá a todos o mesmo `state.stripId`.
- `Panel3D`: bornes com o mesmo `stripId` encostam pelo corpo real (`componentHalfExtents`); o primeiro fica no sítio e os outros seguem-no, também se estiverem numa calha DIN.
- `test:terminal-strip`: 17 verificações (grupo com os 5 e `stripId` único).

## Pendências
- Réguas já criadas antes desta correção não têm `stripId`: apagar e recriar, ou selecionar e Ctrl+G (agrupa, mas não encosta no 3D).
- Só trata réguas na horizontal (rotação 0/180).
- Validar no tablet; `vite build` não foi executado.
