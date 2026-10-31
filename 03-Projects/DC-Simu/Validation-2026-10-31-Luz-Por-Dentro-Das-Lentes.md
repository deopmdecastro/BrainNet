---
project_id: BN-DCSIMU-001
type: validation
status: PUBLISHED
created: 2026-10-31
updated: 2026-10-31
repo: https://github.com/deopmdecastro/dc-simu
commits:
  - 8e07ede
tags: [dc-simu, 3d-realista, glow, lentes, torre, sinaleiros]
---

# Validação 2026-10-31 — Brilho por dentro da lente (todas as luzes)

## Pedido
O halo da torre aparecia ao lado da lente (visto de lado). O brilho deve ficar **dentro** do componente que emite luz, e brilhar/iluminar. Aplicar a todas as luzes.

## Diagnóstico
- O `GlowHalo` estava ancorado na face frontal da lente (`box.max.z`, `+0,258`, `localBox.max.z`). Sendo um sprite virado para a câmara, visto de lado parecia flutuar ao lado do cilindro. Era demasiado grande (4,4× o raio) e a luz de ponto ficava à frente da lente.

## Implementação
- `glow.ts`: novo tipo `lens` (halo contido ≈ 1,3× o diâmetro, luz 0,35).
- `GlowHalo.tsx`: com `kind="lens"` a `position` é o centro da lente e a luz de ponto fica lá dentro.
- Torre GLB (`Panel3D.tsx`, `importedFinish.ts`), `Lamp3D`, `TowerLight3D`, AD22 real, LED do sinaleiro simples, `LandingShowcase` e luzes de catálogo (`stateAnimator.ts`): halo no centro da lente; vidro translúcido e sem `depthWrite` quando aceso, para a luz de dentro se ver através.
- LEDs planos de PLC/relé de segurança mantêm o halo na face (são discos).
- `scripts/glow-smoke.ts` atualizado: halo no centro (z = 22 mm) e escala interna contida.

## Verificações
- `tsc -b`, `vite build`, `npm test` e `glow-smoke` (48 verificações) OK.
- Teste visual em browser **não executado** (sem browser neste ambiente).

## Pendências
- Confirmar no browser, de frente e de lado: halo dentro das 3 lentes da torre, intensidade da luz de ponto (0,35) sem queimar anéis/lentes vizinhas, transparência do vidro aceso (0,82) e ordenação com fios à frente. Ajustar `GLOW_SPECS.lens` se necessário.
