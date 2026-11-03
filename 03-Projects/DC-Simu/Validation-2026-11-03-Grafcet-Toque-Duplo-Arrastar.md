---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED_PARTIAL
created: 2026-11-03
updated: 2026-11-03
repo: https://github.com/deopmdecastro/dc-simu
commits:
  - 8aae103
tags: [dc-simu, grafcet, telemovel, toque, duplo-toque, arrastar, modal]
---
# GRAFCET no telemóvel — duplo toque abre a configuração e arrasto à medida do dedo

## Pedido
Melhorar a edição dos GRAFCET pelo telemóvel: dois toques nos elementos abrem a modal de configuração, permitir arrastar elementos, etc.

## Diagnóstico
- O arrasto de etapas, ações, transições soltas, grupos e puxadores de tamanho **já existia** (ver [[Validation-2026-10-30-GRAFCET-Arrastar-Redimensionar-Delete]]) e a pinça/mover vista também ([[Validation-2026-11-01-Esquema-IEC-Telemovel-Pinca-Barras]]).
- O que falhava em toque: a modal só abria por `onDoubleClick`, e o `dblclick` não é fiável nos nós (`touch-action: none` + captura do ponteiro). O limiar de arrasto de 4 px era pequeno para um dedo (um toque podia mover a etapa) e as faces de redimensionar (6 u) eram impossíveis de acertar — era a pendência da nota de 2026-10-30.

## O que mudou (`dc-simu` 8aae103)
- **Duplo toque** (`src/ui/useDoubleTap.ts`, `bindDoubleTap` + hook): escuta `pointerdown/up` em captura no canvas; só toque/caneta (o rato mantém o duplo clique). Dois toques limpos (≤ 12 px de deslocamento, ≤ 350 ms, mesmo elemento) abrem a modal. Arrasto, pinça (2.º dedo) e `pointercancel` anulam o gesto.
- Abre **etapa, transição** (barra, laço e solta) **e ação** (ligada e solta) com as mesmas modais do PC. Só com a ferramenta Selecionar (na ferramenta Ligar os toques ligam) e nunca com outra modal aberta. A abertura espera ~80 ms para o `click` sintético do 2.º toque não fechar a modal.
- Os grupos de transição ganham `data-transition-id` (já existia nas barras) para o reconhecimento por elemento.
- **Arrasto**: limiar `dragSlop` = 9 px em toque (4 px rato) em etapas, grupos, ações e transições soltas.
- **Puxadores de tamanho**: em `pointer: coarse` as faces passam de 6 para 14 u e os cantos de 8 para 16 u.
- Reaproveitado: setters `setEditingStep/Transition/Action`, `isModalOpen`, padrão `bindPinchZoom` (núcleo testável fora do React).

## Verificações
- `npx tsc -b` limpo; `npm test` ✅; `test:grafcet-dialogs` 31 ✅; `test:style` ✅.
- `scripts/double-tap-smoke.ts` (novo, no `test:pinch`): 13 verificações em jsdom (um toque, duplo toque em etapa/ação, outros elementos, intervalo e distância, arrasto, puxadores, pinça, rato, cancelamento).
- Já falhavam **sem** estas alterações (confirmado com `git stash`): `commands-touch-smoke` («o Esquema IEC não tem coluna/gaveta da direita») e `grafcet-action-layout-smoke` («ação ligada encaixa após a caixa importada»). Ficam no backlog; não foram tocados.

## Não verificado
- Sem navegador/telemóvel neste ambiente: o duplo toque, o arrasto com o dedo e o tamanho dos puxadores não foram testados num dispositivo real (iOS Safari e Android Chrome). Confirmar também que a modal não fecha ao abrir.

## Possíveis seguintes passos
- Toque longo para o menu de contexto (iOS não dispara `contextmenu`).
- Usar `useDoubleTap` no Esquema IEC e no Ladder.
