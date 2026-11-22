---
type: validation
status: IMPLEMENTED_TESTED_LOCAL
created: 2026-11-22
updated: 2026-11-22
tags: [dc-simu, projeto, ficheiros, validacao]
---
# Salvar descarrega o projeto nativo .dc

## Resultado e ficheiros

O botão «Salvar» da barra do simulador descarrega o projeto como
`dc-simu-<nome-do-projeto>.dc`, usando o exportador nativo existente: cabeçalho
`DCSIMU` versão binária 1, seguido do JSON integral, com MIME `application/x-dcsimu`.
Ctrl+S e «Guardar projeto» no menu usam a mesma ação. A mensagem e a dica do botão
passam a identificar o download.

Implementação em `dc-simu/src/components/Toolbar.tsx`; regressão funcional em
`dc-simu/scripts/save-dc-ui-smoke.mjs`. A persistência existente continua no mesmo
percurso. Não foi criado outro formato de ficheiro.

## Verificações e evidências

- `node scripts/save-dc-ui-smoke.mjs`: 11 verificações aprovadas, com downloads reais
  pelo botão, pelo atalho e pelo menu a 390 px; validação do nome, extensão,
  cabeçalho, conteúdo integral e reabertura pelo controlo «Abrir» da aplicação.
- O teste confirma a preservação da posição 3D e do estado do manipulador.
- Ambiente de teste isolado em `http://127.0.0.1:5182`, sem pedidos externos.
- Ficheiros sintéticos em `dc-simu/runtime/save-dc/`: `botao.dc`, `atalho.dc` e `menu.dc`.
- Aplicação: `npm test`, `npm run typecheck` e `npm run test:hooks` aprovados.
- Cofre: `npm test` aprovado, 45 testes. `npm run check` executado; mantém erros
  documentais anteriores fora desta alteração, detalhados em `runtime/checks/foundation.json`.

## Estado e pendências

Implementado e testado localmente. Sem pendências funcionais identificadas neste
âmbito. Versionado em `dc-simu@ba0368f` e enviado para `origin/main` a pedido do
utilizador em 2026-11-22. Sem revisão independente, aprovação de publicação ou deploy.
