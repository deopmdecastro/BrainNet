---
project_id: BN-WEBSITE-001
type: qa
status: PLANNED
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, qa]
---
# Plano de testes do website

| Área | Casos | Evidência esperada |
| --- | --- | --- |
| Contacto | Válido, inválido, repetido, timeout e indisponibilidade n8n | Resultado e identificador sem dados pessoais em logs |
| Segurança | Corpo excessivo, spam, campos extra e segredo ausente | Rejeição server-side e limite de taxa |
| Acessibilidade | Teclado, foco, labels, erros, zoom e leitor de ecrã | Registo manual e relatório automático |
| Conteúdo | Factos, links, metadados e trabalhos autorizados | Checklist revista pelo responsável |
| Responsividade | Mobile, tablet e desktop | Capturas e tarefas concluídas |
| Operação | Build, restauro, rollback e health | Logs da versão/commit e ambiente |

Não há website implementado para testar. Os testes da fundação são separados e constam do [[../../09-Analytics/Foundation-Report|relatório]]. Evidências devem identificar commit e ambiente; um resumo gerado por IA não substitui execução.
