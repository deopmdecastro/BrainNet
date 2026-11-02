---
project_id: BN-DCSIMU-001
type: task
status: IN_PROGRESS
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, ui, mobile, desktop, responsiveness, grafcet, ladder, 3d, simulation, performance, optimization]
---
# Tarefa 2026-10-28 — Melhorar telas de Simulação (GRAFCET / Ladder / 3D) + otimização de performance

## Origem
Capturas fornecidas pelo utilizador (viewport ~390 px / mobile e desktop implícito) do DC-SIMU em dc-simu.vercel.app:

1. **Vista GRAFCET** — «Partida direta com selo», etapa 0 Inicial, H2 PARADO, botão + Ação, barra de simulação (play/pause/stop), Tempo real 1x, Validado, STOP + 0 erro(s) · 8 aviso(s) · Etapa X0. Diagrama com etapas 0 e 1, T1/T2, KM1, H1 MARCHA.
2. **Vista Ladder** — Main [OB1], PLC1 LOGO! 12/24RC, Networks 3 / Energizadas 0 / Contatos 6 / Bobinas 3. Network 1: Partida direta com selo (STOP+START+retenção KM1). Network 2: Sinalização de marcha (H1). Network 3: Sinalização de motor parado (H2 NF). STOP note no fundo.
3. **Vista 3D** — Painel com componentes (fonte, disjuntores, contactores, bornes), navegação ViewCube (SUP/FRENTE/DIR), toggle «Esquema 2D / Visualização 3D», status STOP + avisos.

Texto de contexto: botoeira START/STOP, KM1, motor SEW, H1 verde marcha e H2 vermelho motor parado partilham o mesmo estado. Use STOP para desligar o motor.

## Objetivo
1. Melhorar as telas de simulação (GRAFCET, Ladder, 3D) para mobile **e** desktop: hierarquia visual, alvos de toque, espaçamentos, legibilidade, consistência de barras de transporte/simulação, status e toggles.
2. Otimizar os simuladores (motor Ladder scan, GRAFCET, Three.js Panel3D, sincronização) para menor consumo de CPU/GPU/memória e peso de bundle, sem perder fidelidade.
3. Manter o padrão de tokens `--pn-*` / `--dx-*` / `--mr-*`, componentização e comunicação com o cofre BrainNet (atualizar sempre contexto, Decision-Log, Validation).

## Direção (Design-Principles)
- Alvos de toque ≥ 40 px (`--mr-touch`).
- Em mobile: barras de simulação e status compactas, labels longas → ícone + aria/title; painéis inferiores ≤ 38 % altura; rodapé não transborda.
- Desktop: espaçamentos refinados, hover/focus claros, sem regressão.
- Canvas/diagrama continua protagonista; controlos de simulação próximos do contexto.
- Performance: evitar re-renders desnecessários no scan, throttling de updates de UI, lazy/dispose de recursos Three.js, reduzir trabalho em idle, preferir `requestAnimationFrame` controlado e `useMemo`/`useCallback` onde o custo de medição justifica.

## Ficheiros prioritários (a inspecionar/alterar)
- UI / barras: `src/components/SimulationDock.tsx`, `src/grafcet/GrafcetSimBar.tsx`, `src/grafcet/GrafcetSimPanel.tsx`, `src/styles/grafcet-sim.css`, `src/styles/mobile-refine.css`, `src/styles/panel-system.css`
- Ladder: `src/ladder/LadderEditor.tsx`, `src/ladder/LadderSections.tsx`, `src/styles/ladder-editor.css`
- 3D: `src/three/Panel3D.tsx`, `src/three/CatalogComponent3D.tsx`, loaders e materials
- Store / motores: `src/store/useSimStore.ts`, motores de scan em `src/grafcet/engine`, ladder scan
- Status / diagnósticos: componentes de STOP, erros/avisos, etapa atual

## Critérios de aceite
- [ ] GRAFCET / Ladder / 3D legíveis e tocáveis em 390 px; desktop sem regressão visual.
- [ ] Barra de transporte/simulação e status consistentes entre vistas; alvos ≥ 40 px.
- [ ] Toggle Esquema 2D / 3D e ViewCube usáveis em mobile.
- [ ] Otimizações de performance medidas (menos trabalho por frame/scan em idle ou com poucos elementos; dispose correto de Three.js).
- [ ] Typecheck + smokes relevantes passam.
- [ ] Contexto atualizado no cofre (esta nota + Validation / Decision-Log se aplicável).
- [ ] Commit + push em dc-simu e BrainNet.

## Estado
Preparação: capturas analisadas · Implementação: em curso · Testes: pendente.
