---
project_id: BN-DCSIMU-001
type: validation
status: COMPLETE
created: 2026-10-30
updated: 2026-10-30
tags: [brainnet, dc-simu, grafcet, 3d, navigation]
---
# Barras de deslocamento nos canvas 3D e GRAFCET

## Pedido e implementação

Adicionar deslocamento horizontal e vertical dentro dos canvas 3D e GRAFCET,
com o estilo personalizado já utilizado na aplicação.

Foi implementado um controlo partilhado com calhas nas margens inferior e direita,
polegares arredondados cinzentos e realce ao passar o rato. Arrasto, clique na
calha, roda e teclado movem a vista; o foco é visível e cada eixo tem nome
acessível. Os dois controlos deixam livre o canto comum.

No GRAFCET, as barras acompanham pan, zoom, Ajustar, minimapa e alterações da área
disponível. Os limites incluem ações afastadas, textos alinhados, transições
soltas e dobras em coordenadas negativas, com margem para desenhos pequenos ou
vazios. O SVG mantém o desenho vetorial à dimensão do zoom.

No 3D, a câmara e o alvo deslocam-se juntos no plano do ecrã, conservando rotação,
distância e zoom. Os limites projetam o conteúdo nos eixos da câmara. O controlo
acompanha as vistas frontal e ISO e respeita o bloqueio da vista. O Esquema
frontal nativo partilha este canvas e recebe as mesmas barras. O editor
administrativo de componentes usa outro viewport e fica fora deste âmbito.

Os eventos das barras ficam separados dos gestos de edição e pinça; os atalhos
do editor ficam suspensos enquanto uma barra tem foco. O overlay 3D recebe as
métricas da câmara sem obrigar a árvore de modelos a atualizar por cada pan.
Minimapa e indicadores de orientação deixam espaço para as calhas.

## Ficheiros

- `dc-simu/src/ui/CanvasPanScrollbars.tsx`, `canvasScroll.ts` e
  `src/styles/canvas-pan-scrollbars.css`: interação, cálculo e apresentação comuns.
- `dc-simu/src/grafcet/GrafcetEditor.tsx`: integração com o pan e limites do desenho.
- `dc-simu/src/three/Panel3D.tsx`, `PanelCanvasScrollbars.tsx` e `cameraScroll.ts`:
  integração com a câmara, projeção dos limites e overlay.
- `dc-simu/src/ui/editorKeys.ts` e `usePinchZoom.ts`: isolamento dos gestos e foco.
- `dc-simu/scripts/canvas-scrollbars-smoke.ts`, `canvas-scrollbars-ui-smoke.mjs`
  e `pinch-dom-smoke.ts`: regressões.
- `dc-simu/package.json`: comandos de teste; a verificação de cálculo entra em `test:ci`.

## Verificações

| Verificação | Resultado |
| --- | --- |
| Aplicação: `npm test` | Passou |
| Aplicação: `npm run test:canvas-scrollbars` | 17 verificações passaram |
| Aplicação: `npm run test:pinch` | 10 verificações e teste DOM passaram |
| Aplicação: `npm run test:style` | Passou |
| Aplicação: `npm run build` | Passou; avisos existentes de chunks |
| GRAFCET: `npm run test:grafcet-actions-ui`, com CT ATEC | 26 verificações passaram |
| BrainNet: `npm test` | 45 testes passaram |
| BrainNet: `npm run check` | Passou |
| Navegador: barras nos dois canvas | 22 verificações passaram |
| Avaliação visual independente | Não concluída: limite de utilização do serviço de revisão |

Os testes de cálculo verificaram as vistas frontal, ISO, lateral e superior,
incluindo conservação de orientação, distância e zoom, limites negativos e
calhas pequenas. A regressão ATEC confirmou ligações entre ações nas etapas 5 e
6 a 500%, os 16 textos livres e a navegação pelo minimapa.

## Evidências e entrega

Logs locais em `dc-simu/runtime/canvas-scrollbars-*` e evidências em
`runtime/canvas-scrollbars/`, na raiz do cofre. São ignorados pelo Git.
Os testes usam contas sintéticas, contextos descartáveis e APIs/origens externas
bloqueadas, sem alterar dados reais.

Validação funcional concluída. A avaliação independente prevista no fluxo de
design não ficou disponível por limite de utilização do serviço; a revisão
visual local confirmou as barras e os controlos nos canvas. Sem publicação ou
reinício Docker nesta tarefa.

[[README|DC-Simu]] · [[Design-Principles]]
