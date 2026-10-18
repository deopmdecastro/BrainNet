---
type: sop
status: READY
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, process]
---
# Estados de projeto

Fluxo: IDEA → DISCOVERY → PLANNING → DESIGN → DEVELOPMENT → QA → APPROVAL → DEPLOYMENT → MONITORING → COMPLETED. A automação é uma área de trabalho que acompanha design, desenvolvimento e QA.

| Estado | Entrada | Saída |
| --- | --- | --- |
| IDEA | Pedido com problema e resultado esperado | Intake revisto e responsável indicado |
| DISCOVERY | Pedido aceite para análise | Contexto, riscos e perguntas críticos resolvidos |
| PLANNING | Requisitos suficientes | Âmbito, tarefas, dependências e aceitação revistos |
| DESIGN | Plano e percursos | Especificações e estados implementáveis |
| DEVELOPMENT | Tarefas prontas e design suficiente | Incremento verificável e evidências técnicas |
| QA | Versão e ambiente identificados | Resultados revistos e falhas críticas resolvidas |
| APPROVAL | QA suficiente para decisão | Aprovação explícita do artefacto/commit e ambiente |
| DEPLOYMENT | Aprovação válida e janela definida | Publicação verificada ou rollback registado |
| MONITORING | Versão publicada | Métricas e incidentes revistos no período acordado |
| COMPLETED | Entrega aceite e documentação transferida | Arquivo e manutenção definida |
| BLOCKED | Dependência impede o avanço | Dependência resolvida e retorno ao estado anterior |

BLOCKED exige motivo, responsável pela resolução, próxima ação e estado de retorno. Falhas de QA regressam a DEVELOPMENT ou DESIGN com registo da razão. Alterações após aprovação invalidam a aprovação daquele commit. Datas vazias significam não acordadas; não gerar prazos fictícios.
