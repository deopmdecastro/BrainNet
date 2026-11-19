# Validation — 2026-11-19 — ATV320 HMI fiel + Modal de cookies

**Estado:** APPROVED_PENDING_PRODUCTION_VISUAL
**Commit:** dc-simu `1077ac7` (release #218), pushed para `main`.
**Task:** [Task-2026-11-19-ATV320-HMI-Cookies](Task-2026-11-19-ATV320-HMI-Cookies.md)

## Evidência

### Testes automatizados (sandbox)

| Suíte | Resultado |
|---|---|
| `npx tsc --noEmit` | limpo |
| `npm run test:hooks` (eslint) | limpo |
| `scripts/device-lcd-smoke.ts` | 77 PASS (layout ATV reduzido a dígitos; legendas são físicas) |
| `npm run test:industrial` | 123 PASS |
| `npm run test:industrial-iec` | 52 PASS |
| `node scripts/build-component-covers.mjs --check` | 72 capas + 72 vistas OK |
| `npm run test:ci:fast` | 1 FAIL pré-existente ("estados de posicionamento e arraste…") |
| `npm test` | 1 FAIL pré-existente (o mesmo) |
| `npm run test:terminal-geometry` | FAIL pré-existente `surgeProtectorWegSpw02.L` — reproduz no baseline `1adcca1` com ficheiros originais (git stash), não é regressão |

### Verificação geométrica do GLB (Node + GLTFLoader)

Todos os nós nomeados presentes e dentro do envelope 72,9×143×128,1 mm:
LCD em (−2,7; 126,4), legendas CAN Run/CAN Err acima do visor (y≈135,8),
colunas Ref/Mon/Conf (x≈−21,7) e Value/Unit (x≈15,8), ESC (−19,2; 108,5) com
rótulo abaixo, QR à direita do dial (26,8; 108,5), etiqueta de características
na face lateral direita (plano +X), DANGER/Altivar/Schneider na base.
Encoder Ø22,5 mm na frente (z máx = profundidade do aparelho) ✓.

### Verificação de texturas

`python3 PIL`: as 8 legendas renderizam branco-sobre-transparente legível e o
autocolante QR mostra `ATV320U04M2C` + código QR válido da referência.

### Bornes

35 bornes conferidos com NVE41289 (arranjo ATV320••••M2•/•C): sem divergência.

## Pendente

- Inspeção visual em produção (browser real): as posições foram validadas
  numericamente e as texturas por composição PIL; o sandbox não renderiza
  WebGL (Playwright indisponível).
