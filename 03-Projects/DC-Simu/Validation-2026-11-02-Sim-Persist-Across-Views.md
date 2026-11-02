---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-11-02
updated: 2026-11-02
repo: https://github.com/deopmdecastro/dc-simu
commits:
  - 9803bcd
  - 5a17e10
tags: [dc-simu, simulacao, iec, 3d, vistas, bugfix]
---

# Validação 2026-11-02 — Simulação persiste ao alternar vistas

## Pedido

Iniciar «simulação para todos» em 3D → IEC → 3D → IEC: a simulação ficava parada.

## Causa

`CommandsEditor` fazia `useCommandsUi.getState().stop()` no cleanup do `useEffect` de unmount («Sair da vista não deixa a simulação a correr às escondidas»). Ao sair do IEC o motor de comandos parava; o tick só existia enquanto o editor estava montado.

## Correção (`dc-simu` `9803bcd`)

1. Removido o `stop()` no unmount do `CommandsEditor`.
2. Tick global do IEC em `commandsUi.ts` (50 ms) enquanto `rt.running && !paused`, em qualquer vista.
3. **Stop** e **Pausa** na barra actuam nos dois motores (PLC + IEC), para a simulação «para todos» não deixar um motor a correr.

## Verificação manual

1. Projeto com 3D + IEC (ex. Partida direta).
2. Em 3D: Play → «Todos os simuladores».
3. Alternar IEC → 3D → IEC várias vezes.
4. Esperado: estado RUN mantém-se; no IEC os contactos/bobinas continuam vivos; Stop pára tudo.


## Extensão — outros simuladores (Ladder, GRAFCET, Monitor)

Verificação de código (2026-11-02):

| Vista | Motor | Persiste ao sair? | Notas |
| --- | --- | --- | --- |
| 3D Realista | `useSimStore` (interval global) | Sim | Sem stop no unmount |
| Ladder | mesmo motor PLC | Sim | Só lê `runState` |
| GRAFCET | mesmo motor + `grafcetRuntime` | Sim | Scan no tick global do store |
| Esquema IEC | `useCommandsUi` | Sim (após 9803bcd) | Tick global; sem stop no unmount |
| Monitor | só observação | n/a | Não pára a simulação |

Correção adicional `5a17e10`: badge e barra usam **estado combinado** PLC+IEC — em qualquer vista Stop/Pausa/Reset actuam nos dois motores e o indicador mostra RUN se algum estiver a correr.
