---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, landing, 3d, motor, glow, cables, lock, performance, camera, wires]
---
# Tarefa 2026-10-29 — Landing + motor + brilho + vista + lock + cabos

## Pedido do utilizador
1. Landing page muito pesada → melhorar renderização / performance.
2. Ilustração do simulador: users não podem apagar nem editar componentes.
3. Organizar os cabos; cabo não deve atravessar o painel.
4. No simulador a vista do motor deve ser isométrica apenas; o resto fica na vista frontal.
5. Brilho de luz das lâmpadas não está nos lugares certos → colocar a encostar no vidro.
6. Motor na primeira tela está muito pequeno e sem textura real metálica → melhorar. Não colocar card.

## Alterações feitas

### 1ª entrega (landing + glow + motor)
- LandingMotorHero: FILL 0.74 → 0.88; DPR inicial 1.0
- motorEditorTextures: metais metalness ≥ 0.92, roughness ≤ 0.28
- Pilot lights & lamps: GlowHalo encostado ao vidro (Panel3D + LandingShowcase)

### 2ª entrega (vista + lock + cabos)
- **Vista câmara** (`Panel3D.tsx`):
  - Foco no motor → isométrica; foco no painel → frontal.
  - `framedDistance` usa o `radius` do objeto selecionado (motor não fica minúsculo nem o painel desproporcional).
- **Lock total para utilizadores** (`useSimStore.ts`):
  - `demoMode`: bloqueia delete/move/rotate (já bloqueava tool e move).
  - RUN/PAUSE: bloqueia `deleteComponents`, `deleteWire`, `moveComponent`, `rotateComponents` com aviso.
  - Panel3D já tinha `simLocked` para seleção/drag no 3D.
- **Cabos** (`wireGeometry3D.ts`):
  - `wireFrontLimit`: folga +4 mm à frente da chapa.
  - Pad de obstáculos +0.01 e +0.02 extra em hard (motor); 8 passes de clearObstacles.
  - Clamp final de intermédios mantido.

## Ficheiros
- `src/three/LandingMotorHero.tsx`
- `src/three/motorEditorTextures.ts`
- `src/three/Panel3D.tsx`
- `src/three/LandingShowcase.tsx`
- `src/three/wireGeometry3D.ts`
- `src/store/useSimStore.ts`

## Critérios de aceite
- [x] Motor hero maior e metálico.
- [x] Brilho das lâmpadas encostado ao vidro.
- [x] Landing começa com DPR mais baixo.
- [x] Vista isométrica no motor; frontal no resto (foco + preferência).
- [x] Lock de apagar/editar em demo e em RUN/PAUSE.
- [x] Cabos reforçados para não atravessar chapa (folga + hard pad).
- [ ] Smoke visual / `test:native-wires-3d` a correr em CI (já existe script; validar pós-deploy).

## Estado
Implementado. Commit + push em dc-simu e BrainNet.
