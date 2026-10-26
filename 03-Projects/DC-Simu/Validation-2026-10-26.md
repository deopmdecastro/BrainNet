---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, qa, 3d, ux]
---
# Revisão dos editores 3D — 2026-10-26

## Âmbito e estado

Pedido: rever e melhorar UI, UX e funcionalidades do editor de componentes e do esquema 3D. Trabalho sobre `2f1e801` do DC-Simu; documentação no BrainNet sobre `fa08f88`. Implementado e testado com dados sintéticos. Revisão visual independente aprovada após duas passagens. Deogracia de Castro autorizou explicitamente commit e push em 2026-10-26, para os repositórios DC-Simu e BrainNet; deploy não solicitado nem executado. Commit da aplicação `5225558` enviado para `origin/main` nessa data; esta nota acompanha a atualização da referência do submódulo no BrainNet.

Ambiente: Windows, Node.js v24.13.1, Chrome com Playwright, Vite local em `127.0.0.1:5193`. Contextos descartáveis, sem API, contas ou projetos reais; service workers bloqueados. Fontes do renderizador permitidas para o carregamento dos textos 3D. Não houve alterações aos contratos nem aos workflows n8n.

## Alterações verificadas

| Área | Resultado |
| --- | --- |
| Hierarquia | Pesquisa em objetos/bornes/controlos/luzes/ecrãs, normalização de acentos, foco, teclado, propriedades e enquadramento contextual |
| Responsividade | Cabeçalho sem sobreposição; área alternada até 1024 px. A 768 px, canvas passou de 238 px para 768 px de largura |
| Transformações | Reparent, agrupar e desagrupar conservam posição/rotação/escala mundiais na base e nos estados; ciclos, bloqueios, escala nula e cisalhamento incompatível são recusados |
| Geometria | Importação dos 20 modelos físicos e 142 bornes usa o referencial do simulador; inclui os blocos vazados e marcadores proporcionais dentro dos furos |
| Compatibilidade | Atualização conservadora de importações antigas intactas, preservando IDs; ajustes manuais e modelos personalizados não são substituídos |
| Catálogo | Preparação conserva pontos interiores, diâmetro/profundidade e normal do cabo; registo sintético em memória confirma o percurso até à criação da instância |
| Esquema 3D | Selecionar sem acionar; Manobrar explícito; Apagar respeita bloqueios e histórico; sonda nos bornes; Mover vista; foco de multisseleção e correção do Numpad7 com NumLock desligado |

Guia e ficheiros principais: [comportamento e comandos](./dc-simu/docs/EDITOR-3D-UX.md), [transformações](./dc-simu/src/admin/editor3d/partTransforms.ts), [importação](./dc-simu/src/admin/editor3d/builtinComponents.ts), [viewport](./dc-simu/src/admin/editor3d/Viewport.tsx), [esquema 3D](./dc-simu/src/three/Panel3D.tsx). Hierarquia, cabeçalho, estilos, preparação do catálogo e tipos acompanham estes ficheiros.

## Evidência

| Verificação | Resultado |
| --- | --- |
| `test:editor3d-functional` | PASS — 29 verificações; transformações, histórico, 20 modelos/142 bornes, preparação do catálogo, migração e idempotência |
| `test:editor3d-ui` | PASS — 32 verificações no browser; pesquisa, teclado, 1440/1024/768/390 px, seleção/manobra/apagar/desfazer, bloqueios, sonda, Numpad7 e multisseleção; zero exceções JavaScript |
| `test:terminal-geometry` | PASS — raios de verificação dos encaixes nos 20 modelos e 142 ligações |
| `test:terminal-geometry-ui` | PASS — seis faces dos 20 componentes, contagem de bornes, 390 px e zero exceções JavaScript |
| `npm test` na aplicação | PASS — 668 verificações |
| `typecheck`, `build` | PASS; build mantém o aviso de tamanho dos chunks |
| `test:component-validate`, `test:interactables`, `test:motion`, `test:style` | PASS |
| BrainNet `npm test`, `npm run check` | PASS — 45 testes, zero falhas; 94 Markdown, 214 ligações e 3 workflows, zero erros |

Capturas e logs locais em `runtime/3d-review-20261026/`, ignorados pelo Git. Incluem `admin-desktop-after.png`, `admin-{1024,768,390}-after.png`, `admin-mobile-properties-after.png`, `panel-desktop-after.png`, `panel-mobile-after.png`, `editor-ui.log`, `test.log` e `build.log`. A avaliação visual voltou a abrir 375/768/1024/1440 px e não deixou correções prioritárias pendentes. Só o fornecedor de modelos disponível foi usado; não se realizou avaliação entre fornecedores distintos.

## Limites e pendências

- Não foram alteradas versões já publicadas nem foi feito deploy. A autorização desta entrega abrange commit e push dos ficheiros revistos, para `origin/main` dos dois repositórios.
- A atualização automática requer reconhecer uma importação antiga intacta. Os restantes rascunhos conservam os ajustes existentes e podem exigir edição manual.
- Transformações que exigem cisalhamento não são representáveis no formato atual de posição/rotação/escala; a operação é recusada sem alterar o modelo.
- A validação cobre o browser local e estas resoluções; não substitui testes num dispositivo físico ou no ambiente de produção.

[[README|Índice]] · [[Backlog]] · [[Testing-Plan]] · [[Validation-2026-10-25|Validação anterior]].
