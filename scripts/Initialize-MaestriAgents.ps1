param([switch]$LocalOnly)
$ErrorActionPreference = 'Stop'
$projectDirectory = [IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
. (Join-Path $PSScriptRoot 'MaestriWorkspace.Helpers.ps1')

node (Join-Path $PSScriptRoot 'agent-environment.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Falha ao preparar o ambiente DeepSeek local; nenhum preset foi criado.' }
if ($LocalOnly -or -not $env:MAESTRI_PIPE) {
    Write-Output 'Ambiente local preparado. Para ativar Sonda, execute este script num terminal Maestri de BraiNet OS com Maestro Mode.'
    return
}
$cliPath = $env:MAESTRI_CLI
if (-not $cliPath) { $cliPath = (Get-Command maestri -ErrorAction Stop).Source }
function Invoke-SetupCli {
    param([string[]]$Arguments)
    $result = Invoke-MaestriCli -CliPath $cliPath -CliArguments $Arguments
    $result.Lines | ForEach-Object { Write-Host ([string]$_) }
    if ($result.ExitCode -ne 0) {
        $diagnostic = Invoke-MaestriCli -CliPath $cliPath -CliArguments @('debug')
        $diagnostic.Lines | ForEach-Object { Write-Host ([string]$_) }
        throw 'Comando Maestri falhou; consulte o diagnostico antes de repetir.'
    }
    return (($result.Lines | ForEach-Object { [string]$_ }) -join "`n")
}
$workspaceListing = Invoke-SetupCli -Arguments @('workspace', 'list')
if (-not (Find-MaestriWorkspace -Lines ($workspaceListing -split "`n") -Name 'BraiNet OS' -Directory $projectDirectory)) { throw 'Workspace BraiNet OS nao confirmado.' }
$currentLine = @($workspaceListing -split "`n" | Where-Object { $_ -match '^\s*"BraiNet OS"\s+' })
if ($currentLine.Count -ne 1 -or $currentLine[0] -notmatch '\(you are here\)\s*$') { throw 'Abra este script num terminal do workspace BraiNet OS.' }
$null = Invoke-SetupCli -Arguments @('list')
$listing = Invoke-SetupCli -Arguments @('preset', 'list')
$receipt = Get-Content -LiteralPath (Join-Path $projectDirectory 'runtime\maestri\agent-environment.json') -Raw -Encoding UTF8 | ConvertFrom-Json
if ($listing -match '(?m)(?:"DeepSeek Local"|^\s*(?:[-*]\s*)?DeepSeek Local\s*(?=$|[:|\[(]))') {
    $preset = Invoke-SetupCli -Arguments @('preset', 'show', 'DeepSeek Local')
    if (-not $preset.Contains($receipt.preset_command)) { throw 'Preset DeepSeek Local ja existe com outro comando. Foi preservado.' }
} elseif ($listing.Contains('DeepSeek Local')) {
    throw 'Formato de preset ambiguo. Confirme maestri preset list antes de criar.'
} else {
    # PowerShell 5.1 remove aspas internas ao invocar programas nativos.
    # O comando direto e transmitido com as aspas escapadas para o runtime Windows.
    $nativeCommand = $receipt.preset_command.Replace('"', '\"')
    $null = Invoke-SetupCli -Arguments @('preset', 'create', 'DeepSeek Local', '--command', $nativeCommand)
    $preset = Invoke-SetupCli -Arguments @('preset', 'show', 'DeepSeek Local')
    if (-not $preset.Contains($receipt.preset_command)) { throw 'O comando guardado no preset nao coincide. Confirme-o antes de iniciar agentes.' }
}
& (Join-Path $PSScriptRoot 'Configure-MaestriTeam.ps1') -IncludeDeepSeek
if (-not $?) { throw 'Configuracao da equipa incompleta.' }
