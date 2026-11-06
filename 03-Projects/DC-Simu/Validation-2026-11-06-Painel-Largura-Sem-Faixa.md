---
type: validation
status: IMPLEMENTED_LOCAL
created: 2026-11-06
updated: 2026-11-06
tags: [dc-simu, interface, paineis, tablet, validacao]
---
# Painel Elementos — largura e faixa vazia

Implementado e verificado localmente. Commit `7937899` enviado para `dc-simu/main` em 6 de novembro de 2026, após o pedido explícito do utilizador «commit e push». O push não constitui validação de um lançamento em produção.

## Resultado e ficheiros

O contentor da biblioteca era forçado pelo CSS a `clamp(340px, 29vw, 420px)`, enquanto o conteúdo recebia uma largura independente de 300 px. A diferença criava a faixa vazia mostrada pelo utilizador e impedia que o arrasto controlasse a largura real.

- `dc-simu/src/App.tsx`: largura inicial e mínima de 340 px (antes 300/220), máxima de 460 px; preferências antigas inferiores ao mínimo passam para 340 px. Biblioteca 3D e biblioteca IEC preenchem 100% do contentor.
- `dc-simu/src/styles/panel-drawer.css`: removida a largura forçada com `!important`; o contentor respeita a preferência e o puxador. Removida a borda exterior duplicada no PC/tablet; o painel interior mantém o separador.

## Verificação e evidências

Inspeção com `agent-browser` numa montagem temporária do `App` real, com as folhas CSS reais e projeto sintético vazio, sem depender da conta. O ficheiro temporário foi removido.

- PC a 1600 px, bibliotecas IEC e 3D: contentor e conteúdo com 340 px; diferença entre margens direitas de 0 px.
- Layout de tablet a 1024 e 1280 px (incluindo `data-tablet=true`): conteúdo preenche o painel, sem faixa vazia.
- Arrasto: 400 px guardados na preferência; limite superior de 460 px e inferior de 340 px, sempre com conteúdo à mesma largura. Recolher e reabrir funciona.
- Telemóvel a 390 px: gaveta de 340 px, conteúdo de 339 px mais a borda de 1 px; sem overflow horizontal da página.
- Sem erros JavaScript no navegador de teste.
- `npm test` da aplicação e `git diff --check`: passaram.

Capturas locais: [PC](../../runtime/painel-largura-pc.png) · [tablet](../../runtime/painel-largura-tablet.png). Evidência sintética em `runtime/`, ignorada pelo Git.

## Pendências anteriores

Na verificação inicial, `npm run typecheck` encontrou dois erros TS2367 em `src/three/PanelAccessories3D.tsx`, linhas 136 e 144, sobre comparações com `none` e `front`. Foram entretanto corrigidos no commit `c358446`, relativo às calhas e aos olhos do quadro; a verificação TypeScript passou antes do push.

`npm run check` na raiz continua a reportar os nove problemas documentais anteriores: duas propriedades em falta numa nota e sete ligações para imagens em duas notas de 2 de novembro. A publicação e a aprovação de lançamento permanecem pendentes.
