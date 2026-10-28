---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, ui, mobile, desktop, responsiveness, grafcet, virtual-io, account-menu]
---
# Tarefa 2026-10-28 — Refinar ecrãs GRAFCET Transição, Entradas/Saídas e Menu de Conta

## Origem
Capturas fornecidas pelo utilizador (telemóvel / viewport estreito e desktop):

1. **Cabeçalho de propriedades GRAFCET** — «GRAFCET · Transição T15» com ícones de copiar, eliminar e expandir.
2. **Painel Entradas/Saídas virtuais** — STOP note, contador 0/8, botões −/+, Limpar, células I0.0 / I0.1 com etiqueta INT.
3. **Menu de conta (perfil)** — avatar Admin, lista de ações (Gerir conta, Contribuir, Administração, Base de Dados, Automação, Sair), rodapé de sessão.

## Objetivo
Melhorar responsividade mobile + desktop, usar ícones de forma consistente, refinar espaçamentos, botões e hierarquia visual. Manter o sistema de tokens `--pn-*` / `--dx-*` e o `SidePanelHeader`.

## Direção (alinhada a Design-Principles)
- Alvos de toque ≥ 40 px em mobile (`--mr-touch`).
- Espaçamento generoso mas compacto; evitar densidade excessiva ou vazios grandes.
- Botões e controlos com estados hover/focus/active claros.
- Ícones do kit `src/ui/icons` (não SVGs soltos).
- Em ecrãs estreitos: labels longas passam a ícone + `aria-label` / `title`; menus abrem como folha se necessário.
- Não esconder ações principais; o canvas/diagrama continua protagonista.

## Ficheiros prioritários
- `src/components/SidePanelHeader.tsx` + CSS em `panel-system.css` / `mobile-refine.css`
- `src/components/VirtualIoPanel.tsx` + `src/styles/virtual-io.css`
- `src/components/AccountControls.tsx` + CSS de conta em `dx.css` / `mobile-refine.css`
- `src/grafcet/GrafcetSimPanel.tsx` + `src/styles/grafcet-sim.css` (se o header de simulação precisar)
- `src/ui/PropertyDialog.tsx` (diálogos de transição)

## Critérios de aceite
- [ ] Cabeçalho de transição legível e com ações tocáveis em 390 px.
- [ ] Virtual IO: células com alvo ≥ 40 px, stepper e Limpar bem espaçados, note STOP não invade.
- [ ] Menu de conta: lista com hierarquia clara, ícones alinhados, logout destacado, sem overflow em mobile.
- [ ] Desktop: espaçamentos refinados, sem regressão visual.
- [ ] Typecheck + smoke UI relevantes passam.
- [ ] Contexto atualizado no cofre (esta nota + Decision-Log / Validation se aplicável).

## Estado
Preparação: capturas analisadas · Implementação: em curso · Testes: pendente.
