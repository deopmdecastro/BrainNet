---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, qa, 3d, simulation, ux]
---
# Painel 3D — brilho real, botoneiras e cabos — 2026-10-26

## Pedido
Melhorar a interação e a simulação 3D: botoneiras com animação, sinalizadores e LEDs com brilho real, cabos mais realistas.

## Alterações
- **Brilho real** (`src/three/glow.ts`, `GlowHalo.tsx`): halo aditivo virado para a câmara, subida/descida suaves (LED rápido, lâmpada mais lenta), pisca e leve cintilação; luz de ponto só nos sinaleiros (existe sempre com intensidade 0, sem recompilar shaders ao acender). Sem dependências novas (sem «bloom»).
- **Onde se aplica:** lâmpada, sinaleiro AD22, torre luminosa (sem luz de ponto, por desempenho), LEDs de estado do equipamento, LED do contactor, LEDs do ecrã LOGO, partículas de corrente e as zonas luminosas dos componentes de catálogo (`StateAnimator`, com `kind` led/lamp e `when`/`blink`). Materiais acesos deixam de passar pelo tone mapping para cor mais viva.
- **Botoneiras** (`PushButton3D`): curso com mola (afunda depressa, regressa com ressalto); emergência fica travada em baixo.
- **Cabos:** isolamento com brilho (clearcoat) e partículas de corrente luminosas.
- **Teste novo:** `npm run test:glow` (13 verificações; incluído em `test:ci`).

## Evidência
| Verificação | Resultado |
| --- | --- |
| `tsc -b`, `vite build` | passam |
| `npm test`, `test:glow`, `test:motion`, `test:editor3d-functional`, `test:terminal-geometry`, `test:interactables`, `test:component-validate`, `test:diagnostics`, `test:fluidsim`, `test:style` | passam |

## Pendente
- **Sem verificação visual** (sem Chromium/WebGL no sandbox): intensidades, tamanhos de halo e desempenho no iPhone por validar. Ver UI-VISUAL-01.
- Os halos são sprites na raiz do componente: `Box3.setFromObject(..., true)` pode contá-los em enquadramentos do editor 3D com o LED aceso. Confirmar visualmente e, se necessário, excluí-los.
- O disjuntor já tinha mola e disparo (`Breaker` com `stepSpring`); não foi alterado. Cabos: sem alteração à geometria/encaminhamento.
- Fora do âmbito desta entrega: editor 3D (ferramentas de edição), esquema 3D e novos modelos.
