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
- ~~`test:terminal-geometry`~~ resolvido: `towerLight`, `photoSensor` e `proximitySensor` são procedurais (sem CAD); o teste salta-os e continua a falhar se um GLB declarado faltar.
- ~~Testes órfãos~~ resolvido: os 14 scripts sem comando (não eram 20+; o resto são ferramentas de build) passam todos — 4 entraram no `test:ci`, 10 de interface no `test:ui-extra` (job de UI informativo). `commands-import` usa a amostra FluidSIM só com `FLUIDSIM_CT_SAMPLE`. Commit DC-Simu: `f96f533`.
- O sparse-checkout local deixou de ser necessário (`git sparse-checkout disable` no clone local, opcional).
- Retirar a dependência de dev `supabase` só se a CLI não for usada (o README do Supabase usa-a).
- Validação manual na aplicação após o deploy.

## CI — 2026-11-03 (tarde)
O CI falhava em todos os pushes do dia. Commit DC-Simu `5b71f7c`:
- **Código:** migração dos olhais do motor nativo identificava os cabos por ids antigos (os projetos guardados ficavam com ponteira dupla em U1/V1); exportação do catálogo encostava à face as pontas de fio fora do corpo (sensores/torres).
- **Estrutura:** `test:commands-symbols-ui` e `test:right-dock-ui` precisam de navegador e servidor e estavam no job sem eles; passaram para o job de interface.
- **Testes desatualizados (9):** alterações intencionais do produto (espaço entre ações, passagem A2 do F1, notas do nativo, peças procedurais, pontes de sinalização, edição por toque, painel de simulação só abaixo de 1200 px, «Organizar» no tablet).
- **Resultado no GitHub (run 41678842944):** job «Tipos, testes e build» **verde**; job de interface (informativo) falha em `test:grafcet-ui`, que passa localmente com o mesmo Chromium (106 verificações). Falta ler o registo desse passo no GitHub para identificar a diferença de ambiente.
