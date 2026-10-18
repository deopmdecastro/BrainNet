import { readdir, readFile, access, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const ignored = new Set(['.git', '.obsidian', '.qodo', '.agents', '.codex', 'node_modules', 'runtime']);
const errors = [];
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.filter(e => !ignored.has(e.name)).map(e => e.isDirectory() ? walk(path.join(directory, e.name)) : [path.join(directory, e.name)]));
  return nested.flat();
}
const files = await walk(root);
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const exists = async file => { try { await access(file); return true; } catch { return false; } };
const markdownFiles = files.filter(f => f.endsWith('.md') && path.basename(f) !== 'Bem-vindo.md');
const allNotes = files.filter(f => /\.(md|canvas)$/u.test(f));
let checkedLinks = 0;
for (const file of markdownFiles) {
  const content = await readFile(file, 'utf8');
  if (/^(?:\d{2}-|Templates\/)/u.test(relative(file))) {
    for (const property of ['type', 'status', 'created', 'updated', 'tags']) {
      if (!new RegExp(`^${property}:`, 'm').test(content.split('---')[1] || '')) errors.push(`${relative(file)}: propriedade ${property} ausente`);
    }
  }
  // Ignore code fences and inline code to avoid treating examples as links.
  const prose = content.replace(/```[\s\S]*?```/gu, '').replace(/`[^`\n]+`/gu, '');
  for (const match of prose.matchAll(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/gu)) {
    const target = match[1].split('#')[0];
    if (!target) continue;
    checkedLinks++;
    const extensions = /\.(md|canvas)$/u.test(target) ? [''] : ['.md', '.canvas'];
    const candidates = extensions.map(ext => path.resolve(path.dirname(file), target + ext));
    if ((await Promise.all(candidates.map(exists))).some(Boolean)) continue;
    if (!target.includes('/')) {
      const matches = allNotes.filter(note => path.basename(note, path.extname(note)) === target);
      if (matches.length === 1) continue;
    }
    errors.push(`${relative(file)}: wikilink inválido: ${target}`);
  }
  for (const match of prose.matchAll(/(?<!!)\[[^\]\n]+\]\(([^)]+)\)/gu)) {
    const target = match[1].replace(/^<|>$/gu, '').split('#')[0];
    if (!target || /^[a-z][a-z0-9+.-]*:/iu.test(target)) continue;
    checkedLinks++;
    if (!await exists(path.resolve(path.dirname(file), decodeURIComponent(target)))) errors.push(`${relative(file)}: link inválido: ${target}`);
  }
}
const contractSource = (await readFile(path.join(root, 'automation/lib/contracts.mjs'), 'utf8')).replace(/^export /gm, '');
const allowedNodes = new Set(['n8n-nodes-base.manualTrigger', 'n8n-nodes-base.code', 'n8n-nodes-base.stickyNote']);
for (const id of ['WF-01', 'WF-03', 'WF-05']) {
  const workflow = JSON.parse(await readFile(path.join(root, 'automation/n8n/workflows', `${id}.json`), 'utf8'));
  if (workflow.active !== false) errors.push(`${id}: deve estar inativo`);
  const names = new Set(workflow.nodes.map(n => n.name));
  for (const node of workflow.nodes) {
    if (!allowedNodes.has(node.type) || node.credentials) errors.push(`${id}: nó externo/credencial não permitido`);
    if (node.name === 'Validate and Prepare' && !node.parameters.jsCode.startsWith(contractSource)) errors.push(`${id}: export desatualizado; regenerar`);
  }
  for (const [source, connection] of Object.entries(workflow.connections)) {
    if (!names.has(source)) errors.push(`${id}: origem inexistente`);
    for (const edge of connection.main.flat()) if (!names.has(edge.node)) errors.push(`${id}: destino inexistente`);
  }
}
for (const file of files.filter(f => f.endsWith('.json') || f.endsWith('.canvas'))) {
  try { JSON.parse(await readFile(file, 'utf8')); } catch { errors.push(`${relative(file)}: JSON inválido`); }
}
const canvas = JSON.parse(await readFile(path.join(root, '00-Dashboard/BraiNet-OS.canvas'), 'utf8'));
const nodeIds = new Set(canvas.nodes.map(n => n.id));
for (const node of canvas.nodes.filter(n => n.type === 'file')) if (!await exists(path.join(root, node.file))) errors.push(`Canvas: ficheiro inexistente: ${node.file}`);
for (const edge of canvas.edges) if (!nodeIds.has(edge.fromNode) || !nodeIds.has(edge.toNode)) errors.push('Canvas: ligação sem nó');
const result = { ok: errors.length === 0, checked_at: new Date().toISOString(), markdown_files: markdownFiles.length, links: checkedLinks, workflows: 3, errors, note: 'Bem-vindo.md e configurações pessoais excluídos das regras documentais.' };
await mkdir(path.join(root, 'runtime/checks'), { recursive: true });
await writeFile(path.join(root, 'runtime/checks/foundation.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
