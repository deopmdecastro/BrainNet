---
type: sop
status: READY
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, intake]
---
# Intake de projetos

1. Registar pedido com nome, problema, público, objetivos e resultado esperado.
2. Usar contrato v1 e event_id estável (6–64 caracteres; letras/números/_/-). Um novo pedido recebe novo ID; uma tentativa repetida conserva o ID.
3. Executar o CLI em preview. Acrescentar `--persist` apenas quando se pretender guardar o rascunho local.
4. Rever a pasta devolvida em `runtime/intake/`. Nunca promover exemplos sintéticos como projetos reais.
5. Atribuir responsável, prioridade, âmbito e próxima ação. Promover manualmente para `03-Projects/` usando o modelo.
6. Atualizar dashboard e estado após revisão.

Em conflito de idempotência, parar e comparar os dois pedidos. Não apagar o recibo para forçar uma repetição. Se houver falha de disco, repetir com o mesmo ID após corrigir a causa; diretórios `.pending-*` de processos interrompidos não são registos confirmados. A promoção para o cofre não é automática.
