---
project_id: BN-DCSIMU-001
type: assessment
status: READY_FOR_REVIEW
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, dc-simu, ai, costs]
---
# Ferramentas de IA e custos do DC-Simu

## Recomendação para o próximo incremento

Reutilizar **Codex para implementação/QA**, experimentar **Copilot Free no editor quando a conta for elegível** e manter **Sonda/DeepSeek local para análise de contexto fornecido**. O objetivo do piloto é **USD 0 de novas subscrições**, sem ativar APIs pagas. Esta é uma recomendação técnica; os planos já contratados e o custo total da conta não foram consultados.

A seleção deriva da compatibilidade com o projeto TypeScript/React, da configuração já existente e dos testes locais registados em [[../../04-Agents/Agent-Environment-Validation|validação do ambiente]]. Não há medição comparativa que comprove superioridade entre os fornecedores.

Atualização de 2026-10-18: por pedido do utilizador após cancelamento do setup Mistral Vibe, o terminal Mistral passa a ter **Gemma 4 E4B local** como substituto. O modelo já instalado respondeu ao teste sintético sem chave ou subscrição; o script de substituição do terminal está preparado em [[../../04-Agents/AI-Terminals]], ainda sem confirmação no canvas. Não se infere uma indisponibilidade geral do plano Mistral Free a partir de `Setup cancelled`.

## Correções à proposta inicial

