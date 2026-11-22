# Validation — WAGO 221 reais + sensor XUKT na esteira + base BALLUFF (2026-11-22)

**Estado**: ✅ Concluída · **Repositório**: dc-simu (branch `main`) · **Evidências**: [docs/validation/wago-sensor-fidelity](dc-simu/docs/validation/wago-sensor-fidelity/results.md)

## Pedido

"Tornar fiel ao real os wagos que tenho" (fotos 221-413, 221-415 e inline 221-2411) + "Na esteira use o sensor real que tenho, reaproveita, criar novo componente base de sensores e use ele também" (foto do sensor na esteira + foto do suporte BALLUFF).

## O que foi feito

### 1. Família WAGO 221 fiel (`JunctionWagoDevices3D.tsx`, ~1270 linhas)
Reconstrução completa das carcaças PC cinza-leitoso translúcido com interior visível (barramento Cu, grampos, canal/furo de strip 11 mm), treliça em losango nas faces ±X e **funis de entrada em trombeta na face inferior** (1 por condutor, ao longo da largura) como nas fotos.

| Tipo | Real | Fidelidade |
|---|---|---|
| `wago221_2` | 221-412 (2 vias) | corpo 24×24×36, alavancas-tecla com "WAGO 221" impresso |
| `wago221_3` | **221-413 (3 vias)** — NOVO | 44×24×36, marcações PSE/Cu/JET 20A/escala 11 |
| `wago221_5` | 221-415 (5 vias) | 72×24×36, marcações duplas (faces A/B: 450V/32A, AWG 24-12, PSE) |
| `wago221_inline` | 221-2411 (comparador) | entradas nas extremidades, "450V/32A · 0,2-4 q·mm² · AWG 18-14" |
| `wago221_double` | composto de bancada | 2 pisos espelhados (alavancas para cima/baixo) |

Alavancas: teclas-piano alaranjadas esguias com charneira, frisos de pega e **impressão "WAGO 221" a preto**; abrem ~105° (0.58π) como as reais.

### 2. Sensor real reaproveitado na esteira (`ConveyorDevices3D.tsx`)
Os sensores lineares `rollerConveyor` passaram a montar o **GLB real `photoSensorXukt1ksml2`** (Telemecanique XUKT1KSML2, 33.8×69.6×69.6 mm) via `XuktRealSensor3D` — clone + `fitComponentModel`, LED, feixe fotoelétrico vermelho com pulsos em direção ao refletor. O sensor indutivo de referência mantém o design L original.

### 3. Novo componente base de sensores BALLUFF (`SensorMounts3D.tsx`)
`SensorMountBalluff3D` — suporte de poste com:
- Base em cantoneira com mordente de rail + domo esférico e **colar teal** (identidade visual);
- Poste inox Ø14 mm até 132 mm com mordente duplo (hub + braço);
- **Braço articulado Ø15 mm (−80..+58 mm)** com mordente secundário;
- Chapa de olhal 34×46×9 mm com furo Ø26 mm (eixo Z) onde monta o sensor;
- Gravação "| BALLUFF" em rgba(82,92,104).

Na esteira: montado na longarina (olhal a 184 mm da base) com o sensor XUKT no olhal, eixo ótico atravessando o tabuleiro para o refletor — como na foto de referência. É também um tipo de biblioteca inserível (`factory.ts`/`engine.ts`/`DeviceControls.tsx`).

## Verificações
- `npx tsc -b --noEmit` — limpo;
- `npm run test:ci:fast` — **19/21** (falham `test:terminal-geometry`/`test:terminal-seat` do Mico46, pré-existentes);
- `npm run test:cover-version` — ok;
- `scripts/wago-sensor-fidelity-ui-smoke.mjs` (novo, regressão) — **PASS**, 9 capturas estáveis, 0 erros de runtime;
- Capas `component-covers` regeneradas para os 6 tipos (135/139; as 4 em falta são baseline antigo buttonNO/NC, selector2/3).

## Evidências
[docs/validation/wago-sensor-fidelity](dc-simu/docs/validation/wago-sensor-fidelity/results.md) — 9 capturas: ISO dos 5 tipos WAGO, lateral (impressão "WAGO 221"), fundos (funis), base BALLUFF ISO e esteira com sensor montado.

## Notas técnicas
- Unidades: `U = PANEL_UNITS_PER_MM = 0.01`; geometria em mm×U.
- Z-fighting de planos de textura sobre `RoundedBoxGeometry`: manter ≥ 0.004 de afastamento em Y (a 0.0015 o plano desaparecia).
- Capturas UI podem falhar por re-otimização de deps do Vite (SkeletonUtils) que recarrega a página; repetir a captura resolve.
- Registos de biblioteca: `junctionWagoModel.ts` (`wago221_3`, dimensões realistas), `types/index.ts`, `factory.ts` (TEMPLATES + anchors reais: entradas no fundo para 2/3/5-vias), `engine.ts`, `DeviceControls.tsx`.
