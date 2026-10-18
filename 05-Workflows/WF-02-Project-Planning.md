---
workflow_id: WF-02
type: workflow-spec
status: PLANNED
owner:
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, workflows]
---
# WF-02 — Project Planning

**Objetivo/responsável:** converter briefing revisto em tarefas verificáveis; Orchestrator. Pessoa por atribuir.

**Trigger/pré-condições:** pedido interno após intake revisto, versão do briefing e destino de tarefas confirmados. Não há trigger implementado.

**Entrada/saída:** project_id, brief_version, entregáveis e restrições → proposta de tarefas com task_id, dependências, responsável, prioridade e acceptance. Limitar o tamanho do plano por projeto e rejeitar dependências cíclicas.

**Nós/integrações propostos:** trigger interno, validação de contrato, preparação de checklist, revisão humana e adaptador do gestor escolhido. IA é opcional e o output exige validação de esquema; nenhuma chamada configurada.

**Credenciais/permissões:** escrita limitada ao projeto no gestor selecionado; sem credenciais nesta entrega.

**Idempotência:** chave project_id + brief_version + plan_version; criação de tarefas só após gravar intenção e recibo; títulos não são chave única.

**Falhas/recuperação:** guardar proposta antes de criar tarefas; em falha parcial reconciliar task_ids existentes antes de replay. Plano inválido não cria issues de texto livre como fallback.

**Aceitação/testes futuros:** duas submissões do mesmo plano não duplicam tarefas; plano malformado/cíclico é rejeitado; criação parcial recupera sem duplicar; revisão humana mantém rastreabilidade. Estado: especificação, sem JSON executável nem integração ativa.
