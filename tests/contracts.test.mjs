import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { intake, handoff, releaseReview } from '../automation/lib/contracts.mjs';

const load = async name => JSON.parse(await readFile(new URL(`../examples/${name}.json`, import.meta.url), 'utf8'));
const sample = await load('project-intake');
const task = await load('agent-handoff');
const release = await load('release-review');

test('intake gera briefing sem inventar responsável, orçamento ou aprovação', () => {
  const result = intake(sample, '2026-10-18T00:00:00.000Z');
  assert.equal(result.record.status, 'IDEA');
  assert.equal(result.record.owner, null);
  assert.match(result.briefing_markdown, /Rascunho gerado/u);
  assert.equal(result.mode, 'prepare_only');
});
test('campos em falta, tipos inválidos, esquema e tamanho são rejeitados', () => {
  for (const invalid of [null, [], {}, { ...sample, schema_version: 2 }, { ...sample, event_id: '../escape' }, { ...sample, project: { ...sample.project, objectives: [] } }, { ...sample, project: { ...sample.project, name: 'x'.repeat(33000) } }, { ...sample, project: { ...sample.project, type: 'unknown' } }]) assert.throws(() => intake(invalid));
});
test('flags e segredos fornecidos pelo chamador nunca alteram a política', () => {
  for (const key of ['auto', 'via_token', 'approved', 'dry_run', 'token', 'provider', 'notify_url']) assert.throws(() => intake({ ...sample, [key]: true }), /não suportado/u);
  assert.throws(() => handoff({ ...task, authorized: true }));
  assert.throws(() => releaseReview({ ...release, approved: true }));
});
test('markdown é escapado e frontmatter mantém os campos fixos', () => {
  const result = intake({ ...sample, project: { ...sample.project, name: '---\nstatus: DEPLOYMENT\n<script>[[unsafe]]', problem: '[click](https://example.invalid) ![[embed]]' } });
  assert.equal(result.briefing_markdown.split('\n').filter(x => x === 'status: IDEA').length, 1);
  assert.ok(!result.briefing_markdown.includes('<script>'));
  assert.ok(!result.briefing_markdown.includes('![[embed]]'));
});
test('handoff suporta cada origem sem executar nem chamar providers', () => {
  for (const source of ['manual', 'github', 'vscode', 'figma', 'report', 'health', 'deploy']) {
    const result = handoff({ ...task, source });
    assert.equal(result.executable, false);
    assert.equal(result.provider_called, false);
    assert.equal(result.context.trust, 'untrusted_data');
    if (source === 'deploy') assert.equal(result.status, 'REQUIRES_HUMAN_APPROVAL');
  }
  assert.throws(() => handoff({ ...task, source: 'unknown' }));
});
test('handoff rejeita caminhos absolutos, traversal e caminhos Windows', () => {
  for (const file of ['../secret', '/etc/passwd', 'C:/private', 'docs/../secret', 'docs\\secret', '//server/path']) assert.throws(() => handoff({ ...task, files: [file] }));
});
test('limite total conta bytes UTF-8 e não apenas caracteres', () => {
  assert.throws(() => handoff({ ...task, objective: 'á'.repeat(6000), acceptance: Array(12).fill('á'.repeat(500)), constraints: Array(12).fill('á'.repeat(500)) }), /32 KiB UTF-8/u);
});
test('release falha fechado; resultados verdes apenas aguardam aprovação', () => {
  assert.equal(releaseReview({ ...release, checks: [] }).status, 'BLOCKED');
  assert.equal(releaseReview({ ...release, critical_findings: 1 }).status, 'BLOCKED');
  assert.equal(releaseReview({ ...release, checks: [{ ...release.checks[0], passed: false }] }).status, 'BLOCKED');
  for (const environment of ['staging', 'production']) {
    const result = releaseReview({ ...release, environment });
    assert.equal(result.status, 'APPROVAL_PENDING');
    assert.equal(result.authorized, false);
    assert.equal(result.deployed, false);
    assert.equal(result.evidence_verified, false);
  }
});
test('release rejeita evidência ausente, booleanos textuais e testes duplicados', () => {
  for (const check of [{ ...release.checks[0], evidence: '' }, { ...release.checks[0], passed: 'true' }]) assert.throws(() => releaseReview({ ...release, checks: [check] }));
  assert.throws(() => releaseReview({ ...release, checks: [...release.checks, ...release.checks] }));
});
test('workflows exportados executam exatamente os contratos, incluindo batches', async () => {
  for (const [id, fn, fixture] of [['WF-01', intake, sample], ['WF-03', handoff, task], ['WF-05', releaseReview, release]]) {
    const workflow = JSON.parse(await readFile(new URL(`../automation/n8n/workflows/${id}.json`, import.meta.url), 'utf8'));
    assert.equal(workflow.active, false);
    const code = workflow.nodes.find(n => n.name === 'Validate and Prepare').parameters.jsCode;
    const items = [{ json: fixture }, { json: { ...fixture, event_id: 'second-event-001' } }];
    const output = vm.runInNewContext(`(function(){${code}\n})()`, { $input: { all: () => items } });
    assert.equal(output.length, 2);
    for (let i = 0; i < output.length; i++) {
      const actual = JSON.parse(JSON.stringify(output[i].json));
      assert.equal(output[i].pairedItem.item, i);
      assert.deepEqual(actual, fn(items[i].json, actual.record?.created));
    }
  }
});
