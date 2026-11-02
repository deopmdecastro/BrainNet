param(
    [string]$WorkspaceName = 'BraiNet OS'
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'MaestriWorkspace.Helpers.ps1')
$projectDirectory = [System.IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))

if (-not (Test-Path -LiteralPath (Join-Path $projectDirectory '00-Dashboard\Home.md') -PathType Leaf)) {
    throw 'Pasta de projeto invalida: 00-Dashboard/Home.md nao encontrado.'
}

$cliPath = $env:MAESTRI_CLI
if (-not $cliPath) {
    $cliCommand = Get-Command maestri -ErrorAction SilentlyContinue
    if ($cliCommand) { $cliPath = $cliCommand.Source }
}
if (-not $cliPath) {
    $appProcess = Get-Process Maestri -ErrorAction SilentlyContinue |
        Where-Object { $_.Path -and $_.Path -match '[\\/]Maestri\.exe$' } |
        Select-Object -First 1
    if ($appProcess) {
        $candidatePath = Join-Path (Split-Path -Parent $appProcess.Path) 'resources\cli\maestri.exe'
        if (Test-Path -LiteralPath $candidatePath -PathType Leaf) { $cliPath = $candidatePath }
    }
}
if (-not $cliPath -or -not (Test-Path -LiteralPath $cliPath -PathType Leaf)) {
    throw 'CLI Maestri nao encontrado. Execute este script num terminal aberto pelo Maestri.'
}
if (-not $env:MAESTRI_PIPE) {
    throw 'Esta sessao nao pertence a um terminal Maestri (MAESTRI_PIPE ausente). Abra um terminal no Maestri, ative Maestro Mode e execute novamente este script.'
}

Write-Output 'A verificar os workspaces existentes antes de criar...'
$listing = Invoke-MaestriCli -CliPath $cliPath -CliArguments @('workspace', 'list')
$listing.Lines | Write-Output
if ($listing.ExitCode -ne 0) {
    throw 'Nao foi possivel listar workspaces. Confirme que Maestro Mode esta ativo neste terminal; nenhuma criacao foi tentada.'
}

$reused = Find-MaestriWorkspace -Lines $listing.Lines -Name $WorkspaceName -Directory $projectDirectory
if ($reused) {
    Write-Output "Workspace '$WorkspaceName' ja existe na pasta correta; a reutilizar sem criar outro."
} else {
    Write-Output "A criar '$WorkspaceName' em '$projectDirectory'..."
    $creation = Invoke-MaestriCli -CliPath $cliPath -CliArguments @('workspace', 'create', $WorkspaceName, '--dir', $projectDirectory)
    $creation.Lines | Write-Output

    # Voltar a listar mesmo em erro: outro terminal pode ter criado o workspace.
    $verification = Invoke-MaestriCli -CliPath $cliPath -CliArguments @('workspace', 'list')
    $verification.Lines | Write-Output
    if ($verification.ExitCode -ne 0) { throw 'Nao foi possivel verificar a sidebar. Confira-a antes de repetir o script.' }
    if (-not (Find-MaestriWorkspace -Lines $verification.Lines -Name $WorkspaceName -Directory $projectDirectory)) {
        throw "O Maestri nao confirmou '$WorkspaceName' na pasta esperada (exit da criacao: $($creation.ExitCode))."
    }
    $reused = $creation.ExitCode -ne 0
}

$evidenceDirectory = Join-Path $projectDirectory 'runtime\maestri'
New-Item -ItemType Directory -Force -Path $evidenceDirectory | Out-Null
$receipt = [ordered]@{
    workspace_name = $WorkspaceName
    directory = $projectDirectory
    verified_at_utc = [DateTime]::UtcNow.ToString('o')
    workspace_confirmed_by_cli = $true
    reused_existing = $reused
    agents_recruited = $false
}
$receiptPath = Join-Path $evidenceDirectory 'workspace-verified.json'
[System.IO.File]::WriteAllText($receiptPath, ($receipt | ConvertTo-Json), [System.Text.UTF8Encoding]::new($false))
Write-Output "Workspace pronto. Recibo de verificacao local: $receiptPath"
