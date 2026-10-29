---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, 3d, performance, run, selection, validation]
---
# Validação 2026-10-28 — Render leve, sem rotação automática, seleção em RUN

**Commit dc-simu:** `808c4d5` (main, push ✔, carimbo #98; rebase sobre `4788efd`)
**Captura do utilizador:** `/uploads/image-1.png` (editor completo, Visualização 3D, S1 selecionado)
**Workflow:** trabalho feito dentro do cofre BrainNet (`03-Projects/DC-Simu/dc-simu`), commits e push nos dois repositórios — Pedido do utilizador honrado.

## Os três problemas e a causa raiz apurada

### 1. «Rotação automática — o esquema gira lentamente no canvas»
- **Causa:** `OrbitControls` do Painel 3D com `enableDamping` (fator 0.08) — ao largar o arrasto a câmara continuava a deslizar/rodar lentamente; o utilizador lia-o como «rotação automática».
- **Correção:** `enableDamping` removido e `autoRotate={false}` explícito.
- **Verificação empírica (Playwright):** HUD da câmara lido 3× em ~17 s — Yaw/Pitch/Zoom **estáveis** (sem deriva contínua). A entrada em isométrica na demo é uma transição única de ~0,4 s, não rotação automática.

### 2. «Renderização muito pesada» (pior durante RUN)
- **Causa raiz (empírica):** em RUN, cada scan atualiza bandeiras energéticas (`energized`) → os arrays `wires`/`components` mudam → o `Wires3D` **reconstruía caminho, CatmullRom e 3–4 `TubeGeometry` (centenas de segmentos) por cabo a cada tick**, e as caixas de obstáculo eram recalculadas a cada scan. Com ~27 cabos, o frame rate colapsava (tab quase congelada no sandbox em software-GL).
- **Correções** (`src/three/Panel3D.tsx`):
  - `cachedWireGeometry()`: cache módulo por chave geométrica (pontas, waypoints, route/bend/offset/gauge/flexibility) — bandeiras energéticas não entram na chave;
  - `obstaclesKey`: caixas de obstáculo estáveis por assinatura posicional (posições + comprimento da calha + rotação);
  - **Shadow map sob pedido**: `gl.shadowMap.autoUpdate = false` + `ShadowsOnDemand` (recalcula quando posições/rotações/runState mudam e com aquecimento temporizado nos primeiros segundos para os GLBs carregados via Suspense);
  - (já vinha) `dpr [1, 1.5]`.

### 3. «Em RUN já não dá para selecionar elementos nem cabos»
- **Causa:** com RUN ativo, os handlers de atuação (botões de catálogo, disjuntores, teclas do LOGO!) faziam `stopPropagation` **sem selecionar** — o clique nunca chegava ao seletor do componente, e o `onPointerMissed` do Canvas ainda limpava a seleção.
- **Correção — atuar também seleciona:**
  - `activateComponent` (botanca/terminals do painel): em RUN faz `selectComponents([id])` antes de atuar;
  - wrapper de disjuntores: idem antes do toggle closed/tripped;
  - `CatalogComponent3D.controlDown`: controlo encontrado → `selectComponents([c.id])`;
  - `LogoFrontPanel` (teclas ESC/OK/▲▼◀▶): idem no `onPointerUp`.
- **Verificação empírica:** em STOP um clique selecionava `native-h2`; **em RUN, o mesmo ponto selecionava igualmente** — seleção de corpos/cabos já não precisa de STOP.

## Verificação
- Typecheck limpo; `npm test` OK; smokes da landing/demo (incl. `native-wires-3d`, `native-sim`) todos PASS;
- 7 asserts novos no `landing-editor-showcase-smoke.mjs` (69 total).
- Tests em browser confirmaram drift zero e seleção em RUN (depois das correções de perf, os cliques deixam de congelar).

## Multi-sessão
- Remoto tinha avançado para `4788efd` (outra sessão, "integrar entradas e saídas no painel do GRAFCET") durante o trabalho → **rebase limpo** e push `808c4d5`.
