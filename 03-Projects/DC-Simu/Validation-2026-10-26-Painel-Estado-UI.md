---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, qa, ui, ladder, painel-estado]
---
# Painel de estado do Ladder (UI/UX) — 2026-10-26

## Resultado

Refinamento visual do painel inferior do Ladder (Entradas/Saídas, Memórias, Temporizadores, Contadores, Forçar, Depuração, Compilação, Verificação), sem mudar conceito nem tema. Alteração proposta pelo utilizador (patch + CSS), verificada e implementada.

- Espaçamento uniforme do contentor em todos os separadores (14px/16px).
- Estados vazios padronizados num cartão discreto (antes: texto solto, tamanhos 10px vs 12px).
- Listas de E/S com largura máxima e ponto de estado próximo do texto.
- Barra de Depuração e Compilação com alturas iguais (30px); contador de ciclo em pílula.
- «Bloquear RUN com erros» alinhado à direita.
- Correção na verificação: o separador «Forçar» ficava com 24px de margem (padding próprio de `.ladder-force`); passou a 16px como os restantes.

## Ficheiros (dc-simu, commit `31ad8ff`, carimbo #61)

- `src/styles/status-panel-refine.css` (novo; + regra `.ladder-force`)
- `src/main.tsx` (import depois de `virtual-io.css`)
- `src/ladder/LadderEditor.tsx` (classes de estado vazio: `ladder-status-empty`, `is-inline`)

## Evidência

| Verificação | Resultado |
| --- | --- |
| `git apply --check` sobre `78ef7a2` | Aplica sem conflitos |
| Seletores do CSS | Todos existem no código (`ladder-status-*`, `ladder-debug-*`, `ladder-compile-*`, `ladder-lint-row`, `ladder-meter-grid`, `ladder-chip-list`, `plc-sim`, `vio-hint`) |
| `npx tsc -b` | Sem erros |
| `npm run test:ci` (com `Monta-Carga.ct`) | Passa |
| `vite build` | Concluído |
| UI smokes | `ladder-blocks-ui` 25, `admin-saas-ui` 22, `toolbar-ui` 37, `editors-sweep-ui` 19, `plc-signals-ui` 16: todos passam |
| Capturas antes/depois | 8 separadores, painel vazio e com programa compilado, a 1440 e 900 px: sem texto cortado nem sobreposição; tabs deslizam na horizontal a 900 px |

## Estado

| Item | Estado |
| --- | --- |
| Refinamento do painel de estado | implementado e testado |
| Revisão visual pelo utilizador | pendente |

Observação (anterior a esta alteração, não corrigida): com avisos de verificação, a barra de separadores pode mostrar só «Compilação»/«Verificação» quando a vista é estreita ou o separador está ativo; a confirmar se é intencional.
