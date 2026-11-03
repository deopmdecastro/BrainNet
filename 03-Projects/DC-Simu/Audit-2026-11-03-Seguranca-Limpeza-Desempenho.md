---
project_id: BN-DCSIMU-001
type: audit
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-03
updated: 2026-11-03
tags: [dc-simu, auditoria, seguranca, desempenho, limpeza]
---
# Auditoria — segurança, limpeza e desempenho (03/11/2026)

## Resultado
Commit DC-Simu `24c8e87`. Removidos 20,6 MB (13 ficheiros), cabeçalhos anti-clickjacking, motor GRAFCET mais rápido e uma regressão do importador FluidSIM corrigida.

## Limpeza
- ZIPs de origem CAD em `public/models` (sem referências, servidos publicamente); um tinha `:` no nome e obrigava a sparse-checkout no Windows.
- 3 GLB de PLC duplicados em `models/controladores` (idênticos aos de `models/importados`); `modelPaths.ts` aponta para `importados`.
- Módulos sem uso: `ProjectsPanel`, `GrafcetSimBar`, `LandingGrafcetDemo`, `command3DImage`, `protection3DImage`; script avulso `scripts/fix-syntax.mjs`.
- `pnpm-lock.yaml` desatualizado (CI e Docker usam `npm ci`; a Vercel podia escolher o pnpm pelo lockfile) e dependência `@fortawesome/free-regular-svg-icons` sem uso.

## Segurança
- Sem segredos versionados (varrimento de padrões de chaves, JWT, `service_role`, chaves privadas).
- Servidor: `scrypt` com sal, comparação em tempo constante, cookies `HttpOnly; SameSite=Lax`, verificação de `Origin`, limite de tentativas de login com teto de memória, SQL parametrizado. Sem `eval`/`innerHTML`/iframes no cliente.
- Acrescentado `X-Frame-Options: DENY` e `Content-Security-Policy: frame-ancestors 'none'` (Vercel e servidor Node).
- `npm audit`: 8 moderadas em produção, todas da cadeia `exceljs → archiver → minimatch` (ReDoS em padrões glob). Não explorável no uso atual (geração de `.xlsx` no navegador sem padrões do utilizador); a correção proposta pelo npm é baixar o `exceljs` para 4.1.1 — não aplicada.

## Desempenho
- Agrupamento de GRAFCETs por título em cache por programa; estado por grafo calculado uma vez por ciclo.
- Projeto ATEC (54 etapas, 70 transições, 8 GRAFCETs): ciclo 0,71 → 0,34 ms; validação 2,59 → 1,08 ms.

## Correção
- Importação FluidSIM estrita: ligação sem destino volta a ser rejeitada como «ligações incompletas» em vez de falhar com `TypeError` (regressão de `b0597a0`).

## Verificações
`typecheck`, `npm test`, `build`, `test:imported-components`, `test:grafcet-*` (dialogs, examples, signals, ladder-sync, ladder-word), `test:fluidsim`, `test:plc-signals`, `test:native-sim`, `test:pdf-export`, `test:excel`, `test:style`, `test:auto-detect-models`.

## Pendências
- `test:terminal-geometry` já falhava antes: `towerLight` sem GLB nem caminho em `modelPaths`.
- 20+ scripts de teste de UI não estão ligados ao `package.json` (o knip marca-os como sem uso); decidir se entram no `test:ci` ou se saem.
- O sparse-checkout local deixou de ser necessário (`git sparse-checkout disable` no clone local, opcional).
- Retirar a dependência de dev `supabase` só se a CLI não for usada (o README do Supabase usa-a).
- Validação manual na aplicação após o deploy.
