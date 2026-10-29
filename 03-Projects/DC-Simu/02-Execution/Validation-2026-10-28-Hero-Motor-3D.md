---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
repo: deopmdecastro/dc-simu
commit: ce45276
date: 2026-10-28
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, landing, hero, motor, 3d, validation]
---

# Hero da landing: só o motor 3D real (SEW DRN80) com ventoinha em marcha, vistas giráveis

## Pedido
«Dessa página remove o simulador, coloque apenas o motor com as pás girando, motor
real 3D na vista ISO, podendo girar as vistas» — capa da landing em cima.

## Implementação (dc-simu `ce45276`)

1. **`src/three/LandingMotorHero.tsx` (novo)**
   - Canvas R3F · câmara iso `[2.5, 2.1, 2.5]` · FOV 30 mirando o centro do motor.
   - GLB real do catálogo `motor3ph` (`getComponentModelSpec` + `useGLTF`), com o
     acabamento CAD partilhado via helpers agora exportados de `LandingShowcase`
     (`preparedModel` / `cloneMaterials` / `applyModelState`).
   - Ventoinha do veio sempre a rodar: `MotorShaftFan3D` montado à frente,
     `rpmVisual: 0.9` (ovflw/blur automático a RPM alto).
   - Cenário mínimo: plinta cinza-clara, `ContactShadows`, `Environment city`,
     luz direcional com sombras.
   - Interação: `OrbitControls` com damping, **sem zoom/pan**, polares 24°–55°,
     **auto-rotação 0.7** em repouso, arraste para girar; pill «Arraste para girar»;
     cursor grab/grabbing + `touch-action: none` (telemóvel gira por gesto).

2. **`src/landing/Landing.tsx`**
   - `HeroViewport` deixa de renderizar `LandingShowcase` e os estados sintéticos
     de simulação (RUN/PLC STOP/START/STOP, chips HUD); nos seu lugar `<LandingMotorHero/>`.
   - Moldura: barra com «SEW DRN80MK4 · motor real em 3D» + chip «Modelo GLB da
     biblioteca» (oculto em ≥640 px); rodapé: «Ventoinha do veio em marcha · vista
     isométrica · arraste…» · «A mesma geometria anima dentro do editor».
   - O lazy de `LandingShowcase` foi trocado por `LandingMotorHero` — o showcase do
     painel completo continua disponível no repo mas deixa de ser usado na landing.

3. **CSS** (`dx-landing.css`): `.dx-motor-hero` (ocupa o stage), `.dx-motor-hero-hint`,
   `.dx-window-chip` e variante `.dx-window-motor`.

4. **Contrato estrutural**: `scripts/landing-hero-motor-smoke.mjs` +
   `npm run test:landing-hero` (14 asserções).

## Validação
- typecheck limpo; `npm test` OK; 22 suites + landing-hero/landing-demo/landing-editor
  — todas verdes.
- Sem browsers no sandbox para verificação visual E2E (como sempre: CI/local com
  `npx playwright install chromium`).
