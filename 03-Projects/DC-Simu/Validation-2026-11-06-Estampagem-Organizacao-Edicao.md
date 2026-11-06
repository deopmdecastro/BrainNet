---
type: validation
status: IMPLEMENTED_LOCAL
created: 2026-11-06
updated: 2026-11-06
tags: [dc-simu, estampagem, grafcet, organizacao, edicao, validacao]
---
# Estampagem — organização e edição dos GRAFCETs

Implementado e testado localmente. Commit `425fb0c` enviado para `dc-simu/main` em 6 de novembro de 2026, após o pedido explícito do utilizador «commit e push». O push não constitui validação de um lançamento em produção.

## Resultado no projeto nativo

O exemplo passa de `grafcet-estampagem-industrial-v18` para `v19`: **17 páginas, 53 etapas e 85 transições**. O código do exemplo e `examples/grafcet-estampagem-industrial.json` contêm o mesmo programa, verificado por teste. O JSON conserva os restantes campos do projeto.

- Todas as páginas usam o mesmo organizador do editor: ramos centrados, margem comum e espaçamento a partir das medidas reais das ações, incluindo disposição em linha/coluna e afastamentos. As legendas ficam abaixo da sequência e as notas de ajuda ficam afastadas dos elementos.
- O G16 passa a esperar um impulso de reset, entrar na etapa de reposição e voltar a esperar. Antes, os R condicionais ficavam numa etapa inicial permanentemente ativa e não respondiam a novos pedidos após o arranque.
- O reset da máquina, G3, regressa ao repouso ao sair do modo de reset. Antes, uma emergência em X43 podia deixar o retorno comandado.
- Os atuadores Q0.0–Q0.6 exigem emergência libertada e G1 em segurança; o corte acontece no próprio scan, sem esperar pela propagação entre GRAFCETs.
- STOP impede o arranque mesmo com START mantido. O arranque automático também exige ausência de pausa e de seleção manual.
- Mantidos os ciclos Preta/Branca/Metálica de 5/6/8 segundos, a contagem por entrada na etapa de depósito e o bloqueio na segunda peça de cada rampa.

## Melhorias gerais do editor

- Seletor direto das páginas, com nome e número de etapas; em projetos com muitas páginas, a faixa deixa de enumerar todos os separadores. Renomear, criar, eliminar e abrir variáveis continuam acessíveis no telemóvel, com alvos de 40 × 40 px.
- Trocar de página limpa a seleção anterior e reenquadra o diagrama.
- «Organizar página» considera ações e referências, centra divergências/convergências, recalcula posições de transições e elimina rotas antigas apenas dessa página. Preserva condições, ações, anotações e outras páginas, numa operação de histórico.
- As referências alternativas ficam empilhadas fora das ações, contam para o enquadramento e as referências de entrada de um destino são reunidas num único rótulo. Diagramas inteiramente por referência mantêm a ordem vertical.
- Quebras de ligações de outras páginas deixam de aumentar a área e reduzir o zoom da página atual.
- «Organizar» fica bloqueado em RUN/PAUSA, incluindo chamadas pelo barramento do editor.

## Ficheiros

Na aplicação `dc-simu/`: `src/project/grafcetExamples.ts`, `examples/grafcet-estampagem-industrial.json`, `src/grafcet/layout.ts`, `src/grafcet/organize.ts`, `src/grafcet/referenceLayout.ts`, `src/grafcet/GrafcetEditor.tsx`, `src/components/Toolbar.tsx`, `src/styles/grafcet-editor.css`, `scripts/grafcet-examples-smoke.ts`, `scripts/grafcet-organization-smoke.ts`, `scripts/smoke.ts` e `package.json`.

## Verificações

- `test:grafcet-examples`: **128 verificações existentes atualizadas + 104 novas**. Inclui os três ciclos completos, duas peças por rampa, permanência no depósito sem contagem adicional, reset individual depois de muitos scans, emergência durante reset, prioridade de STOP, geometria das 17 páginas, ações redimensionadas/afastadas, diagramas inteiramente por referência e lineares antigos, preservação de outras páginas, Desfazer/Refazer, guardar, importar e igualdade entre JSON e exemplo nativo.
- `npm test` da aplicação: passou. As verificações do organizador continuam a exigir o eixo e o espaçamento originais de uma sequência simples; o teste de ações distingue agora linha de coluna pela ocupação real.
- `test:grafcet-links` (27 + 10), `test:grafcet-dialogs` (31), `test:grafcet-signals`, `test:grafcet-signal-names` (50) e `test:grafcet-ladder-sync`: passaram.
- `npm run typecheck` e `git diff --check`: passaram.
- `npm run build`: passou no estado final, com 126 entradas no precache. Mantém os avisos de tamanho de bundles/imports. As duas montagens temporárias foram removidas antes deste build e estão ausentes de `public/` e `dist/`.
- `npm test` na raiz: **45 testes passaram**.
- Browser isolado, com o editor, a barra e as folhas de estilo reais: troca G0/G2/G16, Organizar, Ctrl+Z/Ctrl+Shift+Z, renomear e desfazer o nome, duplo clique na etapa 24 abre a configuração, Organizar desativado em pausa e rotas de outra página sem alteração do enquadramento. Sessão final sem erros JavaScript.
- PC 1440 × 1000, tablet 1024 × 900 e telemóvel 390 × 844. Faixa de páginas sem excesso de largura: no telemóvel 354/354 px de área/scroll, com 17 opções acessíveis; botões de edição com 40 × 40 px.

Capturas sintéticas locais: [controlo](../../runtime/estampagem-controlo-desktop.png), [automático](../../runtime/estampagem-automatico-desktop.png), [tablet](../../runtime/estampagem-tablet-paginas.png) e [telemóvel](../../runtime/estampagem-mobile-paginas.png). `runtime/` é ignorado pelo Git. A montagem de teste não usa contas, credenciais ou projetos guardados do utilizador.

## Limites e pendências

- O diagnóstico mantém **26 avisos conhecidos** de endereços/saídas partilhados e dois avanços incondicionais no reset; não há erros. Os avisos não foram suprimidos. Partilhar comandos entre automático, reset e manuais exige a coordenação pelo G0.
- A pausa HMI mantém a etapa e os comandos; os temporizadores continuam a contar. A ajuda do exemplo passa a dizer isto explicitamente. Ao retomar, uma temporização já cumprida pode permitir avançar.
- As lâmpadas verde e azul já podem estar acesas por outras etapas em manual; os respetivos GRAFCETs de teste não têm comando exclusivo da saída. Mantida a regra anterior, documentada em [[Task-2026-11-06-Estampagem-Manual-Por-Atuador]].
- O modelo continua pedagógico, com três gavetas/rampas lógicas. Esta revisão valida o simulador; não redefine o mapeamento físico da máquina descrito em [[Task-2026-11-06-Projeto-Nativo-Estampagem]].
- `npm run check` na raiz mantém nove problemas documentais anteriores: duas propriedades em falta em `Task-2026-11-03-Grafcet-Sem-Painel-Baixo.md` e sete ligações para imagens em duas notas de 2 de novembro.

[[Design-Principles]] · [[Project-Brief]]
