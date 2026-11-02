import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, writeFile, readFile, rm, realpath } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';

async function fixture(scenario, verify) {
  const root = await realpath(await mkdtemp(path.join(os.tmpdir(), 'brainet-ai-terminals-')));
  try {
    for (const dir of ['scripts', 'code']) await mkdir(path.join(root, dir));
    for (const name of ['Add-MaestriAiTerminals.ps1', 'MaestriWorkspace.Helpers.ps1']) {
      await copyFile(new URL(`../scripts/${name}`, import.meta.url), path.join(root, 'scripts', name));
    }
    await writeFile(path.join(root, 'code/package.json'), '{}');
    const binaries = [
      'app/npm/node_modules/@github/copilot/node_modules/@github/copilot-win32-x64/copilot.exe',
      'app/npm/gemini.cmd',
      'local/Programs/Ollama/ollama.exe',
    ];
    for (const binary of binaries) {
      await mkdir(path.dirname(path.join(root, binary)), { recursive: true });
      await writeFile(path.join(root, binary), '');
    }
    await copyFile(new URL('./fixtures/maestri-ai-cli.ps1', import.meta.url), path.join(root, 'mock.ps1'));
    await writeFile(path.join(root, 'mock.cmd'), '@echo off\r\npowershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0mock.ps1" %*\r\nexit /b %ERRORLEVEL%\r\n');
    const run = (extra = []) => spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(root, 'scripts/Add-MaestriAiTerminals.ps1'), '-CodeDirectory', path.join(root, 'code'), ...extra], {
      encoding: 'utf8', timeout: 90000,
      env: { ...process.env, APPDATA: path.join(root, 'app'), LOCALAPPDATA: path.join(root, 'local'), MAESTRI_CLI: path.join(root, 'mock.cmd'), MAESTRI_PIPE: 'synthetic-only', BRAINET_TEST_CASE: scenario, BRAINET_TEST_PROJECT: root },
    });
    const calls = async () => (await readFile(path.join(root, 'calls.jsonl'), 'utf8')).trim().split(/\r?\n/u).map(line => JSON.parse(line.replace(/^\uFEFF/u, '')));
    await verify({ root, run, calls });
  } finally { await rm(root, { recursive: true, force: true }); }
}

test('acrescenta apenas quatro terminais, preserva comandos com espacos e reutiliza-os', { skip: process.platform !== 'win32' }, () => fixture('normal', async ({ root, run, calls }) => {
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = run();
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stdout + result.stderr);
  }
  const log = await calls();
  const recruits = log.filter(args => args[0] === 'recruit');
  assert.deepEqual(recruits.map(args => args[1]), ['Copilot', 'Gemini', 'Gemma Local', 'Llama Local']);
  assert.ok(recruits.every(args => args.length === 6 && args[4] === '--dir' && args[5] === path.join(root, 'code')));
  const creates = log.filter(args => args[0] === 'preset' && args[1] === 'create');
  assert.equal(creates.length, 4);
  assert.equal(creates[0][4], `& '${path.join(root, 'app/npm/node_modules/@github/copilot/node_modules/@github/copilot-win32-x64/copilot.exe')}'`);
  assert.ok(creates.every(args => args.length === 9 && args[5] === '--maestro' && args[6] === 'off'));
  assert.equal(log.some(args => args.includes('--replace') || ['role', 'ask', 'dismiss', 'connect'].includes(args[0]) || args[1] === 'set'), false);
}));

test('substitui Mistral por Gemma no mesmo terminal e nao duplica ao repetir', { skip: process.platform !== 'win32' }, () => fixture('replace-mistral', async ({ run, calls }) => {
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = run(['-Providers', 'Gemma', '-ReplaceTerminal', 'Mistral']);
    assert.equal(result.status, 0, result.stdout + result.stderr);
  }
  const log = await calls();
  const recruits = log.filter(args => args[0] === 'recruit');
  assert.equal(recruits.length, 1);
  assert.deepEqual(recruits[0].slice(0, 6), ['recruit', 'Gemma Local', '--preset', 'Gemma Local', '--replace', 'Mistral']);
  assert.equal(log.some(args => ['dismiss', 'ask', 'role'].includes(args[0])), false);
}));

test('terminal de substituicao ausente impede criar preset ou recrutar', { skip: process.platform !== 'win32' }, () => fixture('normal', async ({ run, calls }) => {
  const result = run(['-Providers', 'Gemma', '-ReplaceTerminal', 'Mistral']);
  assert.notEqual(result.status, 0);
  assert.equal((await calls()).some(args => args[0] === 'recruit' || args[1] === 'create'), false);
}));

test('Gemma e Mistral ja presentes impedem duplicar ou remover terminais', { skip: process.platform !== 'win32' }, () => fixture('both-terminals', async ({ run, calls }) => {
  const result = run(['-Providers', 'Gemma', '-ReplaceTerminal', 'Mistral']);
  assert.notEqual(result.status, 0);
  assert.equal((await calls()).some(args => ['recruit', 'dismiss'].includes(args[0]) || args[1] === 'create'), false);
}));

test('workspace incorreto impede criacao de presets e terminais', { skip: process.platform !== 'win32' }, () => fixture('wrong-workspace', async ({ run, calls }) => {
  const result = run();
  assert.notEqual(result.status, 0);
  assert.equal((await calls()).some(args => args[0] === 'recruit' || args[1] === 'create'), false);
}));
