param([Parameter(ValueFromRemainingArguments = $true)][string[]]$CliArguments)
$ErrorActionPreference = 'Stop'
$root = $env:BRAINET_TEST_PROJECT
Add-Content -LiteralPath (Join-Path $root 'calls.jsonl') -Value (ConvertTo-Json -InputObject @($CliArguments) -Compress)
$statePath = Join-Path $root 'state.json'
$state = @{ presets = @{}; agents = @{ Prumo = 'Codex'; Sonda = 'DeepSeek Local' } }
if (Test-Path -LiteralPath $statePath) {
    $saved = Get-Content -Raw -LiteralPath $statePath | ConvertFrom-Json
    foreach ($key in @('presets', 'agents')) {
        foreach ($property in $saved.$key.PSObject.Properties) { $state[$key][$property.Name] = $property.Value }
    }
} elseif ($env:BRAINET_TEST_CASE -in @('replace-mistral', 'both-terminals')) {
    $state.agents['Mistral'] = 'Mistral Vibe'
    if ($env:BRAINET_TEST_CASE -eq 'both-terminals') { $state.agents['Gemma Local'] = 'Gemma Local' }
}
switch ($CliArguments[0]) {
    'debug' { Write-Output 'Synthetic diagnostic' }
    'workspace' {
        $marker = if ($env:BRAINET_TEST_CASE -eq 'wrong-workspace') { '' } else { ' (you are here)' }
        Write-Output ('"BraiNet OS" - ' + $root + $marker)
    }
    'list' { foreach ($name in $state.agents.Keys) { Write-Output ('"' + $name + '" preset: "' + $state.agents[$name] + '"') } }
    'preset' {
        switch ($CliArguments[1]) {
            'list' { foreach ($name in $state.presets.Keys) { Write-Output ('"' + $name + '"') } }
            'show' { Write-Output $state.presets[$CliArguments[2]] }
            'create' {
                if ($state.presets.ContainsKey($CliArguments[2])) { exit 7 }
                $state.presets[$CliArguments[2]] = $CliArguments[4]
            }
            default { exit 8 }
        }
    }
    'recruit' {
        if ($state.agents.ContainsKey($CliArguments[1])) { exit 9 }
        $replaceIndex = [Array]::IndexOf($CliArguments, '--replace')
        if ($replaceIndex -ge 0) {
            $oldName = $CliArguments[$replaceIndex + 1]
            if (-not $state.agents.ContainsKey($oldName)) { exit 11 }
            $state.agents.Remove($oldName)
        }
        $state.agents[$CliArguments[1]] = $CliArguments[3]
    }
    default { exit 10 }
}
$state | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $statePath -Encoding UTF8
exit 0
