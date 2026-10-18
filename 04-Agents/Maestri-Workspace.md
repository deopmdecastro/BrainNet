---
type: workspace-setup
status: CONFIGURED
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, maestri, workspace]
---
# Workspace Maestri

## Equipa BrainNet e DC-Simu

A configuracao de quatro papeis e terminais esta preparada em [[Maestri-Team]]. Executar scripts/Configure-MaestriTeam.ps1 num terminal do workspace BraiNet OS com Maestro Mode ativo. A preparacao foi testada com CLI simulado; a ativacao real continua por confirmar nesta sessao sem MAESTRI_PIPE.

## Workspace confirmado

- Nome: **BraiNet OS**.
- Diretorio: a raiz deste projeto BrainNet, derivada automaticamente da localizacao do script.
- Workspace visivel na sidebar do Maestri na imagem fornecida pelo utilizador.
- Agentes: papeis disponiveis em `04-Agents/`; nenhum processo e iniciado pelo script.
- Estado real: **BraiNet OS ja existe e esta ligado a pasta correta**, conforme a listagem do CLI visivel na imagem. A imagem tambem mostra outro workspace, `BrainNet`, na mesma pasta; nao foi removido nem renomeado.

Selecione **BraiNet OS** na barra lateral para trabalhar nele. Nao e necessario criar novamente o workspace. O erro mostrado ocorreu porque a versao anterior do script listava os workspaces mas ainda tentava criar um nome ja existente.

## Verificar ou criar no Maestri

Abra um terminal num workspace existente do Maestri e ative **Maestro Mode** nesse terminal. Execute:

```powershell
powershell -NoProfile -File "C:\Users\Deogracia de Castro\Documents\Projetos\BrainNet\scripts\Create-MaestriWorkspace.ps1"
```

O script lista workspaces e compara o nome e o caminho completos. Se `BraiNet OS` ja estiver ligado a esta pasta, reutiliza-o sem chamar `workspace create`. Se o nome estiver associado a outra pasta ou a listagem for ambigua, interrompe sem alterar workspaces. So tenta criar quando o nome nao aparece; depois volta a listar para verificar o resultado, incluindo o caso em que outro terminal o criou entretanto.

Depois de confirmacao pelo CLI, o recibo local fica em `runtime/maestri/workspace-verified.json`, com timestamp de verificacao e indicacao de reutilizacao. O recibo nao atribui uma data de criacao a um workspace existente. A evidencia atual de existencia e a imagem do utilizador; nao foi gerado um recibo de CLI nesta conversa sem acesso ao contexto Maestri.

## Limite encontrado nesta sessao

O Maestri esta instalado e em execucao. CLI localizado em `AppData/Local/Programs/Maestri/resources/cli/maestri.exe`, mas nao esta em PATH e esta conversa nao possui `MAESTRI_PIPE` nem `MAESTRI_CLI`. A tentativa de invocacao devolveu:

```text
maestri: only available inside Maestri terminals (MAESTRI_PIPE not set).
```

O skill [maestri-workspace](<C:/Users/Deogracia de Castro/.agents/skills/maestri-workspace/SKILL.md>) especifica: “These commands require **Maestro Mode** on your terminal”. Nao foram copiados identificadores de outros terminais, alterado o estado interno da aplicacao ou reiniciadas sessoes para ultrapassar esta fronteira.

## Validacao efetuada

Sete testes de regressao no Windows, com CLI simulado e projetos temporarios: reutilizacao por nome/pasta, marcador de workspace atual, pasta diferente, caminho com prefixo semelhante, erro de listagem, criacao inicial e criacao concorrente. Nenhum teste se liga ao Maestri real. Sintaxe e bloqueio sem contexto Maestri tambem foram verificados.

Os testes fazem parte de `node --test tests/*.test.mjs`; em sistemas sem Windows, os sete casos PowerShell sao assinalados como skipped.

Seguir [[Collaboration-Contract]] para reutilizar papeis e configurar agentes conforme a necessidade do trabalho.
