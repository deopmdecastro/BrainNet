---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_BUILD_OK_NOT_VISUALLY_VERIFIED
created: 2026-11-04
updated: 2026-11-04
repos: [dc-simu, BrainNet]
tags: [dc-simu, telemovel, painel-inferior, side-panel-header, sticky, scroll]
---
# Painéis de baixo no telefone: cabeçalho fixo e opaco ao dar scroll

## Pedido
No telefone, nos painéis de baixo o cabeçalho deixa ver a informação por baixo ao dar scroll. Resolver em todos os painéis de baixo.

## Contexto reutilizado
[[Task-2026-11-02-Ladder-Painel-Inferior-Header]] (`SidePanelHeader side="bottom"` + casca `grafcet-properties`), [[Validation-2026-11-01-Grelha-Unica-Painel-Inferior-Telemovel]], [[Validation-2026-10-28-Gavetas-Padronizadas]] («um novo painel entra na lista; sem regras por painel»). O desktop já tinha a solução em `panel-system.css` (cabeçalho `sticky` com sombra sólida que tapa o padding); faltava no telefone.

## Causa
As folhas de baixo (IEC, 3D Realista, GRAFCET) são o próprio contentor de scroll e têm 12 px de padding. O cabeçalho é `sticky`, mas a folha tinha padding por cima e dos lados: ao rolar, a lista (filtro, separadores, cartões) passava nessas faixas à volta do cabeçalho, que parecia solto. No GRAFCET a pega da folha (`::before`, margem negativa) agravava a faixa. O Ladder não tem padding e já estava bem.

## Alterações (`dc-simu`)
- Novo `src/styles/bottom-sheet-head.css` (importado depois de `panel-drawer.css`), uma só regra para todos os painéis de baixo do telefone: folha aberta sem padding-top; cabeçalho `sticky top:0`, opaco, de lado a lado (margem negativa = padding lateral); pega do GRAFCET como bloco normal. Recolhido mantém a barra fina.
- Cobre: `.dc-cmd .cmd-dock` (Esquema IEC), `.schematic-sim-dock-phone` (3D Realista), `.grafcet-full .grafcet-properties` (GRAFCET) e garante camada/fundo sólido no Ladder.
- Mesmos breakpoints das regras existentes (coarse ≤743 px / paisagem baixa, e ≤800 px no GRAFCET).

## Verificação
`tsc -b` e `vite build`: OK. Sem browser neste ambiente. `npm run test:style` falha por um caso que não é desta alteração: `.grafcet-text-guards-list li` em `grafcet-dialog-ux.css` (commit `0f1c66d`, barra lateral de destaque).

## Pendências (não verificado)
Confirmar no telefone, nos quatro painéis (IEC, 3D, GRAFCET, Ladder), a rolar a lista com o painel aberto e ampliado: nada visível por cima nem dos lados do cabeçalho, pega do GRAFCET visível, recolher/abrir intactos. Os separadores (`dc-dock-tabs`, `grafcet-tabs`) ainda rolam com o conteúdo; se quiser, ficam também fixos sob o cabeçalho. Corrigir o `test:style` do `grafcet-text-guards-list`.
