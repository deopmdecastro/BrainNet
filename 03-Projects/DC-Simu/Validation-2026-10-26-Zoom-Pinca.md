---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, ux, mobile, grafcet, ladder]
---
# Zoom com dois dedos (telemóvel e tablet) — 2026-10-26

## Pedido

Permitir ampliar com dois dedos (pinça) em tablet e telemóvel.

## Estado antes

- Esquema 2D: já tinha pinça (limite 3×).
- GRAFCET: só roda do rato e botões (limite 2,5×); com dois dedos, o segundo dedo reiniciava o arrastar da vista e a vista tremia.
- Ladder: só botões (0,7× a 1,5×), sem gesto.

## Alterações

- Novo `src/ui/usePinchZoom.ts` (`bindPinchZoom` + hook): gesto de dois dedos com `touch` não passivo (bloqueia o zoom e a rolagem nativos durante o gesto, incluindo `gesturestart` do Safari). Mover os dedos desloca a vista, e o ponto sob os dedos acompanha-os.
- GRAFCET: pinça ligada ao canvas. Ao tocar o segundo dedo cancela-se o gesto do primeiro (arrastar nó, mover vista, ligação) e os ponteiros da pinça são ignorados até levantar os dedos. Limite 2,5× → 5×.
- Ladder: pinça nas duas áreas de networks (programa principal e blocos FC). A escala é CSS `zoom`, por isso a rolagem é corrigida para manter o ponto sob os dedos. Limite 1,5× → 3× (botões e atalhos usam as mesmas constantes).
- Esquema 2D: limite 3× → 5× (store e pinça).

## Evidência

| Verificação | Resultado |
| --- | --- |
| `scripts/pinch-zoom-smoke.ts` | 10 verificações: razão→zoom, limites, ponto sob os dedos fixo, deslocamento sem escala, limites do store do Ladder |
| `scripts/pinch-dom-smoke.ts` (jsdom) | Eventos touch/pointer simulados: segundo dedo não chega à aplicação, primeiro gesto é cancelado, `touchmove` de dois dedos é bloqueado e um dedo não, novo dedo funciona depois |
| `test:ci` (27 suites), `tsc -b`, `vite build`, `npm audit` | passam |

Commit da aplicação `eaf93d3` enviado para `origin/main` do DC-Simu em 2026-10-26, a pedido do utilizador; sem deploy executado.

## Pendente

- Teste em dispositivo real (iPhone e tablet): Safari/Android têm particularidades que o jsdom não reproduz, por exemplo a rolagem nativa a competir com a pinça no Ladder se o primeiro dedo já estiver a rolar.
- Não há teste Playwright com toque (sem Chromium aqui).
- Aviso do dispositivo: `user-scalable=no` mantém-se; a ampliação é a do próprio diagrama, não a da página.
