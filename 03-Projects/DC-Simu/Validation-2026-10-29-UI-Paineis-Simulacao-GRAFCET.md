---
project_id: BN-DCSIMU-001
type: validation
status: TESTED
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, ui, grafcet, ladder, virtual-io, simulation-dock, mobile, tablet, desktop, validation]
---
# Validação 2026-10-29 — Painéis de simulação, inspetor GRAFCET e E/S

Relacionado com [[Task-2026-10-29-UI-Paineis-Simulacao-GRAFCET]], [[Design-Principles]] e [[Testing-Plan]].

**Commit `dc-simu`:** `701498c` (`main`, carimbo `#102`) — **commit local; push não concluído** (ver Pendências).

## Evidência
- `npx tsc -p tsconfig.json --noEmit`: 0 erros.
- `npm run test:style`: `no-accent-border: ok`.
- `npm test`: todos os testes passaram.
- `test:grafcet-signals` (32 verificações), `test:grafcet-ladder-sync`, `test:diagnostics` (11 modelos): OK.
- `scripts/grafcet-ui-smoke.mjs` (servidor Vite local): **todas as verificações PASS**, incluindo o novo painel («Sequência», cartões de entradas e transições, Run pelo grupo «Controlo da simulação» do painel) e «nenhuma exceção de execução no percurso GRAFCET».
- `test:grafcet-construction-ui`: 18 verificações PASS. `editor-grid-ui-smoke`: 8 PASS.
- `vite build`: sem erros.
- Capturas Playwright/Chromium do projeto nativo em 390×844, 820×1180 e 1440×900: GRAFCET (painel aberto/recolhido, E/S, Sequência, inspetor, Sinais) e Ladder (E/S).

## Observações
- `scripts/grafcet-modals-ui-smoke.mjs` já falhava antes desta alteração (confirmado com `git stash`): procura `.grafcet-toolbox-head button` e um botão «Ajustar» que já não existem desde a passagem para `SidePanelHeader`/barra de ferramentas. Fica como pendência de teste, não de produto.
- A vista Esquema 3D não foi capturada no ambiente de teste: o texto 3D pede fontes a uma CDN bloqueada pela rede da sessão. O painel do projeto (separadores com ícone e barra compacta) foi verificado por typecheck e revisão de código.

## Pendências
- **Push:** a rede da sessão recusou o push para `deopmdecastro/dc-simu` e `deopmdecastro/BrainNet` (repositórios não autorizados na sessão; a conta GitHub não está ligada ao Claude). Os commits ficam prontos; ligar a conta GitHub em claude.ai ou aplicar os pacotes git entregues.
- Revisão visual no iPhone real e aprovação do utilizador.
- Atualizar `grafcet-modals-ui-smoke.mjs` aos seletores atuais.
