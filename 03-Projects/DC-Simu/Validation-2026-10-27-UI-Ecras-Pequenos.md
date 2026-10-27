---
project_id: BN-DCSIMU-001
type: validation
status: ACTIVE
created: 2026-10-27
updated: 2026-10-27
tags: [brainnet, dc-simu, ui, ux, mobile, editor3d, ladder, grafcet]
---
# Validação 2026-10-27 — interface em ecrãs pequenos e barra do editor

Trabalho pedido por Deogracia de Castro: «melhorar UI e UX e funcionalidades que existem, melhorar o
editor de componentes, esquema 3D, ladder e Grafcet» e «melhorar também a barra de ferramentas do
editor de componentes no telemóvel». Executado sobre o submódulo `03-Projects/DC-Simu/dc-simu`
(commit de partida `fabe385`), com autorização explícita para commit, push e publicação das
alterações nos repositórios `dc-simu` e `BrainNet`. O resultado publicado é o commit **`572c9a6`**
(o incremento em `53ade78`, rebaseado sobre o que entretanto já estava no GitHub (`383b349`), mais a
nota do build de produção).

## Como foi observado

Capturas e medições em Chromium headless (Playwright) a **390 × 844** (telemóvel), 768, 1024 e
1440 px, com `localStorage` descartável e `/api/*` bloqueado. Percursos: Esquema 2D/3D com projeto
novo, editor de componentes (PKZM C-10 e LOGO! 12/24RC), Ladder com uma network e GRAFCET com três
etapas. Nenhuma conta, projeto ou ficheiro real foi usado.

## Problemas encontrados (antes)

| # | Onde | Observação |
| --- | --- | --- |
| 1 | Barra do editor de componentes | A segunda faixa transbordava: «Biblioteca de bornes», o olho dos bornes e «Organizar» ficavam cortados na borda, sem sinal de que existiam. A dica da ferramenta ativa desaparecia. |
| 2 | Zoom 3D | A barra mostrava «100 %» fixo no código; sem relação com a câmara. Sem −/+ (só roda do rato ou pinça). |
| 3 | Enquadramento 3D | Câmara calculada pela esfera envolvente: num ecrã ao alto o PKZM ocupava ≈ 1/3 da altura do canvas. |
| 4 | Esquema 3D | Cartão «Selecionar · Clique para selecionar… · Manobrar» ocupava um quarto do canvas; «Biblioteca/GRAFCET/Objetos» no fim de uma faixa com deslize. |
| 5 | Cabeçalho do editor | Nome do projeto reduzido a «E.» (logótipo, separador, dois botões com texto e «Guardar» na mesma linha). |
| 6 | Ladder | Network de 720 px em ecrã de 390 px: bobina fora do ecrã; mínimo de zoom 70 % insuficiente; resumo cortava «Bobinas» e «Timers/Counters»; linha «Programa Ladder» redundante; estado vazio com ≈ 300 px. |
| 7 | GRAFCET | Gaveta de propriedades com 48 % da altura (canvas com 352 px), abria sozinha a cada seleção e tapava a barra de zoom/ajuste. |

## Alterações implementadas

### `dc-simu`

- `src/ui/toolbarKit.tsx` + `src/styles/tool-menu.css` — novo `ToolMenu`: `role="menu"`, setas/Home/End,
  Escape com devolução de foco, popover medido em ecrã largo e folha inferior até 720 px. Itens com
  nome, descrição, atalho, estado e **motivo de bloqueio**.
- `src/admin/editor3d/ComponentEditor3D.tsx` — barra reorganizada em duas linhas com «Mais» fixo;
  menu único com formas/GLB, edição, manipulador, bornes por face, cena e ajuda.
- `src/admin/editor3d/editorStore.ts` + `Viewport.tsx` — `camStats {yaw, pitch, fit, zoom}` (100 % =
  enquadrado), ação `zoom(factor)`, enquadramento pela caixa projetada.
- `src/three/Panel3D.tsx` + `panel3d-editor.css` — cartão de contexto numa linha, explicação no «?».
- `src/components/Toolbar.tsx` — painéis do Esquema no início da faixa; «Ajustar à largura» no Ladder.
- `src/ladder/ladderZoom.ts`, `LadderEditor.tsx`, `ladder-editor.css` — mínimo 40 %, `fitLadderZoom`,
  ajuste automático até escolha manual, resumo em pastilhas, estado vazio compacto.
- `src/grafcet/GrafcetEditor.tsx`, `grafcet-editor.css` — gaveta em folha flutuante, sem abertura
  automática no telemóvel, barra de zoom movida para o topo.
- `src/account.tsx`, `src/ui/icons.tsx`, `dx.css` — nome do projeto com a largura livre; «Projetos» e
  «Comentários» como ícones com contador.
- `scripts/editor3d-toolbar-ui-smoke.mjs` (novo) + `docs/UI-ECRAS-PEQUENOS.md` + secção v5.2 no README.

### Testes atualizados (falhavam já antes desta alteração)

- `scripts/editor3d-autodetect-ui-smoke.mjs` — o inspetor passou a estar agrupado (Construção ·
  Funcionamento · Componente) e o separador «Botões» deixou de estar na fila inicial; o teste agora
  abre a área antes do separador. **Confirmado que falhava também no commit de partida** (`fabe385`,
  verificado em worktree separada) — não é regressão deste incremento.
