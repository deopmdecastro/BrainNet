---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED
created: 2026-11-02
updated: 2026-11-02
tags: [dc-simu, simulation, lock, selection, validation]
---
# Validação 2026-11-02 — bloqueio de seleção e edição em RUN/PAUSA

Tarefa: [[Task-2026-10-28-Sim-Lock-Wires-Breaker]] · Decisão: DC-ADR-086 em [[Decision-Log]] · Commit: `db12006` (`dc-simu`).

## Alterações
| Ficheiro | Alteração |
| --- | --- |
| `src/store/useSimStore.ts` | `isSimEditLocked`; `selectComponents`/`selectWire` ignoram seleção em RUN/PAUSA (limpar continua); ao entrar em RUN/PAUSA a seleção sai. |
| `src/three/Panel3D.tsx` | Componentes, cabos (clique, duplo clique, apagar, novo ponto), textos (só leitura) e desenho de cabo bloqueados; botões continuam a atuar. |
| `src/schematic/SchematicView.tsx` | Componentes, cabos, pontos de curva, bornes e calha sem seleção nem arrasto; a sonda continua a medir. |
| `scripts/sim-select-3d-ui-smoke.mjs` | Passa a afirmar o comportamento novo (antes afirmava seleção em RUN). |
| `scripts/sim-edit-lock-smoke.ts` | Novo `npm run test:sim-edit-lock` (12 verificações de store). |

## Evidência
- `npm run typecheck`: limpo.
- `npm run test:sim-edit-lock`: 12/12 PASS.
- `npm run test:sim-select-3d-ui`: 18/18 PASS (Chromium, projeto nativo, RUN/PAUSA/STOP).
- `npm test`: 735 PASS; 1 FAIL **pré-existente** («disponibilidade 3D reconhece os 43 componentes com GLB real») — reproduzido sem as alterações desta tarefa.
- `npm run test:sim-cursor` (8/8) e `test:style` passam.

## Limites
- **Esquema 2D sem teste de browser:** o editor 2D ficou em «A carregar o editor…» no ambiente de teste (também após 170 s). As alterações 2D foram validadas só por typecheck e revisão de código.
- Esquema IEC (CommandsEditor), Ladder e GRAFCET não foram alterados.
- O commit incluiu `release-stamp.json`, atualizado pelo hook do repositório.

## Pendências
- Validar o Esquema 2D em ecrã real ou com o carregamento concluído.
- Itens 2, 3 e 4 da tarefa de 2026-10-28 (cabos nas chapas, efeito pela cor, sentido do disjuntor motor).
- Falha pré-existente do teste de GLB.
