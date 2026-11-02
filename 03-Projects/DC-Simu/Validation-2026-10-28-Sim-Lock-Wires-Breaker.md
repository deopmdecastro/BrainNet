---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, simulation, lock, wires, electricity-effect, breaker, pkzm]
---
# Validação 2026-10-28 — Bloqueio em RUN + cabos/chapa + efeito elétrico + disjuntor motor

## Pedido
1. Ao iniciar simulação bloquear seleção/edição; só botões e liga/desliga.
2. Cabos nunca atravessam as chapas.
3. Efeito de eletricidade nos cabos conforme a cor do cabo.
4. Sentido do disjuntor motor (PKZM) corrigido.

## Implementação (dc-simu)
- **SchematicView**: `startDrag` e marquee só em `stopped`; ferramenta de cabo só em `stopped`; fluxo de energia 2D usa `WIRE_COLORS[w.color]`.
- **Panel3D**: `simLocked` em running/paused bloqueia `onSelect` e `draggable`; `activateComponent` em RUN só chama a ação (não seleciona); `EnergyFlow3D` recebe `color={wireColor}`; rotação Z do PKZM invertida (`-value * throwDeg`).
- **wireGeometry3D**: clamp final de Z à frente da chapa em `clearObstacles` e após o ramo manual/automático em `wireBodyPoints3D`.

## Critérios
- [x] Seleção/edição bloqueadas em RUN/PAUSA; botões e disjuntores atuam.
- [x] Pontos intermédios dos cabos forçados à frente da chapa.
- [x] Efeito de corrente na cor do cabo (2D e 3D).
- [x] Sentido do manípulo PKZM invertido.
- [ ] Typecheck + smokes / verificação visual em dispositivo (pendente).
- [x] Contexto atualizado no cofre.

## Commit local
`fix(sim): lock edit in RUN, wire plate clearance, energy color, PKZM direction` (dc-simu)

Push depende de token GitHub com escrita.
