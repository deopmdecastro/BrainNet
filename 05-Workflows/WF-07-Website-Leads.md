---
workflow_id: WF-07
type: workflow-spec
status: PLANNED
owner:
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, workflows]
---
# WF-07 — Website Lead Management

**Objetivo/responsável:** preservar e encaminhar pedidos comerciais; responsável comercial por indicar, implementação Automation Engineer.

**Trigger/pré-condições:** endpoint server-side do website com rate limit, validação e autenticação no encaminhamento para n8n. O browser nunca recebe o segredo do webhook. Não existe formulário implementado.

**Entrada/saída:** submission_id, nome, email, necessidade e metadados mínimos → lead NEW, recibo técnico e tarefa de acompanhamento. Marketing opt-in, se existir, é separado do pedido de contacto.

**Nós/integrações propostos:** validação → antispam → registo durável único → fila de notificação → acompanhamento comercial. Honeypot pode complementar, mas não substitui proteção server-side. Destino CRM/base de dados ainda por escolher.

**Credenciais/permissões:** escrita mínima no destino de leads e envio apenas aos destinatários autorizados. Nenhuma credencial ou destinatário foi configurado.

**Idempotência:** submission_id com unicidade transacional; fingerprint deteta ID reutilizado com outro conteúdo. Não usar apenas email como chave do pedido.

**Falhas/recuperação:** não confirmar sucesso antes de registo durável; reenvio mantém ID. Notificação tem estado separado e pode ser repetida após conferir recibo. Processo comercial usa NEW, QUALIFIED, IN_PROGRESS, WON e LOST.

**Testes futuros:** válido/inválido, spam, repetição concorrente, destino indisponível e timeout após gravação. Aceitação: pedido não perdido e nenhuma confirmação falsa. Retenção, acessos, conteúdo da informação ao visitante e eventual confirmação externa exigem definição antes de dados reais. Estado: especificação, sem campanhas ou mensagens enviadas.
