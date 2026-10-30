---
project_id: BN-DCSIMU-001
type: validation
status: TESTED
created: 2026-10-30
updated: 2026-10-30
tags: [dc-simu, performance, covers, albedo, validation]
---
# Validação 2026-10-30 — Renderização mais leve e capas com albedo

Relacionado com [[Task-2026-10-30-Render-Leve-Capas-Albedo]] e [[Testing-Plan]].

**Commit `dc-simu`:** `0865d6d` (`main`, carimbo `#115`).

## Testes automáticos
- `npx tsc --noEmit` — sem erros.
- `npm test` (smoke) — ✅ todos os testes passaram.
- `npm run check` — não existe no `package.json` do dc-simu; cobertura feita com tsc + smoke.

## Medições (Playwright, Vite dev quente, 1440×900, projeto `native-partida-direta-v5`)
| Métrica | Antes | Depois |
|---|---|---|
| Editor quente t0 → canvas visível | 16,5 s (até estável) | 9,0 s |
| Long tasks típicas no arranque | 4,4 s / 2,5 s | 0,7 s / 0,5 s / 0,4 s + uma de ~4,2 s (1.º render 3D) |
| Re-render da Toolbar em RUN | a cada tick (10 Hz) | só quando muda estado/modo/velocidade |
| Capas geradas no arranque | todas (~70) | só as visíveis |

Nota: a primeira medição a frio teve um bloco de 36 s por compilação do chunk lazy no Vite; não acontece em build de produção nem com o servidor quente.

## Regressão visual em RUN
- Antes e depois do RUN: o mesmo número de indicadores energizados (5 → 5); estado ao vivo mantido com `simTick`. Sem erros de página.

## Capas (auditoria `component-cover-audit.html?types=…`)
- `coverMaterialInfo('contactorWegCWC09')`: 8/8 materiais `polymer:albedo` (normal + rough + bump + map).
- Capas renderizadas: contactorWegCWC09, breakerSteckSdC25, motorBreakerPkzmC10, powerSupplyProauto24A, plcSiemensLogo1224RC, breaker3p e motor3ph. Cores de fábrica preservadas; grão/variação visíveis (sobretudo na chapa azul da Proauto).
