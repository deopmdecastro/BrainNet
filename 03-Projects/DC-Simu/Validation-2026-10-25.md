---
project_id: BN-DCSIMU-001
type: validation-record
status: PARTIALLY_VERIFIED
created: 2026-10-25
updated: 2026-10-26
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

## Atualização — grelha comum dos editores (2026-10-25)

Incremento `146972f` centraliza o contrato visual em `EDITOR_THEME`: fundo `#f7f9fc`, ponto de 1 px `#c9d3e3`, linha de 1 px `#e4eaf2` e passo visual padrão de 20 px. A alteração é apenas de apresentação: snap, zoom, o toggle de visibilidade e as coordenadas continuam nas respetivas stores; a malha estrutural Ladder mantém 20 px.

| Área | Comando / percurso | Resultado |
| --- | --- | --- |
| Tipos | `tsc -b` com Node v22.23.4 | PASS |
| Regressão GRAFCET | `GRAFCET_TEST_URL=http://127.0.0.1:5173 node scripts/grafcet-ui-smoke.mjs` | PASS |
| Regressão Ladder | `BLOCK_TEST_URL=http://127.0.0.1:5173 node scripts/add-block-ui-smoke.mjs` | PASS |
| Grelha transversal | `GRID_TEST_URL=http://127.0.0.1:5173 node scripts/editor-grid-ui-smoke.mjs` | PASS — confirma pontos e linhas no SVG do Esquema, fundo/linhas do GRAFCET e Ladder, montagem 3D e ausência de exceções ao alternar o estilo. |

A grelha espacial do cenário 3D permanece uma ajuda de profundidade, distinta da textura de edição sobre a chapa; esta última passou a obedecer à preferência comum de pontos/linhas.

## Atualização — bornes recuados e identificação por face (2026-10-25)

Foi concluído o incremento local que estava por terminar sobre `6c15b0c`. Os bornes medidos voltam a usar o centro do encaixe e o recuo físico, mantendo a conversão correta de Y. A fábrica e o editor partilham agora `realTerminalPosition`, em `src/electrical/realInterfaces.ts`. O editor reconhece a face de um borne no encaixe medido, mesmo quando este fica dentro da caixa exterior do modelo; bornes deslocados manualmente seguem a sua nova posição.

A migração reconhece as duas convenções automáticas anteriores: Y invertido e posição na superfície. Preserva IDs, coordenadas 2D e posições manuais distintas dessas convenções. A repetição da migração conserva a identidade dos componentes já atualizados. Esta atualização substitui a opção de fixar os bornes medidos na superfície descrita no incremento anterior.

Ambiente desta execução: Windows, Node.js **v24.13.1**, dependências já instaladas.

| Verificação | Resultado |
| --- | --- |
| `npm test` na aplicação | PASS — 663 verificações; inclui todas as interfaces medidas, migração da superfície, idempotência e deslocação manual |
| `npm run typecheck` | PASS — corrigido o import de `ComponentType` em falta no incremento retomado |
| `npm run build` | PASS — Vite em 14,65 s, PWA com 77 entradas; mantém o aviso de chunks acima de 500 kB |
| `npm run test:component-validate` | PASS — 10 verificações |
| `npm run test:style` | PASS |
| Browser local isolado | Confirmados 6 bornes no Topo (`−V/+V/RDY`) e 3 na Base (`PE/L/N`) do componente Proauto |
| BrainNet: `npm test` | PASS — 45 testes, 0 falhas, 0 ignorados |
| BrainNet: `npm run check` | PASS — 91 notas, 200 ligações, 3 workflows, sem erros |

A verificação de browser usou Chromium através de `agent-browser`, com domínios limitados a `127.0.0.1`, API bloqueada e integrações remotas desativadas no processo de teste. O editor completo ficou no estado «A carregar o editor…»; para conferir as faces, foi montado o componente real `TerminalFaceEditor` num cenário isolado com uma fonte sintética. As capturas confirmam a renderização desse componente, sem constituir validação ponta-a-ponta do editor completo.

Evidência local, ignorada pelo Git: `runtime/dc-simu-terminals-test.log`, `runtime/dc-simu-terminals-build.log`, `runtime/dc-simu-terminals-top.png` e `runtime/dc-simu-terminals-base.png`. Código alterado em `factory.ts`, `realInterfaces.ts`, `terminalFaces.ts`, `TerminalFaceEditor.tsx` e `scripts/smoke.ts`.

**Preparado:** cenário sintético e evidências locais. **Implementado/testado:** cálculo partilhado, associação por face e migração. **Versionado:** commit `13896bc`, enviado para `origin/main` de `deopmdecastro/dc-simu`; o ponteiro do submódulo e estes registos acompanham o commit do BrainNet. **Autorização:** pedido direto do utilizador «fazer commit e push», em 2026-10-25, para as alterações desta tarefa nos dois repositórios. **Aprovado para produção:** sem aprovação de deploy registada. **Pendências:** repetir o percurso no editor completo e conferir o alinhamento visual dos restantes modelos; não foi executado qualquer deploy.

