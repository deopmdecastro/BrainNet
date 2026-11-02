---
project_id: BN-DCSIMU-001
task_id: DCSIMU-2026-11-02-LADDER-BOTTOM
type: task
status: IN_PROGRESS
priority: HIGH
owner: grok
created: 2026-11-02
updated: 2026-11-02
tags: [dc-simu, ui, ladder, painel-inferior, telemovel, side-panel-header, paridade]
---

# Task 2026-11-02 — Ladder: painel de baixo com o mesmo design/cabeçalho dos outros (GRAFCET / IEC)

## Objetivo e âmbito

No telemóvel (e de forma consistente), o painel inferior do Ladder deve abrir e apresentar o **mesmo design e cabeçalho** que os painéis inferiores do GRAFCET e do Esquema IEC.

- Usar `SidePanelHeader` com `side="bottom"`, eyebrow `LADDER`, título contextual (ex. "Estado do PLC" ou o nome da aba ativa).
- Reutilizar a casca visual `grafcet-properties` (ou equivalente partilhado) para altura, rolagem, estado recolhido, botão de ampliar (`is-tall`), safe-area e comportamento de abrir/recolher.
- Manter todas as abas e conteúdo existentes (E/S, Memórias, Timers, Contadores, Forçar, Depuração, Compilação, Verificação).
- Não inventar um segundo painel; evoluir o `ladder-bottom-panel` existente.

Referência visual: screenshots do utilizador (IEC e GRAFCET mostram cabeçalho com ícone + eyebrow + título + estado + chevron; Ladder deve ficar igual).

## Contexto e ficheiros

- Design-Principles.md: «Painel em baixo no telemóvel: é o painel lateral completo… nunca uma versão reduzida». Validação-2026-11-01-Grelha-Unica-Painel-Inferior-Telemovel e Validation-2026-11-01-Painel-Inferior-IEC-Texto-Objetos já alinharam IEC e GRAFCET.
- Código:
  - `src/ladder/LadderEditor.tsx` — `ladder-bottom-panel`, `showStatus` (via `useSimUi.ladder`), `statusTab`, resizer.
  - `src/components/SidePanelHeader.tsx` — cabeçalho comum.
  - `src/commands/CommandsSimDock.tsx` — padrão a seguir (casca `grafcet-properties` + SidePanelHeader side=bottom).
  - CSS: `src/styles/mobile-refine.css` (regras `.ladder-bottom-*` e `.grafcet-properties` em max-width/phone), `grafcet-editor.css`, `ladder-editor.css`.

## Dependências e restrições

- Respeitar o kit e tokens existentes; não duplicar estilos de cabeçalho.
- Em telemóvel o diagrama Ladder continua protagonista (max-height ~38–48 % como já está).
- Ctrl+J e atalhos existentes continuam a abrir/fechar o painel.
- Tablet/desktop: o painel pode continuar em baixo (já é a natureza do status Ladder); o cabeçalho fica uniforme em todos os breakpoints.

## Critérios de aceitação

- [ ] No telefone, o painel de estado do Ladder abre na parte de baixo com o mesmo aspeto de cabeçalho que GRAFCET e IEC (eyebrow, título, detalhe de estado se aplicável, chevron, botão de ampliar quando aberto).
- [ ] As abas (E/S, Memórias, …) e o conteúdo funcional permanecem; o seletor/tabs ficam integrados de forma limpa sob o cabeçalho ou como ações.
- [ ] Recolher/expandir funciona; estado persistido se já existir.
- [ ] Sem regressões em `tsc`, testes existentes de ladder/style, e smoke de painéis se houver.
- [ ] Nota de validação atualizada em BrainNet após implementação.

## Entrega

(preencher após código)

## Notas de implementação (rascunho)

1. Envolver o conteúdo do painel de status numa `<aside className="grafcet-properties ladder-status-dock …">` (ou reutilizar classes existentes + `cmd-dock` se fizer sentido).
2. Substituir o bloco `ladder-bottom-tabs` pelo `SidePanelHeader` (side="bottom", onToggle que chama setShowStatus).
3. Título dinâmico a partir de `statusTab` (mapear io → "Entradas/Saídas", etc.).
4. Manter o resizer e a altura `statusH` / `flexBasis` se possível, ou alinhar à lógica de `is-tall` do GRAFCET.
5. Ajustar CSS em `mobile-refine.css` / `ladder-editor.css` para que as regras de max-height e safe-area se apliquem à nova casca sem quebrar o conteúdo.
6. Testar visualmente o fluxo: abrir Ladder → tocar no toggle / Ctrl+J → cabeçalho idêntico → mudar de aba → recolher.

## Entrega

### Alterações em dc-simu
- `src/ladder/LadderEditor.tsx`
  - Painel inferior passa a usar a casca `grafcet-properties` + `SidePanelHeader` (`side="bottom"`, eyebrow `LADDER`, título dinâmico pela aba ativa, detalhe RUN/PAUSA).
  - O toggle de recolher/expandir e o cabeçalho ficam idênticos aos do GRAFCET e do Esquema IEC.
  - Abas (E/S, Memórias, …), ações vivas (MW, scan, repor) e conteúdo mantidos; o seletor «Painel» e a tablist ficam sob o cabeçalho quando aberto.
- `src/styles/ladder-editor.css`
  - Regras de paridade para `.ladder-bottom-panel.grafcet-properties` (largura, summary, estado recolhido, grid).

### Critérios
- [x] Cabeçalho igual (eyebrow + título + detalhe + chevron).
- [x] Abre na parte de baixo (já era; agora com o mesmo design).
- [ ] Verificação visual em telemóvel real / browser (ambiente sem Chromium).
- [ ] `tsc` / testes (node_modules não instalados neste ambiente por 502 no registry).

### Branches / commits
A implementar em seguida (commit + push em ambos os repos).

---

## Extensão 2026-11-02 — Painel direito do 3D também em baixo no telemóvel

Pedido: «O painel do lado direito no 3D, deve abrir em baixo também.»

### Implementação (dc-simu)
- Novo `src/components/SchematicSimDock.tsx` — espelho do `CommandsSimDock` (SidePanelHeader + grafcet-properties + RightDockPanel mode=schematic).
- `App.tsx`: `phoneSchematic` / `phoneBottomDock`; no telemóvel o 3D deixa de montar a coluna/gaveta da direita e monta o painel em baixo na coluna do canvas.
- `mobile-refine.css`: regras de altura/rolagem/safe-area para `.schematic-sim-dock-phone`.
- Backdrop mobile não cobre o canvas só por causa do painel de baixo (só biblioteca / gavetas laterais).

### Aceitação
- [x] No telefone, 3D Realista: painel completo (GRAFCET / E/S / Objetos / Diagnóstico) abre em baixo com o mesmo cabeçalho que IEC e GRAFCET.
- [ ] Confirmar visualmente no telemóvel.
