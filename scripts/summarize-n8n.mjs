import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const executions = [];
for (const id of ['WF-01', 'WF-03', 'WF-05']) {
  const log = (await readFile(path.join(root, 'runtime/n8n-validation', `${id}.log`), 'utf8')).replaceAll('\r', '');
  let execution;
  for (const match of log.matchAll(/^\{/gm)) {
    try { execution = JSON.parse(log.slice(match.index)); break; } catch { /* startup logs are not JSON */ }
  }
  if (!execution || execution.status !== 'success' || execution.finished !== true || execution.data?.resultData?.error) throw new Error(`${id}: execução não terminou com sucesso`);
  const output = execution.data.resultData.runData['Validate and Prepare']?.[0]?.data?.main?.[0]?.[0]?.json;
  if (!output) throw new Error(`${id}: output ausente`);
  if (id === 'WF-01' && (output.record?.status !== 'IDEA' || output.mode !== 'prepare_only')) throw new Error('WF-01: output inesperado');
  if (id === 'WF-03' && (output.status !== 'READY_FOR_REVIEW' || output.executable !== false || output.provider_called !== false)) throw new Error('WF-03: output inesperado');
  if (id === 'WF-05' && (output.status !== 'APPROVAL_PENDING' || output.authorized !== false || output.deployed !== false)) throw new Error('WF-05: output inesperado');
  executions.push({ workflow_id: id, status: execution.status, finished: execution.finished, output_status: output.record?.status || output.status, started_at: execution.startedAt, stopped_at: execution.stoppedAt });
}
const summary = { n8n_version: '2.43.7', environment: 'disposable_docker_network_none', synthetic_data_only: true, live_instance_modified: false, executions };
await writeFile(path.join(root, '09-Analytics/n8n-validation.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
