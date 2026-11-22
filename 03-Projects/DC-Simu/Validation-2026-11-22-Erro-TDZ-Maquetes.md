---
project_id: BN-DCSIMU-001
type: validation
status: INTEGRATED_AUTO_VERIFIED
created: 2026-11-22
updated: 2026-11-22
tags: [brainnet, dc-simu, bug, tdz, maquetes, build]
---
# Erro de inicialização ao abrir a Biblioteca de maquetes

Atualização: a correção está no commit [`d8fa230`](https://github.com/deopmdecastro/dc-simu/commit/d8fa230201be8aedbe654df284a2e5848a3a9f14), enviado para `origin/main` em 22 de novembro de 2026, após o pedido direto «commit e push». O diagnóstico do bundle abaixo descreve a versão anterior a esse envio. O estado posterior da integração está no [registo de entrega](./Delivery-2026-11-22-Correcoes-Maquetes-Tomadas.md).

## Diagnóstico confirmado

O erro enviado pelo utilizador, `Cannot access 'z' before initialization`, foi localizado no [próprio bundle publicado](https://dc-simu.vercel.app/assets/index-YOf6sCv8.js), linha 1117. Nesse bundle, `z` corresponde ao auxiliar `wire` de `src/electrical/stampingWallPanel.ts`. O callback síncrono `phases.forEach` invoca `wire` e `term` antes de as respetivas constantes serem inicializadas.

O getter `componentCount` em `readyMaquettes.ts` constrói o QGD para calcular a contagem do cartão. A renderização da Biblioteca desencadeia a chamada e a exceção desmonta a interface. O nome `z` resulta da minificação.

A [versão pública](https://dc-simu.vercel.app/version.json) consultada continua a ser `fd5071a3c15ecba0c55325b6147733e9f04d673c.r303.mws2f6i1`, com `builtAt` de `2026-11-22T17:39:55.717Z`. A inspeção do JavaScript confirma que o erro continua no ficheiro servido; não foi atribuída a causa a cache do navegador.

As correções das tarefas anteriores estavam apenas no working tree local. Nem estas alterações nem os novos modelos de tomadas tinham sido enviados ao remoto ou publicados.

## Correção e proteção

- `stampingWallPanel.ts`: `term` e `wire` passam a declarações de função no início de `stampingWallPanelContent`. Ficam disponíveis em todos os callbacks síncronos, sem dependência da ordem de inicialização de constantes.
- `scripts/maquettes-build-smoke.mjs`: compila e minifica o núcleo das maquetes com Vite/Rollup e executa o getter e a construção do QGD nesse código compilado. Não altera autenticação e não precisa de sessão cloud.
- `package.json`: `npm run build` executa o novo teste entre TypeScript e o build final. As suites CI normal e rápida também o incluem.

Foi preparado adicionalmente um **patch mínimo contra o HEAD original**, apenas com a correção da ordem/disponibilidade dos auxiliares, sem incluir a reconstrução das tomadas ou a alteração da proteção de fases: `dc-simu/runtime/tdz-maquette/stamping-tdz-minimal.patch`. `git apply --check --cached` confirmou que se aplica ao índice de `fd5071a`. Preparar o patch não altera o índice nem cria um commit.

## Verificações

| Verificação | Resultado |
| --- | --- |
| `npm run test:maquetes` | 8 verificações passaram |
| `npm test` na aplicação | Passou |
| `npm run test:maquetes-build` | 3 verificações passaram: contagens 143/6, leitura repetida e QGD com componentes/cabos |
| `node scripts/maquettes-build-smoke.mjs --verify-published` | As três verificações acima passaram; o mesmo teste, com o fonte original guardado, reproduziu a TDZ esperada |
| `npm run build` | TypeScript, regressão minificada e Vite/PWA concluídos |
| `git diff --check` | Sem erros de whitespace |
| Tentativa de teste E2E com sessão local descartável sobre `dist` | Não concluída: a fixture não abriu o projeto no editor. Não se apresenta como validação de autenticação/produção |
| BrainNet `npm run check` | Mantém os 53 erros documentais já registados; as notas desta correção têm metadados válidos |

Evidências locais: bundle público em `dc-simu/runtime/tdz-maquette/index-YOf6sCv8.js`, fonte original e patch mínimo na mesma pasta, teste compilado em `compiled/`, baseline em `published-compiled/` e resultado em `minified-result.json`.

## Estado e pendência

**Corrigido, testado e integrado automaticamente após o push.** Commit `d8fa230`, carimbo de release `#304`. Não foi executado deploy manual. A Vercel confirmou `success` e o `version.json` público confirmou esse commit/carimbo em 22 de novembro de 2026, às `18:51:07 UTC`; ver o registo de entrega. A tentativa E2E local descrita acima continua a não ser apresentada como teste passado.
