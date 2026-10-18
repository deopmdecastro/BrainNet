param([Parameter(ValueFromRemainingArguments = $true)][string[]]$CliArguments)
$ErrorActionPreference = 'Stop'
$action = $CliArguments[0] + ' ' + $CliArguments[1]
Add-Content -LiteralPath $env:BRAINET_TEST_CALLS -Value $action
if ($action -eq 'workspace list') {
    if ($env:BRAINET_TEST_CASE -eq 'list-error') {
        [Console]::Error.WriteLine('Synthetic list failure')
        exit 2
    }
    Write-Output 'Sidebar (top to bottom, as the user sees it):'
    Write-Output 'Root:'
    $hasCreated = Test-Path -LiteralPath $env:BRAINET_TEST_STATE
    if ($env:BRAINET_TEST_CASE -in @('same', 'current', 'different', 'prefix') -or $hasCreated) {
        $directory = $env:BRAINET_TEST_PROJECT
        if ($env:BRAINET_TEST_CASE -eq 'different') { $directory = 'C:\OtherProject' }
        if ($env:BRAINET_TEST_CASE -eq 'prefix') { $directory += ' Other' }
        $marker = ''
        if ($env:BRAINET_TEST_CASE -in @('current', 'prefix')) { $marker = '  ' + [char]0x2190 + ' (you are here)' }
        Write-Output ('  "BraiNet OS" [folder] ' + $directory + $marker)
    }
    exit 0
}
if ($action -eq 'workspace create') {
    Set-Content -LiteralPath $env:BRAINET_TEST_STATE -Value 'created'
    if ($env:BRAINET_TEST_CASE -eq 'concurrent') {
        [Console]::Error.WriteLine('A workspace named "BraiNet OS" already exists.')
        exit 1
    }
    Write-Output 'Synthetic workspace created'
    exit 0
}
[Console]::Error.WriteLine('Unsupported mock command')
exit 3
