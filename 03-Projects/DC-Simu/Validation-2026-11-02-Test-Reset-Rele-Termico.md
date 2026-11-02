---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED
created: 2026-11-02
updated: 2026-11-02
repo: https://github.com/deopmdecastro/dc-simu
commit: f3eec26b0387ea4fb8af15d365940c4c93c7f59d
tags: [dc-simu, rele-termico, 3ru1116, test, reset, simulacao, grafcet, iec]
---

# Validação 2026-11-02 — TEST com disparo retido e RESET rotativo do relé térmico F1

## Resultado

Implementado e testado no projeto nativo «Partida direta» com o relé térmico Siemens 3RU1116 (`F1`).

- TEST físico premido: `testPressed=true`, `tripped=true`, KM1/M1 parados, H1 verde apagado, H3 vermelho aceso, I0.3 ativo e GRAFCET em `native-s0`.
- TEST libertado: o cursor de ensaio volta, mas o disparo fica retido; não há rearranque automático.
- RESET azul: arrasto curto não rearma; arrasto aceite para a esquerda ou direita rearma apenas no fim do gesto, sem ligar o motor.
- Depois de RESET, uma nova ordem START restaura a marcha.
- STOP físico continua momentâneo e não cria disparo de F1.
- O espelho IEC nativo recebe o mesmo estado de disparo/rearme através de `thermalSync`; o comando IEC de rearme usa o mesmo contrato do RESET.

A rotação esquerda/direita do RESET é uma convenção didática desta aplicação. Não altera a seleção física M/A do aparelho real nem ativa modo automático.

## Evidência principal

Capturas reais do GLB montado no navegador, extraídas do canvas 3D:

- [[evidence-test-reset/01-marcha.png|Motor em marcha antes do TEST]]
- [[evidence-test-reset/02-test-premido.png|TEST premido: motor parado, verde OFF, vermelho ON]]
- [[evidence-test-reset/03-disparo-retido.png|TEST libertado: disparo retido]]

Registos guardados em `evidence-test-reset/`:

- `thermal-controls-ui.log` — 12 verificações físicas TEST/RESET no navegador.
- `thermal-controls.log` — 21 verificações de lógica, gestos, pivôs e projeção IEC.
- `native-sim.log` — sequência nativa completa: TEST, retenção, START bloqueado, RESET, novo START, STOP e gravação/reabertura.
- `imported-components.log` — 174 verificações de componentes importados.
- `native-iec.log` — 94 verificações do esquema IEC nativo.
- `commands.log`, `thermal-mount.log`, `imported-finish-ui.log`, `typecheck.log`.

## Verificações executadas

| Verificação | Resultado |
|---|---:|
| `npm run -s typecheck` | PASS |
| `npm run -s test:imported-components` | 174 PASS |
| `npm run -s test:native-sim` | PASS |
| `npm run -s test:thermal-controls` | 21 PASS |
| `npm run -s test:native-iec` | 94 PASS |
| `npm run -s test:commands` | PASS |
| `npm run -s test:thermal-mount` | 12 PASS |
| `npm run -s test:imported-finish-ui` | 15 PASS |
| `npm run -s test:thermal-controls-ui` | 12 PASS |

O teste de navegador cobre o GLB real, a preparação em marcha, TEST premido/liberto, retenção do disparo, rejeição de arrasto curto, RESET esquerda/direita, perda de foco, novo START e ausência de erros JavaScript.

## Limitações e pendências

- O build de produção não foi classificado como aprovado neste sandbox: `vite build` excedeu a memória disponível (host com cerca de 2 GiB). Repetir num runner dimensionado antes de declarar release, conforme [[Decision-Log|DC-ADR-014]].
- `test:thermal-mount-ui` foi interrompido durante a sessão; as verificações core de encaixe (`test:thermal-mount`, 12 PASS) e o acabamento/mecânica (`test:imported-finish-ui`, 15 PASS) passaram.
- Não houve verificação de deploy. A publicação autorizada foi commit/push nos repositórios GitHub.
- A referência Siemens foi usada apenas como contexto técnico; a rotação livre de RESET é decisão didática do utilizador, não uma descrição do curso mecânico real do botão azul.

## Publicação

- Aplicação: `deopmdecastro/dc-simu` @ `f3eec26b0387ea4fb8af15d365940c4c93c7f59d` (`main`).
- Cofre: ponteiro do submodule atualizado para o commit acima, com tarefa, decisão e evidência.
- Carimbo de release da aplicação: #143 (`mvyvigb9`).

## Ligação à tarefa

[[Task-2026-11-02-Test-Reset-Rele-Termico]]
