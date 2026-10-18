import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = (await readFile(path.join(root, 'automation/lib/contracts.mjs'), 'utf8')).replace(/^export /gm, '');
const definitions = [
  ['WF-01', 'Project Intake', 'intake', 'project-intake.json'],
  ['WF-03', 'Event Router e Agent Handoff', 'handoff', 'agent-handoff.json'],
  ['WF-05', 'QA e Release Review', 'releaseReview', 'release-review.json'],
];
export async function build() {
  const directory = path.join(root, 'automation/n8n/workflows');
  await mkdir(directory, { recursive: true });
  for (const [id, title, fn, example] of definitions) {
    const fixture = JSON.parse(await readFile(path.join(root, 'examples', example), 'utf8'));
    const nodeId = name => createHash('sha256').update(`${id}/${name}`).digest('hex').slice(0, 32);
    const workflow = {
      name: `BraiNet OS | ${id} | ${title} | REVIEW ONLY`, active: false,
      nodes: [
        { id: nodeId('manual'), name: 'Manual Test', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 0], parameters: {} },
        { id: nodeId('fixture'), name: 'Synthetic Input', type: 'n8n-nodes-base.code', typeVersion: 2, position: [240, 0], parameters: { mode: 'runOnceForAllItems', jsCode: `// Apenas dados sintéticos. Substituir este nó por um adaptador autenticado após revisão.\nreturn [{ json: ${JSON.stringify(fixture, null, 2)} }];` } },
        { id: nodeId('transform'), name: 'Validate and Prepare', type: 'n8n-nodes-base.code', typeVersion: 2, position: [480, 0], parameters: { mode: 'runOnceForAllItems', jsCode: `${source}\n\nreturn $input.all().map((item, index) => ({ json: ${fn}(item.json), pairedItem: { item: index } }));\n` } },
        { id: nodeId('note'), name: 'Read Before Use', type: 'n8n-nodes-base.stickyNote', typeVersion: 1, position: [0, -240], parameters: { content: `## ${id} — revisão humana\nCompatibilidade alvo: n8n 2.43.7.\nManual + Code; sem credenciais, rede, notificações ou deploy.\nOutput é um rascunho. O n8n não grava no cofre.\nContrato e testes: automation/lib/contracts.mjs.\nIdempotência persistente: CLI local; adaptador n8n ainda pendente.`, height: 200, width: 660 } },
      ],
      connections: {
        'Manual Test': { main: [[{ node: 'Synthetic Input', type: 'main', index: 0 }]] },
        'Synthetic Input': { main: [[{ node: 'Validate and Prepare', type: 'main', index: 0 }]] },
      },
      settings: { executionOrder: 'v1', timezone: 'UTC', saveDataSuccessExecution: 'none', saveDataErrorExecution: 'none', saveManualExecutions: false },
      pinData: {}, tags: [],
    };
    await writeFile(path.join(directory, `${id}.json`), JSON.stringify(workflow, null, 2) + '\n');
  }
}
await build();
console.log('3 workflows gerados (inativos, revisão apenas).');
