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
