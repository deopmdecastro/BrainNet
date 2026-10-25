---
project_id: BN-DCSIMU-001
type: validation-record
status: PARTIALLY_VERIFIED
created: 2026-10-25
updated: 2026-10-25
tags: [brainet, dc-simu, qa, node-22, grafcet]
---
# Validação operacional — 2026-10-25

## Objetivo e ambiente

Verificar o checkout da aplicação que o BrainNet referencia como submódulo e registar uma evidência reproduzível, sem usar contas, projetos ou serviços reais.

- Aplicação: `deopmdecastro/dc-simu`.
- Runtime usado nos checks do produto: Node.js **v22.23.4** (`node@22` temporário). O Node global do sandbox é v20.20.2 e não satisfaz o requisito do produto (`>=22.12.0`).
- Browser: Chromium Playwright instalado apenas no ambiente de validação; os testes usam contexto novo, fixtures descartáveis e bloqueiam chamadas remotas/API.
- Base de dados: `better-sqlite3` foi reconstruído para ABI 127 do Node 22 antes do teste de servidor.

## Resultado dos checks

| Área | Comando / percurso | Resultado |
| --- | --- | --- |
| Tipos | `tsc -b` sob Node 22 | PASS |
| Núcleo elétrico, Ladder e GRAFCET | `tsx scripts/smoke.ts` sob Node 22 | PASS — 643 verificações, 0 falhas |
| API local / autenticação / SQLite temporário | `scripts/server-e2e.mjs` sob Node 22 | PASS — 111 verificações, 0 falhas |
| Cliente n8n | `test:n8n-client` | PASS — 7 verificações |
| UI GRAFCET | `scripts/grafcet-ui-smoke.mjs` contra Vite local | PASS |
| UI de blocos | `scripts/add-block-ui-smoke.mjs` contra Vite local | PASS |
| Modais GRAFCET | `scripts/grafcet-modals-ui-smoke.mjs` contra Vite local | PASS — 23 verificações |
| Construção/importação GRAFCET | `scripts/grafcet-construction-ui-smoke.mjs` contra Vite local | PASS — 17 verificações |
| Cofre BrainNet | build de workflows, `npm test`, `npm run check` | PASS — execução anterior desta sessão: 18 pass, 27 skips, 0 fail; 88 Markdown, 180 links, 3 workflows, 0 erros |

## Correções verificadas no incremento

1. A nova configuração Siemens/LOGO! usa os endereços canónicos `I0.0…`, `Q0.0…` e segundos contactos `·2`; a migração conserva cabos e IDs de projetos legados.
2. Os cenários elétricos e as tabelas GRAFCET foram atualizados para a convenção canónica, mantendo aliases legados como fallback de leitura quando necessário.
3. O estado padrão do PLC compacto expõe `Q0.0…Q0.7`, permitindo scans independentes em configurações multi-PLC.
4. O seletor de variáveis do editor de condições preserva a seleção enquanto abre o picker, para substituir o token escolhido em vez de o inserir numa posição colapsada.
5. Os smoke tests de browser passaram a usar Chromium Playwright instalado por defeito (com canal opcional) e o output dos modais é gravável/portável.

## Limite conhecido: build de produção no sandbox

O `vite build` ainda **não é uma evidência concluída neste sandbox**. Dois limites de memória controlados falharam durante `transforming`:

- Node 22 com heap de 768 MiB: `JavaScript heap out of memory`;
- Node 22 com heap de 900 MiB e `--minify false`: `JavaScript heap out of memory`.

Numa tentativa anterior nesta sessão, com heap de 4 GiB, o Vite transformou 1269 módulos e o processo foi terminado pelo host em `rendering chunks`. Estes resultados não são uma falha de assertion do produto, mas impedem declarar o artefacto de produção verificado neste ambiente. A próxima validação deve executar `npm run build` (ou o Vite equivalente) num runner com memória suficiente e registar o resultado antes de qualquer declaração de lançamento.

## Conclusão operacional

Os motores, persistência/API local e quatro percursos de interface exercitados estão operacionais no runtime suportado. A validação de artefacto de produção permanece pendente exclusivamente por limite de recursos do sandbox; as pendências n8n de segurança e de serviço real permanecem independentes desta execução.

## Atualização — sessão de 2026-10-25 (clone limpo, Node v22.22.2)

Ambiente: sandbox com 1 vCPU e ~4 GB de RAM, clone novo do `dc-simu` no commit `44bda35`, `npm ci`.

| Área | Resultado |
| --- | --- |
| `tsc -b` | PASS |
| Smoke de núcleo, Ladder (compare, math, rename, integration), GRAFCET (signals, sync, word, links, dialogs), FluidSIM, nomes, estilo, interactables, motion | PASS (15 scripts) |
| `server-e2e` | PASS — 111 verificações, 0 falhas |
| `vite build` com `--max-old-space-size=3072` | PASS em 33,6 s; PWA com 77 entradas em precache; aviso de chunks > 500 kB |
| Percursos UI (Playwright) | **Não executados**: este sandbox não tem browsers Playwright e o download não está permitido na rede |

O limite de memória anterior (ENV-01) não se reproduziu com 3 GiB de heap; o build de produção passa a ter evidência neste ambiente. Continua por registar o build no runner de produção e a repetição dos quatro percursos UI.

Incremento novo (`84494d6`): `scripts/diagnostics-smoke.ts` (`npm run test:diagnostics`) cobre os diagnósticos adicionados ao Ladder e ao GRAFCET e confirma que nenhum dos 11 modelos incluídos gera falsos positivos.

[[Testing-Plan|Plano de validação]] · [[Backlog|Backlog]] · [[Decision-Log|Decisões]] · [[Project-Brief|Briefing]]
