---
project_id: BN-DCSIMU-001
type: validation
status: TESTED
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, 3d, pbr, textures, covers, default-views, validation]
---
# Validação 2026-10-29 — Texturas reais, capas e vistas por omissão

Relacionado com [[Task-2026-10-29-Texturas-Capas-Vistas]], [[Design-Principles]] e [[Testing-Plan]].

**Commit `dc-simu`:** `ac098ad` (`main`, carimbo `#103`) — commit local; push dependente da autorização do GitHub na sessão (ver [[Validation-2026-10-29-UI-Paineis-Simulacao-GRAFCET]]).

## Auditoria das vistas (26 GLB)
Renderizados frente, topo e lado direito do modelo ajustado (`scripts/component-cover-audit.html`).
- Frente correta (+Z) e topo correto (+Y) em 25 de 26 modelos.
- **Errado:** `plcLsXbmDn32s` — frente era o lado do corpo; corrigido (rotação base, dimensões físicas, bornes 3D/2D, migração).
- Capas antigas com defeito: `emergencyButton` (cabeça cinzenta), `dinRail15x55` (linha), `pilotLightAd22` (disco), `motor3ph` (miniatura prateada) — todos corrigidos pela capa 3/4.

## Evidência
- `npx tsc -b`: 0 erros. `npm run test:style`: ok.
- `npm run test:ci`: **rc 0** (inclui `test:terminal-geometry` — 20 modelos, 142 ligações — `test:terminal-seat`, `test:builtin-sync` 359 verificações, `test:emergency-actuator`, `test:motor`, `test:native-wires-3d`, landing e o novo `test:cad-surface` com 19 verificações).
- `vite build`: sem erros.
- `grafcet-ui-smoke` e `editor-grid-ui-smoke` (servidor local): PASS. A primeira corrida após criar módulos novos falhou por recarga de otimização do Vite; a seguinte passou sem alterações.
- Capturas Chromium/WebGL: Painel 3D antes/depois (1440×900, ampliado), biblioteca com capas novas e grelha completa de capas/vistas.

## Limitações
- Fontes 3D (troika) vêm de uma CDN bloqueada na sessão; nas capturas foram servidas por um ficheiro local só no teste.
- Os mapas ambientCG têm relevo subtil (512 px); o ganho principal é o estúdio e o tone mapping. A landing mantém a sua iluminação própria.

## Pendências
- Push dos dois repositórios.
- Revisão visual em telemóvel real (desempenho das capas em série) e aprovação.
