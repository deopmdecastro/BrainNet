---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
repo: deopmdecastro/dc-simu
commit: 61ade69
date: 2026-10-28
---

# Hero da landing v2: só o motor, sem cartão; pás na posição real do veio; sem auto-rotação

## Pedido
Captcha mostrava o motor encaixado num cartão com tabs/rodapé e a vista demasiado
perto da peça: «remover o cards em volta do motor, deixar apenas o motor, e use o
motor real com as pás que a gente já tem, remove a rotação do motor, o que vai estar
a rodar será as pás do motor em sentido horário.»

## Mudanças (dc-simu `61ade69`)

1. **Sem cartão** — `HeroViewport` já não rende `.dx-window.dx-window-motor`
   (barra «SEW DRN80MK4», chip, rodapé). O hero passa a `.dx-hero-motor` (altura
   generosa clamp 380–540, canto arredondado, só a peça + sombras de contacto).

2. **Pás onde o editor as põe** — `LandingMotorHero.tsx` passa a pousar
   `MotorShaftFan3D` na posição CAD medida `MOTOR_FAN.hubX = 256 mm` (veio em +X,
   eixo y=z=0), mapeada sobre a caixa real do modelo preparado
   (`preparedModel`+`Box3`), com escala unitária coerente (unitScale = boxY / mm).
   Substitui a aproximação anterior (fanOffset × scale 0.55), que deixava a pá
   fora do sítio/pouco visível.

3. **Sem auto-rotação da câmara** — `autoRotate` fora; a câmara só se move
   por arraste (OrbitControls enableDamping, polar 12°–62°, sem zoom/pan).
   As pás giram sempre (`rpmVisual: 0.9`) em sentido horário (`direction: 'cw'`).

4. **Enquadre do motor inteiro** — câmara `[1.4, 1.05, 1.4]`, FOV 32,
   target `[0.12, -0.02, 0]` (pega veio+pá à vista).

5. **Smoke** atualizado (15 asserções): montagem MOTOR_FAN, ausência de autoRotate,
   pá horária sempre em marcha, sem moldura/card, CSS.

## Validação
- typecheck limpo; `npm test` OK; 23 suites + landing-hero/demo/editor verdes.
- release stamp #93.
