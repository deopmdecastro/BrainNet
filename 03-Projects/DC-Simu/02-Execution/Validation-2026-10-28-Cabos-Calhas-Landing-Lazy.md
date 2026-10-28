---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
repo: deopmdecastro/dc-simu
commit: b3a31e4, 210018d, b4981a0
date: 2026-10-28
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, landing, performance, hero, demo, cabos, calhas]
---

# Validação 2026-10-28 — calhas de cabos, landing lazy e hero menor (dc-simu `b3a31e4`)

## Resultado
- **Implementado e testado (local)**: o editor da demo (App + modelos CAD) só descarrega quando a secção se aproxima do ecrã; antes carregava na abertura da landing.
- Hero: motor isolado, sem cartão, isométrico, ocupa ~60 % da área (antes 78 %); render mais leve (dpr ≤ 1,25, low-power).
- Demo 3D: abre em isométrica; cabos rígidos correm em calhas rentes à chapa entre filas, mudam de fila por uma calha vertical lateral; motor ao lado do quadro.

## Ficheiros
src/landing/Landing.tsx, src/landing/LandingEditorShowcase.tsx, src/three/LandingMotorHero.tsx, src/three/wireGeometry3D.ts, src/project/nativeProjects.ts, scripts/landing-editor-showcase-smoke.mjs

## Verificações
- tsc -b sem erros; smoke.ts, landing-demo-smoke.ts, landing-editor-showcase-smoke.mjs verdes.
- Capturas Playwright (Chromium software) do hero e da Visualização 3D.

## Pendências
- Projeto publicado no backend (/landing/published) pode ter outra disposição; a demo normaliza só cabos flexíveis.
- Desempenho em GPU real e telemóvel não medido.
- Cabos do motor ainda contornam por fora do quadro (calha inferior).

## Notas desta sessão
- Patch aplicado sem conflitos sobre `8e60355`; `tsc -b`, `npm run build`, `smoke.ts`, `landing-demo-smoke.ts`, `landing-editor-showcase-smoke.mjs` e `landing-hero-motor-smoke.mjs` verdes.
- Corrigida uma asserção desatualizada em `landing-hero-motor-smoke.mjs` («Vista isométrica por omissão» ainda procurava `camera={{ position: [1.4, 1.05, 1.4] }}`; a câmara é agora `FitIsoCamera`, direção `1, 0.82, 1`). A falha já existia antes do patch.
- Trabalho feito no submódulo `03-Projects/DC-Simu/dc-simu`; ponteiro atualizado no BrainNet.
- Ver [[../Decision-Log|Decision-Log]] (DC-ADR-068) · [[Validation-2026-10-28-Landing-Peso-Hero-Demo]].

## Ajuste posterior — hero maior e mais fluido (`210018d`)
- Pedido (com captura): «aumentar um pouco o tamanho e melhorar a renderização, ainda cola um pouco».
- Tamanho: `FILL` 0,60 → 0,74 e altura do contentor `clamp(340px, 38vw, 620px)`.
- Fluidez: `ContactShadows` com `frames={1}` (antes re-renderizada com desfoque a cada frame; resolução 256); `PerformanceMonitor` ajusta o dpr (1 ↔ 1,5, arranque 1,25); `powerPreference` `default` (o `low-power` podia escolher a GPU integrada em portáteis); `stencil: false`.
- Verificado: `tsc -b`, `npm run build`, `landing-hero-motor-smoke` (+3 asserções). `landing-ui-smoke` não corre neste ambiente (sem browser Playwright; falha igual sem as alterações).
- Por medir: FPS em GPU real e telemóvel; confirmar visualmente o novo enquadre.

## Ajuste 2 — simulação do nativo, cabos vs. motor e vista isométrica (`b4981a0`)
- Pedido (com capturas): «as luzes não funcionam, nem PLC liga e nem o motor gira; ainda tem cabo a atravessar o motor; o motor deve estar na vista isométrica».
- **Causas da simulação** (reproduzidas sem browser):
  1. `proautoInputPowered`: o 2.º polo do disjuntor 2P (Q0), ligado ao neutro, é `power-in` e contava como fase → o N da fonte PS1 aparecia «em fase» e a fonte nunca arrancava («PLC1 sem alimentação»).
  2. `sourceTerminalIds`: `-V1/-V2` da fonte 24 V não eram origem; bobinas/sinaleiros exigem os dois bornes energizados → KM1, H1/H2 e o motor não reagiam às saídas do PLC.
  3. `migrations.ts`: a regra do legado «Qn.2» do LOGO! reescrevia o borne canónico `Q0.2` para `Q0·2` → cabo de H2 solto (agora só LOGO! e n = 1…4).
- **Cabos vs. motor**: o motor fundia-se com a fila dos aparelhos no cálculo das calhas e os cabos dos bornes de baixo mergulhavam para uma calha abaixo do motor, passando à frente dele. Agora as máquinas são obstáculos duros (`WireObstacle.hard`): ficam fora das calhas do quadro, têm calha própria acima do topo, e o planeador escolhe calhas/coluna sem passar pelo motor nem à frente de aparelhos. Motor da semente afastado do quadro (x 2,7 → 3,5).
- **Vista**: o projeto nativo (`nativeId`) abre o 3D em isométrica também no editor completo (antes só a demo; ignora o pedido «frontal» do cubo 2D na primeira abertura).
- Testes novos: `native-sim-smoke.ts` (11 asserções: fonte, PLC, repouso, START com retenção, STOP, rotação cw, iso) e `native-wires-3d-smoke.ts` (nenhum cabo 3D passa pelo motor; falhava em W16 antes). `tsc -b`, build, `smoke.ts` e todas as suítes sem browser verdes, exceto `terminal-geometry/seat` (falham também sem estas alterações).
- **Atenção**: as correções do motor de simulação aplicam-se a qualquer projeto já aberto; a nova posição do motor e o traçado dos cabos vêm da semente — num projeto nativo já gravado na conta é preciso repor/reabrir a semente.
- Por confirmar visualmente: a captura 3D do novo enquadre e dos cabos (sem browser neste ambiente).
