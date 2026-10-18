---
type: validation-report
status: VERIFIED_LOCAL
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, agents, deepseek, validation]
---
# Validação do ambiente de agentes

## Verificado na preparação

- Ollama 0.40.6 responde em 127.0.0.1:11434.
- OpenCode 1.19.3 instalado e comando de versão executado com sucesso.
- DeepSeek-R1 8B instalado no Ollama: ID 6995872bfe4c, cerca de 5,2 GB.
- Perfil brainet-deepseek:8b criado com os mesmos pesos e contexto de 65536 tokens; preparação repetida sem alterar preferências.
- A configuração proposta foi aceite por opencode debug config, sem chamada a modelo.
- Testes de configuração cobrem preservação de preferências, repetição, conflitos, modo sem ferramentas e aspas no comando Windows.
- Testes de equipa com CLI simulado cobrem a adição de Sonda com preset DeepSeek Local, preservando os quatro terminais anteriores.
- 36 testes do BrainNet passaram; check documental verificou 116 ligações sem erros.

## Inferência local real

Verificação concluída em **2026-10-18T16:49:00.928Z**, registada em `runtime/maestri/deepseek-smoke.json`:

| Verificação | Resultado |
| --- | --- |
| API Ollama, contexto 4096 | Respondeu 4 para 2+2; 544 tokens gerados em cerca de 12,8 segundos |
| OpenCode, perfil de contexto 65536 | Resposta DC_AGENT_OK confirmada; cerca de 57,3 segundos |
| Ferramenta sintética report_probe | HTTP 200, sem a chamada de função esperada; teste não passou |

O servidor anuncia tools, thinking e completion. O teste funcional mostrou que o anúncio de ferramentas não basta para este perfil. Sonda foi configurado com todas as ferramentas desativadas, para analisar apenas o contexto recebido. Os tempos acima são de verificações simples nesta máquina, sem compromisso de desempenho para outras tarefas.

O teste inicial com limite de 256 tokens terminou antes da resposta final. O teste nativo concluído usou limite de 2048 tokens. Um primeiro teste do cliente aguardou entrada padrão aberta no processo de teste; o teste final fechou essa entrada e passou.

## Ativação pendente no Maestri

A criação do terminal Sonda exige executar Initialize-MaestriAgents.ps1 num terminal da aplicação com Maestro Mode; esta sessão de preparação não tem MAESTRI_PIPE.

O recibo anterior em runtime/maestri/team-configured.json confirma os quatro terminais iniciais em 2026-10-18T16:15:05Z. Não comprova a autenticação ou prontidão dos modelos. Nenhuma configuração de preset foi escrita diretamente nos dados internos do Maestri.

[[Agent-Environment|Ambiente]] · [[Maestri-Team|Equipa]].
