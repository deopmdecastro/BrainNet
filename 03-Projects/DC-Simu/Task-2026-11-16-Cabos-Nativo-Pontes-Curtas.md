---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_TESTED_NOT_VISUALLY_VERIFIED
created: 2026-11-16
updated: 2026-11-16
repos: [dc-simu, BrainNet]
tags: [dc-simu, cabos, nativo, partida-direta, 3d, organizacao]
---
# Tarefa 2026-11-16 — Organizar melhor os cabos do projeto nativo «Partida direta»

## Pedido
Captura do 3D com laços e cabos soltos sobre o painel; organizar melhor cabos e fios no projeto nativo.

## Contexto reaproveitado
[[Validation-2026-11-07-Cabos-Organizacao-Bloqueio]] («Organizar cabos» já existe no menu Organizar), [[Task-2026-11-05-Quadro-Estrela-Layout-Motor-Cabos]], `nativeRouting.ts` (2D, cozido na semente) e `wireGeometry3D.ts` (3D, em runtime). Nada novo de UI.

## Diagnóstico (medido, sem browser)
Novo `scripts/native-wire-metrics.ts` calcula, por cabo, comprimento 3D / distância reta. As piores razões eram as **pontes no mesmo aparelho**: Q0.2→Q0.3 e Q0.1→Q0.2 do LOGO! (≈ 12× a distância, 211 mm para bornes a 17 mm) e 13→21 da botoneira (5×). Causa: o ramo sem tronco descia sempre 82 mm antes de voltar — um laço em «U» por baixo/ao lado dos aparelhos.

## Alterações (`dc-simu`)
- `computeBasePlan`: ponte no mesmo aparelho não sobe ao corredor de cabos.
- `wireBodyPoints3D`: ligação curta (< 60 mm) usa um «U» compacto proporcional ao cabo (≥ 28 mm) em vez de 82 mm.
- Resultado: pontes do LOGO! 211 → 103 mm; 13→21 deixa de estar entre os piores; total 20 022 → 19 732 mm.

## Verificação
`tsc -b`, `npm test`, `test:native-wires-3d`, `test:native-sim`, `test:native-diagnostics` (0 erros/0 avisos), `test:wire-isolation`, `test:sim-edit-lock`, `test:motion`: PASS.

## Pendências
- Sem browser: confirmar no 3D do telefone que os laços desapareceram.
- Ainda longos (4–5×, sobem 30–75 mm): F1·96→KM1·A1 e as séries QG→QM1→KM1, que passam pelo corredor de cabos; mudar isso exige rever o layout (operadores por cima dos aparelhos que comandam) — proposta, não feita.
- Em projetos já guardados, usar «Organizar cabos» para recalcular.
