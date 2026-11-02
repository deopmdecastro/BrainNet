---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, qa, admin, saas, planos, comentarios, ladder]
---
# Administração, SaaS, comentários e compilação Ladder — 2026-10-26

## Pedido

1. Criar funcionalidades e melhorar algumas telas da administração.
2. Componentes: melhorar a gestão, com as ações arquivar, bloquear e eliminar.
3. Utilizadores: melhorar e criar a gestão de utilizadores.
4. Transformar o simulador em SaaS:
   - criar planos pagos e um plano gratuito;
   - separar os acessos de acordo com o plano;
   - o administrador gere os planos, define os preços e ativa ou desativa os cartões de preço da página inicial.
5. Comentários nos projetos: nos projetos partilhados, os utilizadores trocam comentários.
6. Ladder: funcionalidade «Compilar».

## Problemas encontrados

| # | Problema | Causa |
| --- | --- | --- |
| 1 | Componentes só podiam ser ativados ou desativados | `component_settings` tinha apenas `enabled` |
| 2 | Não havia planos nem limites | Todas as contas tinham acesso total |
| 3 | A administração de utilizadores não tinha pesquisa por nota, filtros por plano, ações em lote nem bloqueio no Supabase | — |
| 4 | Não era possível conversar dentro de um projeto partilhado | — |
| 5 | O Ladder só tinha lint por bloco | Não havia uma verificação global de chamadas e referências entre o Main, os FC e os blocos |
| 6 | A cena 3D da página inicial lançava «Borne PLC1.I1 em falta» (bug anterior a este pedido) | Os bornes do LOGO! passaram a `I0.0`/`Q0.0` e a cena usava os nomes antigos |

## Implementação