## Atualização — alinhamento com as cavidades do CAD (2026-10-25)

O utilizador assinalou, através de uma imagem do Phoenix PTI 6, que os marcadores continuavam fora dos furos. A validação anterior comparava coordenadas e faces configuradas, sem provar a coincidência com as cavidades do GLB. Esta execução substitui essa calibração por medições na geometria final.

- `fitComponentModel` passa a ser o referencial comum do Painel 3D, capturas, catálogo, landing e medições: rotação, espelho e dimensões físicas nos três eixos. O dimensionamento isolado pela altura deixava volumes diferentes dos usados pelos bornes, sobretudo no multímetro.
- As ligações foram recalibradas no CAD renderizado. Os marcadores cabem no diâmetro e na profundidade dos encaixes e respeitam a oclusão pelo plástico. A direção do cabo segue a face do encaixe, incluindo cavidades recuadas.
- O utilizador escolheu expressamente acrescentar réguas com furos ao relé de segurança e ao PLC LS, cujos CAD não tinham os 16 e 34 encaixes necessários. As réguas são geometria funcional adicional, com recorte das tampas sobrepostas e fundo recuado. A caixa funcional do motor recebe os sete encaixes alinhados com os seus endereços; as pontes Y/Δ mantêm o comando existente.
- O multímetro recupera as quatro tomadas `COM/VΩ/mA/10A`. A migração conserva os IDs das duas tomadas antigas, recupera as duas em falta e é idempotente. As posições antigas estão preservadas em `legacyRealInterfaces.ts`; posições manuais e bornes fixados não são deslocados.

Ambiente: Windows, Node.js **v24.13.1**, Chrome instalado, Vite local com integrações remotas desativadas. Testes de browser usam projeto/sessão sintéticos e bloqueiam API real.

| Verificação | Resultado |
| --- | --- |
| `npm test` na aplicação | PASS — 668 verificações, incluindo migração a partir de `13896bc`, IDs/2D, bornes fixados, carregamento completo e recuperação das tomadas |
| `npm run test:terminal-geometry` | PASS — 142 ligações nos 20 modelos; raios medem aro/fundo, profundidade disponível, tamanho dos marcadores, escala física e face de saída do cabo |
| `npm run build` | PASS — inclui tipos; Vite em 13,79 s; PWA com 77 entradas; mantém aviso de chunks acima de 500 kB |
| `npm run test:component-validate` e `npm run test:style` | PASS |
| `npm run test:motion` | PASS |
| `test:grid-ui` com `GRID_TEST_CHANNEL=chrome` | PASS — oito verificações nos quatro editores, sem exceções JavaScript |
| `test:terminal-geometry-ui` com Chrome | PASS — seis faces dos 20 componentes no editor completo, quatro tomadas do multímetro a 390 px e nenhuma exceção JavaScript |
| BrainNet: `npm test` | PASS — 45 testes, 0 falhas, 0 ignorados |
| BrainNet: `npm run check` | PASS — 92 notas, 204 ligações, 3 workflows, sem erros |

As capturas de inspeção geométrica estão em `runtime/terminal-geometry-before.png`, `runtime/terminal-geometry-all-before.png` e `runtime/terminal-geometry-after.png`. As capturas do editor completo estão em `runtime/terminal-geometry-ui/`, para Phoenix PTI 6, PE, relé de segurança, PLC LS e multímetro. Logs de núcleo e build: `runtime/terminal-geometry-core.log` e `runtime/terminal-geometry-build.log`. São evidências locais sintéticas, ignoradas por Git. A documentação [TERMINAL-GEOMETRY.md](./dc-simu/docs/TERMINAL-GEOMETRY.md) descreve os ficheiros e a reprodução dos testes.

**Preparado:** cenários de inspeção e teste UI reproduzíveis. **Implementado/testado:** calibração física dos 20 modelos, réguas, marcadores, migração e percurso no editor completo. O teste UI permite os ficheiros de fontes usados pelo texto 3D; bloquear o resolvedor de fontes suspendia o editor e originava o ecrã «A carregar o editor…» observado na tentativa anterior. **Versionado em 2026-10-26:** commit `2f1e801`, enviado para `origin/main` de `deopmdecastro/dc-simu`; estes registos e o ponteiro do submódulo acompanham o commit do BrainNet. **Autorização:** pedido direto do utilizador «fazer commit e push», em 2026-10-26, para as alterações desta tarefa nos dois repositórios. O utilizador também autorizou as réguas complementares; sem aprovação de deploy registada e sem deploy executado. A geometria acrescentada complementa a visualização funcional e não é uma medição dos conectores ausentes no CAD original.

[[Testing-Plan|Plano de validação]] · [[Backlog|Backlog]] · [[Decision-Log|Decisões]] · [[Project-Brief|Briefing]]
