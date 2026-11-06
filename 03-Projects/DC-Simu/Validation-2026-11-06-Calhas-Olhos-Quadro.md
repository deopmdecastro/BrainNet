---
type: validation
status: IMPLEMENTED_LOCAL
created: 2026-11-06
updated: 2026-11-06
tags: [dc-simu, calhas, quadro, edicao-3d, validacao]
---
# Junções de calhas e olhos do quadro

Implementado e testado localmente. Commit `c358446` enviado para `dc-simu/main` em 6 de novembro de 2026, após o pedido explícito do utilizador «commit e push». As alterações anteriores à largura do painel foram preservadas no commit `7937899`, também enviado. O push não constitui validação de um lançamento em produção.

## Resultado

Os botões «Juntar outra calha» já chamavam o store, mas recusavam a criação se o comprimento completo não coubesse. A reprodução com uma calha de 400 mm dentro do quadro devolvia `null`, embora houvesse espaço para um troço mais curto.

- Prolongamentos e ramais procuram o maior comprimento que cabe, até ao mínimo de 50 mm, sem atravessar aparelhos ou paredes. O comprimento pedido é editável. Comprimento máximo de 3000 mm.
- A nova peça mantém encosto, largura, altura, tampa, cor e associação ao quadro. As junções em T abrem a parede correspondente. Repetir o botão não sobrepõe um troço duplicado.
- As setas e os nomes dos quatro botões acompanham a orientação da calha. Alterações estruturais ficam bloqueadas durante RUN/PAUSA e em calhas bloqueadas.
- A confirmação ou a falta de espaço aparece no próprio inspetor. A origem permanece selecionada para criar outros ramais; «Editar a nova calha» permite passar para a peça criada.
- No inspetor do quadro, «Visibilidade para edição 3D» tem olhos independentes para porta, laterais esquerda/direita, topo, base, fundo e chapa de montagem, além de ocultar/mostrar todas as chapas.
- Os olhos não abrem a porta, não removem aparelhos/cabos e não alteram a física das paredes. A visibilidade persiste no JSON e participa no Desfazer/Refazer.
- Peças ocultas não interceptam cliques e deixam de projetar sombras. Etiquetas e marcas dos furos acompanham a visibilidade da respetiva face. As faces ficam protegidas contra fusão pelo otimizador de malhas.

## Ficheiros

Na aplicação `dc-simu/`: `src/schematic/ductPlacement.ts`, `src/store/useSimStore.ts`, `src/components/PanelAccessoryControls.tsx`, `src/three/enclosureParts.ts`, `src/three/enclosureVisibility.ts`, `src/three/PanelAccessories3D.tsx`, `scripts/duct-resize-smoke.ts`, `scripts/enclosure-visibility-smoke.ts`, `scripts/panel-accessories-smoke.ts` e `package.json`.

## Verificações e evidência

- `npm run test:duct-resize`: 61 verificações de calhas e o novo teste dos olhos passaram. Inclui criação pelos métodos reais do store, quatro direções e quatro rotações, junções, espaço insuficiente, duplicados, herança, Desfazer/Refazer e guardar/reabrir.
- Teste dos olhos: faces independentes, restaurar, raycasting sem bloquear a edição, persistência, histórico, obstáculos físicos inalterados e resistência a três passagens do otimizador.
- `npm test`, `npm run typecheck`, `npm run build` e `git diff --check`: passaram. Corrigidas também duas comparações impossíveis de tipos no bloco de marcas de furos do renderizador alterado. O build mantém avisos de tamanho de bundles e imports estáticos/dinâmicos.
- Browser local isolado, com o `App`, inspetor e cena reais: botão «Prolongar à direita» criou **CT2 com 316 mm** para um pedido de 400 mm e mostrou a confirmação. O olho da porta revelou o interior mantendo `doorOpen=false`. Um clique real através da porta oculta selecionou **CT1**. Ocultar e restaurar todas as sete chapas funcionou. Sem erros JavaScript na sessão final de teste.
- A montagem temporária do browser foi removida antes do build final; não usa dados de clientes ou credenciais.

Capturas sintéticas locais: [junção funcional](../../runtime/calhas-juntar-funcional.png), [olhos e porta oculta](../../runtime/quadro-olhos-porta-oculta.png) e [todas as chapas ocultas](../../runtime/quadro-todas-chapas-ocultas.png). `runtime/` é ignorado pelo Git.

## Pendências anteriores

`npm run test:panel-accessories` continua a falhar em «perfil guardado no estado», linha 73: o teste espera 5,5 mm para um perfil desconhecido, enquanto o perfil por omissão atual é TS35×7,5. Essa regra não foi alterada nesta tarefa. As verificações da geometria do quadro anteriores a esse ponto passaram.

`npm run check` na raiz mantém nove problemas documentais anteriores: duas propriedades em falta numa nota e sete ligações de imagens em duas notas de 2 de novembro. Publicação e aprovação de lançamento permanecem pendentes.
