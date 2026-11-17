---
type: validation
status: VERIFIED_LOCAL
created: 2026-11-16
updated: 2026-11-16
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, cabos, filacamento, chicotes, 3d, validation]
---

# Validação — Filaçamento Industrial 3D (Chicotes Apertados em Roseta, Cintas PA66 Convexas e Saídas Axiais)

## Resumo

Reformulação geométrica e visual do filaçamento 3D de cabos (`dc-simu` commit `9e1b552`, carimbo `#197`) para reproduzir o acabamento real de quadros elétricos industriais filaçados: condutores encostados entre si em secção hexagonal compacta, abraçadeiras PA66 perpendiculares tensionadas sobre o contorno convexo real dos cabos com cabeça de fecho de perfil baixo (tipo T18R), zero abraçadeiras cruzadas em «X», saídas de ponteira dupla (`ferruleDouble`) perfeitamente axiais sem curvas em «S» (nomeadamente em `PS1` e `Q0`) e chicote do motor `M1` filaçado continuamente até ao bucim M20.

Como o cálculo de `buildAllWirePaths3D`, `bundleLacingTies` e `BundleTies3D` é efetuado em tempo de renderização a partir de `wire.bundleId`, tanto os projetos nativos (`Partida direta`, `Estrela-Triângulo`) como os projetos existentes na conta (incluindo `f8df6df2-c5dd-4b86-ba54-93aeeddc566b`, que já conserva os 7 chicotes `chicote-*`) beneficiam automaticamente do novo acabamento.

## Alterações implementadas (`dc-simu`)

1. **Empacotamento hexagonal em roseta e cinta convexa tensionada** (`src/three/bundleLacing.ts`):
   - `packBundleRosette`: empacotamento transversal determinístico sem sobreposição (favo hexagonal; 7 condutores de `Ø 2,8 mm` compactados em `∅ 8,6 mm`), preservando a ordem relativa dos cabos para evitar tranças.
   - `convexBeltOfCircles` e `BundleTie.circles`: cálculo analítico das tangentes exteriores e arcos do fecho convexo real dos círculos dos condutores abraçados.
   - `bundleLacingTies`: passo regular `52 mm`, tolerância superfície-a-superfície rigorosa (`TIE_MAX_GAP = 3,6 mm`), paralelismo estrito (`|dot| ≥ 0,96`), rejeição de cabos estranhos presos na cinta, supressão global de abraçadeiras sobrepostas/cruzadas em «X» entre chicotes distintos e sondas laterais para troços retos curtos (como o topo de `PS1` e as pontes trifásicas).

2. **Aperto transversal C² de chicotes, saídas axiais e curvas suaves** (`src/three/wireGeometry3D.ts`):
   - `ferrulePortOffsetMm` reduzido para `1,28 mm` (sincronizado automaticamente com o colar oval de `WireEnd3D.tsx`), eliminando curvas em «S» nas ponteiras duplas de `PS1` (`< 0,8 mm` de desvio lateral, `0,00 mm` em `W19/W21/W27/W40`) e `Q0`.
   - Subdivisão adaptativa exterior, corredores/colunas compactos por chicote, aproximação compacta ao bucim M20 de `M1` e passo `cinchLacedBundles3D` com deslocamento estritamente ortogonal à tangente local, rampas C² nas derivações, cintura ligeira junto às abraçadeiras, suavização cosseno em comprimento de arco (`28 mm`) e validação de colisão por troço.
   - Relaxação cabo-a-cabo em comprimento de arco com folga justa dentro do mesmo chicote (`0,12 mm`) e separação franca entre chicotes distintos (`0,55 mm`), seguida de arredondamento progressivo seguro contra obstáculos (`smoothOutsideProgressive`) e compactação colinear fora das zonas terminais.

3. **Renderização 3D das abraçadeiras PA66** (`src/three/Panel3D.tsx`):
   - `buildTensionedStrapGeometry`: extrusão tubular fechada da cinta sobre o fecho convexo real dos condutores (substituindo a antiga argola larga em estádio), cabeça de fecho de perfil baixo (`1,7 × 2,4 × 3,5 mm`) encostada tangencialmente com lingueta metálica discreta e recorte traseiro apenas nos vértices junto à chapa do painel.

4. **Cobertura de regressão** (`scripts/wire-lacing-smoke.ts`):
   - Novas verificações automáticas para vão máximo/médio das abraçadeiras (`14,5 mm` / `8,5 mm`, face aos anteriores `38,8 mm` / `18,9 mm`), cobertura dos `7/7` chicotes (`44` abraçadeiras), chicote contínuo do motor `M1` (`10` abraçadeiras até ao bucim M20), `0` abraçadeiras cruzadas, saídas axiais de `PS1` e empacotamento `packBundleRosette` / `convexBeltOfCircles`.

## Evidências de verificação

- TypeScript (`tsc -b`): `0` erros.
- Estilo (`npm run test:style`): `no-accent-border: ok`.
- Bundle de produção ESM (`esbuild --splitting`): `0` erros, `0` avisos.
- Suites smoke (19/19 verdes): `wire-lacing-smoke` (20/20), `native-wires-3d-smoke` (59/59, `0` colisões entre 43 cabos, `0` viragens `> 90°`, `z_mín = -0,198 ≥ -0,250`), `native-estrela-ks1-smoke`, `motor-star-delta-external-smoke`, `solid-cables-meter-smoke`, `wire-curves-refresh-smoke`, `wire-isolation-markers-lace-smoke` (18/18), `wire-lock-organization-smoke` (28/28), `enclosure-move-smoke` (10/10), `enclosure-visibility-smoke`, `panel-accessories-smoke` (34/34), `lead-pigtails-smoke`, `terminal-geometry-smoke` (200 encaixes), `terminal-seat-smoke`, `terminal-strip-smoke` (17/17), `thermal-mount-smoke` (12/12), `native-sim-smoke`, `native-diagnostics-smoke` (`0` erros, `0` avisos) e `smoke`.
- Inspeção visual 3D em 2× retina (Playwright): vista geral, feixe superior de comando/sinalização, vista frontal e inclinada a `45°` sobre `PS1`/`Q0`/`PLC1` e chicote contínuo do motor `M1` até ao bucim M20, bem como auditoria geométrica com as coordenadas exatas do projeto `f8df6df2-c5dd-4b86-ba54-93aeeddc566b`.
