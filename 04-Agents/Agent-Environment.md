---
type: agent-environment
status: READY_LOCAL
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, maestri, agents, deepseek, ollama]
---
# Ambiente dos agentes

O ambiente combina os quatro agentes existentes com **Sonda**, um analista DeepSeek local. O código do DC-Simu continua em `dc-simu/dc-simu`; o contexto de gestão está no BrainNet.

| Componente | Configuração |
| --- | --- |
| Coordenação, desenvolvimento, automação e QA | Preset Codex já usado por Prumo, Bobina, Nexo e Farol |
| Cliente do DeepSeek | OpenCode 1.19.3, instalado através do pacote oficial opencode-ai |
| Servidor local | Ollama, em http://127.0.0.1:11434 |
| Modelo de base | deepseek-r1:8b, versão destilada de 8 mil milhões de parâmetros |
| Perfil local | brainet-deepseek:8b, mesmos pesos, contexto de 65536 tokens e limite de saída de 8192 |
| Preset Maestri | DeepSeek Local, cliente OpenCode com modelo local explicitamente selecionado |
| Agente | Sonda, papel DC-Simu Analista DeepSeek |

O DeepSeek usa o servidor local e não requer chave de API. O perfil separado não altera os parâmetros do modelo original. O contexto de 64K segue a indicação de integração do [Ollama/OpenCode](https://docs.ollama.com/integrations/opencode).

## Capacidades reais

O modelo instalado anuncia ferramentas em `/api/show`, mas o teste funcional de uma chamada sintética não devolveu a função esperada. Sonda fica em análise de texto fornecido, com todas as ferramentas desativadas no cliente: não lê ficheiros, não executa comandos e não envia mensagens autonomamente. Prumo deve incluir os excertos relevantes na pergunta; recebe a resposta pelo terminal/Maestri. O DeepSeek não substitui Bobina ou Farol nesse modo.

Apenas anunciar uma capacidade não confirma o seu funcionamento. Uma versão futura pode ser avaliada separadamente antes de alterar este modo. Conflitos com uma configuração existente são assinalados para revisão, sem sobrescrever definições diferentes.

## Ativação no Maestri

No workspace **BraiNet OS**, num terminal com **Maestro Mode**:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\Deogracia de Castro\Documents\Projetos\BrainNet\scripts\Initialize-MaestriAgents.ps1"
```

O comando prepara o perfil e a configuração OpenCode, regista o preset se faltar e acrescenta Sonda, reutilizando os quatro agentes existentes. Não reinicia sessões nem altera presets existentes. O comando do preset lança diretamente o executável OpenCode, com o operador de chamada do PowerShell para suportar espaços no caminho.

Fora do Maestri, ou com `-LocalOnly`, prepara apenas o ambiente local. A criação e ligação do terminal Sonda só ocorrem no contexto do Maestri.

## Ficheiros e evidências

- Configuração do cliente: `~/.config/opencode/opencode.json`, ou o diretório definido por XDG_CONFIG_HOME. Acrescenta apenas o provider brainet-ollama e o agente brainet-analyst; preserva as restantes preferências e guarda backup antes de alterar um ficheiro existente.
- Preparação local: `runtime/maestri/agent-environment.json`.
- Terminais registados: `runtime/maestri/team-configured.json`. O recibo anterior de 2026-10-18T16:15:05Z confirma os quatro terminais iniciais; não confirma Sonda ou a prontidão dos modelos.
- Estado de instalação e inferência: [[Agent-Environment-Validation]].

Uma instalação nova requer `npm install -g opencode-ai@1.19.3` e `ollama pull deepseek-r1:8b` antes do preparador. O script não descarrega dependências automaticamente.

Documentação consultada: [providers OpenCode](https://opencode.ai/docs/providers/), [configuração](https://opencode.ai/docs/config/), [permissões](https://opencode.ai/docs/permissions/) e [modelo Ollama](https://ollama.com/library/deepseek-r1:8b).

[[Maestri-Team|Equipa Maestri]] · [[DeepSeek-Analyst|Papel de Sonda]] · [[../03-Projects/DC-Simu/Project-Brief|DC-Simu]].

Outros clientes de IA: [[AI-Terminals|terminais Copilot, Gemini, Gemma e Llama]]. Gemma local substitui a opção Mistral após o pedido do utilizador.
