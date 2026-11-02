---
type: registry
status: ACTIVE
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, workflows]
---
# Biblioteca de workflows

| ID | Especificação | Implementado | Testado | Ativação |
| --- | --- | --- | --- | --- |
| WF-01 | [[WF-01-Project-Intake]] | Contrato, CLI persistente e n8n manual | Local e n8n isolado | Sem entrada real |
| WF-02 | [[WF-02-Project-Planning]] | Especificação | Não | Pendente |
| WF-03 | [[WF-03-Agent-Handoff]] | Pacote de contexto e router por origem | Local e n8n isolado | Sem controlo de agentes |
| WF-04 | [[WF-04-Documentation-Sync]] | Especificação | Não | Pendente |
| WF-05 | [[WF-05-QA-Approval]] | Avaliação de evidência declarada | Local e n8n isolado | Sem aprovação/deploy automático |
| WF-06 | [[WF-06-Error-Monitoring]] | Especificação | Não | Pendente |
| WF-07 | [[WF-07-Website-Leads]] | Especificação | Não | Pendente |
| WF-08 | [[WF-08-Reporting]] | Especificação | Não | Pendente |

Exports em `automation/n8n/workflows/` têm versão alvo 2.43.7 e só usam nós base Manual Trigger, Code e Sticky Note. Foram importados apenas num contentor descartável; a instância do utilizador permanece sem alterações.

Preparado = documentação/contrato. Implementado = ficheiro executável presente. Testado = evidência identificada. Aprovado = decisão explícita do responsável para um artefacto e âmbito específicos. Nenhum fluxo foi aprovado para dados reais.

[[DC-SIMU-Review]] · [[Error-Handling]] · [[Sources]]
