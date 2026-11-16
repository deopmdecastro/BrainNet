---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_BUILD_OK_NOT_VISUALLY_VERIFIED
created: 2026-11-16
updated: 2026-11-16
repos: [dc-simu, BrainNet]
tags: [dc-simu, rele-termico, reset, telemovel, painel-inferior, separadores, ui-ux]
---
# Tarefa 2026-11-16 — RESET rotativo (esq./dir.) e painéis de baixo no telefone

## Pedido
Melhorar barras e painéis laterais e de baixo no telefone (UI/UX) e criar a funcionalidade do botão RESET do relé térmico, que roda para a direita ou para a esquerda.

## Contexto lido e reaproveitado (nada escrito de raiz)
[[Design-Principles]], [[Task-2026-11-03-Repor-Reset-Rotativo-Rele-Termico]] (DC-ADR-091: o gesto rotativo já existia, regrediu uma vez), [[Task-2026-11-03-Test-Rele-Termico-Luz-3D-Cover]], [[Task-2026-11-04-Paineis-Baixo-Cabecalho-Fixo]] (pendência: separadores ainda rolavam), [[Validation-2026-10-28-Gavetas-Padronizadas]]. Estado do código antes: o arrasto no 3D rodava o botão azul, mas os botões «RESET · esquerda/direita» do inspetor apenas rearmavam, sem sentido nem movimento no 3D.

## Alterações (`dc-simu` 3657695)
- `thermalResetControl.ts`: `thermalResetDirection` (sentido do gesto) e `requestThermalResetTurn` (evento `dc:thermal-reset-turn`).
- `ThermalRelayControls.tsx`: cada botão pede ao 3D a rotação no seu sentido e depois rearma; ícone espelhado à esquerda; texto de ajuda atualizado.
- `Panel3D.tsx`: o botão azul roda −1/+1 durante 260 ms e volta ao repouso, igual ao arrasto. Lógica elétrica, TEST e modo M/A intocados.
- `bottom-sheet-head.css`: separadores (`.dc-dock-tabs`, `.grafcet-tabs`) fixos sob o cabeçalho nos painéis de baixo do telefone (IEC, 3D Realista, GRAFCET), opacos e de lado a lado, com 44 px em vez de 50 px; altura do cabeçalho em `--bs-head-h`. Fecha a pendência de 2026-11-04.

## Verificação
`tsc -b`, `vite build`, `test:style` (agora passa), `test:thermal-controls` (24, mais 3 de sentido), `test:imported-components` (189), `test:native-sim`: PASS.

## Pendências
Sem browser neste ambiente: confirmar no telefone a rolar os 3 painéis (separadores colados, sem faixa por cima) e, no 3D, o botão azul a rodar com o arrasto e com os botões do inspetor. Ladder não tem separadores deste tipo.
