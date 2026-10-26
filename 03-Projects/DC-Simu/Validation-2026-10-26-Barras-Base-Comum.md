---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_PARTIALLY_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, ui, toolbar, ladder, grafcet, atalhos, simulacao]
---
# Barras de ferramentas: base comum + ferramentas por ambiente — 2026-10-26

## Pedido

Barras partilhadas entre editores, mas cada ambiente acrescenta as ferramentas de que precisa. Botões de simulação e atalhos iguais.

## Implementação (DC-Simu)

- `toolbarKit.tsx`: novo `SimToggleButton`; `ShortcutsButton` passa a aceitar `scope` e `title` e mantém o aspeto usado nas barras.
- `Toolbar.tsx`: as três cópias do botão «Simulação» (Esquema, Ladder, GRAFCET) e as duas do botão «Atalhos» passam a usar os componentes comuns. Atributos `data-sim-toggle` e `data-shortcuts-button` e comportamento inalterados.
- Ferramentas próprias de cada ambiente ficam no bloco do respetivo `mode` (Compilar e Bloco no Ladder; Componentes e ferramentas de seleção no GRAFCET).
- Guia de extensão: `docs/TOOLBAR-ATALHOS-SIMULACAO.md`, secção «Base comum e ferramentas por ambiente».

## Evidência

| Verificação | Resultado |
| --- | --- |
| `npx tsc -b` | Sem erros |
| `npm test`, `test:style` | Passam |
| `test:toolbar-ui` e restantes percursos Playwright | Não executados: navegadores indisponíveis neste ambiente |

## Estado

| Item | Estado |
| --- | --- |
| Botões Simulação e Atalhos comuns | implementado |
| Verificação visual e Playwright | pendente |
| Editor de componentes: botão Atalhos na barra | por fazer (usa botão próprio no cabeçalho) |
| Aprovação pelo responsável | pendente |
