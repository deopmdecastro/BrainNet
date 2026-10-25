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
| DC-ADR-010 | 2026-10-18 | Explorar o catálogo ECC comum ao Codex dos dois projetos antes de ativar o plugin completo | Pedido do utilizador; versão 2.2.3 e commit 76aaa77 fixados, catálogo verificado nos dois projetos; hooks/MCP e adaptador OpenCode não ativados |
| DC-ADR-011 | 2026-10-25 | Centralizar uma cópia do código em `03-Projects/DC-Simu/dc-simu/` dentro do cofre | Pedido direto do utilizador; checkout anterior preservado sem sincronização automática; cópia sem `.git`, `.env`, dependências instaladas e artefactos de build |

| DC-ADR-012 | 2026-10-25 | Ligar `dc-simu/` como submódulo do repositório da aplicação | Pedido de clone/pull no DC-Simu e commit/push nos dois repositórios; cópia anterior e checkout exterior preservados; BrainNet fixa o commit da aplicação |

O código em `dc-simu/` tem histórico próprio e o BrainNet guarda o seu commit através de um submódulo. O dashboard é atualizado manualmente. Este registo não liga os workflows DC-Simu aos workflows da fundação BraiNet.

[[Project-Brief|Briefing]] · [[Requirements|Requisitos]] · [[../../00-Dashboard/Projects-Dashboard|Projetos]].
