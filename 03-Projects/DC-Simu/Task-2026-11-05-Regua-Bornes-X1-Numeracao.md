---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-05
updated: 2026-11-05
tags: [dc-simu, bornes, regua, pti6, ux]
---
# Régua de bornes: criar vários bornes X1.0, X1.1, X1.2…

## Pedido
Melhorar a função de criar mais de um borne (X1.0, X1.1, X1.2 e seguintes). Reaproveita a funcionalidade `createTerminalStrip` (carimbos 182, `151d471` e `826665e`) em vez de a reescrever do zero.

## Problemas encontrados
- Espaçamento irregular: a posição somava `i*4` além do passo, por isso as folgas cresciam ao longo da régua.
- Série hierárquica: a partir de X1.3 reiniciava em .1 e gerava TAGs feias («X1.1_1»).
- Os clones perdiam a folha ativa (`sheet`), a ordem (`z`) e a cor; num esquema com várias folhas apareciam na folha errada.
- O passo usava a largura da origem (`base.w`), errado se a origem tinha vários pólos.
- Sem pré-visualização das TAGs nem forma clara de escolher entre X1, X2… e X1.0, X1.1…

## Resultado (dc-simu `c6e6c03`)
- `planTerminalStripRefs` (`src/electrical/pti6Strip.ts`, função pura e testada): TAGs consecutivas, a continuar a série, a saltar ocupadas; soltos usam o próximo número livre da família.
- `createTerminalStrip`: passo uniforme (pente encostado = 0 px; soltos = 4 px), sem sobrepor aparelhos da linha, mesma folha/calha/cor/z, encaixe automático na calha DIN do borne de origem (`snapToRails`), um único `commitHistory`.
- Inspetor (`TerminalStripControls`): seletor «X1, X2, X3…» / «X1.0, X1.1…», quantidade com atalhos (2, 4, 6, 8, 12, 16), pré-visualização das TAGs e Enter para criar.
- Teste novo `test:terminal-strip` (15 verificações), ligado ao `test:ci`.

## Pendências
- Validar no tablet real a régua em calha DIN (encaixe e 3D) e num esquema com várias folhas.
- O borne de origem rodado (90°) gera a régua na horizontal; a régua vertical não está tratada.
