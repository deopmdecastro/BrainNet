---
project_id: BN-DCSIMU-001
type: task
status: DONE
created: 2026-11-03
updated: 2026-11-03
tags: [dc-simu, rele-termico, 3ru1116, test, reset, regressao]
---
# Tarefa 2026-11-03 — Repor o RESET rotativo do relé térmico

## Pedido

Repetição do pedido de [[Task-2026-11-02-Test-Reset-Rele-Termico]]: TEST apaga o verde e acende o vermelho enquanto premido; RESET do térmico roda para a direita ou para a esquerda.

## Diagnóstico

- A lógica de TEST (disparo retido, H1 apagado, H3 aceso, KM1/M1 parados) já estava em `main` desde `f3eec26` e continua a passar.
- O RESET tinha regredido: `dbbef54` substituiu o gesto rotativo por clique, contra DC-ADR-083, e o inspetor continuava a dizer «arraste». Não havia registo no cofre.

## Alteração

- Reversão de `dbbef54` (gesto de arrastar, cursor `ew-resize`, rotação visual do pivô azul, documentação do componente), mantendo o tipo `ImportedGesture`.
- Sem alterações à lógica elétrica, ao motor nem ao IEC nativo.

## Verificação

`typecheck`, `test:thermal-controls` (21), `test:native-sim`, `test:imported-components` (189), `test:native-iec` (94): PASS. Teste de navegador (`test:thermal-controls-ui`) não corrido neste sandbox — confirmar o gesto no 3D real.

Aplicação: `b8d353805158b82857b89bce1a17662fab3f9d64` (`main`).

Decisão: DC-ADR-091 em [[Decision-Log]].
