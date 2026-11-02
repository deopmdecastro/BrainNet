---
type: team-setup
status: PREPARED
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, maestri, dc-simu, agents]
---
# Equipa Maestri para BrainNet e DC-Simu

Pedido do utilizador: configurar workspace, papéis e equipa ativa. O script está preparado para criar os terminais; a ativação real exige a execução num terminal Maestri. Esta sessão de preparação não tem MAESTRI_PIPE e não confirmou agentes ativos.

| Agente | Papel | Pasta de trabalho |
| --- | --- | --- |
| Prumo | BraiNet Coordenador | Raiz do BrainNet |
| Bobina | DC-Simu Programador | Repositório dc-simu/dc-simu |
| Nexo | DC-Simu Automacao | Repositório dc-simu/dc-simu |
| Farol | DC-Simu QA | Repositório dc-simu/dc-simu |
| Sonda (opcional) | DC-Simu Analista DeepSeek | Repositório dc-simu/dc-simu; análise conforme capacidades do modelo local |

Para preparar o ambiente e acrescentar Sonda com DeepSeek local, seguir [[Agent-Environment]]. O comando Initialize-MaestriAgents.ps1 trata do preset e chama este configurador com IncludeDeepSeek. O comando abaixo continua a configurar apenas os quatro agentes iniciais.

Os quatro papéis usam os documentos existentes em `04-Agents/`, acrescidos dos caminhos do cofre e do código. Prumo fica ligado aos três especialistas. Os terminais também ficam ligados ao terminal que executar o script. A equipa lê o contexto e aguarda uma tarefa concreta; o arranque não inicia as correções do backlog.

## Ativar

1. No Maestri, selecionar **BraiNet OS**.
2. Abrir um terminal nesse workspace e ativar **Maestro Mode** nesse terminal.
3. Executar:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\Deogracia de Castro\Documents\Projetos\BrainNet\scripts\Configure-MaestriTeam.ps1"
```

O script confirma a pasta do workspace e o marcador de workspace atual antes de criar recursos. Lista equipa, presets e papéis; usa o preset **Codex** apenas se este já existir. Para outro preset configurado, usar `-AgentPreset 'Nome exato'`. Não altera comandos, modelos, contas ou permissões dos presets.

A exceção ExecutionPolicy Bypass vale apenas para este processo. O leitor da listagem aceita o marcador atual com seta, ponto, ponto médio ou bullet, mantendo a verificação do caminho completo.

Se o workspace não existir, usar primeiro [Create-MaestriWorkspace.ps1](../scripts/Create-MaestriWorkspace.ps1), selecionar o workspace criado e executar o comando acima. Ver [[Maestri-Workspace]].

Nomes e papéis já existentes são reutilizados quando o contexto corresponde. Conflitos de nome, papel ou workspace interrompem o script; as sessões existentes não são reiniciadas. Não executar dois arranques em simultâneo. Um erro pode deixar recursos parcialmente criados; consultar `maestri list` e repetir depois de rever o diagnóstico.

## Confirmar o arranque

O recibo `runtime/maestri/team-configured.json` só é escrito após confirmação dos quatro nomes e papéis pelo CLI. A existência de um terminal não confirma que o modelo concluiu o login ou o arranque. Verificar os quatro terminais no canvas e terminar a autenticação, se pedida. Usar `maestri list` e `maestri check 'Prumo'` para inspecionar o estado.

Uma primeira tarefa possível para Prumo: ler [[../03-Projects/DC-Simu/Project-Brief|o briefing do DC-Simu]] e propor o próximo incremento com aceitação, sem modificar código ou serviços. O responsável decide depois a execução.

## Verificação da configuração

Os testes `tests/maestri-team.test.mjs` usam um CLI simulado, sem contacto com o Maestri real. Cobrem criação, repetição sem duplicar agentes, falta de contexto Maestri, workspace errado, preset ausente e falha de recrutamento. Não validam o formato real de listagens de uma versão futura do CLI nem a autenticação dos agentes.

[[Collaboration-Contract|Contrato de colaboração]] · [[../03-Projects/DC-Simu/Project-Brief|DC-Simu]].

## Arranque Codex no Windows

Se um terminal mostrar `unexpected argument --no-daemon`, confirmar o executável e a versão usados nesse terminal. Em 2026-10-18, o cliente npm local 0.163.0 e a sua ajuda aceitam o argumento; o registo anterior do utilizador vinha de um arranque que o rejeitava. A causa exata nesse processo antigo não foi observada.

Para fixar o executável atual e o modelo `gpt-6.1-sol` no preset Codex e iniciar apenas o terminal PowerShell atual, executar dentro de BraiNet OS, com Maestro Mode:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\Deogracia de Castro\Documents\Projetos\BrainNet\scripts\Repair-MaestriCodex.ps1" -Start
```

O script verifica a versão e os argumentos antes de alterar o preset. Usa o binário npm por caminho absoluto, preserva as restantes propriedades do preset e não recria nem reinicia colegas. O comando do preset não duplica `--no-daemon`, que o Maestri pode acrescentar ao arranque. Sem `-Start`, corrige apenas o preset; `-LocalOnly` verifica apenas o cliente local.

Com `-Start`, uma falha de configuração do Maestri é apresentada com o comando, o código de saída e a resposta original; o Codex arranca localmente na mesma pasta. Essa continuação não confirma a alteração do preset. Um `debug` indisponível não bloqueia por si só: o script verifica depois o workspace e o preset antes de alterar a configuração.

Para iniciar apenas o Codex, sem chamar o CLI Maestri nem alterar o preset, usar `-StartOnly` em vez de `-Start`. Os modos de arranque não podem ser combinados com `-LocalOnly`. O parâmetro opcional `-CodexBinary` permite indicar outro executável por caminho completo.

O preset só pode ser alterado numa sessão com `MAESTRI_PIPE`. Foram verificados localmente a versão 0.163.0, a ajuda, a sintaxe PowerShell e, com clientes sintéticos, o arranque independente, a recuperação após falha de IPC, a identificação de erros e a reutilização do preset. Não foi observada uma resposta do modelo nem uma alteração do canvas. Referência: [argumentos oficiais Codex](https://learn.chatgpt.com/docs/developer-commands?surface=cli).
