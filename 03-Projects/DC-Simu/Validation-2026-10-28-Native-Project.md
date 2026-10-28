---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, native-project, admin, ladder, grafcet, 3d]
---
# Validação 2026-10-28 — Projeto nativo «Partida direta»

## Pedido
Projeto nativo no código, visível na conta admin, editável em esquema 3D, Ladder e GRAFCET, em qualquer sessão.

## Implementado (`b0dfac6`)
- `src/project/nativeProjects.ts`: conteúdo completo (fonte, botoeira, H1/H2, LOGO!, disjuntor, PKZM, KM1, motor, calha; cabos; 3 networks Ladder; GRAFCET X0/X1).
- `localBackend.readData()`: semente automática se em falta (`id: native-partida-direta-v1`, owner `dcsimu-admin`).
- Eliminar o projeto **repor** o conteúdo de fábrica (não remove o nativo).

## Como usar
Login `admin@dcsimu.local` → lista de projetos → **Partida direta (nativo)** → abrir e editar.
