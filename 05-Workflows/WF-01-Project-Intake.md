---
workflow_id: WF-01
type: workflow-spec
status: TESTED_LOCAL
owner:
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, workflows]
---
# WF-01 — Project Intake

**Objetivo:** preparar registo e briefing para revisão. Responsável previsto: Orchestrator, com Automation Engineer para a implementação; pessoa por atribuir.

**Trigger/pré-condições:** JSON manual no CLI ou fixture n8n. Node 22+ no CLI; n8n 2.43.7 com Code v2 no export. Não há webhook público.

**Entrada:** `schema_version: 1`, event_id estável e project com name, type, problem, audience, objectives e expected_result. Campos extra são rejeitados. Exemplo: `examples/project-intake.json`. Limites implementados em `automation/lib/contracts.mjs`.

**Saída:** registo IDEA, responsável/prazo vazios, briefing Markdown escapado, `mode: prepare_only`. N8n devolve output sem gravar no cofre. CLI permite `--persist` num diretório local reservado.

**Nós/credenciais:** Manual Trigger → Synthetic Input (Code) → Validate and Prepare (Code). Sem credenciais, APIs, IA ou notificações.

**Validação/falhas:** esquema, tipos, tamanhos, listas, IDs e tipos de projeto; erro interrompe a execução. Controlo de fluxo vem do código, nunca de flags do pedido.

**Idempotência:** CLI usa hash SHA-256 de event_id para o diretório e fingerprint dos dados normalizados; mesmo conteúdo devolve duplicate sem editar ficheiros; conteúdo diferente gera conflito. Rename atómico confirma diretório completo. Output n8n não tem idempotência persistente porque não tem efeitos externos.

**Testes:** inputs inválidos, flags perigosas, escape Markdown, repetição após edição humana e 12 chamadas concorrentes; workflow importado/executado isoladamente.

**Recuperação:** [[Error-Handling]]. Rever rascunho e promover manualmente; manter recibos enquanto houver possibilidade de replay. Política de expiração não implementada.

**Pendente:** adaptador autenticado, registo no sistema de gestão escolhido e notificações autorizadas. Estado: implementado/testado localmente, sem aprovação para dados reais.