**DC-Simu, commit `e6e6da2` (carimbo #55).** Detalhes em [SAAS-PLANOS-ADMIN.md](./dc-simu/docs/SAAS-PLANOS-ADMIN.md).

### Regras partilhadas

`src/saas/platformCore.mjs` é usado pelo navegador e pelo servidor (DC-ADR-028). Define:
- os planos Free, Pro, Escola e Empresa;
- as funcionalidades e os limites de cada plano;
- a validação dos preços (um só destaque, preços não negativos);
- a expiração do plano, que devolve a conta ao plano por omissão;
- os estados dos componentes e as permissões dos comentários.

### Servidor (`server/saas.mjs`)

- **Tabelas novas:** `platform_settings`, `plan_requests` e `project_comments`.
- **Colunas novas:** `plan`, `plan_expires_at` e `admin_note` em `users`; `status` e `min_plan` em `component_settings`.
- **Limites:** HTTP 402 em `POST /api/projects` e nos convites (DC-ADR-030).
- **Rotas:** preços públicos (`/api/pricing`), pedidos de plano, e comentários com um limite de 20 por minuto.

### Supabase

A migração `20261026120000_saas_plans_comments.sql` inclui:
- RLS e o trigger `enforce_project_limit`;
- `protect_profile_role`, que impede um utilizador de mudar o próprio plano ou o estado de bloqueio;
- recusa de login para contas bloqueadas.

### Modo local

`src/auth/localSaas.ts` aplica as mesmas regras com o `localStorage`, mas apenas na interface (DC-ADR-030).

### Administração

- **Separador «Componentes»:**
  - bloquear (exige um motivo), arquivar, eliminar e repor (DC-ADR-031);
  - plano mínimo por componente;
  - filtros, ações em lote e CSV.
- **Separador «Utilizadores»:**
  - pastilhas com a contagem por plano;
  - pesquisa por nome, e-mail ou nota, filtros por papel, estado e plano, e ordenação;
  - «Plano…» para o plano, o fim do período e a nota interna;
  - «Detalhes», bloqueio com confirmação e ações em lote.
- **Separador novo «Planos e preços»:**
  - edição de cada plano: preços, funcionalidades, limites, texto do botão, linhas extra e ordem;
  - visibilidade de cada cartão na página inicial, plano destacado e secção «Preços» global;
  - plano por omissão e moeda;
  - pedidos de plano com aprovação e recusa (DC-ADR-029).

### Página inicial

A nova secção `#precos` aparece na navegação e tem uma alternância mensal/anual. Mostra apenas os cartões que o administrador deixou visíveis.

### Painel do utilizador

- O cartão «O seu plano» mostra o plano, o uso face aos limites e as funcionalidades.
- O utilizador pode pedir outro plano ou cancelar o pedido.
- «Novo projeto» e «Convidar» avisam quando o plano não permite.

### Separação de acessos na interface

- **Vistas que mostram um aviso no lugar do conteúdo:** Ladder, GRAFCET, Visualização 3D e o separador Depuração (incluindo F9/F10).
- **Ações que mostram um aviso de upgrade:** importação FluidSIM, PDF e Excel.

### Comentários (`src/comments/ProjectComments.tsx`)

- **Onde se abrem:** pelo botão «Comentários» no editor e pelo menu «⋯» de cada projeto no painel, incluindo os partilhados.
- **Âncoras:** Geral, Esquema, 3D, Ladder e GRAFCET.
- **Permissões:** o autor edita o seu comentário; o autor, o proprietário e o administrador eliminam ou marcam como resolvido.
- **Atualização:** a lista atualiza a cada 20 s.

### Compilar no Ladder (`src/ladder/ladderCompile.ts`, DC-ADR-032)

- **Verificações locais por bloco:** as etiquetas LBL/JMP são locais a cada bloco.
- **Referências cruzadas globais:** bobinas duplicadas entre blocos, SET/RESET e endereços lidos e nunca escritos.
- **Chamadas:** CALL inexistente, recursão direta, ciclos de chamadas, CALL para um OB e FC nunca chamado.
- **Interface:**
  - botão «Compilar» (Ctrl+Shift+B) e separador «Compilação»;
  - aviso «programa alterado desde a última compilação», com base numa impressão digital do programa;
  - opção «Bloquear RUN com erros».

### Correção da página inicial

`LandingShowcase.tsx` usa agora os bornes `I0.0`, `I0.1`, `Q0.0`, `Q0.0·2`, etc.

## Evidência

| Verificação | Resultado |
| --- | --- |
| `npx tsc -b` | Sem erros |
| `npm run test:ci` (com `Monta-Carga.ct`) | Passa (EXIT 0), incluindo o novo `test:saas` com 58 verificações |
| `npm run test:server` | 166 passam, 0 falham (53 no bloco `saas:`) |
| `vite build` (heap de 3 GiB) | Concluído |
| `admin-saas-ui-smoke` (Playwright, modo local) | 22 verificações (lista abaixo) |
| Percursos UI existentes | `ladder-blocks-ui` 25, `editors-sweep-ui` 19, `grafcet-ui`, `grafcet-construction-ui` 18, `grafcet-modals-ui` 23 e `editor3d-ux-ui`: todos passam, sem exceções |
| Capturas revistas | Preços na página inicial, «Planos e preços», «Utilizadores», «Componentes», comentários e «Compilação» |

O `admin-saas-ui-smoke` verifica:
- na página inicial: os cartões por omissão, a ligação «Preços», o destaque e a alternância mensal/anual;
- na administração: os planos guardados, o plano e a nota do utilizador, e o bloqueio e desbloqueio com motivo;
- que a página inicial reflete as escolhas do administrador;
- o pedido de plano pendente e a sua aprovação, que ativa o Pro;
- os comentários bloqueados no Free, a publicação de um comentário e a sua resolução;
- a compilação Ladder;
- que não há erros de página.

## Estado

| Item | Estado |
| --- | --- |
| Planos, preços, cartões da página inicial e pedidos de plano | implementado e testado |
| Separação de acessos (servidor/Supabase/interface) | implementado e testado no servidor e no modo local. No Supabase está preparado: falta executar a migração e testá-la num projeto real. |
| Pagamento real | preparado: sem gateway, a aprovação é manual |
| Gestão de componentes e de utilizadores | implementado e testado |
| Comentários | implementado e testado |
| Compilar no Ladder | implementado e testado |
| Aprovação pelo responsável | pendente |
| Deploy Vercel | não verificado |

Pendências:
- integrar um gateway de pagamento com webhooks;
- executar a migração Supabase;
- decidir o plano por omissão para as contas existentes: por omissão é o Free, que retira partilha, depuração e PDF/Excel;
- notificações de comentários;
- revogar o token GitHub usado nesta sessão.
