---
project_id: BN-DCSIMU-001
type: requirements
status: DRAFT
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, dc-simu, requirements]
---
# Requisitos e prioridades do DC-Simu

Base inicial derivada do [README técnico da aplicação](./dc-simu/README.md) e de uma revisão n8n histórica que não foi copiada para o cofre. Os critérios seguintes orientam o trabalho futuro; não são resultados de testes desta entrega.

| ID | Prioridade | Resultado esperado | Critério de aceitação |
| --- | --- | --- | --- |
| DC-01 | Alta | Retirar a chave n8n exposta do cliente e rever o segredo no serviço | Código e bundle sem chave; rotação confirmada no n8n; segredo mantido no servidor |
| DC-02 | Alta | Restringir o proxy n8n | Exigir sessão e autorização; destino configurado no servidor; pedidos para destinos arbitrários rejeitados sem encaminhar credenciais |
| DC-03 | Alta | Alinhar o contrato GRAFCET com o workflow pretendido | Endpoint e payload grafcet.export acordados; teste identifica a execução real e a resposta de erro/sucesso |
| DC-04 | Alta | Eliminar falsos sucessos | Indisponibilidade, timeout e rejeição devolvem falha; consultar a definição de workflow não conta como execução |
| DC-05 | Média | Preservar a sincronização 2D/3D/Ladder | Alterações de componentes, cabos e estado propagam-se entre vistas; casos dos motores e cenários existentes passam |
| DC-06 | Média | Preservar projetos e permissões | Guardar/reabrir mantém os dados; conflitos de revisão e acessos não autorizados são tratados nos modos aplicáveis |
| DC-07 | Média | Documentar as condições de operação | Distinguir persistência local e API; verificar o destino n8n a partir do ambiente Docker utilizado |
| AI-R01 | Alta | Preparar o contexto de programação assistida | Copilot encontra arquitetura, comandos e critérios em instruções do repositório; autenticação é validada separadamente |
| AI-R02 | Alta | Avaliar o custo adicional de IA | Matriz com fontes e data; plano gratuito distinguido de subscrição e API; custo existente separado do novo |
| AI-R03 | Alta | Manter aceitação verificável | Código sugerido passa pelos checks aplicáveis; não aceitar respostas de IA como evidência de execução |
| AI-R04 | Média | Medir o piloto antes de contratar | Três tarefas com critérios comuns, tempo, correções e consumo registados; decisão do responsável documentada |

## Questões abertas
- Qual é o próximo incremento funcional após estabilizar a integração n8n?
- Que ambiente e versão serão usados para aceitação do produto?
- Quais são as metas de utilização, desempenho e distribuição?

Responsável do projeto: Deogracia de Castro. Prazo e responsáveis por tarefa ainda não atribuídos. A execução destas correções não faz parte do registo documental no BrainNet.

[[Project-Brief|Briefing]] · [[Testing-Plan|Validação]] · [[Decision-Log|Decisões]].

Implementação e acompanhamento: [[AI-Tooling-Assessment|Avaliação de IA]] · [[Backlog]].
