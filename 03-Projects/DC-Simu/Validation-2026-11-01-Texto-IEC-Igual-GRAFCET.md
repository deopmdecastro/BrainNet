---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED_PARTIAL
created: 2026-11-01
updated: 2026-11-01
repo: https://github.com/deopmdecastro/dc-simu
commits:
  - ed27a50
tags: [dc-simu, texto, iec, grafcet, edicao, selecao, paridade]
---

# Validação 2026-11-01 — Edição e seleção de texto do IEC iguais às do GRAFCET

## Pedido

A forma de editar e selecionar texto no Esquema IEC deve ser igual à do GRAFCET (captura do utilizador com o GRAFCET: caixa tracejada azul e barra de formatação no topo).

## Diferenças encontradas

| Aspeto | GRAFCET (`GrafcetFreeText`) | Esquema IEC (antes) |
| --- | --- | --- |
| Seleção | moldura tracejada azul com fundo suave e hover | contorno contínuo de 2 px |
| Edição | no próprio sítio, a caixa cresce com o texto, Esc/Ctrl+Enter confirmam, vazio apaga | caixa de tamanho fixo com pega de redimensionar, sem confirmar por teclado |
| Arrasto | ajusta à grelha, Alt = livre | posição livre |
| Teclado | Enter/F2 editam, Ctrl+B/I/U formatam | só Delete |
| Toque | — | sem duplo toque |

## Implementação (`dc-simu` ed27a50)

- `src/commands/CommandsAnnotations.tsx`: novo `CommandsFreeText` (moldura, arrasto com `snap`, duplo clique e **duplo toque**, edição com altura automática, Esc/Ctrl+Enter, texto vazio apagado). A barra `TextStyleBar` já era a mesma nos dois editores.
- `src/commands/CommandsEditor.tsx`: Enter/F2 editam e Ctrl+B/I/U formatam o texto selecionado.
- `src/styles/commands.css`: moldura e contorno de edição com os mesmos valores de `canvas-annotations.css`.

## Verificações

- `npx tsc -b` sem erros; `npm test` ✅; `test:canvas-annotations` e `test:style` ok.
- `scripts/commands-text-parity-smoke.ts` (novo, no `test:ci`): 8 verificações de contrato.

## Não verificado

- Sem navegador neste ambiente: `commands-select-texts-ui-smoke` e `annotation-toolbar-ui-smoke` não correram. Confirmar num telemóvel: moldura, duplo toque, caixa a crescer e barra de formatação.
