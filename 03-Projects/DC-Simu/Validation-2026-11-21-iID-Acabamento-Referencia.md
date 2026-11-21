---
type: validation
status: IMPLEMENTED_PENDING_VISUAL_APPROVAL
created: 2026-11-21
updated: 2026-11-21
tags: [dc-simu, schneider, iid, acabamento, manipulo, validacao]
---
# Schneider iID 4P — acabamento e manípulo da referência

## Resultado

O diferencial `residualBreakerSchneiderIid4p` passa a ter carcaça branca acetinada, alavanca branca, pega cinzenta e berço fixo cinzento-claro, segundo a fotografia fornecida. Esta decisão substitui o acabamento antracite descrito na validação de 20 de novembro. Mantém-se o tambor fechado e concêntrico que impede ver o interior do STEP simplificado durante a manobra.

Foram acrescentadas cabeças metálicas com cruz rebaixada aos oito poços frontais e completada a face do botão T. Estes pormenores são reconstruções visuais a partir da referência; não representam CAD interno certificado do fabricante.

Conservaram-se o logótipo, a faixa verde, a referência A9R11440, os valores nominais, o esquema, a numeração e as inscrições laterais. Acrescentou-se o T à face reconstruída do botão. A faixa VisiSafe mantém O.OFF verde e I.ON vermelho; a faixa ON ocupa a zona inferior exposta do tambor para a pega levantada não ocultar o texto.

Não se alteraram as oito interfaces dos condutores, a escala física ou a lógica elétrica. O iDPN Vigi conserva o seu acabamento. As capas frontal e da biblioteca foram regeneradas.

## Ficheiros

- `dc-simu/src/three/schneiderRcdModel.ts`: materiais separados, fecho do manípulo e pormenores visíveis.
- `dc-simu/src/three/protectionMarkings.ts`: T no botão iID, reutilizando a serigrafia existente.
- `dc-simu/scripts/build-schneider-rcd-glb.mjs`: atualização local repetível, com conversão única de geometrias partilhadas.
- `dc-simu/public/models/protecao/schneider-acti9-iid-4p.glb` e `schneider-acti9-rcd-sources.json`: modelo e proveniência atualizados.
- `dc-simu/public/component-covers/`: duas capas do iID e índice.
- `dc-simu/scripts/meters-schneider-smoke.ts` e `scripts/iid-handle-closure-ui-smoke.mjs`: verificações de materiais, geometria, inscrições de estado e integração.

## Verificações e evidências

- **58 verificações** de geometria, bornes, materiais, proveniência e propriedade dos recursos aprovadas.
- **24 verificações** de interface aprovadas: OFF/ON/disparado, centro fixo, nove raios sem passagem para o interior em cada posição, faixa VisiSafe desimpedida em toda a altura, clique, editor, gravação/reabertura e exportação para catálogo local de teste. Zero exceções React/WebGL.
- `npm test` da aplicação: **894 verificações aprovadas**.
- `npm test` do cofre: **45/45 aprovados**.
- TypeScript, `npm run build` e `npm run test:hooks`: aprovados. O build conserva o aviso de tamanho dos bundles da aplicação.
- Capas do iID regeneradas com sucesso. O comando global de capas devolve código 1 por quatro tipos alheios a esta alteração sem capas: `buttonNO`, `buttonNC`, `selector2` e `selector3`.
- `npm run check` do cofre mantém falhas anteriores: metadados ausentes em seis README de evidências de 20 de novembro e dois links inválidos em `.claude/skills/gsap-scrolltrigger/assets/examples/README.md`.

Capturas na aplicação real: [OFF em perspetiva](dc-simu/docs/validation/iid-photo-finish/off.png), [ON](dc-simu/docs/validation/iid-photo-finish/on.png), [disparado](dc-simu/docs/validation/iid-photo-finish/trip.png), [frente em posição intermédia](dc-simu/docs/validation/iid-photo-finish/front.png) e [resultados medidos](dc-simu/docs/validation/iid-photo-finish/results.json).

Os testes de integração concluídos usaram Vite em modo `uitest`, IndexedDB isolado e pedidos externos bloqueados. Uma primeira execução em modo normal foi interrompida ao tentar usar o backend remoto, cujo pedido foi bloqueado pela fixture; foi repetida corretamente no modo local. Uma execução inicial com cache de dependências frio também excedeu o tempo de carregamento. Não houve gravações remotas.

## Estado e pendências

**Preparado:** gerador e verificações. **Implementado:** modelo, materiais, botão e capas. **Testado:** verificações acima e inspeção das capturas OFF/ON. **Aprovado:** aceitação visual pelo utilizador pendente. Alterações locais, sem publicação externa. As falhas documentais e capas genéricas referidas acima permanecem fora do âmbito.
