---
type: validation
status: IMPLEMENTED_PENDING_VISUAL_APPROVAL
created: 2026-11-20
updated: 2026-11-20
tags: [dc-simu, schneider, iid, manipulo, 3d, validacao]
---
# Schneider iID 4P — peça preta atrás do manípulo

## Resultado implementado

Adicionado o corpo preto fechado atrás da pega do diferencial `residualBreakerSchneiderIid4p`. A separação das faces do STEP simplificado deixava uma abertura entre as peças móveis; através dela via-se o interior e a patilha amarela traseira.

O obturador é uma malha opaca, com tampas laterais, concêntrica com o eixo existente do manípulo. Acompanha o curso de 45° sem deslocar o centro ou voltar a abrir a passagem nas posições OFF, ON e disparado. As laterais brancas e a pega original foram conservadas. A faixa VisiSafe foi colocada à frente da nova superfície para continuar visível.

A peça está integrada no GLB e no gerador. A preparação partilhada também completa modelos antigos sem a peça, de forma idempotente. O iDPN Vigi não recebe esta alteração. Os oito bornes, as suas identidades e a lógica elétrica mantêm-se.

É uma reconstrução geométrica para fechar a omissão do CAD simplificado, não uma peça extraída de um STEP completo do mecanismo interno.

## Ficheiros

- `dc-simu/src/three/schneiderRcdModel.ts`: corpo preto e compatibilidade com o modelo anterior.
- `dc-simu/scripts/build-schneider-rcd-glb.mjs`: incorpora a peça em reconstruções a partir do STEP; opção `--refresh-iid-barrel` para atualizar o GLB local existente, mantendo a proveniência.
- `dc-simu/public/models/protecao/schneider-acti9-iid-4p.glb` e `schneider-acti9-rcd-sources.json`: geometria e hash atualizados.
- Capas frontal e de biblioteca em `dc-simu/public/component-covers/`.
- `dc-simu/scripts/meters-schneider-smoke.ts` e `scripts/iid-handle-closure-ui-smoke.mjs`: regressão geométrica e aceitação na aplicação real.

## Evidências

- [Desligado](dc-simu/docs/validation/iid-handle-closure/off.png).
- [Ligado — posição da imagem do pedido](dc-simu/docs/validation/iid-handle-closure/on.png).
- [Disparado](dc-simu/docs/validation/iid-handle-closure/trip.png).
- [Resultados do Painel e editor](dc-simu/docs/validation/iid-handle-closure/results.json).

## Verificação

- `npm run test:meters-schneider`: **56 verificações aprovadas**, incluindo recuperação de um modelo antigo, ausência de duplicação da peça, eixo fixo durante o movimento, bornes livres e identidades elétricas.
- Painel React/R3F: peça opaca, nove raios na abertura em cada uma das três posições sem atingir o interior, clique funcional e centro invariável.
- **18 verificações de interface aprovadas**, incluindo o editor, guardar/reabrir e exportar para um catálogo de teste local; zero exceções React/WebGL.
- `npm run typecheck`, `npm run build` e `npm run test:hooks`: aprovados.
- `npm test` do cofre: **45/45 aprovados**.
- `npm test` da aplicação: 22 falhas nos grupos PLC, Easy9 e Hager/porta-fusíveis, já discriminados nas validações anteriores.
- `npm run check` do cofre: falha por frontmatter ausente nos README de evidências anteriores.
- Capas do iID regeneradas. O inventário global continua a indicar quatro capas genéricas ausentes: `buttonNO`, `buttonNC`, `selector2` e `selector3`.

Os testes de editor usam o modo `uitest`, conta local sintética e IndexedDB isolado; os pedidos externos são bloqueados. Não foram alteradas contas ou componentes remotos.

## Estado

**Preparado:** gerador e testes. **Implementado:** peça preta no modelo e capas. **Testado:** verificações acima. **Aprovado:** aceitação visual pelo utilizador pendente; sem publicação externa. Logs extensos em `dc-simu/runtime/iid-barrel-*.log` e `runtime/iid-barrel-root-*.log`, locais e ignorados por Git.
