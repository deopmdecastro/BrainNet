---
project_id: BN-DCSIMU-001
type: software
status: DEVELOPMENT
priority: MEDIUM
owner: Deogracia de Castro
created: 2026-10-18
updated: 2026-10-25
due_date:
tags: [brainet, project, dc-simu, simulation]
---
# DC-Simu

## Problema e objetivos
Desenvolver um simulador de comandos elétricos industriais para aprendizagem, experimentação e diagnóstico de circuitos. O público previsto inclui estudantes, formadores e profissionais de automação; a validação comercial e as métricas de utilização estão por definir.

O produto existente sincroniza esquema 2D, visualização 3D e programação Ladder através do mesmo modelo de circuito. Inclui GRAFCET, monitorização de entradas/saídas, medições, injeção de falhas, projetos guardados e gestão de componentes e contribuições.

## Localização e fontes de verdade
- Código centralizado no cofre: [aplicação](./dc-simu/) · [README técnico](./dc-simu/README.md) · [comandos disponíveis](./dc-simu/package.json).
- Repositório configurado no Git: [deopmdecastro/dc-simu](https://github.com/deopmdecastro/dc-simu).
- A pasta `dc-simu/` é um submódulo Git da aplicação. A cópia anterior sem histórico foi preservada localmente em `runtime/dc-simu-before-fluidsim/`; o checkout exterior foi mantido.
- O BrainNet versiona o ponteiro para um commit da aplicação; código e documentação de gestão mantêm históricos separados. A análise da importação está em [[FluidSIM-Import]].

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

Para novas alterações de interface e interação, consultar também [[Design-Principles|os princípios de UI/UX e o pacote de contexto do DC-Simu]].

## Assistência de IA e orçamento
A [[AI-Tooling-Assessment|avaliação de ferramentas e custos]] recomenda reutilizar Codex, experimentar Copilot Free quando elegível e usar Sonda/DeepSeek local para análise contextual. Objetivo inicial: zero novas subscrições; custo dos planos já existentes, energia e manutenção por confirmar. Plus, APIs e benefícios de mantenedor não são presumidos como gratuitos.

O repositório tem instruções Copilot e recomendações do editor preparadas. Instalação, autenticação e acesso da conta ao Copilot ainda requerem confirmação. O DeepSeek local não executa testes neste perfil. O Copilot não é o alojamento de produção; a presença de configuração Vercel/Docker não confirma uma versão publicada.

Necessidades, critérios e pendências ficam em [[Backlog]]. O pacote está pronto para avaliação pela coordenação; nenhum coordenador foi contactado nesta sessão.

O [[../../04-Agents/ECC-Exploration|ECC]] está disponível como catálogo Codex para exploração conjunta com o BrainNet. O piloto proposto seleciona revisão n8n, verificação e padrões React; instalar o plugin e comprovar os resultados são passos ainda pendentes.

O resultado esperado é um simulador utilizável, com persistência verificável e automações que comuniquem corretamente falhas e execuções. Baselines, metas de desempenho e critérios comerciais ficam por definir.

## Próxima ação
Tratar primeiro a chave n8n exposta e as permissões do proxy; depois alinhar o webhook GRAFCET e os resultados de sucesso/erro. A revisão é evidência histórica: confirmar o estado do código e dos serviços antes de executar correções ou dar problemas como resolvidos. Para o piloto de IA, restaurar o baseline de dependências e validar o acesso Copilot da conta antes de comparar ferramentas; ver ENV-01 e AI-03 no [[Backlog]].

## Evidências e acompanhamento
- A [documentação local da infraestrutura n8n](./dc-simu/infra/n8n/README.md) acompanha a configuração da aplicação. A revisão histórica de integração citada anteriormente não foi copiada para o cofre; as pendências que dela dependem estão resumidas no [[Backlog]] e necessitam de reconfirmação.
- [[../../00-Dashboard/Projects-Dashboard|Dashboard de projetos]] · [[../../06-SOPs/Project-States|Estados]].
