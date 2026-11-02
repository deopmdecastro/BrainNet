---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-02
updated: 2026-11-02
tags: [dc-simu, grafcet, transicao, comparacao]
---
# Transições comparativas entre GRAFCETs

## Objetivo
Melhorar a modal de propriedades de transição para documentar equivalências com transições de outros GRAFCETs, sem misturar a execução local com referências de revisão.

## Implementação
- `GrafcetTransition.comparisons` guarda uma lista compatível com projetos antigos.
- Cada referência permite nome do GRAFCET, transição equivalente, condição e nota.
- A modal permite adicionar/remover e editar referências; referências vazias não são persistidas.
- A simulação continua a avaliar apenas `condition`, `from` e `to` do GRAFCET atual.

## Contexto reutilizado
Seguidos `AGENTS.md`, `00-Dashboard/Home.md`, `00-Dashboard/Architecture.md`, `Design-Principles.md`, `Requirements.md`, `Backlog.md` e a validação anterior de condições/ligações/importação. O desenho mantém azul para ações, superfícies neutras, densidade técnica e ajuda contextual.

## Aceitação
- [ ] `npm run typecheck`
- [ ] `npm run test:grafcet-dialogs`
- [ ] `npm run test:grafcet-modals-ui`
- [ ] `npm run build`
- [ ] `git diff --check`
- [ ] commit/push no `dc-simu`
- [ ] commit/push no `BrainNet` com referência ao commit do submódulo

## Melhoria posterior da modal de criação — 2026-11-02
A modal de criação de projetos foi refinada no DC-Simu: largura maior no desktop, grelha de tipos em duas colunas, melhor agrupamento semântico, destaque de seleção e adaptação a uma coluna em ecrãs pequenos. Commit: `fa4206f`.
