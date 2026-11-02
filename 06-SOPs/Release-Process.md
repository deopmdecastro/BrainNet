---
type: sop
status: READY
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, release]
---
# Processo de release

1. Fixar commit/versão e ambiente; reunir QA e checklist.
2. Revisor humano verifica evidências, cobertura, falhas e plano de rollback.
3. Responsável autoriza explicitamente aquele commit e ambiente. Registar pessoa, data UTC e âmbito; qualquer alteração exige nova revisão.
4. Operador autorizado publica pela ferramenta configurada e verifica o resultado final. Aceitação HTTP de um dispatch não prova sucesso do deploy.
5. Verificar smoke tests, disponibilidade e formulário. Em falha, executar rollback previsto e abrir incidente.

Não existe executor de deploy nesta fundação. Autenticação de webhook, nome de utilizador num payload, `auto`, `via_token`, resultado verde e saída de IA não concedem autorização de produção.
