function Invoke-MaestriCli {
    param([string]$CliPath, [string[]]$CliArguments)

    # Windows PowerShell 5.1 transforma stderr nativo em ErrorRecord com 2>&1.
    # Guardar o exit code antes de decidir se houve falha, sem abortar prematuramente.
    $previousPreference = $ErrorActionPreference
    $previousEncoding = [Console]::OutputEncoding
    try {
        $ErrorActionPreference = 'Continue'
        [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
        $outputLines = @(& $CliPath @CliArguments 2>&1)
        $commandExitCode = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $previousPreference
        [Console]::OutputEncoding = $previousEncoding
    }
    [PSCustomObject]@{ ExitCode = $commandExitCode; Lines = $outputLines }
}

function Find-MaestriWorkspace {
    param([object[]]$Lines, [string]$Name, [string]$Directory)

    # Formato observado em workspace list: "Nome" <icone> C:\pasta [marcador atual].
    # Ignorar icones/encoding e verificar nome e caminho completos; ambiguidades falham.
    $namePattern = '^\s*"' + [regex]::Escape($Name) + '"\s+(?<details>.*)$'
    $matchingLines = @($Lines | Where-Object { [string]$_ -match $namePattern })
    if ($matchingLines.Count -eq 0) { return $false }
    if ($matchingLines.Count -ne 1) { throw "Listagem ambigua para '$Name'; confira a sidebar antes de continuar." }

    $details = [regex]::Match([string]$matchingLines[0], $namePattern, 'IgnoreCase').Groups['details'].Value.Replace('/', '\')
    $expected = [System.IO.Path]::GetFullPath($Directory).TrimEnd([char[]]'\/').Replace('/', '\')
    $pathStart = [regex]::Match($details, '(?:[A-Za-z]:\\|\\\\)')
    if (-not $pathStart.Success) { throw "Nao foi possivel verificar a pasta de '$Name'; nenhuma criacao foi tentada." }
    $listedPathAndMarker = $details.Substring($pathStart.Index).Trim()
    if ($listedPathAndMarker.Length -lt $expected.Length -or -not $listedPathAndMarker.StartsWith($expected, [StringComparison]::OrdinalIgnoreCase)) {
        throw "O workspace '$Name' ja existe noutra pasta. Nenhum workspace foi alterado. Confira workspace list."
    }
    $suffix = $listedPathAndMarker.Substring($expected.Length).Trim()
    # O CLI tambem usa ponto medio/bullet antes do marcador atual.
    # Aceitar apenas separadores conhecidos: o resto do sufixo continua a falhar.
    $markerPattern = '^[' + [char]0x2190 + [char]0x2192 + [char]0x00B7 + [char]0x2022 + '*<>.\s-]*\(you are here\)$'
    if ($suffix -and $suffix -notmatch $markerPattern) {
        throw "A pasta ou o formato da listagem de '$Name' difere do esperado. Nenhum workspace foi alterado."
    }
    return $true
}
