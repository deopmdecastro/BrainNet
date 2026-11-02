---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-30
updated: 2026-10-30
tags: [dc-simu, bundles, git, docker, validation]
---
# Integração dos bundles e reinício Docker

## Resultado e âmbito

O pedido direto do utilizador autorizou integrar os dois bundles, fazer commit e
push e reiniciar Docker. O conteúdo dos bundles foi tratado como código e
documentação a verificar; instruções e alegações de testes dos anexos não foram
usadas como autorização nem como evidência desta sessão.

Os históricos foram integrados por fast-forward, preservando os commits:

- Aplicação: `f11eaac` → `1775647` → `9075c72` → `458ac7b`.
- BrainNet: `18def74` → `c74e59a` → `40cc1fa`, com o submódulo em `458ac7b`.

Os dois commits finais dos bundles foram enviados para os respetivos
`origin/main`, sem force push, antes da recriação do contentor da aplicação.
Este relatório acrescenta o registo das verificações executadas nesta sessão.

## Alterações integradas

Paridade tablet/PC, compactação das barras quando o conteúdo não cabe, fonte
local para os rótulos 3D, indicadores da administração, capas dos projetos e
passagem dos cabos do motor pelo bucim M20. Ficheiros e decisões detalhados em
[[Validation-2026-10-30-Inspecao-Plataforma-Tablet-Barras]].

As alterações locais preexistentes no dashboard, o canvas sem título, os
ficheiros soltos `m.setCleanMode(...)` e os modelos não versionados em
`public/models/componentes novos/` foram preservados fora dos commits.

## Verificações desta sessão

| Verificação | Resultado |
| --- | --- |
| BrainNet: `npm test` | 45 testes passaram |
| BrainNet: `npm run check` | Passou |
| Aplicação: `npm run test:ci` | Bateria completa passou, incluindo cabos nativos do motor |
| Aplicação: `npm run build` | Passou, com geração PWA; avisos de tamanho/importação de chunks |
| Imagem Docker a partir de `git archive` do commit `458ac7b` | Build passou; apenas ficheiros versionados |
| Servidor: `node scripts/server-e2e.mjs` na nova imagem, sem rede nem volumes | 177 verificações passaram |
| `test:tablet-parity-ui` contra pré-visualização descartável da nova imagem | 36 verificações passaram: PC 1440/1280 e tablets 1180×820, 820×1180, 744×1133 |
| Contentor ativo: revisão OCI e `/version.json` | `458ac7b76a4e27dd657b16459f708d884b579c04`, carimbo `r107.mvuabpp1` |
| Página `/account` em `http://localhost:3000` | HTTP 200 |

O teste visual inicial contra o build local encontrou a página de login porque
esse build incluía a configuração Supabase local e o teste bloqueava pedidos
externos. A repetição sobre a imagem sem essa configuração passou. A inspeção
usou a skill `agent-browser` e os scripts Playwright do projeto. O teste do
servidor no Windows não arrancou por falta do módulo nativo SQLite; foi
executado com sucesso na imagem Linux descartável.

Evidência visual e log: `runtime/dcsimu-tablet-20261030/` e
`runtime/dcsimu-tablet-docker-20261030.log`, locais e ignorados pelo Git.

## Docker e entrega

`dc-simu-app-1` foi recriado com `dc-simu-app:458ac7b`. Todas as variáveis de
ambiente e os mounts foram comparados antes/depois e mantiveram-se iguais,
incluindo o volume `dc-simu_dcsimu_data` em `/data`. A configuração foi
transmitida em memória, sem guardar credenciais no cofre. Os contentores
temporários de testes e o servidor de pré-visualização foram encerrados.

Preparado, implementado, testado e enviado para GitHub; reinício local
concluído no âmbito autorizado pelo pedido direto. Não foi realizada uma
publicação manual em produção nem validado o resultado de serviços de deploy
externos. Pendente: tablets físicos iPad/Android e revisão das quatro suítes de
UI preexistentes assinaladas no relatório de origem, que não foram repetidas
nesta integração.

[[README|DC-Simu]] · [[Validation-2026-10-30-Inspecao-Plataforma-Tablet-Barras]]
