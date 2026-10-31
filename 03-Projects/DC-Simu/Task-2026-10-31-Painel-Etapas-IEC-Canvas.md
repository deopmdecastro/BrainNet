---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, grafcet, painel, propriedades, esquema-iec, canvas, ui]
---

# Painel lateral de etapas GRAFCET + Criar esquema IEC

## Pedido
1. O painel lateral direito de etapas do GRAFCET **não encolhe** ao recolher.
2. O botão **Criar esquema IEC** deve abrir um **canvas vazio pronto a usar**.

Trabalhar a partir do cofre; commit e push em `dc-simu` e `BrainNet`.

## Diagnóstico
- **Painel GRAFCET:** em desktop (`>800px`) o `<aside class="grafcet-properties">` mantinha largura fixa (`min(370px,35vw)`, `flex:none`) mesmo com `propsOpen=false`. A regra que esconde o conteúdo (`display:none` nos filhos excepto o summary) existia só dentro de `@media (max-width: 800px)`. O rail esquerdo (Componentes) já usava `CollapsedPanelRail` ao fechar; o direito não.
- **Esquema IEC:** o botão primário do estado vazio apenas disparava `dc-cmd-open-library` / `dcsimu:open-library`. O overlay `dc-cmd-empty` continuava a bloquear o canvas (`!pageParts.length`).

## Implementação (dc-simu)
- `src/grafcet/GrafcetEditor.tsx`: em desktop, quando `!propsOpen`, renderiza `CollapsedPanelRail` (side=`right`, label «Propriedades») em vez do aside largo; em mobile (`propsAtBottom`) mantém a gaveta inferior com `is-open`.
- `src/styles/grafcet-editor.css`: `.grafcet-properties-restore { flex:none }` e, em `min-width: 801px`, esconde conteúdo e largura do aside quando `not(.is-open)` (defesa em profundidade).
- `src/commands/CommandsEditor.tsx`: estado `emptyDismissed`; o overlay só aparece se `!pageParts.length && !emptyDismissed`. O botão «Criar esquema IEC» define `emptyDismissed=true` (canvas vazio utilizável) e continua a abrir a biblioteca. Ao limpar o diagrama (`emptyCommands`) o overlay volta a ser mostrado.

## Critérios de aceite
- [x] Desktop: recolher o painel de propriedades substitui o aside por uma faixa vertical fina (rail) e liberta largura ao canvas.
- [x] Desktop: reabrir o rail restaura o painel completo.
- [x] Telemóvel (≤800px): comportamento de gaveta inferior inalterado.
- [x] «Criar esquema IEC» remove o overlay e deixa o canvas pronto; biblioteca abre para colocar símbolos.
- [ ] Typecheck / testes locais (ambiente Node pode ser < exigido).
- [ ] Push GitHub autorizado pelo utilizador.

## Commits
A registar após push.