- `scripts/logo-editor-ui-smoke.mjs` — em ≤ 1024 px o menu «Organizar» é agora o «Mais»; o teste passa
  a validar o menu certo e verifica seis formas + eliminação no telemóvel.
- `scripts/pinch-zoom-smoke.ts` — limite mínimo do Ladder atualizado de 0,7 para 0,4.

## Integração com o trabalho publicado no GitHub

Durante a sessão, o `origin/main` do `dc-simu` avançou seis commits (sistema de painéis `pn-*`,
biblioteca do Esquema e Monitor nesse sistema, «Simulação»/«Atalhos» na barra comum, espaçamento da
barra e cubo de vistas, e remoção do modo «Manobrar» do esquema 3D). O incremento deste dia foi
**rebaseado** sobre `383b349` em vez de forçar o envio, e os conflitos resolveram-se assim:

| Ficheiro | Conflito | Resolução |
| --- | --- | --- |
| `src/ui/toolbarKit.tsx` | Ícones importados (`IconPlay` de um lado, `IconChevronDown`/`IconFocus` do outro) | União dos dois conjuntos: ficam cinco peças novas (menu, folha, atalhos, cabeçalho) e o `SimToggleButton` que veio do GitHub. |
| `src/admin/editor3d/ComponentEditor3D.tsx` | Nova arrumação da barra (duas linhas no telefone, menu «Mais») contra o botão «Atalhos» entretanto acrescentado à barra | Fica a arrumação nova e o «Atalhos» do GitHub passa a viver na segunda linha (≥ 1025 px) e no menu «Mais» (telefone). O ícone de ajuda do cabeçalho foi retirado para não haver dois botões iguais; `F1`/`?` continuam a abrir a lista. |
| `src/three/Panel3D.tsx` | Cartão de contexto da ferramenta 3D | Fica a versão nova (explicação dobrável com `IconHelp`, `aria-expanded`) **sem** o botão «Manobrar», que o GitHub já tinha removido — o teste `test:editor3d-ui` confirma «Não existe botão Manobrar: só a simulação aciona os equipamentos». |
| `release-stamp.json` | Carimbo gerado pelo hook | Ficou o carimbo mais recente (`72`); o hook volta a carimbá-lo a cada commit. |

Depois do rebase, todos os comandos de verificação foram executados de novo (tabela seguinte) e o
envio foi feito para `origin/main` sem `--force`.

## Verificações executadas (evidência real)

| Comando | Resultado |
| --- | --- |
| `npm run typecheck` (`tsc -b`) | passa, sem erros |
| `npm test` (núcleo) | «TODOS OS TESTES PASSARAM» |
| `npm run test:editor3d-toolbar` (novo) | 22 verificações passam — ferramentas a 390 px, folha do menu dentro do ecrã, ≥ 20 ações, motivo de bloqueio, zoom 100 % ⇄ 130 %, modelo a 70 % da altura |
| `npm run test:editor3d-ui` | passa (inclui 1024/768/390 px e «Contexto da ferramenta acessível no esquema mobile») |
| `npm run test:logo-editor-ui` | 62 verificações passam |
| `npm run test:editor3d-autodetect-ui` | passa (deteção, encaixe, mola) |
| `npm run test:toolbar-ui` | passa (Sem erros na página) |
| `npm run test:grafcet-ui` | passa |
| `npm run test:ladder-blocks-ui` | 25 verificações passam |
| `npm run test:editors-sweep-ui` | 19 verificações passam |
| `npm run test:editor-grid-ui`, `test:motor-ui`, `test:pinch`, `test:style` | passam |
| `npm run test:editor3d-toolbar` (2.ª execução, já sobre a base integrada) | 22 verificações passam |
| `npx vite build` (local) | **não concluído**: processo terminado por falta de memória no ambiente (2 GB; o projeto documenta 3 GiB em ENV-01). |
| Build de produção na Vercel | **confirmado**: `https://dc-simu.vercel.app/version.json` → `buildId` `53ade78…r72`; site a 390 px sem erros de consola e sem deslocamento horizontal |

## Estado

- **Implementado e testado**: alterações acima, em `dc-simu` (Node 20.22.2/22; Chromium do Playwright).
- **Publicado**: `dc-simu` em `origin/main` = `53ade78` (rebase sobre `383b349`, sem `--force`) e nota
  correspondente no cofre `BrainNet` (esta nota).
- **Por confirmar**: reproduzir `npm run build` localmente num runner com ≥ 3 GiB (ENV-01 — o build
  *de produção* já foi feito pela Vercel a partir de `53ade78`); revisão visual em dispositivo físico
  (UI-VISUAL-01).

## Pendências que continuam abertas

- UI-VISUAL-01 (revisão em browser real, agora parcialmente coberta por capturas a 390 px).
- ENV-01 (build de produção em ambiente com memória suficiente).
- 3D-DETECT-02/03 (segmentação de GLB fundidos e ligação automática de ecrãs a variáveis).
- LADDER-MODEL-01 (mais do que um temporizador/contador por network).

[[Backlog|Backlog]] · [[Design-Principles|Princípios de interface]] · [[Validation-2026-10-26|Validação anterior]]
