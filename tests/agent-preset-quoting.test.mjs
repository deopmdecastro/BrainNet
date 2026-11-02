import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm, copyFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { presetCommand } from '../scripts/agent-environment.mjs';

test('PowerShell transmite o comando DeepSeek com aspas intactas a um CLI nativo', { skip: process.platform !== 'win32' }, async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'brainet-quote-'));
  try {
    await copyFile(new URL('../scripts/MaestriWorkspace.Helpers.ps1', import.meta.url), path.join(root, 'helpers.ps1'));
    await writeFile(path.join(root, 'argv.mjs'), 'console.log(JSON.stringify(process.argv.slice(2)));');
    await writeFile(path.join(root, 'invoke.ps1'), `
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'helpers.ps1')
$nativeCommand = $env:BRAINET_TEST_PRESET_COMMAND.Replace('"', '\\"')
$result = Invoke-MaestriCli -CliPath $env:BRAINET_TEST_NODE -CliArguments @((Join-Path $PSScriptRoot 'argv.mjs'), 'preset', 'create', 'DeepSeek Local', '--command', $nativeCommand)
$result.Lines | Write-Output
exit $result.ExitCode
`);
    const command = presetCommand(path.join(root, 'path with spaces/opencode.exe'));
    const result = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(root, 'invoke.ps1')], { encoding: 'utf8', timeout: 10000, env: { ...process.env, BRAINET_TEST_NODE: process.execPath, BRAINET_TEST_PRESET_COMMAND: command } });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.deepEqual(JSON.parse(result.stdout), ['preset', 'create', 'DeepSeek Local', '--command', command]);
  } finally { await rm(root, { recursive: true, force: true }); }
});
