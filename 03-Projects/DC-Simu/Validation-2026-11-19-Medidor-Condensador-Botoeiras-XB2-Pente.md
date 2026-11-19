---
project_id: BN-DCSIMU-001
type: validation
status: APPROVED_PENDING_PRODUCTION_VISUAL
created: 2026-11-19
updated: 2026-11-19
tags: [dc-simu, validação, medidor, condensador, buzzer, botoeiras, pente]
---
# Validação 2026-11-19 — Medidor D52, condensador, buzzer, botoeiras XB2 e pente

## Âmbito validado

Commit dc-simu `1adcca1` (release #217), publicado em main → Vercel.

| # | Item | Resultado |
|---|------|-----------|
| 1 | D52-2066: túnel removido, poços 3/4 abertos com parafusos captivos | ✅ verificado por raios (scripts/d52-probe.ts): face do degrau em z=44 mm perfurada, parafuso visível a z≈40,9 mm, corpo opaco a varrimento longitudinal |
| 2 | GEYA GRT8: parafusos frontais sem duplicação | ✅ patch runtime flutuante removido; parafusos do GLB nos poços recuados |
| 3 | Condensador 6 pinos faston + auto-encaixe | ✅ 6 lâminas DIN 46244 no GLB; marcadores pin alargados; inset=0; overlaps 2D resolvidos (editors-sweep verde) |
| 4 | Buzzer TBY-301 fiel às fotos | ✅ 4 parafusos traseiros, etiqueta na traseira, aro serrilhado Ø35, grelha furada |
| 5 | Botoeiras KEOLEA KL-XB2 | ✅ 3 variantes (NA verde, NF vermelha, NA preta), GLB cotado, clique press-and-hold com tampa a descer 2 mm, bridges NA/NF no motor, IEC pushNO/pushNC, capas webp, datasheet local |
| 6 | Pente universal | ✅ breaker4p/residualBreaker/motorBreaker + DPS WEG SPW02/SPW12 com REAL_TERMINALS e pistas Easy9; DPS entram em BREAKER_TYPES |
| 7 | Otimização de testes | ✅ `npm run test:ci:fast` (núcleo sem suites de browser) |
| 8 | Commit/push/publicação | ✅ dc-simu main `1adcca1` pushed; BrainNet com submódulo re-pinned |

## Evidência de testes (local, Node 20)

- `npx tsc -b` — limpo.
- `npm run test:terminal-geometry` — PASS: 51 modelos CAD (+8 procedurais), 300 encaixes com cavidade e 48 pinos/fios verificados.
- `npm run test:industrial` — PASS: 123 verificações (inclui TBY-301 110 V, duty 30 min, GRT8 M1/B1, ATV, AVEL).
- `npm run test:industrial-iec` — PASS: 52 asserções (inclui as três botoeiras XB2).
- `npm run test:editors-sweep` — PASS: 60 verificações (3D-DATA-01 sem sobreposições).
- `npm run test:hooks` (eslint) — limpo.
- `npm test` / `test:ci:fast` — 1 falha pré-existente no baseline e5b0019 («estados de posicionamento e arraste não contornam o bloqueio») e `test:meters-schneider` (CT-IN) também falha no baseline: sem regressão introduzida.
- `node scripts/build-component-covers.mjs --check` — 72+3 capas e vistas frontais presentes.

## Limites declarados

- Botoeiras XB2 e buzzer são reconstruções cotadas das fotografias/desenho do
  fabricante; não é CAD oficial. Capas XB2 geradas por renderer Node (painter's
  algorithm) porque o sandbox não tem bibliotecas do Chrome — correr
  `build-component-covers.mjs` com browser para capas fotográficas finais.
- `test:meters-schneider` (bornes CT-IN/CT-OUT do fixture) fica registado para
  sessão própria; não é regressão deste trabalho.
- Validação visual final em produção (dc-simu.vercel.app) pendente do deploy.
