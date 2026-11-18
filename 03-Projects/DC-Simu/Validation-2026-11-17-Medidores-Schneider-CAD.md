---
project_id: BN-DCSIMU-001
type: validation
status: LOCAL_PASSED_GLOBAL_NOT_GREEN
created: 2026-11-17
updated: 2026-11-17
tags: [dc-simu, validacao, medidores, schneider, cad, regressao]
---
# Validação — bibliotecas de medidores e CAD Schneider

> Registo histórico anterior à recuperação. Para a árvore atual, resultados
> repetidos e publicação ver [[Validation-2026-11-17-Recuperacao-Industrial-Editores]].
> Os resultados e commits abaixo não são aprovação da recuperação atual.

Relacionado: [[Task-2026-11-17-Medidores-Bibliotecas-Schneider-CAD]].

## Artefacto e âmbito

Commit local da aplicação:
`10e555bf47a68d8ab7cb7a0a5d1966f2fa13e666` (`r210.mwlyp78v`).
Node 22.23.5, Chromium/Playwright com SwiftShader, sessões locais descartáveis,
API, service workers e recursos externos bloqueados. Auto-validação do
implementador, **não revisão QA independente nem aceitação do fabricante**.

A documentação técnica e os logs portáteis estão no commit da aplicação:

- `docs/MEDIDORES-SCHNEIDER-3D.md`;
- `docs/validation/meters-schneider-2026-11-17/summary.json`;
- `simulator-ui.log`, `admin-rcd-ui.log`, `contract.log`,
  `terminal-geometry-focused.log` e `interfaces-preservation.log` na mesma pasta.

Recursos locais completos da sessão:
`/home/user/work/meters-rcd-audit/`. Este caminho não é um serviço público.

## Resultados finais

| Verificação | Resultado | Evidência local |
| --- | --- | --- |
| `npm run typecheck` | exit 0, após holdVar/projeção/gestos | `typecheck-final.log` |
| `npm run test:hooks` | exit 0, todo src | `hooks-final.log` |
| `npm test` | 834 PASS | `core-final.log` |
| `npm run test:meters-schneider` | 192 PASS | `meters-schneider-final.log` |
| Biblioteca/3D do simulador | 78 PASS, Free e Admin | `ui-fourteenth.log` |
| Editor Admin dos dois diferenciais | 44 PASS | `admin-ui-fifth.log` |
| QGD nativo | 42 PASS; 47 componentes/76 cabos preservados | `qgd-final.log` |
| Editor 3D funcional | 47 verificações; 25 modelos/162 bornes | `editor3d-functional-final.log` |
| LOGO | 10 verificações | `logo-editor-final.log` |
| Componentes, superfície CAD, interactables, SaaS | exit 0 | logs `*-final.log` correspondentes |
| Cavidades dos diferenciais | 2 CAD/12 encaixes PASS | `terminal-geometry-final.log` |
| Detector focado | conserva 26 registos, acrescenta iID, total 27; outros 25 intactos | `interfaces-preservation-final.log` |
| Capas | 8 capturas novas, sem fallback silencioso; 61 capas e 61 frentes presentes | `covers-final.log` |
| Build estático `VERCEL=1 npm run build` do commit exato | exit 0, PWA gerada; aviso de chunks grandes mantido; `version.json` = `10e555bf47a68d8ab7cb7a0a5d1966f2fa13e666.r210.mwlyp78v`, ambos os GLB do bundle conferem com as fontes | `production-build-final.log` |

### O que o browser demonstrou

- Pesquisa «medidor», grupo correto, duas capas carregadas e inserção real de
  D52/KWS sem perder o cabo existente; identidade e contagens preservadas.
- D52 RESET físico; KWS ON/OFF e LCD atualizado por alterações isoladas de iB,
  vC, pC, frequência e temperatura; vistas rodadas dos quatro aparelhos.
- Nos dois diferenciais, T mantido, curso 1,2 mm, letra solidária, TRIP intermédio,
  largar fora e pointercancel sem rodar a câmara, restauro de OrbitControls,
  disparo persistente, rearme/OFF, corpo apenas selecionável e guardas de
  bloqueio/ferramenta Cabo. Sem exceções/React #310/perda de contexto WebGL.
