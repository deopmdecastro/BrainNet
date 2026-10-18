import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { intake } from '../automation/lib/contracts.mjs';
import { persistIntake } from '../automation/lib/store.mjs';

try {
  const args = process.argv.slice(2);
  let input, persist = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) input = args[++i];
    else if (args[i] === '--persist') persist = true;
    else throw new Error('Uso: node scripts/intake.mjs --input <evento.json> [--persist]');
  }
  if (!input) throw new Error('Indique --input <evento.json>');
  const raw = await readFile(input, 'utf8');
  if (Buffer.byteLength(raw) > 32768) throw new Error('Input excede 32 KiB');
  const result = intake(JSON.parse(raw));
  const storage = persist ? await persistIntake(result, fileURLToPath(new URL('../runtime/intake/', import.meta.url))) : null;
  console.log(JSON.stringify({ ...result, storage }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error.message }));
  process.exitCode = 1;
}
