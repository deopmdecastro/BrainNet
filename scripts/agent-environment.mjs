import { readFile, writeFile, mkdir, rename, access, copyFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import os from 'node:os';

export const BASE_MODEL = 'deepseek-r1:8b';
export const LOCAL_MODEL = 'brainet-deepseek:8b';
export const PROVIDER = 'brainet-ollama';

export function buildConfig(existing, { tools }) {
  if (!existing || typeof existing !== 'object' || Array.isArray(existing)) throw new Error('Configuracao OpenCode invalida.');
  const result = structuredClone(existing);
  result.$schema ??= 'https://opencode.ai/config.json';
  result.provider ??= {};
  result.agent ??= {};
  const provider = {
    npm: '@ai-sdk/openai-compatible', name: 'BraiNet Ollama local',
    options: { baseURL: 'http://127.0.0.1:11434/v1' },
    models: { [LOCAL_MODEL]: { name: 'DeepSeek R1 8B local', tool_call: Boolean(tools), limit: { context: 65536, output: 8192 } } },
  };
  const analyst = {
    description: 'Analise e segunda opiniao local para BrainNet/DC-Simu', mode: 'primary',
    model: `${PROVIDER}/${LOCAL_MODEL}`,
    prompt: tools
      ? 'Le as instrucoes do papel Maestri e o contexto da tarefa. Analisa e responde com evidencias. Aguarda uma tarefa concreta. Executa maestri list antes de contactar colegas. Nao alteres ficheiros neste papel.'
      : 'Analisa o contexto fornecido na conversa e responde com evidencias. Este modelo nao usa ferramentas: nao podes ler ficheiros, executar comandos ou contactar colegas. Pede ao coordenador os excertos relevantes. Aguarda uma tarefa concreta.',
    permission: tools ? { edit: 'deny', bash: { '*': 'deny', 'maestri list': 'allow', 'maestri check *': 'allow', 'maestri ask *': 'allow' } } : { '*': 'deny' },
  };
  for (const [section, key, expected] of [['provider', PROVIDER, provider], ['agent', 'brainet-analyst', analyst]]) {
    if (result[section][key] && JSON.stringify(result[section][key]) !== JSON.stringify(expected)) throw new Error(`Configuracao ${section}.${key} ja existe com outros valores; foi preservada.`);
    result[section][key] = expected;
  }
  return result;
}

export function presetCommand(binary) {
  if (!path.isAbsolute(binary) || /["\r\n]/u.test(binary)) throw new Error('Caminho do OpenCode invalido.');
  return `& "${binary}" --model ${PROVIDER}/${LOCAL_MODEL} --agent brainet-analyst`;
}

async function exists(file) { try { await access(file); return true; } catch (error) { if (error.code === 'ENOENT') return false; throw error; } }

async function main() {
  const project = fileURLToPath(new URL('../', import.meta.url));
  const configRoot = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
  const configPath = path.join(configRoot, 'opencode/opencode.json');
  const jsoncPath = path.join(configRoot, 'opencode/opencode.jsonc');
  if (await exists(jsoncPath)) throw new Error('Existe opencode.jsonc. Integrar o provider manualmente para preservar comentarios e preferencias.');
  const binary = path.join(process.env.APPDATA, 'npm/node_modules/opencode-ai/bin/opencode.exe');
  const version = spawnSync(binary, ['--version'], { encoding: 'utf8', timeout: 30000, windowsHide: true });
  if (version.error || version.status !== 0) throw new Error('OpenCode indisponivel. Instale opencode-ai e volte a executar.');
  const response = await fetch('http://127.0.0.1:11434/api/show', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: BASE_MODEL }), signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Modelo Ollama indisponivel (HTTP ${response.status}). Execute ollama pull ${BASE_MODEL}.`);
  const metadata = await response.json();
  const previous = await exists(configPath) ? await readFile(configPath, 'utf8') : null;
  const existing = previous === null ? {} : JSON.parse(previous.replace(/^\uFEFF/u, ''));
  // O teste funcional deste modelo nao produziu uma chamada de ferramenta valida.
  // Sonda usa contexto fornecido, mesmo quando o servidor anuncia a capacidade.
  const config = buildConfig(existing, { tools: false });
  // Perfil separado para nao alterar os parametros do modelo original.
  const aliasResponse = await fetch('http://127.0.0.1:11434/api/show', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: LOCAL_MODEL }), signal: AbortSignal.timeout(15000) });
  if (aliasResponse.ok) {
    const alias = await aliasResponse.json();
    const baseWeights = metadata.modelfile?.match(/^FROM (.+)$/mu)?.[1];
    const aliasWeights = alias.modelfile?.match(/^FROM (.+)$/mu)?.[1];
    if (!baseWeights || baseWeights !== aliasWeights || alias.template !== metadata.template || !/num_ctx\s+65536/u.test(alias.parameters || '') || !/num_predict\s+8192/u.test(alias.parameters || '')) {
      throw new Error(`O perfil ${LOCAL_MODEL} ja existe com outros parametros. Foi preservado.`);
    }
  } else if (aliasResponse.status === 404) {
    const creation = await fetch('http://127.0.0.1:11434/api/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: LOCAL_MODEL, from: BASE_MODEL, parameters: { num_ctx: 65536, num_predict: 8192 }, stream: false }), signal: AbortSignal.timeout(60000) });
    if (!creation.ok) throw new Error(`Falha ao criar perfil Ollama: HTTP ${creation.status}.`);
    const result = await creation.json();
    if (result.status !== 'success') throw new Error('Ollama nao confirmou a criacao do perfil.');
  } else throw new Error(`Falha ao consultar perfil Ollama: HTTP ${aliasResponse.status}.`);
  await mkdir(path.dirname(configPath), { recursive: true });
  const serialized = JSON.stringify(config, null, 2) + '\n';
  if (previous !== serialized) {
    const current = await exists(configPath) ? await readFile(configPath, 'utf8') : null;
    if (current !== previous) throw new Error('Configuracao OpenCode alterada por outra sessao; repetir apos rever.');
    if (previous !== null) await copyFile(configPath, `${configPath}.brainet-${Date.now()}.backup`);
    const temporary = `${configPath}.${process.pid}.tmp`;
    await writeFile(temporary, serialized, { encoding: 'utf8', flag: 'wx' });
    await rename(temporary, configPath);
  }
  const receipt = { prepared_at_utc: new Date().toISOString(), opencode_version: version.stdout.trim(), opencode_binary: binary, config_path: configPath, base_model: BASE_MODEL, model: LOCAL_MODEL, capabilities: metadata.capabilities, agent_mode: 'context-analysis', agent_tools_enabled: false, preset_name: 'DeepSeek Local', preset_command: presetCommand(binary), maestri_activated: false };
  await mkdir(path.join(project, 'runtime/maestri'), { recursive: true });
  await writeFile(path.join(project, 'runtime/maestri/agent-environment.json'), JSON.stringify(receipt, null, 2) + '\n');
  console.log(JSON.stringify({ ok: true, model: receipt.model, opencode_version: receipt.opencode_version, config_path: configPath, maestri_activated: false }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
