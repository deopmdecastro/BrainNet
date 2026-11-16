---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_TESTED_NOT_VISUALLY_VERIFIED
created: 2026-11-16
updated: 2026-11-16
repos: [dc-simu, BrainNet]
tags: [dc-simu, cabos, filacar, chicote, abracadeiras, 3d, nativo]
---
# Tarefa 2026-11-16 — Filaçar os cabos

## Pedido
«Filaçar os cabos» no projeto nativo «Partida direta».

## Contexto reaproveitado
[[Task-2026-11-04-Quadro-Parentesco-Espiral-Cabos]] (item 5, filaçar), [[Validation-2026-11-07-Cabos-Organizacao-Bloqueio]] (o filaçamento respeita o bloqueio), [[Task-2026-11-16-Cabos-Nativo-Pontes-Curtas]]. O botão «Filaçar» (SelectionBar e Inspetor) e `laceWires`/`bundleId` já existiam, mas **só marcavam** os cabos: nada se via no 3D.

## Alterações (`dc-simu`)
- `src/three/bundleLacing.ts` (cálculo puro): `bundleLacingTies` põe uma abraçadeira a cada 60 mm onde 2+ cabos do mesmo chicote correm juntos (≤ 22 mm, paralelos), a 35 mm das pontas; `lacePairBundles` filaça os cabos que ligam o mesmo par de aparelhos, sem tocar em bloqueados, já filaçados nem sondas.
- `Panel3D.tsx`: `BundleTies3D` desenha as abraçadeiras (anel + cabeça, cor de nylon) para qualquer chicote, incluindo os criados à mão com «Filaçar».
- `nativeProjects.ts`: o nativo sai filaçado por par de aparelhos (`chicote-…`): 8 chicotes, 21 cabos (força QG→QM1→KM1, F1→M1, 24 V, entradas, sinalização).
- `scripts/wire-lacing-smoke.ts` (11 verificações) integrado em `test:native-wires-3d`.

## Verificação
`tsc -b`, `vite build`, `npm test`, `test:native-wires-3d` (inclui lacing), `test:native-sim`, `test:native-diagnostics`, `test:wire-isolation`: PASS. 41 abraçadeiras no nativo, raio máx. 14,9 mm.

## Pendências
- Sem browser: confirmar o aspeto (tamanho, cor, espaçamento) no 3D do telefone.
- O Esquema 2D não desenha o filaçamento (só o 3D).
- Projetos já guardados: o nativo atualiza-se pela semente; noutros, usar «Filaçar seleção».
- Proposta: ação «Filaçar por aparelhos» no menu Organizar (usa `lacePairBundles`).
