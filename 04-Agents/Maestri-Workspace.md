---
type: workspace-setup
status: BLOCKED
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, maestri, workspace]
---
# Workspace Maestri

## Configuracao preparada

- Nome: **BraiNet OS**.
- Diretorio: a raiz deste projeto BrainNet, derivada automaticamente da localizacao do script.
- Canvas inicial: vazio, conforme `workspace create` sem template.
- Agentes: papeis disponiveis em `04-Agents/`; nenhum processo e iniciado pelo script.
- Estado real: **criacao pendente de execucao num terminal Maestri**.

## Executar no Maestri

Abra um terminal num workspace existente do Maestri e ative **Maestro Mode** nesse terminal. Execute:

```powershell
powershell -NoProfile -File "C:\Users\Deogracia de Castro\Documents\Projetos\BrainNet\scripts\Create-MaestriWorkspace.ps1"
```

O script lista workspaces, pede ao CLI que crie `BraiNet OS` ligado a esta pasta e lista novamente para verificacao. Se o nome estiver ocupado, o CLI recusa a criacao; o script nao substitui nem remove o existente. A criacao e silenciosa: o novo workspace aparece na sidebar sem mudar a vista atual.

Depois de confirmacao, o recibo local fica em `runtime/maestri/workspace-created.json`. O recibo so e escrito apos sucesso do comando e da verificacao final; a ausencia de recibo nao prova que um comando interrompido nao criou o workspace. Confira sempre a sidebar antes de repetir.

## Limite encontrado nesta sessao

O Maestri esta instalado e em execucao. CLI localizado em `AppData/Local/Programs/Maestri/resources/cli/maestri.exe`, mas nao esta em PATH e esta conversa nao possui `MAESTRI_PIPE` nem `MAESTRI_CLI`. A tentativa de invocacao devolveu:

```text
maestri: only available inside Maestri terminals (MAESTRI_PIPE not set).
```

O skill [maestri-workspace](<C:/Users/Deogracia de Castro/.agents/skills/maestri-workspace/SKILL.md>) especifica: “These commands require **Maestro Mode** on your terminal”. Nao foram copiados identificadores de outros terminais, alterado o estado interno da aplicacao ou reiniciadas sessoes para ultrapassar esta fronteira.

## Validacao efetuada

Sintaxe PowerShell analisada e comportamento sem contexto Maestri verificado: falha antes de tentar listar/criar. A criacao efetiva e a verificacao na sidebar continuam pendentes de execucao no contexto suportado.

Depois de criado, seguir [[Collaboration-Contract]] para reutilizar papeis e configurar agentes conforme a necessidade do trabalho.
