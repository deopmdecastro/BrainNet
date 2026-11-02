---
project_id: BN-WEBSITE-001
type: automation
status: PLANNED
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, automation]
---
# Plano de automação do website

1. [[../../05-Workflows/WF-01-Project-Intake|WF-01]] prepara briefing; disponível com dados sintéticos e por CLI local.
2. [[../../05-Workflows/WF-07-Website-Leads|WF-07]] será a captação comercial após confirmar destino, responsável e retenção.
3. [[../../05-Workflows/WF-05-QA-Approval|WF-05]] prepara revisão de qualidade para um commit; nunca lança o website.
4. [[../../05-Workflows/WF-06-Error-Monitoring|WF-06]] e [[../../05-Workflows/WF-08-Reporting|WF-08]] entram quando existirem dados e operação reais.

Estados comerciais previstos: NEW → QUALIFIED → IN_PROGRESS → WON/LOST. O estado de envio/notificação deve ser separado para evitar interpretar uma tentativa de entrega como contacto comercial efetuado.

Notificações e confirmações externas requerem configuração e autorização próprias; nenhuma mensagem foi enviada nesta entrega.
