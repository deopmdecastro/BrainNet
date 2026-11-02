---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, qa, grafcet, ux]
---
# GRAFCET — arrasto da linha de retorno — 2026-10-26

## Problema (gravação de ecrã, iPhone, `dc-simu.vercel.app`)

Ao arrastar a linha de retorno da T3 (etapa 2 → etapa 0) no editor GRAFCET, o percurso saltava e mudava de forma a cada movimento, com laços e desvios, em vez de deslizar.

## Causa

`startSegmentDrag` inseria um ponto de quebra solto entre os cantos do trilho automático. O traçado ortogonal (`expandPolyline`, regra V→H) acrescentava então cotovelos adicionais entre esse ponto e os vizinhos, e o percurso refazia-se de forma diferente a cada movimento. O commit `6c15b0c` já preservava os cantos, mas mantinha o mecanismo de inserção; por isso o salto continuava. A entrada na etapa de destino também chegava na horizontal, ao longo do topo da caixa.

## Correção

- Arrastar um troço desliza-o na perpendicular, como numa ligação de um editor de diagramas. Os troços vizinhos esticam e os ângulos ficam sempre retos.
- As ancoragens nas etapas não se movem. Se o troço toca na saída ou na entrada, separa-se um degrau fixo de 12 px junto à ancoragem.
- O percurso guarda-se uma só vez, ao largar (um passo de histórico). Largar sem mover não altera nada. Largar sobre a espinha funde os pontos numa reta.
- Mover a pega de uma quebra arrasta também os vizinhos que partilhavam o eixo, para os troços continuarem retos.
- Mesma lógica nas ligações diretas (transições consecutivas).

Código: `src/grafcet/links.ts` (`beginSegmentDrag`, `applySegmentDrag`, `simplifyOrthogonal`, `nearestLeg`, `interiorBends`, `moveBendOrthogonal`) e `src/grafcet/GrafcetEditor.tsx`.

## Evidência

| Verificação | Resultado |
| --- | --- |
| `scripts/grafcet-links-smoke.ts` | 27 verificações (10 novas): troços ortogonais, ancoragens fixas, degrau na saída/entrada, fusão de colineares, quebras inteiras |
| `npm test`, `test:grafcet-dialogs`, `test:grafcet-signals`, `test:style` | passam |
| `tsc -b` e `vite build` | passam (Node v22.22.2) |
| BrainNet `npm test` e `npm run check` | passam |

## Pendente

- Verificação em browser real (touch no iPhone e Playwright `test:grafcet-construction-ui`, atualizado mas **não executado**: o sandbox não tem Chromium). Ver UI-VISUAL-01.
- Commit da aplicação `800dbaa` enviado para `origin/main` do DC-Simu em 2026-10-26, a pedido do utilizador.
- Deploy: não executado por mim. A publicação na Vercel depende da ligação do projeto ao `main`; confirmar no painel.