- Admin: gravar, reabrir, migrações preservando IDs/bornes/controlos, manobra
  física e exportação GLB conservando as três fitas de estado.
- Dimensões Admin medidas: iID 72,03 × 85 × 73,50 mm;
  Vigi 36,03 × 85 × 73,00 mm, incluindo a serigrafia projetada.

## Tentativas superadas e limites

- A fixture D52 inicial estava em STOP; a aplicação bloqueava corretamente a
  manobra. O harness passou a PAUSA, sem retirar a guarda da aplicação.
- A tinta projetada sem apoio criava vértices 100 mm atrás do Vigi. Corrigida
  a projeção e validada a caixa física/serigrafia nos ensaios finais.
- O primeiro build excedeu o timeout com pressão de memória. O filho foi
  explicitamente encerrado; o build integral passou sem browser/Vite dev e
  com swap temporário no ambiente de 2 GB. Não é contado o build interrompido.
- O harness QGD minificado tentou uma sessão local no build estático VERCEL=1;
  este exige sessão Supabase e redirecionou para login. Falhou antes de abrir
  o QGD e **não é contado como teste de UI aprovado em produção**. Não se
  alterou o guard de autenticação para contornar a fixture.
- Admin medidores teve 24 PASS históricos e refresh D52 de 12 PASS; a corrida
  Admin completa dos quatro foi interrompida por RAM. O resultado atual 44 PASS
  refere-se explicitamente aos dois diferenciais, não aos quatro aparelhos.
- Sem ensaio de download automático do gerador: usados ZIP/STEP locais com
  hashes verificados. Sem Supabase/RLS/cloud/autenticação real.

## Baseline global não verde

`test:ci` foi reexecutado e parou em `editors-sweep-smoke.ts`: sobreposições
2D de `capacitorRun60uF:1/1B`, `2/2B`, `2C/2D`. Geometria global reexecutada:
`surgeProtectorWegSpw02.L` não centrado na cavidade. Mesmas áreas de baseline
registadas na entrega anterior; gates continuam ativos.

Os restantes problemas globais históricos (`terminal-seat`, `builtin-sync`,
`native-wires-3d`, `grafcet-live-dock`, `native-iec` e timeout UI GRAFCET)
não foram declarados resolvidos nem todos reexecutados nesta correção.
Logs: `ci-final.log`, `terminal-geometry-global-final.log`.

## Verificações do cofre

`npm test`: 45 testes listados, **18 executados/aprovados, 27 skipped**, zero
falhas. `npm run check`: **exit 1**, por dois links no checkout pessoal
aninhado inalterado: `docs/AI-ASSISTANCE.md` → `../.github/copilot-instructions.md`
e `../.vscode/extensions.json`. Não foram criados ficheiros vazios nem alteradas
as regras para ocultar essas pendências. Não são erros nas novas ligações
Obsidian. Logs: `brainnet-tests-final.log`, `brainnet-check-final.log`.

Antes/depois da preparação do gitlink, HEAD `adf9fbf`, 122 entradas pessoais e
o SHA-256 do estado porcelain permaneceram iguais. Evidência local:
`brainnet-nested-preservation-final.json`. Nenhum checkout/reset/clean efetuado.

## Publicação e preservação

**Pendente de autenticação e verificação remota.** Este relatório não afirma
push, deploy nem CI global verde. Produção anterior confirmada:
`d474ab3e99383e1e8ede6cc75a2b8ae1277b3323.r209.mwlsnh6v`.

Não se alterou o checkout pessoal aninhado `03-Projects/DC-Simu/dc-simu/`,
HEAD `adf9fbf`, com alterações pessoais preservadas. A referência gitlink pode
ser atualizada no índice sem fazer checkout, reset, clean ou sobrescrever esses
ficheiros. Backup anterior: `/home/user/work/qgd-release/brainnet-nested-source-before.tar.gz`.
Credenciais não entram no cofre, código, logs ou commits.
