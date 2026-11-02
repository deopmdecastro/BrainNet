---
type: agent-environment
status: PREPARED_LOCAL
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, maestri, agents, terminals]
---
# Terminais de outras IA

Clientes instalados nesta máquina para acrescentar quatro terminais independentes ao workspace **BraiNet OS**:

| Terminal | Cliente | Primeiro arranque |
| --- | --- | --- |
| Copilot | GitHub Copilot CLI 1.0.98 | Autenticação GitHub e acesso do plano |
| Gemini | Gemini CLI 0.64.0 | Seleção do método de autenticação disponível para a conta |
| Gemma Local | Ollama com gemma4:e4b já instalado | Conversa local sem login ou chave de API |
| Llama Local | Ollama com llama3.2:latest já instalado | Conversa local; não lê ficheiros nem executa ferramentas por este comando |

No **Shell do Maestri**, dentro de BraiNet OS e com Maestro Mode, executar:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\Deogracia de Castro\Documents\Projetos\BrainNet\scripts\Add-MaestriAiTerminals.ps1"
```

O script acrescenta apenas os terminais em falta, sem papéis ou tarefas automáticas. Reutiliza os nomes existentes, preserva presets com comandos diferentes e não reinicia os agentes atuais. Os novos terminais abrem na pasta do código DC-Simu. Para verificar apenas os caminhos locais, usar `-LocalOnly`.

Copilot e Gemini foram instalados por npm através dos pacotes oficiais. Nenhuma subscrição foi contratada ou chave configurada nesta preparação. Os logins e as respostas dos modelos cloud continuam por confirmar. Os terminais Codex e o DeepSeek descrito em [[Agent-Environment]] mantêm a configuração anterior. Gemma e Llama usam o Ollama local para conversa com o contexto fornecido; estes comandos não lhes dão acesso autónomo a ficheiros ou ferramentas.

## Substituir o Mistral existente

Após o utilizador reportar `Setup cancelled` no Mistral Vibe, foi preparada a substituição por **Gemma Local**. Essa mensagem confirma o cancelamento do assistente de configuração, sem demonstrar que todos os planos Free do Mistral são inutilizáveis. O cliente Mistral instalado fica preservado, mas deixa de ser um dos terminais criados por omissão.

No Shell de BraiNet OS com **Maestro ativo**, executar:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\Deogracia de Castro\Documents\Projetos\BrainNet\scripts\Add-MaestriAiTerminals.ps1" -Providers Gemma -ReplaceTerminal Mistral
```

O script usa `maestri recruit --replace`, preservando o terminal, as ligações, a posição e as rotinas. O processo Mistral é trocado e o terminal passa a chamar-se Gemma Local; a conversa do processo anterior não é retomada. O nome antigo tem de coincidir com `maestri list`; a operação interrompe se faltar o terminal ou se já existir outro Gemma. Repetir após uma substituição concluída reutiliza o Gemma existente.

Para conversar imediatamente no PowerShell do antigo terminal Mistral, sem alterar o nome ou o preset no canvas:

```powershell
& "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe" run gemma4:e4b
```

O modelo local, já instalado, respondeu `GEMMA_OK` em 6,844 segundos no teste sintético com contexto de 4096 tokens e raciocínio desativado. O teste não descarregou pesos nem contactou uma API cloud; o custo de energia e do equipamento continua aplicável. Evidência local: `runtime/maestri/gemma-smoke.json`. A substituição do canvas continua por confirmar nesta sessão.

Verificação: comandos de versão dos clientes; inferência Gemma local; testes sintéticos de criação, substituição sem remover o terminal, reutilização sem duplicados, preservação dos argumentos com espaços e bloqueio fora do workspace correto. O canvas só pode ser confirmado após executar o script num terminal Maestri; esta sessão não dispõe da ligação `MAESTRI_PIPE`.

Fontes: [Copilot CLI](https://docs.github.com/en/copilot/get-started/cli-quickstart), [instalação Gemini CLI](https://geminicli.com/docs/get-started/installation/), [autenticação Gemini](https://geminicli.com/docs/get-started/authentication/), [Ollama CLI](https://docs.ollama.com/cli) e [Gemma 4](https://ollama.com/library/gemma4). A instalação do Gemini CLI não confirma elegibilidade para login gratuito; consultar também a avaliação do projeto em [[../03-Projects/DC-Simu/AI-Tooling-Assessment]].
