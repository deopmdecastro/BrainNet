param(
    [string]$WorkspaceName = 'BraiNet OS'
)

$ErrorActionPreference = 'Stop'
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
$workspaceList = & $cliPath workspace list 2>&1
$listExitCode = $LASTEXITCODE
$workspaceList | Write-Output
if ($listExitCode -ne 0) {
    throw 'Nao foi possivel listar workspaces. Confirme que Maestro Mode esta ativo neste terminal; nenhuma criacao foi tentada.'
}

# A lista e apenas informativa. O CLI e responsavel por recusar nomes em uso;
# nao interpretar formato textual da sidebar como uma API JSON inexistente.
Write-Output "A criar '$WorkspaceName' em '$projectDirectory'..."
$creationOutput = & $cliPath workspace create $WorkspaceName --dir $projectDirectory 2>&1
$creationExitCode = $LASTEXITCODE
$creationOutput | Write-Output
if ($creationExitCode -ne 0) {
    throw 'O Maestri nao confirmou a criacao. Se o nome ja existir, confirme na lista a pasta desse workspace e reutilize-o. O script nao substitui nem remove workspaces.'
}

Write-Output 'Criacao confirmada pelo CLI. A verificar a sidebar...'
& $cliPath workspace list
if ($LASTEXITCODE -ne 0) { throw 'A criacao foi confirmada, mas a listagem final falhou. Verifique a sidebar antes de repetir.' }

$evidenceDirectory = Join-Path $projectDirectory 'runtime\maestri'
New-Item -ItemType Directory -Force -Path $evidenceDirectory | Out-Null
$receipt = [ordered]@{
    workspace_name = $WorkspaceName
    directory = $projectDirectory
    created_at_utc = [DateTime]::UtcNow.ToString('o')
    creation_confirmed_by_cli = $true
    agents_recruited = $false
}
$receiptPath = Join-Path $evidenceDirectory 'workspace-created.json'
[System.IO.File]::WriteAllText($receiptPath, ($receipt | ConvertTo-Json), [System.Text.UTF8Encoding]::new($false))
Write-Output "Workspace criado. Recibo local: $receiptPath"
