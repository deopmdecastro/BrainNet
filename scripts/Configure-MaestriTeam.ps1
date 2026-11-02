param(
    [string]$WorkspaceName = 'BraiNet OS',
    [string]$AgentPreset = 'Codex',
    [string]$CodeDirectory,
    [switch]$IncludeDeepSeek,
    [string]$DeepSeekPreset = 'DeepSeek Local'
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'MaestriWorkspace.Helpers.ps1')
$projectDirectory = [IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
if (-not $CodeDirectory) {
    $CodeDirectory = Join-Path (Split-Path -Parent $projectDirectory) 'dc-simu\dc-simu'
}
$CodeDirectory = [IO.Path]::GetFullPath($CodeDirectory)
if (-not $env:MAESTRI_PIPE) {
    throw 'Execute num terminal do workspace BraiNet OS no Maestri, com Maestro Mode ativo (MAESTRI_PIPE ausente).'
}
$cliPath = $env:MAESTRI_CLI
if (-not $cliPath) {
    $command = Get-Command maestri -ErrorAction SilentlyContinue
    if ($command) { $cliPath = $command.Source }
}
if (-not $cliPath -or -not (Test-Path -LiteralPath $cliPath -PathType Leaf)) {
    throw 'CLI indisponivel. Abra um novo terminal dentro do Maestri.'
}

function Invoke-TeamCommand {
    param([string[]]$Arguments)
    $result = Invoke-MaestriCli -CliPath $cliPath -CliArguments $Arguments
    $result.Lines | ForEach-Object { Write-Host ([string]$_) }
    if ($result.ExitCode -ne 0) {
        $diagnostic = Invoke-MaestriCli -CliPath $cliPath -CliArguments @('debug')
        $diagnostic.Lines | ForEach-Object { Write-Host ([string]$_) }
        throw "Comando Maestri falhou: $($Arguments[0]). Operacoes anteriores podem ter sido aplicadas; consulte maestri list antes de repetir."
    }
    return (($result.Lines | ForEach-Object { [string]$_ }) -join "`n")
}

function Test-ListedName {
    param([string]$Listing, [string]$Name)
    # Aceitar o token completo, evitando que um nome com sufixo conte como igual.
    $escaped = [regex]::Escape($Name)
    $pattern = '(?m)(?:"' + $escaped + '"|^\s*(?:[-*]\s*)?' + $escaped + '\s*(?=$|[:|\[(]))'
    return [regex]::IsMatch($Listing, $pattern)
}

$workspaceListing = Invoke-TeamCommand -Arguments @('workspace', 'list')
if (-not (Find-MaestriWorkspace -Lines ($workspaceListing -split "`n") -Name $WorkspaceName -Directory $projectDirectory)) {
    throw 'Workspace ainda nao existe. Execute Create-MaestriWorkspace.ps1, selecione BraiNet OS e volte a executar este script.'
}
$workspaceLine = @($workspaceListing -split "`n" | Where-Object { $_ -match ('^\s*"' + [regex]::Escape($WorkspaceName) + '"\s+') })
if ($workspaceLine.Count -ne 1 -or $workspaceLine[0] -notmatch '\(you are here\)\s*$') {
    throw 'Selecione o workspace BraiNet OS e execute num terminal desse workspace. Nenhum papel ou agente foi criado.'
}
if (-not (Test-Path -LiteralPath (Join-Path $CodeDirectory 'package.json') -PathType Leaf)) {
    throw "Codigo DC-Simu nao encontrado: $CodeDirectory"
}

# Inspecionar a equipa antes de qualquer recrutamento; nao alterar sessoes existentes.
$teamListing = Invoke-TeamCommand -Arguments @('list')
$presetListing = Invoke-TeamCommand -Arguments @('preset', 'list')
$roleListing = Invoke-TeamCommand -Arguments @('role', 'list')
if (-not (Test-ListedName -Listing $presetListing -Name $AgentPreset)) {
    throw "Preset '$AgentPreset' nao confirmado. Consulte maestri preset list e indique -AgentPreset com o nome exato."
}
if ($IncludeDeepSeek -and -not (Test-ListedName -Listing $presetListing -Name $DeepSeekPreset)) {
    throw 'Preset DeepSeek ausente. Execute Initialize-MaestriAgents.ps1 neste terminal.'
}

$team = @(
    @{ name = 'Prumo'; role = 'BraiNet Coordenador'; file = 'Orchestrator.md'; directory = $projectDirectory },
    @{ name = 'Bobina'; role = 'DC-Simu Programador'; file = 'Developer.md'; directory = $CodeDirectory },
    @{ name = 'Nexo'; role = 'DC-Simu Automacao'; file = 'Automation-Engineer.md'; directory = $CodeDirectory },
    @{ name = 'Farol'; role = 'DC-Simu QA'; file = 'QA-Security.md'; directory = $CodeDirectory }
)
foreach ($member in $team) { $member.preset = $AgentPreset }
if ($IncludeDeepSeek) {
    $team += @{ name = 'Sonda'; role = 'DC-Simu Analista DeepSeek'; file = 'DeepSeek-Analyst.md'; directory = $CodeDirectory; preset = $DeepSeekPreset }
}
$context = " Workspace documental: $projectDirectory. Codigo do DC-Simu: $CodeDirectory. Le AGENTS.md e 04-Agents/Collaboration-Contract.md no BrainNet e 03-Projects/DC-Simu/Project-Brief.md, Requirements.md, Decision-Log.md e Testing-Plan.md. Executa maestri list antes de contactar colegas. Prumo coordena; Bobina implementa; Nexo trata automacoes; Farol faz revisao e QA. Ao iniciar, le o contexto e aguarda uma tarefa concreta do utilizador ou coordenador. A configuracao da equipa nao e uma tarefa para corrigir o backlog. Nao publicar, enviar mensagens externas, rodar segredos ou alterar servicos nesta inicializacao. Entrega sempre resultado, ficheiros, verificacoes e pendencias."

# Preparar todos os prompts e detetar conflitos antes de criar recursos.
foreach ($member in $team) {
    $roleFile = Join-Path $projectDirectory ('04-Agents\' + $member.file)
    $roleText = [IO.File]::ReadAllText($roleFile)
    $roleBody = [regex]::Replace($roleText, '(?s)\A---\r?\n.*?\r?\n---\r?\n', '')
    $member.prompt = ([regex]::Replace(($roleBody + $context), '\s+', ' ')).Trim()
    if ($member.name -eq 'Sonda') {
        $member.prompt += ' Sonda usa DeepSeek local para analise e segunda opiniao. Se nao tiver ferramentas, usa apenas o contexto recebido na conversa e pede ao coordenador os excertos necessarios; nao executes maestri list ou outros comandos nesse modo.'
    }
    $member.existing = Test-ListedName -Listing $teamListing -Name $member.name
    if ($member.existing -and -not (Test-ListedName -Listing $teamListing -Name $member.role)) {
        throw "Nome $($member.name) ja em uso sem o papel esperado. Nenhuma sessao foi reiniciada."
    }
    if (-not $member.existing -and (Test-ListedName -Listing $teamListing -Name $member.role)) {
        throw "Ja existe colega com o papel $($member.role). Reutilize esse colega; nao foi criado um duplicado."
    }
    $member.roleExists = Test-ListedName -Listing $roleListing -Name $member.role
    if ($member.roleExists) {
        $existingPrompt = Invoke-TeamCommand -Arguments @('role', 'show', $member.role)
        if (-not $existingPrompt.Contains($member.prompt)) {
            throw "Papel $($member.role) ja existe com outro contexto. Reveja-o antes de repetir; nao foi sobrescrito."
        }
    }
}

foreach ($member in $team) {
    if (-not $member.roleExists) {
        $null = Invoke-TeamCommand -Arguments @('role', 'create', $member.role, $member.prompt, '--scope', 'current')
    }
}
foreach ($member in $team) {
    if (-not $member.existing) {
        # Atualizar a listagem imediatamente antes de recrutar, incluindo concorrencia.
        $teamListing = Invoke-TeamCommand -Arguments @('list')
        if ((Test-ListedName -Listing $teamListing -Name $member.name) -or (Test-ListedName -Listing $teamListing -Name $member.role)) {
            throw 'A equipa mudou entretanto. Rever maestri list antes de repetir.'
        }
        $null = Invoke-TeamCommand -Arguments @('recruit', $member.name, '--preset', $member.preset, '--role', $member.role, '--dir', $member.directory)
    }
}
foreach ($member in $team | Where-Object { $_.name -ne 'Prumo' }) {
    $null = Invoke-TeamCommand -Arguments @('connect', 'Prumo', $member.name)
}
$finalListing = Invoke-TeamCommand -Arguments @('list')
foreach ($member in $team) {
    if (-not (Test-ListedName -Listing $finalListing -Name $member.name) -or -not (Test-ListedName -Listing $finalListing -Name $member.role)) {
        throw "Terminal/papel de $($member.name) nao confirmado. Reveja a equipa no canvas."
    }
}
$receiptDirectory = Join-Path $projectDirectory 'runtime\maestri'
New-Item -ItemType Directory -Force -Path $receiptDirectory | Out-Null
$receipt = [ordered]@{
    workspace = $WorkspaceName
    configured_at_utc = [DateTime]::UtcNow.ToString('o')
    agent_preset = $AgentPreset
    terminals_confirmed_by_cli = $true
    model_readiness_verified = $false
    team = @($team | ForEach-Object { @{ name = $_.name; role = $_.role; directory = $_.directory; preset = $_.preset; reused = $_.existing } })
}
$receiptPath = Join-Path $receiptDirectory 'team-configured.json'
[IO.File]::WriteAllText($receiptPath, ($receipt | ConvertTo-Json -Depth 5), [Text.UTF8Encoding]::new($false))
Write-Host "Equipa configurada. Os modelos podem ainda estar a iniciar ou pedir autenticacao. Recibo: $receiptPath"
Write-Host "No canvas, confirme que os $($team.Count) agentes terminaram o arranque. Prumo coordena as proximas tarefas."
