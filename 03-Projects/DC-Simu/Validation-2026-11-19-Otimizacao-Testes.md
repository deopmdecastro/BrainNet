---
project_id: BN-DCSIMU-001
type: validation
status: APPROVED
created: 2026-11-19
updated: 2026-11-19
tags: [dc-simu, validação, testes, desempenho, ci]
---
# Validation — 2026-11-19 — Otimização de testes e validações

**Estado:** APPROVED
**Commit:** dc-simu `e5ee22a` (release #219), pushed para `main`.
**Task:** [Task-2026-11-19-Otimizacao-Testes](Task-2026-11-19-Otimizacao-Testes.md)

## Evidência

### Âmbito preservado (verificação automática)

Comparação programática das listas de suítes antes/depois:
`ci:fast em falta: nenhuma | extra: nenhuma` · `ci em falta: nenhuma | extra: nenhuma`
(19 e 104 suítes, incluindo `test`/`test:hooks`).

### Tempos medidos (sandbox 2 núcleos)

| Alvo | Antes | Depois |
|---|---|---|
| `test:hooks` (cache quente) | 18,7 s | **1,1 s** |
| `test:ci:fast` (cache quente) | ~42 s | **27 s** |
| `test:ci` (104 suítes) | n/a (parava na 1.ª falha) | **142 s** completo |
| `--jobs 3` em 2 núcleos | — | 39,9 s (pior: oversubscrição; predefinição mantida em min(4, cores)) |

### Corretude do executor

- Output por suíte bufferizado; falhas mostram o log completo indentado.
- Resumo: `91/104 suítes OK em 142.3s (2 trabalhadores)` + lista de falhas;
  exit code 1 com falhas, 0 sem falhas (verificado nas execuções).
- `test:ci:fast` executado 3× (frio/quente/reordenado) — resultados estáveis.

### Regressões: zero

As 13 falhas do `test:ci` foram reproduzidas **em sequencial na árvore atual**
e **em worktree limpo no baseline `1adcca1`** (`test:terminal-seat`,
`test:editor3d-functional`, `test:mechanical`, `test:meters-schneider`,
`test:terminal-geometry`, `test:qgd`, `test:pinch`, `test:landing-demo`,
`test:native-policy` — todos FAIL no baseline). As duas `supabase-*` falham por
ausência de WebSocket nativo no Node 20 do sandbox (ambiental). Estas falhas
estavam mascaradas pelo curto-circuito `&&`; são agora visíveis por decisão de
diagnóstico, com âmbito de correção fora desta tarefa.

## Pendente

- Corrigir as 13 falhas pré-existentes em tarefa própria (registadas na Task).
