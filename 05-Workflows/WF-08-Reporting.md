---
workflow_id: WF-08
type: workflow-spec
status: PLANNED
owner:
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, workflows]
---
# WF-08 — Reporting

**Objetivo/responsável:** consolidar estado e métricas sem confundir ausência de dados com resultado zero; Documentation Manager e Orchestrator.

**Trigger/pré-condições:** manual inicialmente; Schedule Trigger apenas após confirmar cadência e timezone. UTC é o padrão de timestamps desta fundação, sem agendamento ativo.

**Entrada/saída:** período [início, fim), fontes autorizadas e respetivos estados → resumo de projetos, bloqueios, execuções e leads agregados. Cada métrica identifica fonte, cobertura e data de extração.

**Nós/integrações propostos:** obter fontes paginadas → validar cobertura → agregar deterministicamente → preparar Markdown → revisão humana. IA é opcional e não inventa dados ausentes.

**Credenciais/permissões:** leitura mínima por fonte; nenhuma credencial ou canal de envio configurado.

**Idempotência:** período UTC + conjunto de fontes + versão do relatório. Janela fixa evita sobrepor um período móvel de “últimas 24h”. Distinguir relatório preliminar de versão revista.

**Falhas/recuperação:** falha de uma fonte produz relatório parcial explicitamente marcado; não declarar “zero commits” quando a consulta falhou. Recolher novamente a fonte e versionar a correção.

**Testes futuros:** paginação, fronteira temporal, fuso horário, fonte vazia vs falhada e repetição do período. Aceitação: números rastreáveis e nenhuma publicação/envio automático. Estado: especificação.
