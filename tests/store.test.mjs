import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { intake } from '../automation/lib/contracts.mjs';
import { persistIntake } from '../automation/lib/store.mjs';
const fixture = JSON.parse(await readFile(new URL('../examples/project-intake.json', import.meta.url), 'utf8'));

async function isolated(fn) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'brainet-test-'));
  try { await fn(root); } finally { await rm(root, { recursive: true, force: true }); }
}
test('replay após nova data preserva briefing editado por humano', () => isolated(async root => {
  const first = await persistIntake(intake(fixture, '2026-10-18T00:00:00Z'), root);
  await writeFile(path.join(first.directory, 'Project-Brief.md'), 'Edição humana\n');
  const second = await persistIntake(intake(fixture, '2026-10-19T00:00:00Z'), root);
  assert.equal(first.status, 'created'); assert.equal(second.status, 'duplicate');
  assert.equal(await readFile(path.join(first.directory, 'Project-Brief.md'), 'utf8'), 'Edição humana\n');
}));
test('mesmo event_id com conteúdo diferente produz conflito', () => isolated(async root => {
  await persistIntake(intake(fixture), root);
  await assert.rejects(persistIntake(intake({ ...fixture, project: { ...fixture.project, name: 'Alterado' } }), root), /IDEMPOTENCY_CONFLICT/u);
}));
test('concorrência gera um único registo completo e limpa staging', () => isolated(async root => {
  const results = await Promise.all(Array.from({ length: 12 }, () => persistIntake(intake(fixture), root)));
  assert.equal(results.filter(r => r.status === 'created').length, 1);
  assert.equal(results.filter(r => r.status === 'duplicate').length, 11);
  const dirs = await readdir(root);
  assert.equal(dirs.length, 1);
  assert.deepEqual((await readdir(path.join(root, dirs[0]))).sort(), ['Project-Brief.md', 'receipt.json', 'record.json']);
}));
