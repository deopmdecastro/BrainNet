import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, writeFile, readFile, access, rm, realpath } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';

async function fixture(scenario, verify) {
  const root = await realpath(await mkdtemp(path.join(os.tmpdir(), 'brainet-team-')));
  try {
    for (const dir of ['scripts', '04-Agents', 'code']) await mkdir(path.join(root, dir));
    for (const name of ['Configure-MaestriTeam.ps1', 'MaestriWorkspace.Helpers.ps1']) {
      await copyFile(new URL(`../scripts/${name}`, import.meta.url), path.join(root, 'scripts', name));
    }
    for (const name of ['Orchestrator.md', 'Developer.md', 'Automation-Engineer.md', 'QA-Security.md', 'DeepSeek-Analyst.md']) {
      await copyFile(new URL(`../04-Agents/${name}`, import.meta.url), path.join(root, '04-Agents', name));
    }
    await writeFile(path.join(root, 'code/package.json'), '{}');
    await copyFile(new URL('./fixtures/maestri-team-cli.ps1', import.meta.url), path.join(root, 'mock.ps1'));
    await writeFile(path.join(root, 'mock.cmd'), '@echo off\r\npowershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0mock.ps1" %*\r\nexit /b %ERRORLEVEL%\r\n');
    const callsFile = path.join(root, 'calls.jsonl');
    const run = (extra = []) => spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(root, 'scripts/Configure-MaestriTeam.ps1'), '-CodeDirectory', path.join(root, 'code'), ...extra], {
      encoding: 'utf8', timeout: 90000,
      env: { ...process.env, MAESTRI_CLI: path.join(root, 'mock.cmd'), MAESTRI_PIPE: scenario === 'no-pipe' ? '' : 'synthetic-only', BRAINET_TEST_CASE: scenario, BRAINET_TEST_PROJECT: root, BRAINET_TEST_CALLS: callsFile, BRAINET_TEST_STATE: path.join(root, 'state.json') },
    });
    const calls = async () => (await readFile(callsFile, 'utf8').catch(() => '')).trim().split(/\r?\n/u).filter(Boolean).map(line => JSON.parse(line.replace(/^\uFEFF/u, '')));
    await verify({ root, run, calls, receipt: path.join(root, 'runtime/maestri/team-configured.json') });
  } finally { await rm(root, { recursive: true, force: true }); }
}

test('Maestri configura quatro papeis/terminais e reutiliza-os sem reiniciar sessoes', { skip: process.platform !== 'win32' }, () => fixture('new', async ({ run, calls, receipt }) => {
  const first = run();
  assert.ifError(first.error);
  assert.equal(first.status, 0, first.stdout + first.stderr);
  const evidence = JSON.parse(await readFile(receipt, 'utf8'));
  assert.equal(evidence.team.length, 4);
  assert.equal(evidence.terminals_confirmed_by_cli, true);
  assert.equal(evidence.model_readiness_verified, false);
  const second = run();
  assert.ifError(second.error);
  assert.equal(second.status, 0, second.stdout + second.stderr);
  const log = await calls();
  assert.equal(log.filter(args => args[0] === 'recruit').length, 4);
  assert.equal(log.filter(args => args[0] === 'role' && args[1] === 'create').length, 4);
  assert.equal(log.some(args => args.includes('assign') || args.includes('dismiss') || args.includes('write')), false);
}));

test('Maestri acrescenta Sonda com DeepSeek preservando os quatro agentes ativos', { skip: process.platform !== 'win32' }, () => fixture('deepseek', async ({ run, calls, receipt }) => {
  const first = run();
  assert.equal(first.status, 0, first.stdout + first.stderr);
  const second = run(['-IncludeDeepSeek']);
  assert.equal(second.status, 0, second.stdout + second.stderr);
  const evidence = JSON.parse(await readFile(receipt, 'utf8'));
  assert.equal(evidence.team.length, 5);
  assert.equal(evidence.team.find(member => member.name === 'Sonda').preset, 'DeepSeek Local');
  assert.ok(evidence.team.filter(member => member.name !== 'Sonda').every(member => member.reused));
  const log = await calls();
  const recruits = log.filter(args => args[0] === 'recruit');
  assert.equal(recruits.length, 5);
  assert.equal(recruits.at(-1)[1], 'Sonda');
  assert.equal(recruits.at(-1)[3], 'DeepSeek Local');
  assert.equal(log.some(args => args.includes('assign') || args.includes('dismiss')), false);
}));

for (const scenario of ['no-pipe', 'wrong-workspace', 'missing-preset', 'recruit-failure']) {
  test(`Maestri interrompe ${scenario} sem recibo de sucesso`, { skip: process.platform !== 'win32' }, () => fixture(scenario, async ({ run, calls, receipt }) => {
    const result = run();
    assert.ifError(result.error);
    assert.notEqual(result.status, 0);
    await assert.rejects(access(receipt));
    const log = await calls();
    if (scenario !== 'recruit-failure') assert.equal(log.some(args => args[0] === 'recruit' || (args[0] === 'role' && args[1] === 'create')), false);
    else assert.equal(log.at(-1)[0], 'debug');
  }));
}
