---
project_id: BN-DCSIMU-001
task_id: DCSIMU-2026-11-06-GRAFCET-ES
type: task
status: IMPLEMENTED
priority: HIGH
owner: claude
created: 2026-11-06
updated: 2026-11-06
tags: [dc-simu, ui, grafcet, simulacao, entradas-saidas, int-no-nc, paridade]
---

# Task 2026-11-06 — GRAFCET: separador «E/S» com os botões INT/NO/NC e as saídas

## Pedido
O painel do GRAFCET não tinha os botões de entrada com o tipo **INT / NO / NC** nem os cartões de saídas que existem nos painéis do Ladder e do Esquema IEC, por isso não era possível simular as entradas e ver as saídas.

## Diagnóstico
- O painel inferior `GrafcetSimDock` (E/S + Sequência) está desligado em `GrafcetEditor.tsx` (`{false && …}`) e a aba `io` do inspetor era redirecionada para `steps`. Resultado: no PC e no tablet o GRAFCET ficou sem qualquer cartão de E/S; os «Sinais» são só a tabela de variáveis com valor ao vivo.
- Ladder (`LadderEditor`, aba E/S), Esquema 2D/3D (`SimulationDock`) e IEC já usam `SimulationSignals` → `VirtualIoPanel` (sem PLC) ou `PlcSignalPanel` (com PLC): cartão por entrada com `VirtualInputButton` + seletor INT → NO → NC e lâmpadas Q/M.

## Decisão (reaproveitar, não reescrever)
Novo separador **E/S** no inspetor do GRAFCET que monta o mesmo `SimulationSignals`. Sem componente de cartões próprio: um painel novo não inventa o desenho (ver [[Design-Principles]]).

## Ficheiros (repo `dc-simu`)
- `src/grafcet/GrafcetIoPanel.tsx` (novo) — envolve `SimulationSignals` e faz crescer `virtualInputCount` até à maior entrada usada nas condições (`detectGrafcetIo`), como fazia o antigo `GrafcetSimPanel`.
- `src/grafcet/GrafcetEditor.tsx` — separador «E/S» (ícone `IconSignals`, o mesmo do botão «Simulação»; contagem verde dos bits I/Q/M ativos), remoção do redirecionamento da aba `io`; no telemóvel o botão «Simulação» abre a gaveta no separador E/S. Saídas usadas nas ações das etapas (`liveBitsAll`) aparecem mesmo a 0.
- `src/styles/sim-dock-refine.css` — cinco mosaicos iguais (Etapas, Transições, E/S, Sinais, Diagnóstico); `.grafcet-io` sem moldura dupla. Em telemóvel mantém-se o deslize horizontal de `clean-mode.css`.
- `scripts/grafcet-io-panel-smoke.tsx` + `npm run test:grafcet-io-panel`.

## Verificações
| Verificação | Resultado |
| --- | --- |
| `tsc -b` | passou |
| `test:grafcet-io-panel` (7 verificações: painel `vio-panel`, uma célula por entrada, seletor INT por omissão, saídas Q e memórias M, bits das ações visíveis a 0) | passou |
| `test:grafcet-signals`, `test:grafcet-signal-names`, `test:grafcet-dialogs`, `test:style` | passaram |
| Teste em navegador (Chromium/CDP) a 390, 768, 1024, 1440 px | **não executado** (sem Chromium neste ambiente) |

## Pendências
- Rever visualmente os cinco mosaicos a 360–390 px e o separador com PLC no esquema (`PlcSignalPanel`).
- `scripts/grafcet-ui-smoke.mjs` ainda assume o painel inferior `[data-grafcet-sim-dock]` abaixo de 1200 px, desligado antes desta tarefa; atualizar quando se decidir o destino do `GrafcetSimDock`.
- Estado: implementado e testado ao nível de código; **não aprovado** nem validado em ecrã.
