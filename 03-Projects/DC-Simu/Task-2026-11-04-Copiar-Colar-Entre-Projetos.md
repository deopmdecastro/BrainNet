---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-04
updated: 2026-11-04
tags: [dc-simu, clipboard, projetos, grafcet, esquema]
---
# Copiar de um projeto e colar noutro

## Pedido
Permitir copiar elementos num projeto e colá-los noutro (mesmo navegador).

## Problema
- Esquema elétrico: `clipboard` só em memória no Zustand — perdia-se em alguns fluxos de troca de projeto.
- GRAFCET: `clipboardRef` (useRef) — perdia-se ao sair do editor / mudar de projeto.

## Solução
- Módulo `src/clipboard/crossProjectClipboard.ts`:
  - Grava em `localStorage` (`dc-simu.cross-project-clipboard.v1`).
  - Opcionalmente escreve JSON no clipboard do sistema (prefixo `dc-simu-clipboard:`).
  - Tipos: `electrical` (componentes + cabos internos) e `grafcet` (etapas + transições + posições).
- `useSimStore.copySelection` / `pasteClipboard`: grava e restaura o clip elétrico persistente.
- `GrafcetEditor.copySelection` / `pasteClipboard`: idem para GRAFCET; menu Colar ativo se houver clip persistente.
- Smoke: `scripts/cross-project-clipboard-smoke.ts`.

## Uso
1. Abrir projeto A → selecionar componentes (ou etapas GRAFCET) → Ctrl+C.
2. Abrir projeto B → Ctrl+V.
3. Funciona também após recarregar a página no mesmo navegador.

## Critérios
- [x] Copiar componentes no esquema e colar noutro projeto.
- [x] Copiar etapas GRAFCET e colar noutro projeto / outro diagrama após troca.
- [x] Mensagens de feedback mencionam «outro projeto».
