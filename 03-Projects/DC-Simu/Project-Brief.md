---
project_id: BN-DCSIMU-001
type: software
status: DEVELOPMENT
priority: MEDIUM
owner: Deogracia de Castro
created: 2026-10-18
updated: 2026-10-18
due_date:
tags: [brainet, project, dc-simu, simulation]
---
# DC-Simu

## Problema e objetivos
Desenvolver um simulador de comandos elétricos industriais para aprendizagem, experimentação e diagnóstico de circuitos. O público previsto inclui estudantes, formadores e profissionais de automação; a validação comercial e as métricas de utilização estão por definir.

O produto existente sincroniza esquema 2D, visualização 3D e programação Ladder através do mesmo modelo de circuito. Inclui GRAFCET, monitorização de entradas/saídas, medições, injeção de falhas, projetos guardados e gestão de componentes e contribuições.

## Localização e fontes de verdade
- Código: `C:\Users\Deogracia de Castro\Documents\Projetos\dc-simu\dc-simu`.
- [Abrir pasta do código](../../../dc-simu/dc-simu/) · [README técnico](../../../dc-simu/dc-simu/README.md) · [Comandos disponíveis](../../../dc-simu/dc-simu/package.json).
- Repositório configurado no Git: [deopmdecastro/dc-simu](https://github.com/deopmdecastro/dc-simu).
- Checkout observado em 2026-10-18: `7d479eb`, com ficheiros não seguidos em `dist/`. Esta é uma referência local, não uma confirmação do estado remoto ou da versão publicada.
- O BrainNet centraliza o briefing, prioridades, decisões e evidências. O código mantém-se no repositório existente. As ligações locais pressupõem que BrainNet e dc-simu continuam como pastas irmãs.

## Estado e âmbito
**DEVELOPMENT**: existe uma aplicação implementada, com trabalho de integração e validação por concluir. O registo no BrainNet não representa aprovação de lançamento. A prioridade MEDIUM é inicial e pode ser revista; não há prazo acordado.

| Área | Situação documentada |
| --- | --- |
| Simulação e edição | Implementadas segundo o README e a estrutura do código; sem nova execução de testes do produto nesta integração documental |
| Projetos e administração | Modos local e com API Node/SQLite descritos no repositório |
| Integração n8n | Envio manual de GRAFCET existente; incompatibilidades e falsos sucessos registados na revisão local |
| Saúde n8n | Revisão anterior regista correção e teste bem-sucedido do ramo de saúde; restantes ramos não validados por esse teste |
| Sandbox e pesquisa | Configuração e verificação anteriores documentadas em infra/n8n; estado atual dos serviços não consultado nesta integração |

## Entregáveis e aceitação
[[Requirements|Requisitos e prioridades]] · [[Testing-Plan|Plano de validação]] · [[Decision-Log|Decisões]].

O resultado esperado é um simulador utilizável, com persistência verificável e automações que comuniquem corretamente falhas e execuções. Baselines, metas de desempenho e critérios comerciais ficam por definir.

## Próxima ação
Tratar primeiro a chave n8n exposta e as permissões do proxy; depois alinhar o webhook GRAFCET e os resultados de sucesso/erro. A revisão é evidência histórica: confirmar o estado do código e dos serviços antes de executar correções ou dar problemas como resolvidos.

## Evidências e acompanhamento
- [Revisão local DC-Simu/n8n de 2026-10-18](../../../dc-simu/n8n-integration-review.md).
- [Infraestrutura n8n, sandbox e SearXNG](../../../dc-simu/dc-simu/infra/n8n/README.md).
- [[../../00-Dashboard/Projects-Dashboard|Dashboard de projetos]] · [[../../06-SOPs/Project-States|Estados]].
