---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_PARTIAL_TEST
created: 2026-10-27
updated: 2026-10-27
tags: [brainet, dc-simu, qa, admin, ui, ux]
---
# Administração: renovação de ecrãs e páginas — 2026-10-27

## Pedido

Melhorar os ecrãs e as páginas da administração, que pareciam amadores. O trabalho foi feito no submódulo do cofre (`03-Projects/DC-Simu/dc-simu`), com commit nos dois repositórios. Contexto usado: [[Design-Principles]], [[Validation-2026-10-26-Admin-SaaS]] e capturas de ecrã do estado anterior.

## Problemas encontrados (capturas anteriores)

| # | Problema | Efeito |
| --- | --- | --- |
| 1 | Nove separadores numa única barra de botões, sem agrupamento | Difícil perceber onde está cada coisa; barra cheia |
| 2 | O Resumo mostrava números grandes sem ação e os pedidos pendentes perdiam-se entre eles | Era preciso procurar o que exigia decisão |
| 3 | Utilizadores: oito botões iguais por conta, vários desativados | Ruído visual; não se percebia porquê estavam desativados |
| 4 | Componentes: três linhas por componente, com chips «0 ficha(s)» e «0 modelo(s)» | Lista longa e repetitiva |
| 5 | Projetos e Registos: linhas de texto corrido, sem colunas | Não se comparava nada |
| 6 | Planos: o cartão Pro ficava desalinhado por causa de «Remover destaque» | Cartões desiguais |
| 7 | Avisos de sucesso empurravam o conteúdo | O layout saltava |

## Alterações

DC-Simu, commit `e3a112c` (carimbo #74), publicado em `main`.

- **Estrutura** (`AdminPanel.tsx`): cabeçalho com ambiente (servidor ou modo local) e ações; navegação lateral agrupada, com a contagem «por tratar» realçada; barra horizontal em ecrãs estreitos e na Biblioteca 3D.
- **Resumo:** pendências com ação, seis totais que abrem a lista correspondente, atividade recente e contribuições lado a lado.
- **Projetos:** tabela com cabeçalho, números alinhados, eliminação com nome acessível; em telemóvel cada linha passa a cartão.
- **Utilizadores:** ações frequentes visíveis (Plano…, Detalhes, Ver atividade) e as restantes em «Mais ações» (`RowMenu.tsx`), com o motivo quando estão indisponíveis.
- **Componentes:** linha compacta (nome, estado, ações), sem chips a zero; arquivados e eliminados em tom neutro.
- **Registos:** tabela única com cabeçalho. **Sistema:** grupos «Armazenamento» e «Aplicação». **Planos:** cartões em duas colunas, funcionalidades em duas colunas, barra de gravação com sombra.
- **Estilo:** `src/styles/admin-refine.css`, só com tokens `--dx-*`; decisão em DC-ADR-050.

## Verificação

| Verificação | Resultado |
| --- | --- |
| `tsc -b` | Sem erros |
| `npm run test:style` | OK |
| `npm run test:saas` | OK (58 verificações) |
| `vite build` | OK |
| Smoke de UI da administração (planos, utilizador, bloquear/desbloquear componente), Chromium a 1440 px | OK, sem erros de página |
| Capturas a 1440 px (Resumo, Utilizadores, Componentes, Planos, Registos) e 390 px (Resumo, Utilizadores) | Revistas |

## Limites e pendências

- O smoke completo `test:admin-saas-ui` **não** terminou neste ambiente: a parte da página inicial falhou ao clicar em «Anual» (o elemento é desligado do DOM em ciclo, ambiente com renderização por software). Só foram executados os passos da administração. Repetir o smoke completo numa máquina normal.
- As capturas partiram de um navegador sem dados: a tabela de Projetos e as linhas de Registos com dados foram verificadas por tipos e estrutura, não visualmente.
- Biblioteca 3D, Contribuições e a vista com servidor (SQLite/Supabase) não foram revistas visualmente.
- Estado: implementado e testado em parte; **não aprovado**. A publicação em produção segue o [[Release-Process]].
