---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, qa, ui, toolbar, atalhos, ladder, grafcet, simulacao]
---
# Barra de ferramentas: Atalhos, Compilar, Simulação, cartão GRAFCET e nomes no sítio — 2026-10-26

## Pedido

1. Em todos os simuladores, um botão de atalhos na barra de ferramentas com os atalhos de cada simulador.
2. O botão «Compilar» do Ladder deve estar na barra de ferramentas.
3. Na barra de baixo, ao lado do ciclo, um cartão com o GRAFCET em que o programa está e a etapa ativa.
4. Barras com muitos botões não passam para baixo: deslocamento horizontal.
5. Botão «Simulação» igual ao do GRAFCET no Ladder e no Esquema 3D.
6. Mudar o nome das páginas sem a caixa nativa do sistema, como o nome do documento (clicar e editar); melhorar o input «Nome do GRAFCET».

## Implementação

**DC-Simu, commit `78ef7a2` (carimbo #60).** Detalhes em [TOOLBAR-ATALHOS-SIMULACAO.md](./dc-simu/docs/TOOLBAR-ATALHOS-SIMULACAO.md).

- Atalhos (DC-ADR-039): botão `data-shortcuts-button` nas 4 vistas; o Esquema 2D/3D ganhou a lista de ferramentas (1–5), câmara, cabos e vistas; o Monitor mostra as teclas de vista. Pedido por evento `dcsimu:shortcuts` para o editor montado.
- Compilar (DC-ADR-040): na segunda linha da barra com ponto de estado (ok/aviso/erro/desatualizada) partilhado em `useLadderUi`; saiu da barra do programa.
- Cartão GRAFCET: `GrafcetStatusCard` ao lado de `scan #` (nome, página, «Etapa Xn» + comentário, «+N»); clique abre o GRAFCET.
- Deslocamento: barras em `nowrap` + `overflow-x: auto` (principal, segunda linha, programa Ladder, páginas GRAFCET).
- Simulação (DC-ADR-041): `useSimUi` (estado no navegador). Ladder: mostra/esconde o painel inferior. Esquema 2D/3D: `SimulationDock` lateral com controlos RUN, sinais do PLC ou E/S virtuais e etapas GRAFCET.
- Nomes no sítio (DC-ADR-042): `InlineName` (Enter grava, Escape cancela) nas páginas GRAFCET, no título do GRAFCET (substitui a linha «Nome do GRAFCET») e nas folhas do Esquema 2D. Sem `window.prompt`.

## Evidência

| Verificação | Resultado |
| --- | --- |
| `npx tsc -b` | Sem erros |
| `npm run test:ci` (com `Monta-Carga.ct`) | Passa (EXIT 0) |
| `npm run test:server` | 166 passam, 0 falham |
| `vite build` (heap de 3 GiB) | Concluído |
| `test:toolbar-ui` (Playwright, novo) | 37 verificações: atalhos nas 4 vistas, Compilar na barra (ok → desatualizada ao alterar), Simulação no Ladder/Esquema/3D, cartão «Enchimento · Etapa X0», barras a 760 px com 40 px de altura e deslocamento, renomear sem caixas nativas, sem erros |
| Percursos UI existentes | editor3d, terminal-geometry, editor3d-autodetect, editors-sweep, motor, plc-signals, admin-saas, ladder-blocks, grafcet, grafcet-modals, grafcet-construction, blocks, grid: todos passam (admin-saas falhou uma vez por um HDR externo da página inicial bloqueado no teste; passou à repetição e na base) |
| Capturas revistas (`runtime/toolbar/`) | Esquema 2D/3D com painel Simulação; Ladder com Compilar na barra; título e páginas GRAFCET; cartão na barra de estado; barras estreitas |

## Estado

| Item | Estado |
| --- | --- |
| Atalhos em todas as barras | implementado e testado |
| Compilar na barra | implementado e testado |
| Cartão GRAFCET na barra de estado | implementado e testado |
| Barras com deslocamento | implementado e testado |
| Simulação no Ladder e Esquema 2D/3D | implementado e testado |
| Nomes editáveis no sítio | implementado e testado |
| Aprovação pelo responsável | pendente |
| Deploy Vercel | não verificado |

Pendências:
- validar em ecrã tátil o deslocamento das barras;
- painel Simulação do Esquema estreito em portáteis com biblioteca e painel direito abertos;
- pendências anteriores: «Sincronizar tudo» com dados reais, modelos CAD dos 47 integrados, Supabase/pagamentos;
- revogar o token GitHub usado nesta sessão.
