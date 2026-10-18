param(
    [ValidateSet('Copilot', 'Gemini', 'Gemma', 'Llama')]
    [string[]]$Providers = @('Copilot', 'Gemini', 'Gemma', 'Llama'),
    [string]$CodeDirectory,
    [string]$ReplaceTerminal,
    [switch]$LocalOnly
)

$ErrorActionPreference = 'Stop'
if ($ReplaceTerminal -and ($Providers.Count -ne 1 -or $Providers[0] -ne 'Gemma')) {
    throw 'Para substituir um terminal use -Providers Gemma -ReplaceTerminal com o nome exato do terminal antigo.'
}
. (Join-Path $PSScriptRoot 'MaestriWorkspace.Helpers.ps1')
$projectDirectory = [IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
if (-not $CodeDirectory) {
    $CodeDirectory = Join-Path (Split-Path -Parent $projectDirectory) 'dc-simu\dc-simu'
}
$CodeDirectory = [IO.Path]::GetFullPath($CodeDirectory)
if (-not (Test-Path -LiteralPath (Join-Path $CodeDirectory 'package.json') -PathType Leaf)) {
    throw "Codigo DC-Simu nao encontrado: $CodeDirectory"
}

function New-TerminalCommand {
    param([string]$Binary, [string]$Suffix = '')
    if (-not (Test-Path -LiteralPath $Binary -PathType Leaf)) { throw "Cliente nao instalado: $Binary" }
    # Aspas simples pertencem ao comando PowerShell guardado no preset.
    # Evitam perder aspas internas ao passar argumentos nativos em PowerShell 5.1.
    return ("& '" + $Binary.Replace("'", "''") + "'" + $Suffix)
}

$definitions = @{
    Copilot = @{ name = 'Copilot'; preset = 'Copilot CLI'; binary = (Join-Path $env:APPDATA 'npm\node_modules\@github\copilot\node_modules\@github\copilot-win32-x64\copilot.exe'); suffix = ''; aliases = @('Copilot', 'Copilot CLI') }
    Gemini = @{ name = 'Gemini'; preset = 'Gemini CLI'; binary = (Join-Path $env:APPDATA 'npm\gemini.cmd'); suffix = ''; aliases = @('Gemini', 'Gemini CLI') }
    Gemma = @{ name = 'Gemma Local'; preset = 'Gemma Local'; binary = (Join-Path $env:LOCALAPPDATA 'Programs\Ollama\ollama.exe'); suffix = ' run gemma4:e4b'; aliases = @('Gemma Local', 'Gemma') }
    Llama = @{ name = 'Llama Local'; preset = 'Llama Local'; binary = (Join-Path $env:LOCALAPPDATA 'Programs\Ollama\ollama.exe'); suffix = ' run llama3.2:latest'; aliases = @('Llama Local', 'Llama') }
}
$selected = @($Providers | Select-Object -Unique | ForEach-Object {
    $item = $definitions[$_]
    $item.command = New-TerminalCommand -Binary $item.binary -Suffix $item.suffix
    $item
})
if ($LocalOnly) {
    $selected | ForEach-Object { Write-Output ("$($_.name): $($_.command)") }
    Write-Output 'Clientes encontrados. Execute sem -LocalOnly num terminal Maestri para acrescentar os terminais.'
    return
}
if (-not $env:MAESTRI_PIPE) {
    throw 'Abra este script no Shell do workspace BraiNet OS no Maestri, com Maestro Mode ativo. Esta sessao nao tem MAESTRI_PIPE.'
}
$cliPath = $env:MAESTRI_CLI
if (-not $cliPath) { $cliPath = (Get-Command maestri -ErrorAction Stop).Source }
function Invoke-TerminalCli {
    param([string[]]$Arguments)
    $result = Invoke-MaestriCli -CliPath $cliPath -CliArguments $Arguments
    $result.Lines | ForEach-Object { Write-Host ([string]$_) }
    if ($result.ExitCode -ne 0) {
        $debug = Invoke-MaestriCli -CliPath $cliPath -CliArguments @('debug')
        $debug.Lines | ForEach-Object { Write-Host ([string]$_) }
        $operation = ($Arguments | Select-Object -First 3) -join ' '
        $details = ($result.Lines | ForEach-Object { [string]$_ }) -join "`n"
        throw "Falhou 'maestri $operation' (codigo $($result.ExitCode)). Ative Maestro neste terminal se o CLI o solicitar.`n$details"
    }
    return (($result.Lines | ForEach-Object { [string]$_ }) -join "`n")
}
function Test-TerminalName {
    param([string]$Listing, [string]$Name)
    $token = [regex]::Escape($Name)
    return [regex]::IsMatch($Listing, ('(?m)(?:"' + $token + '"|^\s*(?:[-*]\s*)?' + $token + '\s*(?=$|[:|\[(]))'))
}

$null = Invoke-TerminalCli -Arguments @('debug')
$workspaces = Invoke-TerminalCli -Arguments @('workspace', 'list')
if (-not (Find-MaestriWorkspace -Lines ($workspaces -split "`n") -Name 'BraiNet OS' -Directory $projectDirectory)) {
    throw 'Workspace BraiNet OS nao confirmado.'
}
$current = @($workspaces -split "`n" | Where-Object { $_ -match '^\s*"BraiNet OS"\s+' })
if ($current.Count -ne 1 -or $current[0] -notmatch '\(you are here\)\s*$') { throw 'Execute no workspace BraiNet OS.' }
$team = Invoke-TerminalCli -Arguments @('list')
$presets = Invoke-TerminalCli -Arguments @('preset', 'list')

foreach ($item in $selected) {
    $existing = @($item.aliases | Where-Object { Test-TerminalName -Listing $team -Name $_ })
    $replacementExists = $ReplaceTerminal -and (Test-TerminalName -Listing $team -Name $ReplaceTerminal)
    if ($existing.Count -and $replacementExists) {
        throw 'Gemma ja existe e o terminal antigo ainda esta presente. Nao foi criado outro agente nem removido um terminal.'
    }
    if ($existing.Count) {
        Write-Host "Terminal existente reutilizado: $($existing -join ', ')."
        continue
    }
    if ($ReplaceTerminal -and -not $replacementExists) {
        throw "Terminal '$ReplaceTerminal' nao confirmado. Consulte maestri list e indique o nome exato; nenhum substituto foi criado."
    }
    if (Test-TerminalName -Listing $presets -Name $item.preset) {
        $saved = Invoke-TerminalCli -Arguments @('preset', 'show', $item.preset)
        if (-not $saved.Contains($item.command)) { throw "Preset '$($item.preset)' tem outro comando. Foi preservado; nenhum terminal deste fornecedor foi criado." }
    } else {
        $null = Invoke-TerminalCli -Arguments @('preset', 'create', $item.preset, '--command', $item.command, '--maestro', 'off', '--chat', 'off')
        $saved = Invoke-TerminalCli -Arguments @('preset', 'show', $item.preset)
        if (-not $saved.Contains($item.command)) { throw "Comando do preset '$($item.preset)' nao confirmado; nao foi iniciado." }
        $presets = Invoke-TerminalCli -Arguments @('preset', 'list')
    }
    # Revalidar antes de recrutar para nao duplicar um terminal criado entretanto.
    $team = Invoke-TerminalCli -Arguments @('list')
    if (@($item.aliases | Where-Object { Test-TerminalName -Listing $team -Name $_ }).Count) {
        if ($ReplaceTerminal) { throw 'A equipa mudou entretanto. Confirme os terminais antes de substituir.' }
        continue
    }
    if ($ReplaceTerminal) {
        if (-not (Test-TerminalName -Listing $team -Name $ReplaceTerminal)) { throw 'O terminal antigo mudou entretanto; substituicao interrompida.' }
        # Trocar o processo no mesmo node preserva posicao, ligacoes e rotinas.
        $null = Invoke-TerminalCli -Arguments @('recruit', $item.name, '--preset', $item.preset, '--replace', $ReplaceTerminal, '--dir', $CodeDirectory)
    } else {
        $null = Invoke-TerminalCli -Arguments @('recruit', $item.name, '--preset', $item.preset, '--dir', $CodeDirectory)
    }
    $team = Invoke-TerminalCli -Arguments @('list')
    if (-not (Test-TerminalName -Listing $team -Name $item.name)) { throw "Terminal '$($item.name)' nao confirmado pelo CLI." }
}
Write-Host 'Terminais adicionais confirmados pelo CLI. Conclua o login nos clientes cloud quando solicitado.'
Write-Host 'O arranque dos terminais nao confirma autenticacao ou uma resposta do modelo. Gemma e Llama funcionam localmente pelo Ollama.'
