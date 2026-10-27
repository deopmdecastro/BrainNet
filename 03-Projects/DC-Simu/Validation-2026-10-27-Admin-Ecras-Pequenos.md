---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED
created: 2026-10-27
updated: 2026-10-27
tags: [brainnet, dc-simu, admin, ui, ux, mobile, tablet]
---
# Validação 2026-10-27 — administração em ecrãs pequenos

Trabalho pedido por Deogracia de Castro: «melhorar a UI e UX do meu painel
administrativo», com autorização explícita para `git commit`, `git push` e publicação nos repositórios
`dc-simu` e `BrainNet`. Feito no submódulo do cofre (`03-Projects/DC-Simu/dc-simu`), como pedido,
sobre o `main` publicado (`037977d`). Complementa [[Validation-2026-10-27-Admin-UI]], que tratou da
estrutura e dos ecrãs de secretária: aqui o alvo foi **a mesma administração no telemóvel, no tablet e
no portátil**.

## Como foi observado

Capturas e medições em Chromium headless (Playwright) a **390 × 844** (telemóvel do pedido),
**768 × 1024**, **1024 × 900** e **1440 × 900**, com `localStorage` descartável, `/api/*` bloqueado e
a conta `dcsimu-admin`. Percorridas as nove secções, medindo: conteúdo da faixa de secções,
deslocamento horizontal da página, altura do cabeçalho, altura de cada linha de componente, posição
da barra de gravação e altura dos alvos de toque.

## Problemas medidos (antes)

| # | Largura | Medição | Efeito para quem usa |
| --- | --- | --- | --- |
| 1 | 390 px | faixa de secções: 1 087 px de conteúdo em 350 px visíveis | só se viam três das nove secções; as outras seis estavam atrás de um deslize que ninguém adivinha |
| 2 | 390 px | cabeçalho com 250 px em todas as secções | um quarto do ecrã antes de qualquer conteúdo |
| 3 | 390 px | componente com ≈ 170 px (cinco botões em três linhas) | 72 componentes = dez ecrãs de percurso |
| 4 | 390 px | barra «Guardar planos» fixa sobre os últimos campos | tapava o campo que se estava a preencher |
| 5 | 390 px | datas nativas sem nome (`mm/dd/yyyy`) | não se sabia qual era o início e qual era o fim |
| 6 | 768 px | faixa: 1 087 px em 707 px | seis secções escondidas |
| 7 | 1024 px | página 31 px (Componentes) e 114 px (Utilizadores) mais larga do que o ecrã | conteúdo cortado e deslocamento horizontal |
| 8 | 390 px | botões da conta a quebrar para uma terceira linha | altura desperdiçada em cada conta |

## Alterações

### `dc-simu`

- `src/admin/AdminPanel.tsx` + `src/styles/admin-refine.css` — **navegação adaptativa**: ≤ 720 px um
  **seletor de secção** (grupo + nome + contador) que abre folha inferior com as nove secções e os
  quatro grupos; 721–960 px faixa em duas linhas; > 960 px navegação lateral. Cabeçalho compacto no
  telemóvel (131 px).
- `src/admin/ComponentsTab.tsx` — ≤ 1180 px a linha fica com plano mínimo, a ação do estado atual e
  **Mais ações** (`RowMenu`: arquivar, eliminar, contribuições com o efeito); ≤ 720 px duas filas e
  seleção na linha do nome (129 px por componente); nota de ajuda em `<details>` fechada no telemóvel.
- `src/admin/PlansTab.tsx` — barra de gravação estreita (Guardar + Mais) e conteúdo a reservar 84 px,
  em vez de a barra tapar os últimos campos.
- `src/admin/LogsTab.tsx` — «De»/«Até» com nome visível, paginação larga e limpeza de registos num
  grupo com rótulo.
- `src/admin/UsersTab.tsx` — ações da conta em grelha de duas colunas com altura de toque; «+ Nova
  conta» explica por que está desativada no modo local.
- `src/ui/toolbarKit.tsx` — `useNarrowMenu` passa a ser exportado, para a administração usar o mesmo
  ponto de corte (720 px) dos menus dos editores. Sem alteração de comportamento.
- `scripts/admin-ui-smoke.mjs` (novo, `npm run test:admin-ui`) e `package.json`.
- `docs/ADMIN-ECRAS-PEQUENOS.md` (novo) e secção **v5.3** no `README.md`.

### Teste desalinhado (não é mudança de produto)

`scripts/editor3d-ux-ui-smoke.mjs` falhava no `main` publicado, antes deste trabalho: o esquema 3D
passou a deixar acionar equipamentos quando a simulação está a correr (`runState === 'running'`, desde
`81f4bce`) e o teste ainda alternava `useSimUi.schematic`. O teste passa a ligar/desligar a simulação
(`play()` / `stop()`). Registado como TEST-DRIFT-02 no [[Backlog]].

## Verificações executadas (evidência real)

| Comando | Resultado |
| --- | --- |
| `npm run typecheck` (`tsc -b`) | sem erros |
| `npm run test:admin-ui` (novo) | **43 verificações** a 390, 768, 1024 e 1440 px — seletor/folha, cabeçalho ≤ 160 px, sem deslocamento horizontal nas quatro larguras, componentes ≤ 150 px, menu da linha, ajuda fechada, datas com nome, barra de gravação dentro do ecrã, alvos ≥ 32 px, faixa do tablet em duas linhas, navegação lateral na secretária |
| `npm run test:admin-saas-ui` | 22 verificações (planos, plano de conta, bloqueio de componente, pedido aprovado) |
| `npm run test:saas` | 58 verificações |
| `npm test` (núcleo) | «TODOS OS TESTES PASSARAM» |
| `npm run test:style` | `no-accent-border: ok` |
| `npm run test:editor3d-ui` | passa, já com a correção de deriva (antes falhava em «Simulação ativa permite manobrar») |
| `npm run test:logo-editor-ui` · `test:toolbar-ui` · `test:editors-sweep-ui` | 62 · OK · 19 — sem regressões nos editores |
| `npx vite build` (local) | não executado neste ambiente (2 GB; ENV-01 pede 3 GiB). O build de produção é feito pela Vercel a partir do `main` |

## Estado

- **Implementado e testado** (telemóvel, tablet, portátil e secretária, Chromium headless).
- **Publicado**: `dc-simu` e `BrainNet` (este registo, [[Backlog]], [[Design-Principles]],
  [[Decision-Log]] e [[../../00-Dashboard/Projects-Dashboard|dashboard]]).
- **Por confirmar**: revisão num telemóvel físico (UI-VISUAL-01); vista com servidor
  (SQLite/Supabase), que o ambiente de trabalho não tem; Biblioteca 3D a 390 px.

## Pendências que continuam abertas

- UI-VISUAL-01 (revisão em dispositivo real).
- ENV-01 (reproduzir o build de produção num ambiente com memória suficiente).
- ADMIN-SERVER-01 (medir a administração com servidor/Supabase, incluindo criação e bloqueio de contas).
- 3D-DETECT-02/03, LADDER-MODEL-01 e as restantes entradas de [[Backlog]].

[[Backlog|Backlog]] · [[Design-Principles|Princípios de interface]] · [[Decision-Log|Decisões]] · [[Validation-2026-10-27-Admin-UI|Validação da estrutura da administração]]
