---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED_PARTIAL
created: 2026-11-01
updated: 2026-11-01
repo: https://github.com/deopmdecastro/dc-simu
commits:
  - edaaec4
tags: [dc-simu, grelha, canvas, telemovel, painel-inferior, iec, grafcet, paridade]
---

# Validação 2026-11-01 — Grelha única e painel lateral completo em baixo no telemóvel

## Pedido

1. Garantir que, em todos os dispositivos, a grelha tem o mesmo tamanho e o mesmo aspeto em todos os canvas dos editores.
2. O painel que abre em baixo no Esquema IEC só tinha entradas: passa a ser o **painel lateral completo** (no telemóvel).
3. No GRAFCET, em vez de duplicar painéis, usar apenas o painel lateral completo do GRAFCET, **em baixo e só nos telefones**.

## Grelha

### Diagnóstico

As cores, o passo de 20 e o ponto de 1 px já vinham de `src/ui/editorTheme.ts`, mas cada canvas calculava o **passo visual** à sua maneira:

| Canvas | Como desenhava a grelha | Problema |
| --- | --- | --- |
| Esquema (SVG) | `<pattern>` dentro do grupo com `scale(zoom)` | o ponto de 1 px encolhia com o zoom; no telemóvel (enquadramento com zoom baixo) ficava sub-píxel e a grelha «desaparecia» ou ficava mais fina |
| GRAFCET | `GRID × scale`, duplicado até ≥ 16 px | regra correta, mas escrita à mão |
| Esquema IEC | `CMD_GRID × scale`, sem mínimo | com zoom baixo os pontos comprimiam-se |
| Ladder, 3D, editor de componentes | 20 px fixos | já coerentes (sem zoom) |

### Regra única

`editorGridPitch(scale, step)` (em `editorTheme.ts`) é agora a única regra: ponto de 1 px (`EDITOR_GRID_DOT_RADIUS`), passo visual ≥ 16 px (`EDITOR_GRID_MIN_PITCH`), duplicando (nunca subdividindo) para que **cada ponto coincida com um ponto do íman**. A 100 % o passo é 20 px em todos os canvas.

- **Esquema:** a grelha sai do grupo escalado e é desenhada em píxeis do ecrã, com o `<pattern>` alinhado ao `pan` (`x = panX − 1`). O ponto mede sempre 1 px; o atributo `data-grid-step` guarda o passo do mundo.
- **GRAFCET e Esquema IEC:** passam a chamar `editorGridPitch`.

## Painéis em baixo no telemóvel

- **Esquema IEC:** novo `src/components/RightDockPanel.tsx` (separadores `RightDockTabs` + conteúdo do separador), usado pela coluna da direita (tablet/PC) **e** por `CommandsSimDock` (painel inferior do telemóvel). Um só painel, nunca duas versões. A barra do painel continua a mostrar estado e transporte. No telemóvel o `App` deixa de montar a coluna/gaveta da direita no Esquema IEC (`phoneCommands`), e as ações «GRAFCET», «Objetos» e «Diagnóstico» abrem o separador certo no painel inferior (`useCommandsUi.dockTab`).
- **GRAFCET:** no telemóvel (`PHONE_TOUCH_QUERY`) deixa de haver `GrafcetSimDock`; fica só o painel lateral completo em baixo (Etapas, Transições, Sinais, Diagnóstico). O separador **Sinais** já mostra os valores ao vivo, por isso não se perde a informação das E/S. O botão «Simulação» da barra abre/fecha esse painel e leva ao separador Sinais.

## Verificações

- `npx tsc -b` — 0 erros.
- `npm test` — ✅ todos os testes passaram.
- `npm run test:style` — ok.
- `scripts/grid-parity-smoke.ts` (novo, no `test:ci`) — 27 verificações: passo 20 px a 100 %, ≥ 16 px de 0,05× a 5×, cada ponto sobre um ponto do íman, os três canvas usam a função, grelha do Esquema fora do grupo escalado.
- `scripts/commands-touch-smoke.ts` — 20 verificações (as duas sobre o painel inferior foram reescritas; novas: sem coluna da direita duplicada no telemóvel e GRAFCET sem `GrafcetSimDock`).

## Não verificado

- **Render visual em navegador:** o ambiente não tem Chromium (o download está bloqueado), por isso `test:right-dock-ui`, `test:grid-ui` e `test:workspace-panels-ui` **não foram executados**. `test:grid-ui` foi ajustado (passo visual ≥ 16 px + `data-grid-step`), mas não corrido. `test:workspace-panels-ui` ainda refere `[data-grafcet-sim-dock]` e já falhava antes desta alteração.
- Confirmar num telemóvel real: grelha igual entre Esquema, Esquema IEC e GRAFCET ao mesmo zoom; painel inferior do IEC com os quatro separadores; GRAFCET só com o painel lateral em baixo.

## Pendências

- Telemóvel em horizontal largo (> 800 px): o GRAFCET mostra o painel à direita, não em baixo — comportamento mantido, só se esconde o painel de simulação.
- A aba «Sequência» (etapas ativas, transições, histórico) do antigo painel de simulação do GRAFCET deixou de existir no telemóvel; as etapas ativas continuam marcadas na lista de Etapas. Avaliar se deve voltar como separador do painel lateral.
