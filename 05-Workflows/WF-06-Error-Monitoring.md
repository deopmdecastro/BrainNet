---
workflow_id: WF-06
type: workflow-spec
status: PLANNED
owner:
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, workflows]
---
# WF-06 — Error Monitoring

**Objetivo/responsável:** centralizar incidentes e recuperação; Automation Engineer e QA.

**Trigger/pré-condições:** Error Trigger n8n futuro e eventos de adaptadores; canais e permissões confirmados antes de notificar.

**Entrada/saída:** workflow_id, versão, execution_id, correlation_id, etapa, categoria e causa sanitizada → incidente, estado e ação de recuperação. Excluir headers/corpo integral e dados de contacto.

**Nós/integrações propostos:** trigger → sanitização → registo persistente → deduplicação/agrupamento → notificação autorizada. Monitor de saúde será fluxo separado com endpoints de configuração confiável, nunca URLs arbitrárias do pedido.

**Credenciais/permissões:** acesso de escrita ao registo e envio ao canal permitido, por configurar.

**Idempotência:** workflow_id + execution_id + etapa para incidente; cooldown por serviço/causa para alertas. Não usar associação por posição de array como identidade de serviço.

**Falhas/recuperação:** seguir [[Error-Handling]]; falha de notificação não apaga incidente. Retry de efeitos externos só após reconciliação.

**Testes futuros:** mesma falha repetida, falha do próprio canal, timeout e sanitização de segredos. Aceitação: incidente durável antes da tentativa de envio; alertas sem tempestade de repetições. Estado: especificação.
