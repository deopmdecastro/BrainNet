---
workflow_id: WF-05
type: workflow-spec
status: TESTED_LOCAL
owner:
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, workflows]
---
# WF-05 — QA e Release Review

**Objetivo/responsável:** preparar decisão de qualidade para um commit e ambiente; QA/Security, com aprovação pelo responsável da BraiNet.

**Trigger/pré-condições:** fixture manual; n8n 2.43.7. Inputs reais exigem identidade, origem e acesso à evidência confirmados.

**Entrada:** schema_version, event_id, project_id, commit SHA de 40 caracteres, environment, checks com name/passed/evidence e critical_findings inteiro não negativo. `examples/release-review.json` é ilustrativo e usa SHA nulo de teste.

**Saída:** BLOCKED para ausência de testes, falhas ou findings críticos; APPROVAL_PENDING no restante. Sempre `authorized: false`, `deployed: false`, `evidence_verified: false`.

**Nós/credenciais:** Manual Trigger e Code. Sem credenciais, API de CI ou deploy. O fluxo não verifica se o SHA existe nem consulta as evidências; isso pertence à revisão humana/futura integração.

**Validação/idempotência:** tipos estritos, evidência textual não vazia, nomes únicos e rejeição de campos extra como approved. Sem efeito externo nem aprovação persistida.

**Testes:** vazio, falha, finding crítico, booleano textual, evidência vazia, duplicação e staging/production com QA verde ainda não autorizado; importação/execução isolada.

**Recuperação:** corrigir causa, voltar a executar os testes do commit e gerar nova proposta. Mudança de commit invalida revisão anterior. A cobertura tem de ser conferida pelo revisor; a lista enviada pode ser incompleta.

**Pendente:** verificação de artefactos de CI e registo de aprovação humana ligado a commit/ambiente. Não existe executor de deploy.
