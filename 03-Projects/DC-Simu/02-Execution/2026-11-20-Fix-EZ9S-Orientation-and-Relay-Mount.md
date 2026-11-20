---
project_id: BN-DCSIMU-001
type: execution-note
status: DONE
created: 2026-11-20
updated: 2026-11-20
tags: [brainnet, dc-simu, 3d, protecao, ez9s, bugfix, simulacao]
---

# Fix: Orientação dos interruptores EZ9S + montagem de relé nunca ativa a simulação

**Commit em main (dc-simu):** `a005c4b` — *fix: EZ9S frente correta + montagem de relé nunca ativa a simulação*

## Problema 1 — Interruptores de corte (QS1 / QS2 / QS3)

Os três `switchSchneiderEz9s*` (1P/2P/4P) tinham a serigrafia e os manípulos na face traseira.

**Causa:** script de build mapeia STEP com frente em +Z alto (~74,7 mm), mas `physicalSizeMm.depth` era 66,5 mm → centragem errada.

**Correção em main**
- `src/three/modelPaths.ts`: `flipDepth: true` nos três specs; `hinge.z` 0.94 → 0.06
- `src/three/protectionMarkings.ts`: `frontZ` / `lowerZ` dos EZ9S 74.5 → 0.5

## Problema 2 — Relé de nível «ativava» a simulação ao encaixar/desencaixar

**Causa raiz:** `step()` força transição `stopped → paused`. Os helpers `recomputeIfActive` / `recomputeIfPaused` chamavam `step()` também a partir de STOP (quando `scanCount > 0` ou via condição lata). Encaixe/snap mecânico acabava a tirar a simulação de STOP.

**Correção em main**
- `recomputeIfActive` e `recomputeIfPaused` só chamam `step()` se `runState === 'running' || runState === 'paused'`
- `mountRelayOnSocket` / `unmountRelayFromSocket` reforçam a mesma regra
- A única forma de sair de STOP continua a ser o botão **Play** (e o transporte Step, que continua a poder avançar um scan a partir de STOP de forma explícita)

## Validação sugerida
1. Colocar QS1/QS2/QS3 no Painel 3D — manípulo vermelho e serigrafia à frente.
2. Com simulação em STOP: encaixar e desencaixar o AVEL 411 no socket Finder 90.23 → `runState` permanece `stopped`.
3. Em RUN/PAUSA: o encaixe continua a recalcular o scan (estado elétrico atualiza).

## Referências
- Screenshots do editor 3D (QS1/QS2/QS3)
- `src/three/modelPaths.ts`, `src/three/protectionMarkings.ts`, `src/store/useSimStore.ts`
