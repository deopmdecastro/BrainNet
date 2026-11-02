---
type: sop
status: READY
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, errors]
---
# Falhas e recuperação

| Categoria | Comportamento proposto para adaptadores reais |
| --- | --- |
| Validação | Rejeitar sem retry; devolver erro de campo sem ecoar o pedido completo |
| Autenticação/autorização | Rejeitar; nenhum efeito externo; auditar metadados mínimos |
| Conflito de ID | Parar; comparar dados; manter recibo original |
| Timeout/429/5xx em leitura | Até 3 tentativas, backoff e jitter; respeitar Retry-After |
| Timeout em escrita | Consultar recibo pelo identificador antes de repetir |
| Configuração/credencial | Bloquear até correção; não insistir automaticamente |
| Falha de disco | Corrigir a causa, depois replay com mesmo evento; não promover staging incompleto |

O código entregue falha com erro no Code node/CLI em inputs inválidos. Não há retries ou notificações externos implementados. O CLI guarda briefing/record/receipt num diretório de staging e só confirma por rename; se o processo morrer antes do commit, a pasta `.pending-*` pode ficar para inspeção manual. Se receipt estiver corrupto, parar e restaurar; não substituir pelo novo pedido.

Logs operacionais futuros devem conter event_id, workflow_id, versão, timestamp, etapa, estado e causa sanitizada. Não guardar headers, tokens, corpo integral ou código de cliente por defeito. Retenção depende de política aprovada; na instância ativa o histórico não foi alterado.

Não usar `continueRegularOutput` de forma a transformar um erro em sucesso. Separar resultado de transporte, resultado de processamento e efeito confirmado. Um dispatch aceite não confirma deploy concluído.
