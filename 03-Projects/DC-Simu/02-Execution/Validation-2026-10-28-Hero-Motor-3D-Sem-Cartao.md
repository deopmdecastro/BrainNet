---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
repo: deopmdecastro/dc-simu
commit: d474cf9
date: 2026-10-28
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, landing, hero, motor, 3d, validation]
---

# Hero da landing v2: sem cartão; pás na posição real do veio; sem auto-rotação

## Pedido
«Remover os cards em volta do motor, deixar apenas o motor; usar o motor real com
as pás que a gente já tem; remover a rotação do motor — o que roda são as pás do
motor em sentido horário.»

## Mudanças (dc-simu `d474cf9`)

1. **Sem cartão** — HeroViewport deixa de rende `.dx-window-motor` (barra/chip/
   rodapé). O hero é agora `.dx-hero-motor`: contentor limdo de cantos suaves,
   altura generosa (clamp 380–540), só a peça + sombras de contacto.

2. **Pás onde o editor as põe** — `MotorShaftFan3D` passa a ser posicionado a
   partir de `MOTOR_FAN.hubX` (256 mm do eixo X do CAD), medida sobre a caixa
   da cena preparada (`preparedModel` + `Box3`), com escala unitária coerente
   com as dimensões físicas do motor — elimina a aproximação anterior que deixava
   a ventoinha fora de sítio.

3. **Sem auto-rotação** — `autoRotate` fora; a câmara gira apenas por arraste
   (OrbitControls damping, polar 12°–62°, sem zoom/pan). As pás giram sempre
   (`rpmVisual: 0.9`) em **sentido horário**.

4. **Enquadre do motor inteiro** — câmara `[1.4, 1.05, 1.4]`, FOV 32,
   target `[0.12, -0.02, 0]`.

5. **Contrato** — smoke atualizado: 15 asserções (montagem MOTOR_FAN, sem
   autoRotate, pá horária em marcha, sem moldura, CSS).

## Validação
- typecheck limpo; `npm test` OK; 23 suites + landing-hero(15)/demo(27)/editor(38)
  verdes.

## Notas
- Observado estado multi-sessão: branches `arena/…` existem em dc-simu (sessões
  paralelas); o main do dc-simu está atualizado neste pendente; BrainNet .git
  e .git/modules continuam a evaporar a meio de sessões (provável postinstall).
  Reparação estável: re-init local + fetch + read-tree (sem clean).
