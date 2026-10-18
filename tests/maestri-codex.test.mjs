import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, writeFile, readFile, rm, realpath } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';

async function fixture(scenario, verify) {
  const root = await realpath(await mkdtemp(path.join(os.tmpdir(), 'brainet codex ')));
  try {
    await mkdir(path.join(root, 'scripts'));
    for (const name of ['Repair-MaestriCodex.ps1', 'MaestriWorkspace.Helpers.ps1']) {
      await copyFile(new URL(`../scripts/${name}`, import.meta.url), path.join(root, 'scripts', name));
    }
    await copyFile(new URL('./fixtures/maestri-codex-cli.mjs', import.meta.url), path.join(root, 'mock.mjs'));
    for (const client of ['maestri', 'codex']) {
      await writeFile(path.join(root, `${client}.cmd`), `@echo off\r\nnode "%~dp0mock.mjs" ${client} %*\r\nexit /b %ERRORLEVEL%\r\n`);
    }
    const run = (extra = []) => spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(root, 'scripts/Repair-MaestriCodex.ps1'), '-CodexBinary', path.join(root, 'codex.cmd'), ...extra], {
      encoding: 'utf8', timeout: 30000,
      env: { ...process.env, MAESTRI_CLI: path.join(root, 'maestri.cmd'), MAESTRI_PIPE: scenario === 'no-pipe' ? '' : 'synthetic-only', BRAINET_TEST_PROJECT: root, BRAINET_TEST_CASE: scenario },
    });
    const calls = async () => (await readFile(path.join(root, 'calls.jsonl'), 'utf8')).trim().split(/\r?\n/u).map(line => JSON.parse(line));
    await verify({ run, calls });
  } finally { await rm(root, { recursive: true, force: true }); }
}
const started = calls => calls.filter(call => call.client === 'codex' && !call.args.includes('--version') && !call.args.includes('--help'));

test('StartOnly inicia Codex sem pipe e sem chamar Maestri', { skip: process.platform !== 'win32' }, () => fixture('no-pipe', async ({ run, calls }) => {
  const result = run(['-StartOnly']);
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const log = await calls();
  assert.equal(log.some(call => call.client === 'maestri'), false);
  assert.deepEqual(started(log).map(call => call.args), [['--no-daemon', '--model', 'gpt-6.1-sol']]);
}));

test('Start permite arranque local apos falha de IPC e mostra a causa', { skip: process.platform !== 'win32' }, () => fixture('broken-pipe', async ({ run, calls }) => {
  const result = run(['-Start']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout + result.stderr, /workspace list.*codigo 9/su);
  assert.match(result.stdout + result.stderr, /synthetic pipe disconnected/u);
  const log = await calls();
  assert.equal(started(log).length, 1);
  assert.equal(log.some(call => call.client === 'maestri' && call.args[0] === 'preset' && call.args[1] === 'set'), false);
}));

test('falha de preset mostra comando, codigo e stderr sem declarar sucesso', { skip: process.platform !== 'win32' }, () => fixture('preset-failure', async ({ run, calls }) => {
  const result = run();
  assert.notEqual(result.status, 0);
  assert.match(result.stdout + result.stderr, /preset set Codex.*codigo 7/su);
  assert.match(result.stdout + result.stderr, /synthetic preset denied/u);
  assert.doesNotMatch(result.stdout + result.stderr, /Preset Codex confirmado/u);
  assert.equal(started(await calls()).length, 0);
}));

test('debug indisponivel nao bloqueia consultas validas e preset e reutilizado', { skip: process.platform !== 'win32' }, () => fixture('debug-unavailable', async ({ run, calls }) => {
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = run();
    assert.equal(result.status, 0, result.stdout + result.stderr);
  }
  const log = await calls();
  assert.equal(log.filter(call => call.client === 'maestri' && call.args[1] === 'set').length, 1);
  assert.equal(log.some(call => ['recruit', 'dismiss', 'ask', 'role'].includes(call.args[0])), false);
}));
