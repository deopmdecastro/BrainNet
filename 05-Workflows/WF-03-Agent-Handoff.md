---
workflow_id: WF-03
type: workflow-spec
status: TESTED_LOCAL
owner:
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, workflows]
---
# WF-03 — Event Router e Agent Handoff

**Objetivo/responsável:** transformar contexto normalizado num pacote de trabalho para revisão; Orchestrator e Automation Engineer.

**Trigger/pré-condições:** fixture manual; n8n 2.43.7. O adaptador de cada origem terá de autenticar e autorizar o evento antes de construir este contrato.

**Entrada:** schema_version, event_id, source, project_id, objective, files relativos, acceptance e constraints. `examples/agent-handoff.json` mostra o contrato normalizado; não aceita diretamente webhooks GitHub/Figma brutos.

**Router:** manual/GitHub → Orchestrator; VSCode → Developer; Figma → UX/UI; report → Documentation; health → QA; deploy → revisão humana. Não é classificação por IA.

**Saída:** papel sugerido, contexto marcado untrusted_data, result_contract e `executable: false`. Pedidos deploy recebem REQUIRES_HUMAN_APPROVAL; nenhum comando é produzido ou executado.

**Nós/credenciais:** Manual Trigger e Code; nenhuma credencial. Os oito papéis ficam disponíveis para seleção manual, sem oito processos iniciados.

**Validações/idempotência:** fontes permitidas, limites, listas e rejeição de caminhos absolutos/traversal. Não lê os ficheiros e não garante que existem; agente/revisor deve verificar acesso e symlinks. Sem efeito externo, logo sem recibo persistente nesta versão.

**Testes/recuperação:** todas as origens, paths inválidos, campos de autorização injetados e batch com contexto separado; execução n8n isolada. Corrigir input e repetir; pacote antigo só deve ser executado uma vez pelo responsável.

**Pendente:** adaptadores autenticados, distribuição no Maestri e validação dos resultados devolvidos. Não existe API Maestri invocada por este fluxo.
