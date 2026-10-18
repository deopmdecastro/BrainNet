import fs from 'node:fs';
import path from 'node:path';
const [client, ...args] = process.argv.slice(2);
const root = process.env.BRAINET_TEST_PROJECT;
const scenario = process.env.BRAINET_TEST_CASE;
fs.appendFileSync(path.join(root, 'calls.jsonl'), JSON.stringify({ client, args }) + '\n');
if (client === 'codex') {
  console.log(args.includes('--version') ? 'codex-cli synthetic' : args.includes('--help') ? 'synthetic help --no-daemon --model' : 'synthetic Codex started');
  process.exit(0);
}
if (scenario === 'broken-pipe') {
  console.error('synthetic pipe disconnected');
  process.exit(9);
}
if (args[0] === 'debug') {
  if (scenario === 'debug-unavailable') { console.error('synthetic debug unavailable'); process.exit(8); }
  console.log('synthetic diagnostic');
} else if (args[0] === 'workspace') {
  console.log(`"BraiNet OS" - ${root} (you are here)`);
} else if (args[0] === 'list') {
  console.log('"Prumo" preset: "Codex"');
} else if (args[0] === 'preset') {
  const statePath = path.join(root, 'preset.json');
  if (args[1] === 'list') console.log('"Codex"');
  else if (args[1] === 'show') console.log(fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')).command : 'codex --no-daemon');
  else if (args[1] === 'set') {
    if (scenario === 'preset-failure') { console.error('synthetic preset denied'); process.exit(7); }
    fs.writeFileSync(statePath, JSON.stringify({ command: args[4] }));
    console.log(args[4]);
  } else process.exit(11);
} else process.exit(12);
