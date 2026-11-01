---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-11-01
updated: 2026-11-01
tags: [dc-simu, esquema-iec, telemovel, pinca, toolbar, ux]
---
# Esquema IEC no telemóvel — pinça, mover a vista e barras

## Pedido

No telemóvel o canvas do Esquema IEC não se movia nem ampliava com os dedos (o GRAFCET sim), e as barras de
ferramentas estavam mal organizadas (capturas de 2026-11-01, vista «Partida direta com emergência (LOGO!)» em RUN).

## Causa

- `CommandsEditor.tsx` não usava `usePinchZoom` (o GRAFCET e o Ladder sim). O zoom máximo era 3× e o único gesto de um dedo
  no vazio era o retângulo de seleção — que só existe com o esquema editável. Em simulação (RUN) não havia como mover a vista.
- Barra compacta: botão «Dois canvas» (inútil num telemóvel) disputava largura com as 5 vistas e os 5 botões de execução;
  o botão «…» ficava tapado pela régua recolhida do painel direito; o menu «Mais» listava modo/velocidade de execução, que o
  Esquema IEC esconde; nome do esquema e páginas quebravam em 2–3 linhas; o aviso da simulação ocupava duas linhas no fundo.

## Alterações (`dc-simu`)

| Área | Alteração |
| --- | --- |
| Canvas IEC | Pinça com dois dedos (`usePinchZoom` + `pinchPan`, `swallowPointers`): o ponto sob os dedos acompanha-os e mover os dois dedos desloca a vista; o gesto do 1.º dedo é cancelado. |
| Canvas IEC | Um dedo no fundo vazio move a vista (editar, simular e demonstração). O retângulo de seleção fica para rato/caneta. |
| Canvas IEC | Zoom 0,3×–5× (`CMD_ZOOM_MIN/MAX`), igual ao esquema 3D e ao GRAFCET. |
| Canvas IEC | ~~Controlo de zoom flutuante~~ — removido a pedido (a pinça e o menu «Vista» chegam). |
| Entradas/Saídas | No telemóvel passam para um **painel inferior** igual ao do GRAFCET (`CommandsSimDock`, casca `gdock`): barra sempre visível com estado + transporte, corpo com entradas e saídas. O botão «Simulação» da barra compacta abre/fecha-o. Tablet/PC mantêm o painel lateral. | **Atualizado:** o corpo passou a ser o painel lateral completo, não só as entradas — [[Validation-2026-11-01-Grelha-Unica-Painel-Inferior-Telemovel]]. |
| Textos | Os títulos do esquema («Circuito de potência…», «Q0 · proteção…») são clicáveis: toque seleciona, arrastar move (um passo de Desfazer), duplo toque/clique edita o texto, borracha apaga. Área de toque maior que a do texto. |
| Canvas IEC | Aviso da simulação curto numa linha, à esquerda, sem tapar o zoom. |
| Páginas | Nome do esquema + páginas numa só linha com deslize; «Nova página» passa a ícone no telemóvel. |
| Barra | Sem «Dois canvas» no telemóvel; barra compacta acima da régua lateral (z-index 60); botões de execução a 36 px até 430 px. |
| Menu «Mais» | Sem «Execução» (modo/velocidade) no Esquema IEC. |

Ficheiros: `src/commands/CommandsEditor.tsx`, `src/commands/CommandsSimDock.tsx` (novo), `src/commands/CommandsPanels.tsx` (`useCommandsTransport`), `src/commands/commandsUi.ts` (`dockOpen`), `src/components/Toolbar.tsx`, `src/styles/mobile-refine.css` (secção 9),
`scripts/commands-touch-smoke.ts` (novo, ligado a `npm run test:pinch`).

## Evidência

| Verificação | Resultado |
| --- | --- |
| `npx tsc -b` | passa |
| `npm run test:pinch` (zoom, DOM jsdom, contrato do Esquema IEC) | 10 + 1 + 17 verificações |
| `scripts/commands-smoke.ts`, `npm run test:style`, `vite build` | passam |

## Pendente

- Teste em iPhone real: sem Chromium neste ambiente não houve captura nem toque real; o contrato é estático + jsdom.
  Confirmar: pinça e arrastar com um dedo, «…» já não tapado, linha única das páginas, zoom flutuante.
- O painel E/S lateral continua disponível no telemóvel (separador «E/S» do painel direito); se ficar redundante, esconder.
- Seleção múltipla por toque (retângulo) deixou de existir com o dedo; se fizer falta, acrescentar ferramenta «Selecionar área».
- Mesma auditoria de barras para o Ladder e o GRAFCET no telemóvel (não alterados).
- Sem deploy executado; publicar é decisão do utilizador.
