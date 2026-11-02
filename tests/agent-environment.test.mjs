import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { buildConfig, presetCommand, LOCAL_MODEL, PROVIDER } from '../scripts/agent-environment.mjs';

test('DeepSeek preserva providers, agentes e preferencias existentes sem alterar o input', () => {
  const original = { model: 'existing/model', provider: { existing: { name: 'existing' } }, agent: { custom: { description: 'existing' } }, theme: 'existing' };
  const config = buildConfig(original, { tools: true });
  assert.equal(config.model, original.model);
  assert.deepEqual(config.provider.existing, original.provider.existing);
  assert.deepEqual(config.agent.custom, original.agent.custom);
  assert.equal(original.provider[PROVIDER], undefined);
  assert.equal(config.provider[PROVIDER].options.baseURL, 'http://127.0.0.1:11434/v1');
  assert.equal(config.agent['brainet-analyst'].model, `${PROVIDER}/${LOCAL_MODEL}`);
  assert.equal(config.agent['brainet-analyst'].permission.edit, 'deny');
});
test('DeepSeek pode ser preparado novamente sem alterar a configuracao', () => {
  const first = buildConfig({}, { tools: true });
  assert.deepEqual(buildConfig(first, { tools: true }), first);
});
test('DeepSeek recusa conflito de configuracao existente', () => {
  const config = buildConfig({}, { tools: true });
  config.provider[PROVIDER].options.baseURL = 'http://other-host:11434/v1';
  assert.throws(() => buildConfig(config, { tools: true }), /preservada/u);
});
test('DeepSeek sem ferramentas fica em analise de contexto fornecido, sem comandos ou edicao', () => {
  const config = buildConfig({}, { tools: false });
  assert.equal(config.provider[PROVIDER].models[LOCAL_MODEL].tool_call, false);
  assert.deepEqual(config.agent['brainet-analyst'].permission, { '*': 'deny' });
  assert.match(config.agent['brainet-analyst'].prompt, /nao podes ler ficheiros/u);
});
test('preset DeepSeek lanca diretamente o cliente e preserva caminho com espacos', () => {
  const binary = path.resolve('client with spaces/opencode.exe');
  assert.equal(presetCommand(binary), `& "${binary}" --model ${PROVIDER}/${LOCAL_MODEL} --agent brainet-analyst`);
  assert.throws(() => presetCommand('relative.exe'));
});
