---
project_id: BN-DCSIMU-001
type: task
status: VALIDATED_LIVE
created: 2026-11-16
updated: 2026-11-16
repos: [dc-simu, BrainNet]
tags: [dc-simu, cabos, chicote, abracadeiras, calha, bucim, 3d, 2d, nativo, saas, free]
---
# Tarefa 2026-11-16 — Chicotes industriais 2D/3D (Partida direta + Estrela-Triângulo) e projetos nativos no plano Free

## Resumo
Revisão completa da cablagem industrial 2D e 3D nos dois quadros nativos («Partida direta com emergência» e «Estrela-Triângulo com KS1»), abraçadeiras PA66 ajustadas à secção real dos chicotes em 3D e 2D, e disponibilização de todos os 7 projetos nativos em contas Free/não-admin com edição isolada por utilizador e sem consumir a quota de projetos próprios.

## Contexto reaproveitado
[[Task-2026-11-16-Filacar-Cabos-Abracadeiras]], [[Task-2026-11-16-Cabos-Nativo-Pontes-Curtas]], [[Validation-2026-11-07-Cabos-Organizacao-Bloqueio]].

## Alterações (`dc-simu` — commit `ef58b12`, carimbo `#195`)
1. **Abraçadeiras PA66 e chicotes 2D/3D** (`src/three/bundleLacing.ts`, `src/three/Panel3D.tsx`, `src/schematic/SchematicView.tsx`, `src/schematic/wireGeometry.ts`, `src/project/nativeRouting.ts`):
   - Perfil estádio orientado por PCA sobre a secção transversal real dos condutores (`majorRadius`/`minorRadius`), cabeça dentada PA66 encostada ao chicote, ocultação dentro de calhas com tampa fechada (`coverOn`) e exclusão de colisões com obstáculos 3D.
   - Camada SVG `.dc-bundle-ties-2d` no Esquema 2D, raios de curvatura `R = 18` nos cantos ortogonais e encaminhamento 2D por calhas/corredores do armário `QE1`.
   - Atualização automática de curvas nativas (`wire-curves-v8`) e anotações (`native-annotations-v3`) sem sobreposição de títulos no painel 3D/2D; olhais e ponteiras de força/comando completos no «Estrela-Triângulo».
2. **Encaminhamento 3D em armário, porta, calhas e bucim M20** (`src/three/wireGeometry3D.ts`, `src/three/solidWireRouting.ts`):
   - Contenção integral dos cabos internos nas paredes do armário `QE1` (`EnclosureWallKind`) e condução pelos canais das calhas rasgadas e caleira inferior.
   - Chicote de porta (`buildDoorHarnessBody3D`) com ramais horizontais filaçados na face interior da porta, coluna vertical junto à dobradiça e arco flexível para a régua de bornes `X1` (porta aberta e fechada).
   - Bucim M20 (`buildMotorGlandBody3D`) com grelha de 7 condutores para arranque estrela-triângulo (`U1/V1/W1`, `U2/V2/W2`, `PE`), separação mínima ≥ 4,1 mm e curvas C2 suaves na caixa de bornes do motor.
   - Saídas laterais/inferiores dos contactos traseiros de botões e sinalizadores `AD22` sem retrocessos nem colisões (`clearOwnExitY`).
3. **Projetos nativos editáveis para contas Free/não-admin** (`src/project/freeNativeSandbox.ts`, `src/supabase/supabaseBackend.ts`, `src/auth/localBackend.ts`, `src/auth/accountApi.ts`, `src/dashboard/Dashboard.tsx`, `src/dashboard/projectPreview.ts`):
   - Exposição dos 7 projetos nativos (`Partida direta`, `Estrela-Triângulo` e 5 exemplos GRAFCET/ATEC) com `owner: 'DC-Simu'`, `role: 'editor'` e etiqueta «Exemplo nativo», preservando intactos os projetos pessoais (ex.: «Electronica» em `user@dcsimu.local`) e consumindo `0` da quota de 3 projetos próprios do plano Free.
   - Rascunhos guardados de forma isolada por utilizador (sem alterar as sementes globais nem a conta de administrador), proteção contra eliminação/renomeação do modelo partilhado e ação «Repor original» no menu do cartão no painel.

## Verificação
- `npm run typecheck` (`tsc -b`) e empacotamento ESM completo (`esbuild --splitting`): 0 erros.
- `native-wires-3d-smoke.ts`: **60/60 PASS**; `native-wire-metrics.ts`: comprimento total **18 152 mm** (−1 580 mm / −8,0 % face aos 19 732 mm anteriores), **0** colisões entre cabos, **0** pares < 1 mm, **0** viragens > 90°, separação mínima no bucim M20 de **4,1 mm**, 7 chicotes e 52 abraçadeiras PA66.
- Auditoria 3D do «Estrela-Triângulo com KS1» (porta aberta e fechada): **71/71** cabos válidos, **7/7** condutores pelo bucim M20, **0** cabos fora do armário, **0** colisões com paredes de `QE1`, **133** abraçadeiras PA66 em 11 chicotes (raio máx. 19,0 mm); `test:native-estrela-ks1` **25/25 PASS**.
- Regressão: `test:wire-lacing` (13/13), `test:wire-curves-refresh` (PASS), `wire-isolation-markers-lace-smoke.ts` (18/18), `test:wire-locks` (28/28), `landing-demo-smoke.ts` (30/30), `supabase-comments-smoke.ts` (PASS), `server-e2e.mjs` (188/188), `BrainNet` `npm test` (18/18).
- Inspeção visual Playwright (Chromium + WebGL): painel de `user@dcsimu.local` (7 exemplos nativos + coexistência com «Electronica» a 1/3 da quota + «Repor original»), «Partida direta» 2D/3D ISO e «Estrela-Triângulo» 3D ISO com porta aberta, chicote de dobradiça, calhas e bucim M20 — 0 erros de página.
- Produção (`https://dc-simu.vercel.app`): deploy Vercel confirmado em `/version.json` e verificação da conta `user@dcsimu.local` concluída.
