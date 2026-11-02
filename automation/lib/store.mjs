import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile, rename, rm } from 'node:fs/promises';
import path from 'node:path';

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])]));
  return value;
}
const hash = value => createHash('sha256').update(value).digest('hex');

// Commit a complete directory atomically; a replay never changes human-edited files.
export async function persistIntake(result, root) {
  if (result?.ok !== true || result?.mode !== 'prepare_only' || !result.record || typeof result.briefing_markdown !== 'string') throw new Error('Resultado de intake inválido');
  const { created, updated, ...stable } = result.record;
  const fingerprint = hash(JSON.stringify(canonical(stable)));
  const id = hash(result.record.event_id);
  const base = path.resolve(root);
  await mkdir(base, { recursive: true });
  const destination = path.join(base, id);
  async function replay() {
    let receipt;
    try { receipt = JSON.parse(await readFile(path.join(destination, 'receipt.json'), 'utf8')); }
    catch (error) { if (error.code === 'ENOENT') return null; throw error; }
    if (receipt.fingerprint !== fingerprint) throw new Error('IDEMPOTENCY_CONFLICT: event_id reutilizado com dados diferentes');
    return { status: 'duplicate', directory: destination, project_id: result.record.project_id };
  }
  const existing = await replay();
  if (existing) return existing;
  const temporary = path.join(base, `.pending-${randomUUID()}`);
  await mkdir(temporary);
  try {
    await writeFile(path.join(temporary, 'record.json'), JSON.stringify(result.record, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    await writeFile(path.join(temporary, 'Project-Brief.md'), result.briefing_markdown, { flag: 'wx', mode: 0o600 });
    await writeFile(path.join(temporary, 'receipt.json'), JSON.stringify({ event_id: result.record.event_id, fingerprint, committed_at: created }, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    try { await rename(temporary, destination); }
    catch (error) {
      if (['EEXIST', 'ENOTEMPTY', 'EPERM', 'EACCES'].includes(error.code)) {
        const concurrent = await replay();
        if (concurrent) return concurrent;
      }
      throw error;
    }
    return { status: 'created', directory: destination, project_id: result.record.project_id };
  } finally { await rm(temporary, { recursive: true, force: true }); }
}
