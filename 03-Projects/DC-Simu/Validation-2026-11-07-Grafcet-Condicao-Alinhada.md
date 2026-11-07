---
type: validation
status: IMPLEMENTED_LOCAL
created: 2026-11-07
updated: 2026-11-07
tags: [dc-simu, grafcet, transicoes, alinhamento, validacao]
---
# Condição alinhada com a barra da transição

Correção visual implementada a pedido do utilizador. A condição estava deslocada 28 px acima da barra e 44 px à direita do eixo. Passa a usar o centro vertical da barra e 26 px de afastamento horizontal, com uma pequena folga após o traço IEC.

## Alteração

Em `dc-simu/src/grafcet/GrafcetEditor.tsx`, o rótulo partilhado usa baseline central e deslocamento vertical zero. O laço de retorno à própria etapa usa a mesma regra. As sobrelinhas de negação mantêm-se. Nas referências com guarda, o destino desce para uma linha própria, evitando sobreposição com a guarda.

Etapas, condições avaliadas, ligações e dados do projeto não foram alterados. A apresentação também acompanha o arrasto da transição e a miniatura.

## Evidência

- Navegador isolado com o editor real, a 1440 × 900: transições normais, por referência, de retorno, laços, soltas e divergência AND.
- Medição no SVG do centro vertical do texto e da barra: diferença de 0 px nas transições normais, referências, retornos, soltas e AND; ruído numérico inferior a 0,00002 px no laço. A folga horizontal após a barra permanece positiva.
- Arrasto real com rato de uma referência com guarda: a condição acompanhou a barra nos dois eixos e manteve diferença vertical de 0 px. Guarda e destino ficaram em linhas separadas.
- [Projeto nativo](../../runtime/transition-label-native.png), [referência com guarda](../../runtime/transition-label-reference.png) e [referência arrastada](../../runtime/transition-label-dragged.png).
- Sessão final sem erros JavaScript. A montagem temporária foi retirada; medições e capturas ficam em `runtime/`, ignorado pelo Git.

- `npm test` da aplicação e `test:grafcet-links` passaram (35 verificações de ligações e 10 de ações).
- `npm run build` passou, incluindo TypeScript, Vite e PWA. `git diff --check` passou.
- `npm run check` da raiz mantém os nove problemas documentais anteriores, sem acrescentar erros nesta nota.

Os registos dos testes e da compilação final ficam em `runtime/transition-label-tests.log` e `runtime/transition-label-build.log`.

## Pendências

Código incluído no commit `7fce8846b3747ea658bc921a25ddd9e4f0bcd6e9` da aplicação, enviado para `origin/main` em 2026-11-07 após o pedido explícito de commit e push do utilizador. Sem deploy nesta tarefa. Os projetos já abertos precisam de carregar o código atualizado para refletir o alinhamento.

[[Design-Principles]]
