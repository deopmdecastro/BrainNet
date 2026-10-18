param([Parameter(ValueFromRemainingArguments = $true)][string[]]$CliArguments)
$ErrorActionPreference = 'Stop'
$action = $CliArguments[0]
Add-Content -LiteralPath $env:BRAINET_TEST_CALLS -Value (ConvertTo-Json -InputObject @($CliArguments) -Compress)
$state = @{ roles = @{}; agents = @{} }
if (Test-Path -LiteralPath $env:BRAINET_TEST_STATE) {
    $saved = Get-Content -Raw -LiteralPath $env:BRAINET_TEST_STATE | ConvertFrom-Json
    foreach ($property in $saved.roles.PSObject.Properties) { $state.roles[$property.Name] = $property.Value }
    foreach ($property in $saved.agents.PSObject.Properties) { $state.agents[$property.Name] = $property.Value }
}
function Save-TestState {
    $state | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $env:BRAINET_TEST_STATE -Encoding UTF8
}
switch ($action) {
    'workspace' {
        $marker = '  ' + [char]0x00B7 + ' (you are here)'
        if ($env:BRAINET_TEST_CASE -eq 'wrong-workspace') { $marker = '' }
        Write-Output ('"BraiNet OS" [folder] ' + $env:BRAINET_TEST_PROJECT + $marker)
    }
    'preset' {
        if ($env:BRAINET_TEST_CASE -eq 'missing-preset') { Write-Output '"Shell"' }
        else {
            Write-Output '"Codex"'
            if ($env:BRAINET_TEST_CASE -eq 'deepseek') { Write-Output '"DeepSeek Local"' }
        }
    }
    'list' {
        foreach ($name in $state.agents.Keys) { Write-Output ('"' + $name + '" role: "' + $state.agents[$name] + '"') }
    }
    'role' {
        switch ($CliArguments[1]) {
            'list' { foreach ($name in $state.roles.Keys) { Write-Output ('"' + $name + '"') } }
            'show' { Write-Output $state.roles[$CliArguments[2]] }
            'create' {
                if ($state.roles.ContainsKey($CliArguments[2])) { exit 7 }
                $state.roles[$CliArguments[2]] = $CliArguments[3]
                Save-TestState
            }
            default { exit 8 }
        }
    }
    'recruit' {
        if ($env:BRAINET_TEST_CASE -eq 'recruit-failure') { exit 9 }
        if ($state.agents.ContainsKey($CliArguments[1])) { exit 10 }
        $state.agents[$CliArguments[1]] = $CliArguments[5]
        Save-TestState
    }
    'connect' { Write-Output 'Synthetic connection confirmed' }
    'debug' { Write-Output 'Synthetic diagnostic' }
    default { exit 11 }
}
exit 0
