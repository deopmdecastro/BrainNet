---
type: validation
status: IMPLEMENTED
created: 2026-11-23
updated: 2026-11-23
tags: [dc-simu, efeitos, ar, agua, pneumatico, hidraulico, NeonCurrent, fluxo]
---

# Efeitos de fluxo de ar e água nos tubos (Passo 4)

## Pedido
- Criar efeito de ar a passar nos tubos.
- Efeito de água a passar no tubo, parecido com o de eletricidade mas visualmente distinto.

## Solução

### `NeonCurrent3D.tsx` — variantes de fluxo
| Variante | Visual | Velocidade | Espaçamento | Extra |
|----------|--------|-----------|-------------|-------|
| `electric` | Impulsos nítidos na cor do cabo | média | médio | (original) |
| `air` | Impulsos claros esparsos (`#e0f2fe`) | rápida | largo | aspeto “seco” |
| `water` | Impulsos azuis densos (`#38bdf8`) | lenta | apertado | bolhas suaves no shader |

### `panel3DEditing.ts` — `wireFluidEffectVisible`
- Ativo só em `runState === 'running'`.
- Pneumático: `pneumaticPressureBar > 0.05` (ou `energized`).
- Hidráulico: `hydraulicPressureBar > 0.05` (ou `energized`).

### `Panel3D.tsx`
- Combina fluxo elétrico + fluido.
- Passa `variant` e cor adequadas ao `NeonCurrent3D`.

### `renderOptimization.ts`
- Emissive subtil nos tubos de ar quando em fluxo (`#bae6fd`).

## Integração (dc-simu main)
- `0932452` NeonCurrent3D
- `130d80b` panel3DEditing
- `4702607` renderOptimization
- `2dc19c6` Panel3D

## Como ver
1. Abrir Maquete Estampagem (tubos PU azuis compressor → FRL → CPV).
2. Arrancar simulação (RUN).
3. Com pressão > 0 nos tubos pneumáticos, o fluxo de ar aparece.
4. Tubos hidráulicos (se existirem no projeto) mostram fluxo de água com bolhas.

Estado: **implementado e publicado**. Revisão visual pendente.
