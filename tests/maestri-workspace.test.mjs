import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, writeFile, readFile, access, rm, realpath } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';

async function runFixture(scenario, verify) {
  const root = await realpath(await mkdtemp(path.join(os.tmpdir(), 'brainet-maestri-')));
  try {
    await mkdir(path.join(root, 'scripts'));
    await mkdir(path.join(root, '00-Dashboard'));
    await writeFile(path.join(root, '00-Dashboard/Home.md'), '# Synthetic project\n');
    for (const name of ['Create-MaestriWorkspace.ps1', 'MaestriWorkspace.Helpers.ps1']) {
      await copyFile(new URL(`../scripts/${name}`, import.meta.url), path.join(root, 'scripts', name));
    }
    await copyFile(new URL('./fixtures/maestri-cli.ps1', import.meta.url), path.join(root, 'mock-cli.ps1'));
    const cli = path.join(root, 'mock-cli.cmd');
    await writeFile(cli, '@echo off\r\npowershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0mock-cli.ps1" %*\r\nexit /b %ERRORLEVEL%\r\n');
    const callsFile = path.join(root, 'calls.txt');
    const result = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(root, 'scripts/Create-MaestriWorkspace.ps1')], {
      encoding: 'utf8', timeout: 20000,
      env: { ...process.env, MAESTRI_CLI: cli, MAESTRI_PIPE: 'synthetic-no-real-connection', BRAINET_TEST_CASE: scenario, BRAINET_TEST_PROJECT: root, BRAINET_TEST_CALLS: callsFile, BRAINET_TEST_STATE: path.join(root, 'mock-state') },
    });
    assert.ifError(result.error);
    const callLog = await readFile(callsFile, 'utf8').catch(error => { throw new Error(`${error.message}\n${result.stderr}\n${result.stdout}`); });
    const calls = callLog.trim().split(/\r?\n/u);
    await verify({ root, result, calls, receipt: path.join(root, 'runtime/maestri/workspace-verified.json') });
  } finally { await rm(root, { recursive: true, force: true }); }
}

for (const scenario of ['same', 'current', 'current-middle-dot', 'current-bullet', 'current-ascii-dot']) {
  test(`Maestri reutiliza workspace existente (${scenario}) sem criar`, { skip: process.platform !== 'win32' }, () => runFixture(scenario, async ({ result, calls, receipt }) => {
    assert.equal(result.status, 0, result.stderr + result.stdout);
    assert.deepEqual(calls, ['workspace list']);
    assert.equal(JSON.parse(await readFile(receipt, 'utf8')).reused_existing, true);
  }));
}
for (const scenario of ['different', 'prefix', 'prefix-current', 'list-error']) {
  test(`Maestri interrompe ${scenario} sem criar nem escrever recibo`, { skip: process.platform !== 'win32' }, () => runFixture(scenario, async ({ result, calls, receipt }) => {
    assert.notEqual(result.status, 0);
    assert.deepEqual(calls, ['workspace list']);
    await assert.rejects(access(receipt));
  }));
}
for (const scenario of ['absent', 'concurrent']) {
  test(`Maestri verifica a pasta depois da tentativa de criacao (${scenario})`, { skip: process.platform !== 'win32' }, () => runFixture(scenario, async ({ result, calls, receipt }) => {
    assert.equal(result.status, 0, result.stderr + result.stdout);
    assert.deepEqual(calls, ['workspace list', 'workspace create', 'workspace list']);
    const evidence = JSON.parse(await readFile(receipt, 'utf8'));
    assert.equal(evidence.workspace_confirmed_by_cli, true);
    assert.equal(evidence.reused_existing, scenario === 'concurrent');
  }));
}
