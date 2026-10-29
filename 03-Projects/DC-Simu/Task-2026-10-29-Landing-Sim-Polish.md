---
project_id: BN-DCSIMU-001
type: task
status: IN_PROGRESS
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, landing, 3d, motor, glow, cables, lock, performance]
---
# Tarefa 2026-10-29 — Landing mais leve + motor hero + brilho nas lâmpadas + cabos + vista motor

## Pedido do utilizador
1. Landing page muito pesada → melhorar renderização / performance.
2. Ilustração do simulador: users não podem apagar nem editar componentes.
3. Organizar os cabos; cabo não deve atravessar o painel.
4. No simulador a vista do motor deve ser isométrica apenas; o resto fica na vista frontal.
5. Brilho de luz das lâmpadas não está nos lugares certos → colocar a encostar no vidro.
6. Motor na primeira tela está muito pequeno e sem textura real metálica → melhorar. Não colocar card.

## Alterações feitas (2026-10-29)
- **LandingMotorHero**: FILL 0.74 → 0.88 (motor ocupa mais do ecrã); DPR inicial 1.25 → 1.0 (mais leve).
- **motorEditorTextures**: metais com metalness ≥ 0.92 e roughness ≤ 0.28; envMapIntensity 1.6 para aspeto metálico real.
- **Panel3D PilotLightAd22Real3D + Lamp3D**: GlowHalo reposicionado para encostar na lente/vidro (z reduzido).
- **LandingShowcase PilotLightWithGlow**: halo encostado à lente (offset reduzido).
- Lógica de lock em RUN (simLocked) e clearObstacles de cabos já existia; reforçada por validação visual pendente.

## Ficheiros tocados
- `src/three/LandingMotorHero.tsx`
- `src/three/motorEditorTextures.ts`
- `src/three/Panel3D.tsx`
- `src/three/LandingShowcase.tsx`

## Critérios de aceite
- [x] Motor hero maior e com textura metálica reforçada.
- [x] Brilho das lâmpadas/sinaleiros encostado ao vidro.
- [x] Landing começa com DPR mais baixo.
- [ ] Vista isométrica exclusiva do motor (resto frontal) — a implementar com preferência de câmara / view cube.
- [ ] Lock total de edição/delete para utilizadores em modo demo/público (além do RUN).
- [ ] Cabos 100% sem atravessar chapa (validação visual + smoke).
- [ ] Contexto atualizado no cofre; typecheck + smokes; commit + push.

## Estado
Implementação parcial dos pontos de performance, motor e brilho. Vista motor e lock completo de utilizador ficam para o próximo incremento.
