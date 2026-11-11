---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED
created: 2026-11-11
updated: 2026-11-11
tags: [dc-simu, revisao, servidor, ladder, desempenho, supabase]
---
# Revisão da plataforma DC-Simu

## Pedido
Verificar e aplicar melhorias no que já existe na plataforma e corrigir erros.

## Resultado

### Implementado e testado
- **Desempenho (causa principal):** o traçado dos cabos do nativo estrela-triângulo era recalculado em cada chamada ao backend local e ao listar projetos de um administrador no Supabase. A Administração demorava cerca de 83 s a abrir em desenvolvimento, com a página bloqueada. As sementes passam a ser calculadas uma vez por sessão e o planeador deixou de ordenar todos os candidatos. Traçado comparado com o algoritmo anterior: igual nos dois projetos nativos, cerca de 15 vezes mais rápido (2954 ms → 200 ms).
- **Contas fixas do servidor:** mudar o e-mail de uma conta fixa impedia o servidor de a reencontrar no arranque (falha sem senha inicial, ou conta recriada com a senha inicial). O e-mail passa a estar bloqueado, no servidor e na página da conta. O arranque deixou de repor o nome alterado pelo titular.
- **API:** pedidos sem corpo deixaram de dar erro 500; JSON inválido e excesso de tamanho respondem em JSON, sem pilha de chamadas; guardar sem conteúdo devolve 400.
- **Servidor:** recurso de build em falta devolve 404 em vez do `index.html`; paragem limpa em SIGTERM; o contentor arranca com `node` diretamente.
- **Ladder:** network desativada deixou de escrever `false` nas bobinas e de repor temporizadores; ramo vazio em paralelo deixou de congelar os flancos P/N; a deteção de tags inclui o 2.º operando dos comparadores.
- **Minimapa GRAFCET:** a cópia deixou de duplicar os identificadores das etapas, transições e textos.
- **Testes:** `wire-isolation-markers-lace-smoke` não chegava ao fim por importações em falta; limpeza do `test:server` corrigida no Windows; 15 testes verdes que estavam fora entraram no `test:ci`; novo `npm run dev:ui-test` (Vite sem Supabase).

### Preparado, não aplicado
- `supabase/proposals/20261111120000_harden_function_privileges.sql`: resolve os avisos do Security Advisor sobre `search_path` e sobre funções `SECURITY DEFINER` executáveis sem sessão. Fica fora de `supabase/migrations/` para um push não a aplicar. Não foi executada em nenhuma base de dados.

## Verificação
Node 24.13.1, Windows.
- `tsc -b`: passa.
- `test:ci`: passa, já com os testes novos.
- `test:server`: 188 passaram, 0 falharam. As novas verificações falham contra o servidor anterior.
- `vite build`: passa.
- `npm audit --omit=dev`: 0 vulnerabilidades.
- Testes de browser, com `--mode uitest`: pelo menos 22 de 56 passam.

## Pendências
- **UI-SUITES-03:** 34 testes de browser continuam a falhar. Os que foram analisados procuram interfaces antigas (por exemplo, 14 modelos importados quando o catálogo tem 17), mas nem todos foram analisados e alguns podem esconder defeitos reais.
- **SUPA-SEC-01:** aplicar a proposta SQL exige autorização com pessoa, commit, ambiente, data e âmbito.
- **SUPA-SEC-02:** `public.profiles` é legível por qualquer conta autenticada, incluindo `admin_note`, e-mail e plano. Requer decisão de desenho (tabela separada ou RPC de administração).
- **SUPA-SEC-03:** ativar a proteção contra palavras-passe comprometidas no painel do Supabase.
- **Vercel:** os erros de produção não foram consultados; o conector não tem autorização neste âmbito.
- **Ambiente de teste:** o primeiro varrimento de browser correu com `.env.development.local` e apontava para o Supabase real, sem credenciais. Foi interrompido após 8 testes. Não foram consultados os registos do Supabase.

Por aprovar: esta entrega não foi aprovada para publicação.
