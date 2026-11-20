---
type: validation
status: IMPLEMENTED_PENDING_VISUAL_APPROVAL
created: 2026-11-20
updated: 2026-11-20
tags: [dc-simu, murrelektronik, mico, 3d, validacao]
---
# MICO Classic 4.6 — revisão pela fotografia

## Resultado implementado

Revisto o modelo `breakerMurrelektronikMico46`, Murrelektronik MICO Classic 4.6, referência `9000-41034-0100600`, comparando a fotografia fornecida com o manual de instalação V2.5. A revisão anterior tinha corpo baixo, bornes horizontais, grelha elevada, janela opaca e nove nervuras inferiores grossas.

A reconstrução passa a ter corpo cinzento carvão, frente superior inclinada, grelha superior perfurada, ranhuras laterais abertas com fundo interior escuro, duas entradas grandes de mola e bloco central em duas filas. A entrada ON tem dois encaixes; 13 e 14 ficam na fila inferior. As teclas transparentes são independentes da tampa de proteção transparente sobre os quatro seletores de corrente. A parte inferior tem quatro lâminas inclinadas, separadores finos, entalhes e fixações laterais. O logótipo antigo MURR ELEKTRONIK substitui a marca moderna usada anteriormente. Foram revistas as legendas e acrescentada a identificação lateral.

O manual indica largura 70 mm, altura 90 mm e profundidade 80 mm. A caixa do GLB mede **70 × 90 × 79,9 mm**; a diferença de 0,1 mm é inferior à tolerância da reconstrução. A revisão anterior media 71 × 83,1 × 56 mm. A referência documental é o [manual MICO 4.6](https://media.automation24.com/manual/101523.pdf), também disponível em `dc-simu/public/datasheets/industrial/murrelektronik-mico46.pdf`.

Os doze bornes têm cavidades geométricas abertas. Os eixos inclinados são partilhados pelo ponto de entrada, recuo do cabo, Painel e Admin. Os pares L+/L+2, GND/GND2 e ON/ON2 estão ligados internamente. As teclas mantêm a manobra dos canais e os seletores mantêm os valores 1/2/4/6 A. Com alimentação, o LED apresenta verde em ON e vermelho em OFF; sem alimentação fica escuro. A animação de intermitência de sobrecarga/defeito não foi acrescentada nesta revisão.

Projetos nativos antigos migram apenas as posições e interfaces automáticas reconhecidas. São conservados os IDs dos onze bornes existentes e os extremos dos cabos; acrescenta-se ON2. Bornes fixados, posições, normais e interfaces personalizadas, bem como geometria de autoria, têm proteção contra substituição. O Admin reconhece os pontos antigos, conserva IDs e nomes e acrescenta ON2 quando migra a geometria automática.

## Ficheiros

- Gerador: `dc-simu/scripts/lib/mico-classic-model.mjs`, chamado por `scripts/build-industrial-devices.mjs`.
- Serigrafia: `scripts/build-mico-labels.mjs` e imagens `public/models/industriais/mico-*.png`.
- Modelo e metadados: `public/models/industriais/breakerMurrelektronikMico46.glb`, `sources.json` e `src/data/industrial-device-geometry.json`.
- Acabamento, transparência, comandos e LED: `src/three/industrialFinish.ts`.
- Interfaces e migração: `src/electrical/realInterfaces.ts`, `industrialDevices.ts`, `legacyRealInterfaces.ts`, `factory.ts`, `src/three/terminal3D.ts` e `src/admin/editor3d/builtinComponents.ts`.
- Verificações: `scripts/industrial-devices-smoke.ts`, `mechanical-refinement-smoke.ts` e `mico-classic-ui-smoke.mjs`.
- Capas de biblioteca regeneradas nas vistas frontal e isométrica.

## Verificações e evidências

- `npm run test:industrial`: **178 verificações aprovadas**, incluindo dimensões, doze entradas abertas por raios, pares duplicados, corrente, disparo e comandos.
- Casos MICO em `npm run test:mechanical`: **24 verificações aprovadas** de migração nativa e Admin, idempotência e preservação das alterações de autoria. A suite completa continua a falhar no caso já existente de alimentação do projeto legado CWBC65/GEYA.
- `scripts/mico-classic-ui-smoke.mjs`: **17 verificações aprovadas** no Painel/Admin React e R3F reais, incluindo os oito cliques, transparência, cores dos LED, guardar/reabrir e exportar/reutilizar no catálogo local de teste. IndexedDB isolado e pedidos externos bloqueados.
- `npm run typecheck`, `npm run test:hooks`, `npm run build` e `git diff --check`: aprovados. O build mantém os avisos existentes de divisão de módulos e tamanho de chunks.
- `npm test` na raiz BraiNet: **45 testes aprovados**.
- `npm test` da aplicação: continuam **22 falhas preexistentes**, em PLC, Easy9 e cadeia Hager/DF101V/DF81N.
- `npm run check` na raiz continua a detetar frontmatter ausente em seis README de evidências anteriores, fora desta alteração.
- O gerador de capas produziu as duas capas MICO; o comando global devolve código 1 porque faltam quatro capas antigas de outros tipos (`buttonNO`, `buttonNC`, `selector2`, `selector3`).

Evidências da aplicação: [vista frontal](dc-simu/docs/validation/mico-classic-photo/front.png), [vista isométrica](dc-simu/docs/validation/mico-classic-photo/isometric.png) e [resultados UI](dc-simu/docs/validation/mico-classic-photo/results.json).

## Estado e pendências

Implementado e testado localmente. Sem publicação remota nem deploy. A aceitação visual continua pendente do utilizador. A forma e as impressões foram reconstruídas pela referência; não foi obtido STEP oficial do fabricante e não é apresentada como cópia metrológica ou CAD de fabrico. Não foram inventados números de série nem símbolos de certificação.

## Correção após revisão — GND 0V na carcaça

A marcação `GND 0V` estava num plano frontal afastado cerca de 10 mm da superfície inferior. Foi reduzida para caber na face estreita à direita das lâminas e ligada à própria malha da carcaça. A posição e a inclinação são obtidas por interseção com a superfície real; o afastamento de 0,035 mm serve apenas para evitar cintilação entre superfícies coincidentes.

Atualizados `scripts/lib/mico-classic-model.mjs`, o GLB MICO, a proveniência e as duas capas. Não se alteraram dimensões, bornes nem comportamento elétrico. `npm run test:industrial` voltou a aprovar as 178 verificações. A verificação no Painel React/R3F confirmou o parentesco com a carcaça, nove pontos sobre a superfície (afastamento entre 0,034998 e 0,035004 mm) e ausência de exceções React/WebGL.

Evidências desta correção: [vista inferior frontal](dc-simu/docs/validation/mico-gnd-marking/lower-front.png) e [medições](dc-simu/docs/validation/mico-gnd-marking/results.json). Esta correção está implementada, testada e enviada para o GitHub no commit DC-Simu `58c09a9` (sem deploy). O MICO 2.4 seguiu em `ec023da`.
