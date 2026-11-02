---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-30
updated: 2026-10-30
tags: [dc-simu, grafcet, editor, arrastar, redimensionar, atalhos, modal]
---
# GRAFCET — arrastar para qualquer lado, redimensionar etapas/ações e Enter no eliminar

## Pedido

1. Melhorar a criação e o arrasto de linhas, transições, ações e etapas: arrastar para qualquer lado do canvas sem que se soltem das linhas.
2. Redimensionar etapas e ações: face (uma dimensão) ou canto (proporcional).
3. Ao eliminar um componente, Enter na modal de confirmação abria a configuração do componente em vez de apagar.

## O que mudou

### Arrastar para qualquer lado
- Os limites de arrasto saíram: etapas (incluindo grupos), transições soltas, ações e o Shift+setas já não param na borda esquerda/de cima.
- Ao largar, se algo ficou com coordenadas negativas, `normalizeOrigin` (em `save`) desloca a página toda — as etapas ficam fixadas na posição atual, e transições, ações soltas, comentários e dobras das linhas acompanham. A vista compensa o deslocamento, por isso nada salta no ecrã.
- **Ação anexada largada em espaço vazio fica onde foi largada e continua ligada à etapa.** Guarda a posição relativa à etapa (`dx`/`dy`) e desenha a sua própria ligação (pela face direita ou esquerda, ou na vertical quando fica por cima ou por baixo da etapa). Durante o arrasto, a ligação acompanha a ação a laranja. Para desanexar de propósito, carregue em **Ctrl/⌘ ao largar**. Largar junto à própria etapa devolve a ação à coluna ou linha; largar noutra etapa move-a para lá.

### Redimensionar
- Etapa ou ação selecionada mostra puxadores:
  - as **faces** são faixas ao longo de cada lado, que se acendem ao passar o rato e deixam uma folga ao centro para os portos de ligação;
  - os **cantos** são quadrados brancos que redimensionam na mesma proporção.
- Etapas crescem para os dois lados do eixo, para a sequência continuar alinhada. A face norte sobe o topo e fixa a etapa.
- Ações na coluna ou linha: puxadores E, S e SE (não saem do lugar). Ações afastadas e ações soltas têm os 8 puxadores.
- Limites: etapas 40–260 × 36–220; ações 70–420 × 22–180. Com o íman ligado, as faces avançam em meia grelha (Alt dá movimento livre).
- Tudo acompanha o tamanho guardado (`w`/`h` em `GrafcetStep`/`GrafcetAction`):
  - portos de entrada e saída, ligação à ação e transições acima e abaixo;
  - empilhamento das ações (larguras e alturas acumuladas), zona de largada, enquadramento ("zoom à seleção") e o tamanho do texto.

### Enter no eliminar
- `isModalOpen()` (em `editorKeys.ts`): enquanto houver um `[aria-modal="true"]`, o atalho global do GRAFCET não trata Enter, Delete nem as setas.
- A modal de confirmação (`dialogs.tsx`) passa a tratar Enter e Escape em captura: Enter confirma, Escape cancela. Se o foco estiver num botão da modal, vale o clique nativo desse botão.

## Ficheiros
- `src/grafcet/GrafcetEditor.tsx`:
  - geometria por tamanho: `stepSizeOf`, `attachedBoxes`, `nextActionSlot`;
  - `ResizeHandles` e `startResize`;
  - `normalizeOrigin`;
  - arrasto de ação que mantém a ligação;
  - limites de arrasto removidos.
- `src/grafcet/layout.ts`: `stepSize`, `actionSize`, `resizeBox`, `originShift` e os limites.
- `src/grafcet/engine.ts`: `w`, `h`, `dx` e `dy` opcionais (projetos antigos não mudam).
- `src/ui/dialogs.tsx` e `src/ui/editorKeys.ts`: teclado das modais.
- `src/styles/grafcet-editor.css`: puxadores.
- `scripts/smoke.ts`: 11 verificações novas (tamanhos, faces, cantos, limites, origem).

## Validação
- `tsc -b` limpo; `npm test` passou, incluindo as 11 verificações novas.
- `test:grafcet-links` passou: 27 verificações.
- Browser (Playwright no servidor de dev, projeto «Partida direta com emergência»):
  - etapa 0 arrastada 260 px para a esquerda e 60 px para cima: ficou onde foi largada (±5 px, por causa do íman), e a página deslocou-se sem saltar;
  - etapa 1, pelo canto SE: de 70×60 para 150×127, a mesma proporção (1,18);
  - etapa 1, pela face E: a largura cresceu de 150 para 215 px, e a altura não mudou (salvo o arredondamento à meia grelha);
  - ação «H1 MARCHA» arrastada 60 px para a direita e 150 px para cima: continua anexada (3 anexadas, 0 soltas) e a ligação foi redesenhada;
  - redimensionada pela face S: de 42 para 74 px de altura;
  - Delete numa etapa → confirmação → Enter: a etapa foi apagada e nenhuma modal ficou aberta.
- Já falhavam antes desta alteração, verificado com `git stash`: `test:grafcet-ui` (contagem da tabela de sinais), `test:grafcet-construction-ui` e `test:grafcet-modals-ui` (as fixtures não carregam no servidor de dev partilhado). Ficaram no backlog como GRAFCET-UI-TESTS-ENV-01 — **resolvido** em [[Validation-2026-10-30-Render-Cores-Luzes-Exemplos-GRAFCET]] (os testes importavam outra instância da store).

## Pendente
- Confirmar em tablet real o arrasto dos puxadores com o dedo (as faces têm 6 unidades de espessura).
