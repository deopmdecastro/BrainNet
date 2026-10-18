---
project_id: BN-DCSIMU-001
type: decisions
status: ACTIVE
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, dc-simu, decisions]
---
# Decisões do DC-Simu

| ID | Data UTC | Decisão | Base e estado |
| --- | --- | --- | --- |
| DC-ADR-001 | 2026-10-18 | Incluir o DC-Simu no portefólio de projetos do BrainNet como BN-DCSIMU-001 | Pedido direto do utilizador; registo documental |
| DC-ADR-002 | 2026-10-18 | Manter o código na pasta existente e ligar o contexto a partir do cofre | Organização adotada para esta integração; evita duplicar o repositório |
| DC-ADR-003 | 2026-10-18 | Usar DEVELOPMENT como estado inicial | Produto já implementado, com pendências n8n documentadas; aceitação da versão por confirmar |
| DC-ADR-004 | 2026-10-18 | Colocar segurança e fiabilidade n8n no início do backlog | Prioridade técnica proposta com base na revisão local; requer reconfirmação antes de implementar |
| DC-ADR-005 | | Definir ambiente e critérios de lançamento | Pendente do responsável do projeto |
| DC-ADR-006 | 2026-10-18 | Preparar adoção de IA com objetivo de zero novas subscrições | Implementadas instruções de repositório e avaliação de custos; contratação não autorizada por esta proposta |
| DC-ADR-007 | 2026-10-18 | Manter DeepSeek/Sonda como analista de contexto | Baseado no teste local de ferramentas sem chamada válida; QA continua a exigir comandos e revisão |
| DC-ADR-008 | 2026-10-18 | Avaliar acesso e baseline antes de escolher outra subscrição | Copilot e conta Google por verificar; dependências locais do produto incompletas nos checks iniciais |
| DC-ADR-009 | 2026-10-18 | Substituir o terminal Mistral por Gemma 4 E4B local no Ollama | Pedido direto após setup cancelado; inferência sintética local passou, troca do terminal preparada e ainda por confirmar no Maestri |

O código é a fonte de verdade da implementação; o BrainNet mantém o contexto de gestão. O dashboard é atualizado manualmente. Este registo não liga os workflows DC-Simu aos workflows da fundação BraiNet.

[[Project-Brief|Briefing]] · [[Requirements|Requisitos]] · [[../../00-Dashboard/Projects-Dashboard|Projetos]].
