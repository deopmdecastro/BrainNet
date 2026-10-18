param(
    [string]$Image = 'docker.n8n.io/n8nio/n8n:2.43.7'
)
$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path -Parent $PSScriptRoot
$workflowRoot = Join-Path $taskRoot 'automation\n8n\workflows'
$evidenceRoot = Join-Path $taskRoot 'runtime\n8n-validation'
New-Item -ItemType Directory -Force -Path $evidenceRoot | Out-Null
$isolatedInputs = Join-Path $evidenceRoot 'inputs'
New-Item -ItemType Directory -Force -Path $isolatedInputs | Out-Null
& docker image inspect $Image --format '{{.Id}}' | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Imagem ausente. Use -Image com uma imagem n8n 2.43.7 local; não é feito pull automaticamente.' }
foreach ($workflowId in @('WF-01', 'WF-03', 'WF-05')) {
    $testId = "brainet-test-$workflowId"
    $workflow = Get-Content -LiteralPath (Join-Path $workflowRoot "$workflowId.json") -Raw -Encoding UTF8 | ConvertFrom-Json
    $workflow | Add-Member -NotePropertyName id -NotePropertyValue $testId -Force
    $serialized = $workflow | ConvertTo-Json -Depth 100
    [System.IO.File]::WriteAllText((Join-Path $isolatedInputs "$workflowId.json"), $serialized, [System.Text.UTF8Encoding]::new($false))
    $runner = "const {spawnSync}=require('node:child_process'); for(const args of [['import:workflow','--input=/workflows/$workflowId.json'],['execute','--id=$testId','--rawOutput']]) { const r=spawnSync('n8n',args,{stdio:'inherit'}); if(r.status!==0) process.exit(r.status||1); }"
    $dockerArgs = @(
        'run', '--rm', '--network', 'none', '--read-only',
        '--tmpfs', '/tmp:rw,noexec,nosuid,size=256m',
        '--tmpfs', '/home/node/.n8n:rw,uid=1000,gid=1000,size=256m',
        '--mount', "type=bind,source=$isolatedInputs,target=/workflows,readonly",
        '-e', 'N8N_LOG_LEVEL=info',
        '-e', 'N8N_DIAGNOSTICS_ENABLED=false',
        '-e', 'N8N_VERSION_NOTIFICATIONS_ENABLED=false',
        '-e', 'N8N_TEMPLATES_ENABLED=false',
        '-e', 'N8N_COMMUNITY_PACKAGES_ENABLED=false',
        '--entrypoint', 'node', $Image, '-e', $runner
    )
    $output = & docker @dockerArgs 2>&1
    $executionCode = $LASTEXITCODE
    $output | Set-Content -LiteralPath (Join-Path $evidenceRoot "$workflowId.log") -Encoding UTF8
    if ($executionCode -ne 0) { $output | Select-Object -Last 30 | Write-Output; throw "Falhou $workflowId (exit $executionCode)" }
    if (($output -join "`n") -notmatch '"finished"\s*:\s*true') { $output | Select-Object -Last 30 | Write-Output; throw "Execucao $workflowId sem confirmacao finished=true" }
    Write-Output "$workflowId executado: finished=true (rede desativada; dados temporarios)."
}
& node (Join-Path $PSScriptRoot 'summarize-n8n.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Falhou a verificacao dos resultados dos workflows.' }
