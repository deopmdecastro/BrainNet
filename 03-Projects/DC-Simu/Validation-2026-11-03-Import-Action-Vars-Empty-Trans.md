---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-11-03
updated: 2026-11-03
tags: [brainnet, dc-simu, grafcet, fluidsim, import, validation]
---
# Validação — Variáveis de ação inválidas e transição vazia na importação FluidSIM

## Problema (projeto ATEC / revisão de importação)

Erros bloqueantes após importar o GRAFCET ATEC:

1. **Ação … use uma variável válida** nas etapas 25, 45, 115, 183, 187  
   Nomes FluidSIM com `+`/`-` **no meio** (`Y7_E+_Vacuo_On`, `Y8_E-_Vacuo_Off`) falhavam `validGrafcetVariable`, que só aceitava `+/-` no **fim** (`Y0_A+`).

2. **T41 precisa de origem e destino**  
   Transição residual (UUID, `branchType: and-divergence`) sem `from`/`to` e sem `source`.

Causa raiz no importador: em modo desenho (`drawing === true`) o nome original era guardado **sem** passar por `normalizeFluidSimVariable`.

## Alterações (dc-simu)

### `src/grafcet/fluidSim4.ts`
- Sempre aplicar `normalizeFluidSimVariable` ao `address`/`variable` da ação (mesmo em modo desenho).
- O normalizador já preserva só o sufixo pneumático final e troca o resto de caracteres especiais por `_`.

### `src/grafcet/engine.ts`
- `validGrafcetVariable` passa a aceitar `+`/`-` em qualquer posição após o primeiro carácter (`Y7_E+_Vacuo_On` válido) — compatível com projetos já gravados.
- Novo `sanitizeActionVariable` (API estável para futuras migrações / UI).
- Token do parser de condições atualizado para o mesmo padrão de identificadores.
- Transição **totalmente vazia** (sem origem, destino nem `source`) deixa de ser **erro** e passa a **aviso** («pode eliminá-la se for residual»).

## Commits
- `7f88533` — always normalize FluidSIM action variables  
- `18f3b73` — accept industrial +/- ; soft-warn empty transitions ; sanitizeActionVariable  

## Efeito no projeto ATEC
Após atualizar a app e recarregar o projeto:
- As 5 ações com `Y7_E+…` / `Y8_E-…` deixam de gerar erro.
- T41 passa a aviso (ou elimine-a manualmente no editor).
- As notas de importação (transições 9/26/28, 3 iniciais, etc.) continuam informativas; a revisão conclui-se quando não houver **erros** no Diagnóstico.

## Verificação
1. Abrir o JSON ATEC na build com estes commits.
2. Confirmar Diagnóstico sem os 5 erros de variável nem o erro de T41.
3. «Concluir revisão» deve ficar disponível quando só restarem avisos/notas.
4. Reimportar um `.ct` com ações `…E+_…` e confirmar que o nome fica normalizado e válido.

[[FluidSIM-Import]] · [[Design-Principles]] · [[Backlog]]
