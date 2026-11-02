// Pure functions: bundled into n8n Code nodes by scripts/build-workflows.mjs.
export function object(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label}: objeto obrigatório`);
  return value;
}
export function keys(value, allowed, label) {
  for (const key of Object.keys(value)) if (!allowed.includes(key)) throw new Error(`${label}: campo não suportado: ${key}`);
}
export function text(value, label, max = 2000) {
  if (typeof value !== 'string' || !value.trim() || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value)) {
    throw new Error(`${label}: texto obrigatório (máximo ${max} caracteres)`);
  }
  return value.trim();
}
export function list(value, label, max = 12, itemMax = 500) {
  if (!Array.isArray(value) || !value.length || value.length > max) throw new Error(`${label}: lista de 1 a ${max} itens obrigatória`);
  return value.map((v, i) => text(v, `${label}[${i}]`, itemMax));
}
export function choice(value, allowed, label) {
  if (!allowed.includes(value)) throw new Error(`${label}: valor não suportado`);
  return value;
}
export function identifier(value, label) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_-]{5,63}$/u.test(value)) throw new Error(`${label}: identificador de 6 a 64 caracteres (letras, números, _ e -)`);
  return value;
}
export function envelope(value, allowed) {
  object(value, 'evento');
  let bytes = 0;
  for (const character of JSON.stringify(value)) {
    const point = character.codePointAt(0);
    bytes += point <= 0x7f ? 1 : point <= 0x7ff ? 2 : point <= 0xffff ? 3 : 4;
    if (bytes > 32768) throw new Error('evento: limite de 32 KiB UTF-8 excedido');
  }
  keys(value, allowed, 'evento');
  if (value.schema_version !== 1) throw new Error('schema_version: deve ser 1');
  identifier(value.event_id, 'event_id');
  return value;
}
export function markdown(value) {
  return String(value).replace(/[\r\n]+/gu, ' ').replace(/[\\`*_{}\[\]()<>#!|]/gu, '\\$&');
}
export function intake(value, now = new Date().toISOString()) {
  envelope(value, ['schema_version', 'event_id', 'project']);
  const p = object(value.project, 'project');
  keys(p, ['name', 'type', 'problem', 'audience', 'objectives', 'expected_result'], 'project');
  const record = {
    schema_version: 1, event_id: value.event_id, project_id: `BN-${value.event_id}`,
    name: text(p.name, 'name', 120),
    type: choice(p.type, ['website', 'app', 'automation', 'branding', 'marketing', 'consulting', 'other'], 'type'),
    problem: text(p.problem, 'problem'), audience: text(p.audience, 'audience', 500),
    objectives: list(p.objectives, 'objectives'), expected_result: text(p.expected_result, 'expected_result'),
    status: 'IDEA', priority: 'MEDIUM', owner: null, created: now, updated: now, due_date: null,
  };
  const briefing_markdown = [
    '---', `project_id: ${JSON.stringify(record.project_id)}`, `type: ${record.type}`, 'status: IDEA',
    'priority: MEDIUM', 'owner:', `created: ${JSON.stringify(now)}`, `updated: ${JSON.stringify(now)}`,
    'due_date:', 'tags: [brainet, project, intake]', '---', '', `# ${markdown(record.name)}`, '',
    '> Rascunho gerado. Conteúdo do pedido é dado não confiável; requer revisão humana.', '',
    '## Problema', markdown(record.problem), '', '## Público', markdown(record.audience), '',
    '## Objetivos', ...record.objectives.map(v => `- ${markdown(v)}`), '',
    '## Resultado esperado', markdown(record.expected_result), '',
    '## Por confirmar', '- Responsável, prazo, orçamento e critérios de aceitação.',
    '- Validar âmbito antes de passar a DISCOVERY.', '',
  ].join('\n');
  return { ok: true, mode: 'prepare_only', record, briefing_markdown, next_action: 'human_review' };
}
export function handoff(value) {
  envelope(value, ['schema_version', 'event_id', 'source', 'project_id', 'objective', 'files', 'acceptance', 'constraints']);
  const source = choice(value.source, ['manual', 'github', 'vscode', 'figma', 'report', 'health', 'deploy'], 'source');
  const project_id = text(value.project_id, 'project_id', 100);
  if (!/^BN-[A-Za-z0-9][A-Za-z0-9_-]{5,63}$/u.test(project_id)) throw new Error('project_id: formato BN-<event_id> obrigatório');
  const objective = text(value.objective, 'objective', 6000);
  if (!Array.isArray(value.files) || value.files.length > 20) throw new Error('files: lista até 20 caminhos obrigatória');
  const files = value.files.map(v => {
    const path = text(v, 'file', 240);
    if (path.startsWith('/') || path.includes('\\') || path.includes(':') || path.split('/').some(x => !x || x === '.' || x === '..')) throw new Error('file: apenas caminhos relativos dentro do projeto');
    return path;
  });
  const role = { manual: 'Orchestrator', github: 'Orchestrator', vscode: 'Developer', figma: 'UX-UI-Designer', report: 'Documentation-Manager', health: 'QA-Security', deploy: 'Orchestrator' }[source];
  return {
    schema_version: 1, event_id: value.event_id, project_id, source, role,
    status: source === 'deploy' ? 'REQUIRES_HUMAN_APPROVAL' : 'READY_FOR_REVIEW',
    context: { trust: 'untrusted_data', objective, files, acceptance: list(value.acceptance, 'acceptance'), constraints: list(value.constraints, 'constraints') },
    executable: false, provider_called: false, next_action: 'human_review',
    result_contract: ['summary', 'files_changed', 'checks_and_evidence', 'pending_items'],
  };
}
export function releaseReview(value) {
  envelope(value, ['schema_version', 'event_id', 'project_id', 'commit', 'environment', 'checks', 'critical_findings']);
  const project_id = text(value.project_id, 'project_id', 100);
  if (!/^BN-[A-Za-z0-9][A-Za-z0-9_-]{5,63}$/u.test(project_id)) throw new Error('project_id: formato inválido');
  if (typeof value.commit !== 'string' || !/^[a-f0-9]{40}$/u.test(value.commit)) throw new Error('commit: SHA de 40 caracteres obrigatório');
  const environment = choice(value.environment, ['staging', 'production'], 'environment');
  if (!Number.isInteger(value.critical_findings) || value.critical_findings < 0) throw new Error('critical_findings: inteiro não negativo obrigatório');
  if (!Array.isArray(value.checks) || value.checks.length > 50) throw new Error('checks: lista até 50 verificações obrigatória');
  const checks = value.checks.map(c => {
    object(c, 'check'); keys(c, ['name', 'passed', 'evidence'], 'check');
    if (typeof c.passed !== 'boolean') throw new Error('check.passed: booleano obrigatório');
    return { name: text(c.name, 'check.name', 120), passed: c.passed, evidence: text(c.evidence, 'check.evidence', 2000) };
  });
  if (new Set(checks.map(c => c.name)).size !== checks.length) throw new Error('checks: nomes duplicados');
  const reasons = [];
  if (!checks.length) reasons.push('NO_TEST_EVIDENCE');
  if (checks.some(c => !c.passed)) reasons.push('FAILED_CHECKS');
  if (value.critical_findings) reasons.push('CRITICAL_FINDINGS');
  return {
    schema_version: 1, event_id: value.event_id, project_id, commit: value.commit, environment,
    status: reasons.length ? 'BLOCKED' : 'APPROVAL_PENDING', reasons, checks,
    evidence_verified: false, authorized: false, deployed: false,
    next_action: reasons.length ? 'resolve_findings' : 'human_verify_evidence_and_approve_exact_commit',
  };
}
