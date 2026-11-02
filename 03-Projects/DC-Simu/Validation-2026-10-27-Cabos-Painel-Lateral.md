---
project_id: BN-DCSIMU-001
type: validation
status: ACTIVE
created: 2026-10-27
updated: 2026-10-27
tags: [brainet, dc-simu, ui, ux, cabos, ponteiras, editor3d, sidebar]
---
# Validação 2026-10-27 — Cabos e ponteiras no painel lateral (simulador e editor)

Trabalho pedido por Deogracia de Castro: «houve uma época em que as definições e configurações dos
cabos e ponteiras aparecia no painel lateral esquerdo ao clicar no botão cabo, hoje aparece um card
dentro do Canva. Não quero isso, recupera o design que aparecia no painel lateral, com icon das
ponteiras, icon do cabo rígido ou flexível, quero recuperar essa UI e UX, tanto no esquema 3D como no
editor de componentes.» Executado no submódulo `03-Projects/DC-Simu/dc-simu`.

## Como foi observado

Chromium headless (Playwright) a 1440 × 1000 e 390 × 844, `localStorage` descartável e `/api/*`
bloqueado. Percursos reais: criação de projeto no painel, escolha da ferramenta **Cabo** no Esquema,
e editor de componentes (`/admin/editor/<id>` com a ferramenta Cabo) do PKZM C-10. Medições por
`getBoundingClientRect` e `getComputedStyle`, além de capturas.

## Problemas encontrados (antes)

| # | Onde | Observação |
| --- | --- | --- |
| 1 | Esquema/3D do simulador | Com a ferramenta **Cabo** ativa, o painel lateral esquerdo continuava na Biblioteca: as opções dos cabos novos só existiam na barra superior. |
| 2 | Esquema 3D | O cabo selecionado abria um **cartão sobre o canvas** (`.panel3d-wire-context`/`.panel3d-wire-bar`), a tapar o esquema. |
| 3 | Editor de componentes | As opções dos cabos (`WirePanel`) eram um cartão flutuante (`position:absolute; left:10px; top:56px`) **por cima do canvas 3D**, com os campos escondidos num `<details>` recolhido e três `<select>` sem ícones. |
| 4 | Consistência | O simulador usava ícones (`WireEndIcon`, `ConductorIcon`) no inspetor do cabo e o editor usava listas pendentes — duas linguagens para a mesma decisão. |

## Alterações implementadas

### `dc-simu`

- `src/ui/WireOptions.tsx` (**novo**) — bloco único `WireOptionsFields`: cor do cabo (AUTO + 13
  amostras), **condutor** com `ConductorIcon` (flexível/rígido e o efeito de cada um), **secção**
  (0,5 … 16 mm²) e **terminal das pontas** com `WireEndIcon` nas 8 opções (`ferrule`, `ferruleDupla`,
  olhal, forquilha, pino, faston, estanhado, nu) e a explicação da opção escolhida. Só apresenta
  valores e devolve alterações — quem chama guarda o estado (store do simulador ou `wireDefaults` do
  editor).
- `src/styles/wire-options.css` (**novo**) — tokens `--dx-*` (funciona nos dois editores), grelhas
  responsivas (1 coluna até 560 px) e alvos de 20–22 px nas amostras de cor.
- `src/components/Sidebar.tsx` — com `tool === 'wire'` o painel esquerdo passa a **Inspetor**, com o
  título «Novo cabo» e a secção «Cabos e ponteiras» no topo; `WireOptionsFields` escreve diretamente
  em `wireDefaults` (`setWireDefaults`), pelo que as escolhas valem para os cabos seguintes.
- `src/three/Panel3D.tsx` + `src/ui/wireActionSlot.ts` (**novo**) — o cartão do cabo **sai do canvas**.
  As ações que dependem do estado 3D (ponto de curva, mover cabo, religar/soltar ponta, repor/fixar
  traçado, eliminar) são desenhadas num **portal** para o inspetor do cabo, no painel lateral: o
  `Sidebar` disponibiliza o nó (`data-slot="wire-3d"`) e o `Panel3D` lá monta as ações, sem duplicar
  lógica.
- `src/admin/editor3d/WirePanel.tsx` — «Novo cabo» deixa de estar recolhido: aparece **aberto**, no
  topo do painel, com o mesmo `WireOptionsFields` e o resumo (cor · secção).
- `src/admin/editor3d/Hierarchy.tsx` + `ComponentEditor3D.tsx` — o painel esquerdo do editor recebe um
  `wireSlot` (`<div class="ce-left-wires">`); o `WirePanel` deixou de ser montado sobre o `.ce-stage`.
- `src/styles/catalog-editor.css` — `.ce-wirepanel` deixa de ser absoluto (`position` estático),
  `.ce-left-wires` limita a altura a 48 % (máx. 430 px) com deslocamento próprio, e o `<details>`
  passa a bloco `.ce-wp-new` com ícone de cor e resumo.
