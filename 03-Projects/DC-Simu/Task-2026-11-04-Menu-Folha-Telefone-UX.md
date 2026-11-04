---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_BUILD_OK_NOT_VISUALLY_VERIFIED
created: 2026-11-04
updated: 2026-11-04
repos: [dc-simu, BrainNet]
tags: [dc-simu, telemovel, tool-menu, folha-inferior, ux, ui]
---
# Menu «Opções do projeto e da vista» (e todos os ToolMenu) no telefone: melhor UI e UX

## Pedido
Melhorar a UI e a UX deste menu em todos os módulos que o têm, no telefone.

## Contexto reutilizado
[[Design-Principles]] (alvos de toque, tokens `--dx-*`, `--pn-*`), [[Validation-2026-10-28-Gavetas-Padronizadas]] («uma especificação, nada por painel»), [[Task-2026-11-04-Paineis-Baixo-Cabecalho-Fixo]] (folga de 56 px para a barra do Safari). Não há menu novo: o mesmo `ToolMenu` (`src/ui/toolbarKit.tsx`, `src/styles/tool-menu.css`) serve Ficheiro, Ferramentas, Painéis, Mais, Alinhar (3D, Ladder, GRAFCET, IEC, Monitor), o «Mais» do editor de componente e o seletor do Admin; melhorar a folha uma vez melhora todos.

## Problemas na captura
- Fim da lista tapado pela barra flutuante do Safari («Velocidade 0.25×» cortada) — só havia área segura em baixo.
- Seis «Velocidade …×» (e os «Passo da malha …») em lista longa, sem ícone e desalinhados com o resto.
- Títulos de secção minúsculos e pálidos; itens sem separação; estado ativo só com um ponto.
- A pega parecia arrastável, mas não fazia nada; o fundo rolava por baixo.

## Alterações (dc-simu)
- **Estrutura:** folha sobre fundo suave, com cabeçalho branco (título 17 px, fechar 40 px) e grupos em cartões brancos com divisórias; títulos de secção fixos (`sticky`) e legíveis (12 px).
- **Itens:** altura 56 px, ícone em mosaico de 36 px, nome 15,5 px e dica 12,5 px; ativo com realce, mosaico azul e visto (✓) à direita; perigo a vermelho; desativado com motivo a âmbar; feedback ao toque (`:active`).
- **Escolhas curtas em chips:** `ToolMenuItem.chip/group/chipLabel`. Itens seguidos do mesmo grupo viram uma linha de botões («Velocidade»: 0.25× … 10×; «Passo da malha»: n px) com `role="menuitemradio"`. Só na folha; o popover do PC/tablet não muda.
- **Gestos:** arrastar a pega/título para baixo fecha (limite 90 px ou deslize rápido); o fundo não rola enquanto a folha está aberta.
- **Fim da lista:** o corpo tem folga de 56 px + área segura para passar por cima da barra do Safari.
- Os itens com `data-tm-item` e `role="menuitem"` continuam iguais (testes de UI do Admin e do editor 3D).

## Verificação
`tsc -b`, `vite build` e `npm test`: OK. `test:style` falha só no caso anterior `.grafcet-text-guards-list li` (`grafcet-dialog-ux.css`), não nesta alteração. Smokes de UI com browser não correram (sem Chromium).

## Pendências (não verificado)
Ver no telefone (390 px e paisagem) o «Mais» do 3D, Ladder, GRAFCET, IEC e Monitor, Ficheiro/Ferramentas/Painéis, Alinhar, e o seletor do Admin: altura da folha, fim da lista visível, chips, arrastar para fechar e toque fora. Opcional: usar `chip` noutros menus com escolhas curtas.
