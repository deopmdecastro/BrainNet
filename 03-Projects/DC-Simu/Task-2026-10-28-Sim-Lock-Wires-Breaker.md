---
project_id: BN-DCSIMU-001
type: task
status: IN_PROGRESS
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, simulation, lock, wires, cables, electricity-effect, breaker, motor-protection, 3d]
---
# Tarefa 2026-10-28 — Bloquear edição em RUN + cabos sem atravessar chapas + efeito elétrico por cor + sentido do disjuntor motor

## Pedido do utilizador
1. **Ao iniciar simulação**: bloquear a seleção de componentes e a edição. A única coisa possível deve ser intervenções nos botões ou ligar/desligar componentes (atuadores).
2. **Cabos / fios**: nunca podem atravessar as chapas onde os elementos são postos.
3. **Efeito de eletricidade nos cabos**: melhorar; o efeito deve ser de acordo com a cor do cabo.
4. **Disjuntor motor**: está a ligar e desligar no sentido errado — corrigir.

## Direção
- Em `runState === 'running'` (e preferencialmente também em `paused` se fizer sentido): desativar seleção/edição de componentes no Esquema 2D e no 3D; manter interativos apenas controlos de simulação, botões de atuação (START/STOP, etc.) e toggle on/off de componentes que o suportam.
- Traçado 3D de cabos: reforçar obstáculos duros das chapas/placas (já existe lógica de `WireObstacle.hard` e calhas); garantir que nenhum segmento cruza o plano da chapa.
- Efeito elétrico (glow / partículas / fluxo): mapear a cor do cabo (fase, neutro, terra, sinal, etc.) para a cor do efeito; não usar cor genérica azul/branco.
- Disjuntor motor (PKZM ou equivalente): inverter o sentido de rotação/animação do manípulo (eixo e ângulo ON/OFF) para coincidir com o comportamento físico esperado.

## Ficheiros prioritários
- Bloqueio em RUN: `src/store/useSimStore.ts`, `src/schematic/SchematicView.tsx`, `src/three/Panel3D.tsx`, handlers de seleção/edição, `SimulationDock` / transport.
- Cabos 3D: `src/three/WireDraw3D.tsx`, `src/three/wireGeometry3D.ts`, `src/three/panelLayout.ts`, obstáculos em `WireObstacle` / planner de cabos.
- Efeito elétrico: materiais/glow em `src/three/glow.ts`, `GlowHalo.tsx`, shaders ou texturas de fluxo nos fios.
- Disjuntor motor: `src/three/breakerHandle.ts`, `src/catalog/...` (PKZM), animações de manípulo, `modelPaths` / pose.

## Critérios de aceite
- [ ] Em RUN (e pausa se aplicável) não é possível selecionar/mover/editar componentes; botões e liga/desliga de atuadores continuam a responder.
- [ ] Nenhum cabo 3D atravessa a chapa de montagem.
- [ ] Efeito de corrente nos cabos usa a cor do próprio cabo.
- [ ] Manípulo do disjuntor motor gira no sentido correto (OFF → ON e inverso).
- [ ] Contexto atualizado no cofre; typecheck + smokes relevantes.
- [ ] Commit preparado (push depende de token válido).

## Estado
Preparação: requisitos capturados · Implementação: em curso.
