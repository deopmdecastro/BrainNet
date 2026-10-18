---
project_id: BN-DCSIMU-001
type: qa
status: PLANNED
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, dc-simu, qa]
---
# Validação do DC-Simu

Executar os comandos do produto na pasta `C:\Users\Deogracia de Castro\Documents\Projetos\dc-simu\dc-simu`. Os scripts existem no package.json. Não foram executados no registo inicial; a avaliação de IA de 2026-10-18 executou o baseline abaixo.

## Baseline da avaliação de IA

- `npm test`: falhou por não encontrar a dependência declarada @supabase/supabase-js; não comprovou os casos de simulação.
- `npm run typecheck`: falhou com dependências em falta (React Router, cliente Supabase e pacotes Font Awesome), além de TS7006 em src/supabase/supabaseBackend.ts:114. Restaurar as dependências e repetir antes de classificar falhas residuais.
- Não foram alterados motores, backend ou modelos nesta avaliação. Ver ENV-01 em [[Backlog]] e [[AI-Tooling-Assessment|o relatório]].

## Verificações previstas

| Área | Verificação prevista | Evidência esperada |
| --- | --- | --- |
| Tipos e build | npm run typecheck; npm run build | Resultado e commit; identificar alterações geradas em dist |
| Motores | npm test | Casos de continuidade, Ladder e sequência de fases |
| Interação e movimento | npm run test:interactables; npm run test:motion | Resultado dos casos existentes |
| API e permissões | npm run test:server | Resultado em dados temporários, sem alterar projetos reais |
| Percurso manual | Criar circuito, alternar 2D/3D/Ladder, simular e guardar/reabrir | Registo dos passos, resultado e ambiente |
| n8n | Validar contrato, autenticação, destino, sucesso e falha | Resposta coerente e identificador de execução; ausência de falsos sucessos |
| Copilot | Confirmar leitura das instruções e concluir uma tarefa pequena | Conta/plano identificados, referências às instruções e diff revisto |
| Piloto de IA | Mesmas três tarefas e critérios em ferramentas selecionadas | Tempo, correções, consumo e custo registados; nenhuma sugestão tomada como teste passado |

## Evidências anteriores
A [revisão de integração](../../../dc-simu/n8n-integration-review.md) regista uma execução de saúde bem-sucedida após correção. O [guia de infraestrutura](../../../dc-simu/dc-simu/infra/n8n/README.md) documenta verificações anteriores do sandbox e SearXNG. Nenhuma delas comprova o envio GRAFCET completo ou o estado atual de todos os serviços.

## Validação do registo no BrainNet
Verificar frontmatter, ligações internas e existência dos caminhos locais. Executar `npm test` e `npm run check` na raiz do BrainNet e comunicar os resultados da execução. Estes checks validam a fundação e a documentação, sem substituir os testes do produto acima.

[[Project-Brief|Briefing]] · [[Requirements|Requisitos]].