- `src/styles/panel3d-editor.css` — removidas as regras `.panel3d-wire-context`,
  `.panel3d-wire-inspector`, `.panel3d-wire-fields`, `.panel3d-wire-bar`, `.panel3d-draw-*` e
  `.panel3d-wire-end*` (interface morta); novas regras `.panel3d-wire-actions-panel` para o bloco no
  painel lateral.
- `scripts/wire-options-panel-ui-smoke.mjs` (**novo**) + `test:wire-options-ui` no `package.json`.

## Medições

| Medida | Antes | Agora |
| --- | --- | --- |
| Opções dos cabos no simulador | só na barra superior | painel lateral (Inspetor), título «Novo cabo» |
| Cartão sobre o canvas 3D | `.panel3d-wire-bar` (520 px) fixo no topo do canvas | 0 elementos; ações no inspetor (`data-slot="wire-3d"`) |
| Painel dos cabos no editor | `position: absolute`, 300 px por cima do canvas | `position: static`, dentro de `.ce-left` (240 px) |
| Ícones de ponteira no painel | 0 no editor (3 `<select>`) | 8 no simulador e 8 no editor |
| Ícones de condutor | 2 (só no inspetor do simulador) | 2 nos dois editores |
| Amostras de cor | 13 no simulador / 13 no editor | 13 partilhadas |
| Bloco no painel esquerdo (1440 px) | — | 400 px de altura, com deslocamento próprio |

## Testes

| Comando | Resultado |
| --- | --- |
| `npm run -s test:wire-options-ui` (**novo**) | **27 PASS** — opções no painel lateral com os ícones das 8 ponteiras e dos 2 condutores, 13 cores, 9 secções, escolhas aplicadas a `wireDefaults`, bloco dentro do painel lateral, cartão do canvas removido, `position` não absoluta, sem sobreposição ao canvas, sem overflow a 390 px, sem exceções |
| `npm test` | ✅ |
| `npm run -s test:barras-padrao` | ✅ (2 PASS) — barras continuam iguais nos editores |
| `npm run -s test:style` | ✅ (`no-accent-border: ok`) |
| `npm run -s test:builtin-sync` | 355 verificações OK |
| `npm run -s test:emergency-button-ui` | 13 PASS |
| `npx tsc -b` | sem erros |

### Falhas herdadas (confirmadas no código anterior, não são regressão)

Confirmadas com `git stash` (o mesmo teste falha no `HEAD` sem estas alterações):

| Teste | Falha |
| --- | --- |
| `test:editor3d-toolbar` | «A câmara comunica a distância de enquadramento» (`camStats.fit/zoom` a 0) |
| `test:editor3d-ui` | «Biblioteca acessível a 1024 px» |
| `test:toolbar-ui` | «Nova network» da barra cria uma network no Main |
| `test:editors-sweep-ui` | `TypeError: Cannot read properties of undefined (reading 'branches')` (Ladder) |
| `test:terminal-geometry` / `test:terminal-seat` | borne `21` do `emergencyButtonKeyP20ACR` |

## Publicação

| Passo | Resultado |
| --- | --- |
| Commits | `dc-simu` **`c2bac45`** (botão de emergência) e **`a10ccd6`** (cabos no painel lateral); `BrainNet` **`346352b`** e **`8afb97a`** |
| Envio | `origin/main` dos dois repositórios, sem `--force` |
| Vercel | estado GitHub do commit `a10ccd6` → **success**; `https://dc-simu.vercel.app/version.json` → `buildId` `a10ccd6…r80.mvqj5fln` (`builtAt` 2026-10-27T10:16:47Z) |
| Verificação no site publicado | Projeto novo + botão **Cabo**: painel lateral abre «Novo cabo» com **8 ponteiras**, **2 condutores**, **13 cores**; bloco dentro do painel lateral; **nenhum** cartão de cabos no canvas; 0 exceções JavaScript (captura `producao-cabos.png`) |

## Estado

- **Implementado, testado e publicado** (produção `a10ccd6…r80`).
- **Pendente:** nenhuma opção foi retirada do utilizador — a barra superior do simulador mantém o
  acesso rápido (AUTO, amostras, condutor, secção e terminal) e as opções completas vivem agora no
  painel lateral. Confirmar em dispositivo físico depois do deploy (UI-VISUAL-01).
- **Comportamento a saber:** com o painel lateral recolhido não há inspetor, pelo que as ações de
  traçado 3D do cabo aparecem ao reabrir o painel («Biblioteca»/rail lateral) — a decisão é a mesma
  das restantes propriedades do cabo.

[[Backlog|Backlog]] · [[Decision-Log|Decisões]] · [[Validation-2026-10-27-Botao-Emergencia|Botão de emergência]]
