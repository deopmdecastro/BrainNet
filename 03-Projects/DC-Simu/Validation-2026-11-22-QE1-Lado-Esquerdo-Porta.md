---
type: validation
status: IMPLEMENTED
created: 2026-11-22
updated: 2026-11-22
tags: [dc-simu, maquete, estampagem, QE1, quadro]
---
# QE1 no lado esquerdo da mesa, porta a abrir para fora

## Pedido

Colocar o quadro da mesa no lado esquerdo, e a porta do quadro abre por fora.

## Correção (`185518e`)

Em `src/electrical/stampingBench.ts`:

- **Posição:** `cabinetX = -plate.lengthMm/2 + cab.w/2 + 50` (lado esquerdo, folga ~50 mm).
- **Dobradiça:** `hingeSide: 'right'` — eixo do lado da mesa; a porta abre para a **esquerda, para fora**.
- Componentes internos (DIN, relés, bornes), ductos de campo e calhas técnicas acompanham o novo X via `inside()` com offset `cabinetX`.
- Travessas estruturais sob a mesa mantêm-se a largura total.

Estado: **implementado e publicado**.
