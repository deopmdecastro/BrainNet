---
project_id: BN-DCSIMU-001
type: task
status: DONE
created: 2026-11-19
updated: 2026-11-19
tags: [dc-simu, tarefa, testes, desempenho, ci]
---
# Task — 2026-11-19 — Otimizar testes e validações longos

**Estado:** DONE
**Commit dc-simu:** `e5ee22a` (release #219)
**Validação:** [Validation-2026-11-19-Otimizacao-Testes](Validation-2026-11-19-Otimizacao-Testes.md)

## Pedido (utilizador)

"Otimizar testes e validações longos para reduzir o tempo de execução."
Âmbito preservado: nenhuma suíte removida nem enfraquecida.

## Medição inicial (sandbox 2 núcleos)

| Suíte | Tempo |
|---|---|
| `test:hooks` (eslint) | **18,7 s** ← gargalo dominante |
| `test:builtin-sync` | 15,4 s (120 GLBs: fetch + parse + paint + fit, CPU-bound) |
| `test` (smoke.ts) | 8,4 s |
| restantes | 0,7–3 s cada |
| `test:ci:fast` total | ~42 s sequencial |

## Alterações

1. **`scripts/run-suites.mjs`** (novo): executor paralelo de suítes npm com
   concorrência limitada (predefinição `min(4, núcleos)`, ajustável com
   `--jobs N`). Output bufferizado por suíte (só impresso em falha), resumo
   final com durações e lista de falhas, exit 1 se alguma falhar. Todas as
   suítes correm sempre — a semântica `&&` que parava na primeira falha foi
   substituída por relatório completo.
2. **`test:ci` (104 suítes) e `test:ci:fast` (19 suítes)** passam a usar o
   executor, com escalonamento *longest-first* segundo durações medidas.
3. **`test:hooks`**: `eslint --cache --cache-location node_modules/.cache/.eslintcache`
   → 18,7 s → ~1,1 s em código inalterado (o cache é bónus, nunca correção).

Verificação prévia de segurança: nenhuma suíte de CI usa porta fixa, servidor
ou escrita em ficheiros do repositório (único escritor, `qgd-production-ui`,
não faz parte de CI) → paralelização segura.

## Resultados

- `test:ci:fast`: 42 s → **27 s** (2 núcleos, cache quente); em 4–8 núcleos
  espera-se ~15–18 s.
- `test:ci` completo: **142 s** com relatório de todas as falhas (antes
  parava em `test` e nunca chegava às restantes ~100 suítes).

## Falhas pré-existentes reveladas (não são regressões)

Confirmado em worktree no baseline `1adcca1` — falham igualmente em sequencial:
`test` (estados-de-posicionamento), `test:meters-schneider` e
`test:sim-transport` (D52 CT-IN), `test:terminal-geometry` e
`test:terminal-seat` (WEG DPS), `test:editor3d-functional`,
`test:mechanical`, `test:qgd`, `test:pinch`, `test:landing-demo`,
`test:native-policy`, `test:supabase-comments`/`test:supabase-contrib`
(WebSocket nativo inexistente no Node 20 do sandbox). Estavam escondidas
pelo curto-circuito do `&&`. Ficam registadas para correção futura — fora do
âmbito desta tarefa (otimização de tempo).
