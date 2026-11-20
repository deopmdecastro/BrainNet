---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED_PENDING_VISUAL_APPROVAL
created: 2026-11-20
updated: 2026-11-20
tags: [dc-simu, validação, easy9, ez9s, interruptor-corte, serigrafia, manípulo, glb, step]
---
# Validação 2026-11-20 — Easy9 Switch (QS1/QS2/QS3): frente, serigrafia e manípulos

## Âmbito

Ramo `fix/ez9s-frente-e-produto-real` (a partir de `main` @ `6b7d0f8`).
Queixa do utilizador: «Os três interruptores de corte foram construídos na vista errada —
a serigrafia e os manípulos ficaram na parte de trás do componente.» Pedido adicional:
usar o produto real e resolver outros erros pendentes.

Interruptores afetados: `switchSchneiderEz9s1p`, `switchSchneiderEz9s2p`,
`switchSchneiderEz9s4p` (produto Schneider Easy9 Switch EZ9S, 1P/2P/4P).

## Causa raiz

O STEP do fabricante (`MCADFD0001285`) **já usa a convenção do GLB**: frente (manípulo,
janela de estado, cabeças Pozidriv) em `z = 65,5…74,7 mm` e face de encaixe na calha em
`z = 0`. O gerador aplicava `z → 74,7 − z`, que **invertia a profundidade**: a moldura e o
manípulo iam para a traseira e a face da calha saía para `z ≈ 29 mm`, com o aparelho a
flutuar à frente da chapa.

Medição que o provou, sobre os vértices crus (sem render): terminais de topo `y 66…77` →
`z 4,9…45,5`; terminais de fundo `y 10…22` → `z 0…73,4`; manípulo vermelho `y 19…33` →
`z 1,5…74,7`; zona da etiqueta `y 40…52` → `z 59,4…64,4`.

## Correções

| # | Defeito | Correção | Evidência |
|---|---------|----------|-----------|
| 1 | Profundidade invertida | `scripts/build-ez9s-glb.mjs`: mapa identidade em Z + deslocamento vertical `y + 2,1 mm` (assentamento na calha) | envelope 19,2/37,2/73,2 × 76,8 × 74,67 mm; auditoria por raios: +Z bate em `dcsimu_handle_*` e `ez9s_pos_on`, −Z só em corpos |
| 2 | Manípulo branco (era geometria do corpo) | As **9 faces do molde** na janela frontal (`x 3,5…14,1 · y 21,1…32,1 · z 65,5…74,7`) são separadas do corpo em malhas `dcsimu_handle_<n>` e pintadas de vermelho — sem caixas sobrepostas nem z-fighting | `v4-iso.png`, `v5-iso.png` |
| 3 | Serigrafia flutuava 37 mm à frente | `protectionMarkings.ts`: as cotas são do GLB (traseira em `z = 0`) mas o grupo `__dcProtectionMarking` é acrescentado à moldura **centrada em profundidade**; introduzido `DEPTH_OFFSET_MM = −74,7/2` | medido no painel: parede do corpo `z` até 55,2 mm; chapas a 46,0 / 45,2 mm (antes 83,4 / 82,5) |
| 4 | Gravação lateral enterrada na malha | Flancos do molde ficam 0,6 mm além do referencial nominal (aletas DIN): a chapa passa a assentar na largura real (`bodyHalfMm`) | `left.png`, `iso.png` |
| 5 | Túneis de borne em `z = 25 mm` | `TERMINAL = { z: 25, depth: 14, diameter: 9 }` e `REAL_TERMINALS` `z: 0.738 → 0.335` (14 ocorrências) | `terminal-geometry-smoke` e `terminal-seat-smoke` PASS |
| 6 | `physicalFrameMm.height` gravado como `78,89999999999999` | Arredondamento a 3 casas no gerador | `test:editor3d-functional` PASS |
| 7 | `smoke.ts:790` abortava a suite inteira | O cenário DB/PLC chamava `step()` em STOP; desde a regra de manobra `step()` não acorda a simulação. O cenário passa a arrancar em `runState: 'running'` e devolve a store a STOP no fim | as verificações EZ9 voltaram a correr |
| 8 | `boxOf` do smoke ignorava a matriz dos nós | Passou a compor `matrix`/`translation` dos nós e dos pais (caixa no mundo) | as 3 verificações de caixa deixaram de dar falso negativo |

## Resultado dos testes

- `npx tsc -b --noEmit` — limpo.
- `npm run test:ci:fast` — **16/19** (era 13/19 no início da sessão, 15/19 após a orientação).
- Falham ainda `test`, `test:mechanical`, `test:industrial`.
- **Sem regressões**: comparação nominal das falhas do `smoke.ts` contra o baseline
  (`git stash`) dá **0 falhas novas** e **14 falhas resolvidas** (21 → 7). As 3 suites
  restantes falham de forma idêntica no baseline, com as mesmas asserções:
  - `test:mechanical` — «Legacy wired project still energizes the actual CWBC65 coil and GEYA supply after migration»
  - `test:industrial` — «ATV: mains supply powers controls but cannot invent STO/DI wiring» + 1
  - `test` — 7 restantes: cadeia Hager/DF101V/DF81N, gaveta em STOP, cartucho DF101V, fusível DF81N, CFC225P (2), «programas distintos… Q0.0»
- Suites do protocolo: `terminal-geometry`, `terminal-seat`, `imported-components`,
  `thermal-controls`, `siemens-plc`, `breaker-cut`, `panel-accessories`, `test:style` — todas PASS.

## Estado

| Estado | Item |
|--------|------|
| **Preparado** | Referência do produto real (fotos 4P EZ9S + DXF isométrico do fabricante) |
| **Implementado** | Itens 1–8 acima, nos três interruptores |
| **Testado** | typecheck, `test:ci:fast` 16/19 sem regressões, 8 suites do protocolo PASS, auditoria por raios |
| **Aprovado** | — (falta confirmação visual do utilizador nas vistas front/iso/left/back) |

## Limites declarados

- O envelope do molde é 19,2 mm no 1P e passos de 18,0 mm nos restantes (medido no STEP);
  o referencial nominal de implantação mantém 18 mm por polo (passo DIN). Não se estica a
  malha para os igualar — `cadScalePreserved`.
- As cotas de serigrafia são medidas no STEP; não são CAD oficial da etiqueta impressa.
- As 3 suites ainda a falhar são dívida anterior a este trabalho e ficam registadas no
  Backlog, não neste ramo.

## Ficheiros alterados (dc-simu)

`public/models/protecao/schneider-ez9s-{1p,2p,4p}.glb`,
`public/models/protecao/schneider-ez9s-sources.json`, `scripts/build-ez9s-glb.mjs`,
`scripts/smoke.ts`, `src/electrical/realInterfaces.ts`, `src/three/modelPaths.ts`,
`src/three/protectionMarkings.ts`.
