---
project_id: BN-DCSIMU-001
type: validation
status: TESTED
created: 2026-11-04
updated: 2026-11-04
repos: [dc-simu, BrainNet]
tags: [dc-simu, auth, conta, build]
---
# Correção de build: `src/account.tsx`

## Resultado
O commit `b64a1aa` (login/criar conta) deixou ~50 linhas da versão antiga do ecrã de login coladas após o novo `AuthScreen`, causando erros TS1128/TS1005 e impedindo o build. Removidas no commit `f0028d9` (dc-simu).

## Estado da tarefa Login/Conta/Esquadria/Imagens
Implementada em `b64a1aa` + `c5d8607`; ver [[Task-2026-11-04-Login-Conta-Esquadria-Imagens]] e [[Task-2026-11-04-Conta-Exportacao-Editor]]. Nenhuma funcionalidade reescrita; só remoção do código morto.

## Verificações
- `npm run typecheck`: erro antes, passou depois.
- `npm run build`: passou (PWA, 123 entradas precache).
- Não executado nesta sessão: smoke SaaS e teste visual no navegador.

## Pendências
- Smoke SaaS e verificação visual de Entrar/Criar conta, logótipo e imagem no canvas.
- Revogar o token GitHub partilhado em chat.
