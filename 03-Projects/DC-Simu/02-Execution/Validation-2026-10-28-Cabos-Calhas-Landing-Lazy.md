---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
repo: deopmdecastro/dc-simu
commit: b3a31e4
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
