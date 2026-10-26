---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, qa, security, performance, ci]
---
# Auditoria da plataforma e correções — 2026-10-26

Commit da aplicação `b4e32b4` enviado para `origin/main` do DC-Simu em 2026-10-26, a pedido do utilizador; sem deploy executado.

## Corrigido

| Ponto | Resultado |
| --- | --- |
| Segurança (jsPDF) | `jspdf` 3.0.4 → 4.2.1. `npm audit --omit=dev`: de 1 vulnerabilidade crítica para 0. `test:pdf-export` (11 verificações) passa |
| Peso do bundle | «Exportar PDF» passa a carregar-se só ao abrir (`React.lazy`). O chunk `App` desceu de 1 298 KB para 885 KB; jsPDF e html2canvas ficam fora do carregamento inicial. `exceljs` já era diferido |
| CI | `.github/workflows/ci.yml`: `tsc -b`, `test:ci` (25 suites sem browser), `test:server` (111 verificações), build e `npm audit --audit-level=high`. Segundo job com Playwright (GRAFCET), informativo (`continue-on-error`) até haver execuções estáveis |
| DC-01/02, DC-03/04 | Verificado no código: o cliente descarta `apiKey` ao guardar, não há segredos nem chaves no `src`/`server`/`scripts`; o proxy `/api/n8n/trigger` exige autenticação, usa só o URL configurado no servidor e devolve erro HTTP real quando o webhook falha. `test:server`: 111 passam |

## Nota de correção

O hook `.githooks/pre-commit` só atualiza `release-stamp.json` (não corre testes) e não é executável. Não foi alterado, para não mudar o comportamento dos commits; a verificação passa a ser feita no CI.

## Por fazer (não executado)

- LADDER-SIM-02/03: passo a passo e blocos em falta no motor Ladder (funcionalidade nova, com desenho prévio).
- Dividir `GrafcetEditor.tsx` (5 800 linhas), `useSimStore` e `Panel3D`: refatoração a fazer por partes, com testes de UI em browser.
- React 19 / `@react-three/fiber` 9 / `drei` 10: subir em conjunto, num ramo próprio.
- Verificação em browser/touch (UI-VISUAL-01) e o job Playwright do CI: o job não foi executado aqui (sem Chromium) e a sua primeira execução está por confirmar.
- OPS-01 e rotação de segredos em produção: dependem do painel Vercel/servidor, sem acesso daqui.
