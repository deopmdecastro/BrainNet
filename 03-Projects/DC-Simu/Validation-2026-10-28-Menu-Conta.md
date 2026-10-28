---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_LOCAL
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, account, ui, accessibility, responsive]
---
# Menu da conta — identidade, ações e acessibilidade

## Pedido e resultado

Melhorar o menu de conta mostrado pelo utilizador, mantendo as ações e as
permissões existentes. Implementado no commit
`c67ab1623e730302c78a44e04d3280c96227b658`, sobre a integração documentada em
[[Validation-2026-10-28-Integracao-Docker-Vercel]].

- Cartão branco opaco, hierarquia e contraste ajustados, avatar centrado,
  nome/email legíveis e papel discreto junto à identidade.
- «Gerir conta» em azul suave, ações alinhadas e grupo «Ligações» para
  Supabase/n8n, preservando os seus modais.
- Projetos sem duplicação nos contextos administração, conta e contribuições;
  logout separado e acessível, com scroll do corpo em ecrãs baixos.
- Rodapé baseado no backend efetivo; configuração não é prova de ligação.
- Foco inicial, Escape com retorno ao avatar, fecho por clique fora e ao sair
  com Tab. Autenticação, operações de dados e permissões mantidas.

## Ficheiros

`src/components/AccountControls.tsx`: estrutura, callbacks e foco.
`src/styles/dx.css`: estilos consolidados do menu.
`release-stamp.json`: versão `r87`.

## Verificações e evidências

| Verificação | Resultado |
| --- | --- |
| Aplicação: `npm run typecheck` | Passou |
| Aplicação: `npm test` e `npm run test:style` | Passaram |
| BrainNet: `npm test` | 45 testes passaram |
| Revisão independente | PASS em 1440×900, 768×1024, 375×812 e 360×480 |
| Teclado e layout | Escape/foco, clique fora, Projetos único, nome/email longos, papel user e logout acessível; sem transbordo ou erros JavaScript |
| Docker local | Build passou; imagem em execução com revisão `c67ab16`, dados e configuração preservados |
| Smoke na imagem final | Menu novo, estado de sessão, largura a 390 px, Escape e retorno de foco passaram, com sessão sintética e mutações bloqueadas |

A pré-visualização usa o componente real com dados sintéticos, sem sessão real,
e foi removida da aplicação antes do build. Não foram usadas credenciais nem
testadas operações de backend. Capturas finais do contexto do editor em
`runtime/account-menu/menu-1440.png` e `runtime/account-menu/menu-390.png`;
avaliação, ecrã baixo e texto longo em `runtime/account-menu/evaluation/`.

A avaliação foi feita por outro agente com o modelo herdado; não havia modelo
de outro fornecedor disponível. As duas falhas geométricas preexistentes da
validação de integração não foram alteradas por esta tarefa.

`http://localhost:3000/version.json` confirmou o build
`c67ab1623e730302c78a44e04d3280c96227b658.r87.mvsedw21`. A imagem final é
`sha256:4901c9b68192798a7c08cc96bded3fc553c0780f74016c8e6b483fc3e075004d`.

## Estado de entrega

Preparado, implementado e testado no Docker local. Publicação
Vercel pendente de aprovação com pessoa, commit, ambiente, data e âmbito,
conforme o AGENTS.md. O candidato passa a ser `c67ab16`, incluindo a integração
anterior e o refinamento do menu. Não foram executadas migrações nem alteradas
configurações de serviços externos.
