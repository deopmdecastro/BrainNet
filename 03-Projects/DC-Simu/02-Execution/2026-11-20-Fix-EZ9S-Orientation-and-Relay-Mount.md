---
project_id: BN-DCSIMU-001
type: execution-note
status: DONE
created: 2026-11-20
updated: 2026-11-20
tags: [brainnet, dc-simu, 3d, protecao, ez9s, bugfix]
---

# Fix: Orientação dos interruptores EZ9S + ativação indevida da simulação no encaixe do relé de nível

## Problema 1 — Interruptores de corte (QS1 / QS2 / QS3)

Os três `switchSchneiderEz9s*` (1P/2P/4P) foram construídos com a serigrafia e os manípulos na face traseira.

**Causa raiz**
- Script `scripts/build-ez9s-glb.mjs` mapeia STEP → GLB com `z_glb = 74.7 - z_step` (frente em +Z alto).
- `COMPONENT_PHYSICAL_SIZE_MM` declara `depth: 66.5`, enquanto a geometria gerada tem ~74.7 mm.
- Ao encaixar no envelope nominal, a face com manípulo/serigrafia fica do lado errado.

**Correção aplicada** (branch `fix/ez9s-orientation` no dc-simu)
- `src/three/modelPaths.ts`:
  - `spec(..., true)` → `flipDepth: true` nos três tipos.
  - `hinge.z`: 0.94 → 0.06 (após escala Z negativa).
- `src/three/protectionMarkings.ts`:
  - `frontZ` / `lowerZ` dos EZ9S: 74.5 * u → 0.5 * u.

## Problema 2 — Relé de nível ativa a simulação ao encaixar/desencaixar

`mountRelayOnSocket` / `unmountRelayFromSocket` chamam `recomputeIfActive()`, que só executa `step()` se `runState !== 'stopped' || scanCount > 0`. Não deveria iniciar a simulação.

**Ação pendente / a verificar**
- Confirmar se o handler de drop 3D ou algum `useEffect` de mudança de `components` chama `play()`.
- Garantir explicitamente que montagem/desmontagem nunca altera `sim.runState` quando estava `stopped`.
- Única forma de ativar simulação deve continuar a ser o botão Play (e atalhos associados).

## Próximos passos
1. Revisar a PR `fix/ez9s-orientation` e fazer merge em `main`/`dev`.
2. Reproduzir o encaixe do AVEL 411 no socket Finder 90.23 com simulação parada e confirmar que não arranca.
3. Se o bug persistir, instrumentar o call-site de `play()` / `set({ sim: { runState: 'running' }})`.

## Referências
- Screenshots do editor 3D (QS1/QS2/QS3).
- `src/three/modelPaths.ts`, `src/three/protectionMarkings.ts`, `src/store/useSimStore.ts` (mountRelayOnSocket).
- Design Principles e regras de construção 3D do DC-Simu.
