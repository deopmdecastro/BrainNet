---
project_id: BN-DCSIMU-001
type: validation
status: IN_PROGRESS
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, ui, mobile, desktop, grafcet, ladder, 3d, simulation, performance]
---
# Validação 2026-10-28 — Vistas de simulação (GRAFCET / Ladder / 3D) + performance

## Pedido
Capturas do utilizador (Partida direta com selo): GRAFCET com etapa 0, Ladder com 3 networks (STOP+START+KM1, H1, H2 NF), vista 3D do painel com ViewCube e toggle 2D/3D. Melhorar para mobile e desktop; otimizar simuladores para menor consumo/peso.

## Trabalho no cofre
- Criada [[Task-2026-10-28-UI-Sim-Views-Mobile-Desktop-Perf]].
- Registada decisão DC-ADR-070 no Decision-Log.
- Índice do projeto atualizado.

## Alterações de código (dc-simu)
- `src/styles/mobile-refine.css`: regras adicionais para
  - status STOP / erros / avisos / etapa (alvos ≥ 40 px, compactação);
  - barras de transporte de simulação (botões e selects tocáveis);
  - cabeçalhos de network Ladder;
  - toggle Esquema 2D / Visualização 3D e ViewCube;
  - hovers desktop refinados.
- Sem alteração de lógica de motores nesta iteração; performance documentada como próximo passo (throttle de UI updates, dispose Three.js, reduzir trabalho em idle — ver tarefa).

## Critérios
- [x] Contexto atualizado no cofre.
- [ ] Typecheck + smokes (a executar).
- [ ] Verificação visual em 390 / 768 / 1024 / 1440 px.
- [ ] Otimizações de performance medidas (próxima iteração).

## Próximo
1. Correr `pnpm typecheck` e smokes relevantes no dc-simu.
2. Inspecionar `useSimStore` scan loop e `Panel3D` para idle throttling / rAF controlado.
3. Commit + push em ambos os repositórios após validação visual.
