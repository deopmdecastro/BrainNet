# BraiNet OS

Fundação reutilizável da BraiNet, organizada no próprio cofre Obsidian. Comece por [[00-Dashboard/Home|Home]] ou abra [Home](00-Dashboard/Home.md).

Inclui papéis de agentes, modelos de projeto, plano do website e uma biblioteca de automações. O website está em discovery; dados empresariais em falta estão identificados nas notas.

## Usar agora

Requer Node.js 22 ou superior. Sem dependências npm nem instalação adicional:

```powershell
node scripts/build-workflows.mjs
node --test tests/*.test.mjs
node scripts/check-foundation.mjs
node scripts/intake.mjs --input examples/project-intake.json
```

O último comando apenas mostra o rascunho. Para guardar um exemplo local, acrescente `--persist`. O registo e o briefing ficam em `runtime/intake/<hash>/`; repetir o mesmo evento não sobrescreve edições humanas. Um identificador repetido com conteúdo diferente produz `IDEMPOTENCY_CONFLICT`.

## n8n local

Instância detetada: `http://localhost:5678`, versão **2.43.7**. Não foram alterados workflows, credenciais ou definições dessa instância.

Os três ficheiros em [automation/n8n/workflows](automation/n8n/workflows) são executáveis por trigger manual, inativos e sem acessos externos. Importar no editor cria cópias novas; executar manualmente mostra dados sintéticos. Instruções: [guia n8n](automation/n8n/README.md).

## Estado da entrega

- Implementado: organização Obsidian, contratos, intake local com idempotência, roteamento de contexto e avaliação QA.
- Testado: contratos, concorrência, preservação de edições e execução dos três workflows em n8n isolado (ver [relatório](09-Analytics/Foundation-Report.md)).
- Preparado: oito especificações de workflows e papéis reutilizáveis de agentes.
- Pendente: ligação autenticada dos eventos reais, importação na instância em uso, agentes Maestri ativos e decisões de negócio do website.

Não há execução de IA, envio de mensagens, publicação nem deploy nestes fluxos. O output n8n é um rascunho; a persistência local pertence ao CLI e ainda não está ligada ao n8n.
