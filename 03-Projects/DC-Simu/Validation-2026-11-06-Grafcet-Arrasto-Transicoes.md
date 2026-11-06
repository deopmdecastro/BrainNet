---
type: validation
status: IMPLEMENTED_LOCAL
created: 2026-11-06
updated: 2026-11-06
tags: [dc-simu, grafcet, transicoes, arrasto, toque, validacao]
---
# GRAFCET — arrastar transições por referência

Implementado e verificado localmente. Commit `e74e631` enviado para `dc-simu/main` em 6 de novembro de 2026, após o pedido explícito do utilizador «commit e push». Inclui também o seletor de páginas da plataforma. O push não constitui validação de um lançamento em produção.

## Correção

As barras por referência, como E3 e T6 do G0 da Estampagem, não tinham handlers de arrasto nem área de captura. A posição gráfica era sempre calculada sem consultar as barras guardadas em `linkBars`.

- As referências passam a usar o mesmo mecanismo de arrasto das transições com linhas, com posição nos dois eixos, grelha e Alt para movimento livre. O percurso acompanha a barra, mantendo origens, destinos e receptividade.
- A posição em `linkBars` alimenta tanto a pré-visualização como o desenho depois de guardar/reabrir. Também funciona em referências sem irmãs e em pequenos deslocamentos horizontais inferiores a 80 px.
- A área de captura fica centrada na barra. Clique/toque seleciona a transição e não cai no fundo do canvas; o alvo clicável também impede o ajuste de toque do Chromium de escolher os portos de ligação vizinhos.
- A vista fica fixada no início do gesto, antes de a seleção abrir o inspetor e reduzir o canvas. Um pequeno toque deixa de provocar um salto e de criar uma posição manual. O limiar tátil é de 9 px.
- Escape cancela o movimento em curso; Desfazer/Refazer trata cada arrasto como uma única alteração. As referências movidas para a esquerda/acima entram nos limites de navegação.
- Os botões de configurar/eliminar das referências foram afastados da área da barra e dos portos, para continuarem acessíveis.

## Ficheiros

Na aplicação `dc-simu/`: `src/grafcet/GrafcetEditor.tsx`, `src/grafcet/referenceLayout.ts` e `scripts/grafcet-links-smoke.ts`. O CSS e o uso do `Select` partilhado pertencem à alteração local anterior.

## Verificações e evidência

- `test:grafcet-links`: **35 verificações de ligações + 10 de disposição de ações**, incluindo oito novas verificações de posição manual, referência sem ramos, histórico, guardar/reabrir, sequência preservada e reposição por Organizar.
- Browser isolado com o editor e o projeto nativo reais: arrasto com rato de E3, T6 e T1 com linhas. Movimento pedido de 60 × 30 px na E3 resultou em cerca de 62 × 29 px devido à grelha, sem salto ao abrir o inspetor. Origens, destinos e condições mantiveram-se iguais.
- Ctrl+Z/Ctrl+Shift+Z, Escape, guardar/reabrir e botão «Configurar transição» da E3 verificados no browser. Sessão final sem erros JavaScript.
- Gesto tátil real no Chromium, pelo protocolo documentado do `agent-browser`, a 1024 × 900: eventos `pointerType=touch` e `isTrusted=true` na barra de G1/T2. Movimento de 3 × 2 px não alterou o diagrama; o arrasto seguinte de 35 × 50 px guardou a referência em x=171, y=418, sem mudar as ligações.
- `npm run typecheck` e `git diff --check`: passaram. `npm test` da aplicação passou.
- `test:grafcet-examples`: 128 + 104 verificações passaram. `npm run build` passou no estado final; a montagem temporária não está em `dist/`.
- `npm test` da raiz: 45 testes passaram. `npm run check` mantém os nove problemas documentais anteriores (duas propriedades em falta e sete ligações de imagens em notas de novembro); esta nota não acrescenta erros.

Captura sintética local: [E3 arrastada](../../runtime/grafcet-transicao-e3-arrastada.png). Dados e evidências de teste ficam em `runtime/`, ignorado pelo Git. A montagem temporária do editor foi removida.

[[Design-Principles]] · [[Validation-2026-11-06-Estampagem-Organizacao-Edicao]]