- O Copilot é um assistente de programação. O repositório tem configuração Vercel e Docker; isso não confirma o ambiente publicado.
- O repositório GitHub foi confirmado como **público** pelo conector em 2026-10-18. Não foi encontrado um ficheiro LICENSE seguido pelo Git neste checkout. Não presumir licença aberta ou benefício Copilot Pro a partir da visibilidade.
- O benefício Copilot Pro gratuito depende da elegibilidade do mantenedor de um projeto popular; existe também Copilot Free com limites. [Planos GitHub](https://docs.github.com/en/copilot/get-started/plans).
- ChatGPT Free e Plus são planos distintos. Plus custa USD 20/mês na tabela consultada; a API tem faturação separada. [OpenAI Docs](https://learn.chatgpt.com/docs/pricing).
- DeepSeek não executa testes neste perfil: a resposta local foi validada, mas a chamada de ferramenta sintética não passou. Os testes do produto continuam a ser comandos executáveis e revisão humana.

## Opções e compatibilidade

Valores de referência consultados em **2026-10-18 UTC**, por pessoa, antes de impostos e conversão cambial. Quotas, disponibilidade regional e checkout devem ser reconfirmados antes de contratar.

| Opção | Custo de referência | Utilização no DC-Simu | Situação nesta entrega |
| --- | --- | --- | --- |
| GitHub Copilot | Free: USD 0; Pro: USD 10/mês | Sugestões e explicações de código no VS Code | Instruções de repositório e recomendações de extensão criadas; login, plano e funcionamento na conta por confirmar |
| ChatGPT/Codex | Free: USD 0 com limitações; Plus: USD 20/mês | Requisitos, documentação e tarefas de código conforme o acesso disponível | CLI Codex e extensão OpenAI detetados; reutilizar os agentes existentes; subscrição não auditada |
| DeepSeek-R1 8B/Ollama | Sem nova subscrição; energia e manutenção variáveis | Segunda opinião a partir de excertos enviados a Sonda | Inferência local previamente testada; ferramentas desativadas; ativação de Sonda por confirmar |
| Llama 2 local | Sem mensalidade de serviço local; recursos e condições da licença do modelo | Alternativa para experiências locais | Avaliado como alternativa; não instalado neste piloto, que já dispõe de modelo local |
| Mistral | Free com limites; Pro: USD 14,99/mês | Alternativa cloud retirada dos terminais por omissão | Vibe instalado numa etapa posterior; setup cancelado pelo utilizador, substituição local pedida |
| Gemma 4 E4B/Ollama | Sem mensalidade de serviço ou chamadas API cloud; energia e manutenção variáveis | Substituto local do terminal Mistral para conversa e análise de excertos | Modelo gemma4:e4b já instalado; teste GEMMA_OK passou em 6,844 segundos; troca do terminal preparada |
| Gemini | App Free: USD 0; AI Pro: USD 19,99/mês na página EUA; API tem tabela própria | Análise de documentos e comparação de propostas | Extensão Gemini Code Assist detetada; acesso pessoal antigo descontinuado; migração a avaliar |

Fontes da matriz: [GitHub](https://docs.github.com/en/copilot/get-started/plans), [OpenAI](https://learn.chatgpt.com/docs/pricing), [licença Llama 2](https://github.com/meta-llama/llama/blob/main/LICENSE), [Mistral](https://mistral.ai/pricing/), [modelos Mistral](https://docs.mistral.ai/models), [Gemini app](https://gemini.google/subscriptions/) e [Gemini API](https://ai.google.dev/gemini-api/docs/pricing). Llama e Mistral exigem selecionar e verificar o modelo/licença concretos; não se assume que toda a família tenha as mesmas condições.

## Gemini: integração a atualizar

A extensão local `google.geminicodeassist-2.104.0` existe. A documentação oficial informa que o acesso pessoal antigo ao Code Assist e o login pessoal associado no Gemini CLI terminaram em **2026-06-18**, com migração para a família Antigravity. Uma instalação não comprova que a conta tenha acesso utilizável. Não foi adicionado um preset baseado no antigo login gratuito. [Aviso Google](https://developers.google.com/gemini-code-assist/docs/deprecations/code-assist-individuals).

O acesso gratuito à app web e os níveis gratuitos de alguns modelos da API são produtos diferentes do antigo acesso ao editor. Não foi criada integração API nesta entrega.

## Implementação e manutenção

**Implementado no repositório:** `.github/copilot-instructions.md`, `.vscode/extensions.json` e `docs/AI-ASSISTANCE.md`. As instruções descrevem a arquitetura partilhada, comandos de testes, persistência e entrega de evidências. O percurso de ativação do editor segue [o guia oficial GitHub](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/set-up-copilot/install-copilot-extension). Não foi alterada a faturação nem instalada uma extensão por este trabalho.

As recomendações de extensões são `GitHub.copilot-chat` e `openai.chatgpt`. A extensão OpenAI já foi detetada; não foi detetada uma extensão GitHub Copilot instalada. A extensão `namdang.ollama-copilot-vscode` existente é outro produto e não comprova acesso ao GitHub Copilot.

| Cenário de novas subscrições | Mensal | Equivalente de 12 mensalidades |
| --- | --- | --- |
| Piloto recomendado: acesso existente + opções Free + DeepSeek local | USD 0 | USD 0 |
| Apenas Copilot Pro, se necessário | USD 10 | USD 120 |
| Apenas ChatGPT Plus, se necessário | USD 20 | USD 240 |
| Copilot Pro + ChatGPT Plus | USD 30 | USD 360 |

São cenários de subscrição, não uma previsão do custo total nem autorização de compra. API, eletricidade, alojamento e tempo de manutenção ficam fora desses totais. Não somar uma subscrição já existente como se fosse uma nova despesa.

Para o modelo local: custo de energia = potência média medida em kW × horas de uso × tarifa por kWh. Exemplo meramente ilustrativo: 0,12 kW × 20 h × EUR 0,25/kWh = EUR 0,60/mês. A potência e a tarifa reais não foram medidas. Manutenção = horas registadas × custo/hora acordado; ainda sem valores.

## Baseline técnico executado

No checkout `7d479eb`, antes de alterar lógica do produto:

| Comando | Resultado observado |
| --- | --- |
| npm test | Falhou ao resolver a dependência declarada @supabase/supabase-js; os casos de smoke não chegaram a executar |
| npm run typecheck | Falhou com módulos em falta: react-router-dom, @supabase/supabase-js e pacotes Font Awesome; também reportou TS7006 em src/supabase/supabaseBackend.ts:114 |

Nenhuma lógica do produto foi alterada nesta tarefa. Restaurar primeiro as dependências pelo lockfile adequado e repetir os checks; só depois classificar eventuais erros de código. Não escolher ou aprovar uma IA com base num baseline que ainda não executa os testes.

## Piloto proposto e decisão seguinte

Comparar três tarefas reais: explicar um módulo do motor, propor um caso de teste e rever uma alteração documental. Medir tempo total, correções humanas, requisitos satisfeitos e consumo/quota observado. Usar o mesmo contexto e aceitação; a equipa executa os comandos, incluindo quando a proposta vem de Sonda. Não há prazo imposto nem resultados de produtividade inventados.

Revisão proposta para **Prumo (papel de coordenação)** e decisão do responsável Deogracia de Castro. O papel não foi contactado nesta sessão. O pacote de avaliação e os critérios estão prontos em [[Backlog]]; acesso e ativação dos serviços dependem das contas reais.

[[Project-Brief|Briefing]] · [[Requirements|Requisitos]] · [[Testing-Plan|Validação]] · [[Decision-Log|Decisões]].
