param([switch]$LocalOnly, [switch]$Start, [switch]$StartOnly, [string]$CodexBinary)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'MaestriWorkspace.Helpers.ps1')
$projectDirectory = [IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
$binary = $CodexBinary
if (-not $binary) { $binary = Join-Path $env:APPDATA 'npm\node_modules\@openai\codex\node_modules\@openai\codex-win32-x64\vendor\x86_64-pc-windows-msvc\bin\codex.exe' }
if ($LocalOnly -and ($Start -or $StartOnly)) { throw '-LocalOnly nao pode ser combinado com -Start ou -StartOnly.' }
if (-not (Test-Path -LiteralPath $binary -PathType Leaf)) { throw 'Executavel Codex npm nao encontrado. Instale o pacote oficial @openai/codex.' }
$version = & $binary --version
if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel verificar a versao do Codex.' }
Write-Host $version
# Validar o argumento problemático sem iniciar sessao nem enviar pedidos ao modelo.
$null = & $binary --no-daemon --model gpt-6.1-sol --help
if ($LASTEXITCODE -ne 0) { throw 'Este executavel nao aceita os argumentos de arranque. Atualize o Codex antes de continuar.' }
# O Maestri pode acrescentar --no-daemon ao iniciar um agente. Nao o duplicar.
$presetCommand = "& '" + $binary.Replace("'", "''") + "' --model gpt-6.1-sol"
Write-Host "Comando do preset: $presetCommand"
if ($LocalOnly) {
    Write-Host 'Validacao local concluida; nenhum preset ou terminal foi alterado.'
    return
}
function Start-LocalCodex {
    Write-Host 'A iniciar o Codex neste terminal com gpt-6.1-sol.'
    & $binary --no-daemon --model gpt-6.1-sol
    if ($LASTEXITCODE -ne 0) { throw "Codex terminou com codigo $LASTEXITCODE." }
}
if ($StartOnly) {
    # Arranque direto: nao depende do IPC e nao altera a configuracao do Maestri.
    Start-LocalCodex
    return
}
function Invoke-RepairCli {
    param([string[]]$Arguments, [switch]$Diagnostic)
    $result = Invoke-MaestriCli -CliPath $cliPath -CliArguments $Arguments
    $result.Lines | ForEach-Object { Write-Host ([string]$_) }
    $outputText = ($result.Lines | ForEach-Object { [string]$_ }) -join "`n"
    if ($result.ExitCode -ne 0) {
        $operation = ($Arguments | Select-Object -First 3) -join ' '
        $failure = "Falhou 'maestri $operation' (codigo $($result.ExitCode)).`n$outputText"
        if ($Diagnostic) {
            # Um debug indisponivel nao prova que os restantes comandos falhem.
            # As consultas seguintes confirmam o acesso antes de qualquer alteracao.
            Write-Warning $failure
            return $outputText
        }
        if ($Arguments[0] -ne 'debug') {
            $diagnosticResult = Invoke-MaestriCli -CliPath $cliPath -CliArguments @('debug')
            $diagnosticResult.Lines | ForEach-Object { Write-Host ([string]$_) }
        }
        throw $failure
    }
    return $outputText
}
try {
    if (-not $env:MAESTRI_PIPE) { throw 'MAESTRI_PIPE ausente. A alteracao do preset exige um terminal Maestri com Maestro Mode.' }
    $cliPath = $env:MAESTRI_CLI
    if (-not $cliPath) { $cliPath = (Get-Command maestri -ErrorAction Stop).Source }
    $null = Invoke-RepairCli -Arguments @('debug') -Diagnostic
    $workspaces = Invoke-RepairCli -Arguments @('workspace', 'list')
    if (-not (Find-MaestriWorkspace -Lines ($workspaces -split "`n") -Name 'BraiNet OS' -Directory $projectDirectory)) { throw 'Workspace BraiNet OS nao confirmado.' }
    $current = @($workspaces -split "`n" | Where-Object { $_ -match '^\s*"BraiNet OS"\s+' })
    if ($current.Count -ne 1 -or $current[0] -notmatch '\(you are here\)\s*$') { throw 'Execute no workspace BraiNet OS.' }
    $null = Invoke-RepairCli -Arguments @('list')
    $presets = Invoke-RepairCli -Arguments @('preset', 'list')
    if ($presets -notmatch '(?m)(?:"Codex"|^\s*(?:[-*]\s*)?Codex\s*(?=$|[:|\[(]))') { throw 'Preset Codex nao confirmado; nenhum preset foi criado ou alterado.' }
    $existing = Invoke-RepairCli -Arguments @('preset', 'show', 'Codex')
    if (-not $existing.Contains($presetCommand)) {
        $null = Invoke-RepairCli -Arguments @('preset', 'set', 'Codex', '--command', $presetCommand)
    }
    $confirmed = Invoke-RepairCli -Arguments @('preset', 'show', 'Codex')
    if (-not $confirmed.Contains($presetCommand)) { throw 'O comando guardado nao coincide; arranque interrompido.' }
    Write-Host 'Preset Codex confirmado. Contas, papeis e outros terminais nao foram alterados.'
} catch {
    if (-not $Start) { throw }
    Write-Warning ("Configuracao do preset nao confirmada. " + $_.Exception.Message)
    Write-Host 'O arranque local pode continuar; o preset tera de ser confirmado separadamente.'
}
if ($Start) { Start-LocalCodex }
