---
project_id: BN-DCSIMU-001
type: qa
status: PLANNED
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, dc-simu, qa]
---
# Validação do DC-Simu

Executar os comandos do produto na pasta `C:\Users\Deogracia de Castro\Documents\Projetos\dc-simu\dc-simu`. Os scripts existem no package.json; não foram executados ao registar o projeto no BrainNet.

| Área | Verificação prevista | Evidência esperada |
| --- | --- | --- |
| Tipos e build | npm run typecheck; npm run build | Resultado e commit; identificar alterações geradas em dist |
| Motores | npm test | Casos de continuidade, Ladder e sequência de fases |
| Interação e movimento | npm run test:interactables; npm run test:motion | Resultado dos casos existentes |
| API e permissões | npm run test:server | Resultado em dados temporários, sem alterar projetos reais |
| Percurso manual | Criar circuito, alternar 2D/3D/Ladder, simular e guardar/reabrir | Registo dos passos, resultado e ambiente |
| n8n | Validar contrato, autenticação, destino, sucesso e falha | Resposta coerente e identificador de execução; ausência de falsos sucessos |

## Evidências anteriores
A [revisão de integração](../../../dc-simu/n8n-integration-review.md) regista uma execução de saúde bem-sucedida após correção. O [guia de infraestrutura](../../../dc-simu/dc-simu/infra/n8n/README.md) documenta verificações anteriores do sandbox e SearXNG. Nenhuma delas comprova o envio GRAFCET completo ou o estado atual de todos os serviços.

## Validação do registo no BrainNet
Verificar frontmatter, ligações internas e existência dos caminhos locais. Executar `npm test` e `npm run check` na raiz do BrainNet e comunicar os resultados da execução. Estes checks validam a fundação e a documentação, sem substituir os testes do produto acima.

[[Project-Brief|Briefing]] · [[Requirements|Requisitos]].
