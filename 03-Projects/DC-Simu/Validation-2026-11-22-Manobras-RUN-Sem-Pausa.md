# Manobras em RUN sem pausar a simulação

**Data:** 2026-11-22 · **Commit:** `dc-simu@801e0d6` (`main`) · **Regra:** DC-ADR-086

## Pedido

«Todos os componentes eletrónicos, elétricos, hidráulicos, pneumáticos ou que têm
botões de ação só têm ação depois de clicar pausa.» A regra registada é a DC-ADR-086:
em RUN e em PAUSA, os botões e atuadores atuam; só a edição fica bloqueada.

## Causa (reproduzida no Painel 3D, RUN real com `play()`)

`setComponentState` → `recomputeIfActive()` → `step()`. O `step()` pausa quando a
simulação está em RUN (é o botão «Passo»). Assim, o primeiro toque em qualquer
aparelho mudava a simulação de RUN para PAUSA. O gesto era aplicado, mas a
simulação ficava parada, e por isso parecia que só atuava depois da pausa. O
stack trace capturado no browser
mostrou o caminho `handleSwitchDown → operateComponent → setComponentState →
recomputeIfActive → step → pause`.

Os testes existentes não o apanhavam, porque mudavam só `runState` para
`'running'`, sem o ciclo real.

## Correção

- Em RUN, `recomputeIfActive` corre um scan imediato com `dt = 0`: a resposta é
  imediata, não adianta temporizadores nem animações, e a simulação continua em
  RUN. Um botão de mola premido e largado entre dois ticks continua a ser processado.
- Em PAUSA, mantém o STEP, como antes (DC-ADR-102).
- O FC 1 de rolete (`mecMicroSwitchRoller`) só aceita o clique 3D em modo manual,
  como o inspetor. Em modo «alimentador», segue a peça.

## Verificações

- `npm run test:sim-run-manobra` (novo, na bateria `test:ci:fast`): 5/5. Cobre 11
  famílias em RUN: botão NA, emergência, seletor, disjuntor, interruptor de
  iluminação, válvula 5/2, ilha de válvulas, ventosa, válvula hidráulica, FC 1 e
  braço com vácuo. Cobre também o botão de mola entre ticks, o `dt = 0` nos
  temporizadores, a PAUSA e o bloqueio em STOP.
  **Sem a correção, falha logo no primeiro aparelho** («a manobra pausou a simulação»).
- Diagnóstico no browser com RUN real: antes, o estado passava a `paused` ao
  premir. Depois, mantém-se `running` ao premir e ao largar.
- `npx tsc -b`: OK. `test:ci:fast`: 21/23. As falhas `terminal-geometry` e
  `terminal-seat` (bornes do MICO) já existiam.
- `test:lighting-switch-action-ui`: 16/16.
- `test:native-sim`: 9 falhas (relé térmico F1 / TEST / vista). São **idênticas sem
  a correção**, por isso já existiam. `test:sim-select-3d-ui`: timeout, também sem
  a correção. Ficam como pendências próprias.

## Pendências

- Investigar as 9 falhas de `test:native-sim` (TEST/RESET do F1) e o timeout de
  `test:sim-select-3d-ui`. Ambas são anteriores a esta alteração.
- Os testes UI de manobra deviam usar `play()` real em vez de forçar `runState`.
- Não foi feito deploy.
