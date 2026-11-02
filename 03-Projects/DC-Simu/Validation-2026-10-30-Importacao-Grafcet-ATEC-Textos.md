---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-30
updated: 2026-10-30
tags: [dc-simu, grafcet, fluidsim, importacao, textos, validation]
---
# Importação do GRAFCET ATEC e textos livres

## Pedido e resultado

O utilizador pediu trabalhar em maneiras de importar `Grafcet ATEC.ct`, com
`Grafcet ATEC.tif` como referência, convertendo os textos soltos em texto do seu
GRAFCET. Os ficheiros foram lidos como dados; não foram executados nem usados
como instruções. Os originais em Downloads permaneceram intactos.

Foi acrescentado ao importador existente o modo **Desenho editável**. Recuperou
**34 etapas, 40 transições, 30 ações e 16 textos**, mantendo os três gráficos
lado a lado, os números originais e as posições e tamanhos das etapas e ações.
Os 16 textos são elementos nativos do editor (mover, editar por duplo clique,
formatar, desfazer e guardar/reabrir), incluindo títulos e notas afastadas.

O modo **Programa** mantém a validação estrita anterior. O TIFF foi convertido
localmente para PNG apenas para inspeção; não se usou OCR nem se inferiram
ligações a partir da imagem.

## Pontos do original por rever

- Transições 9, 26 e 28 sem origem completa; mantidas editáveis, sem inventar
  etapas de origem.
- Referência `51` sem etapa correspondente; número preservado em `targetInfo`.
- Duas etapas com o número `135`; números e identificadores próprios preservados.
- Condição `G0 <> X5`, referências entre gráficos e qualificadores de ações sem
  equivalência confirmada no motor atual.
- Duas ações sem ligação reconhecida a uma etapa, mantidas como ações soltas.

O resultado fica em revisão persistente (`importReview`). A execução e a forçagem
GRAFCET e a geração de Ladder ficam bloqueadas até concluir a revisão no editor.
A conclusão exige corrigir os erros de validação e os números repetidos, e
confirmar a revisão das condições e dos qualificadores. Os nomes das ações
permanecem como no original no modo desenho, mesmo quando requerem correção.

## Ficheiros

Na aplicação:

- `src/grafcet/fluidSim4.ts`: modo desenho, ligações pendentes, texto integral,
  dimensões e posições, distinção entre texto regular e negrito.
- `src/grafcet/importFile.ts`: escolha do modo e validação/persistência da revisão.
- `src/grafcet/GrafcetImportDialog.tsx` e `GrafcetEditor.tsx`: escolha do modo,
  contagem de textos, revisão e confirmação.
- `src/grafcet/engine.ts`, `toLadder.ts` e `toLadderWord.ts`: bloqueio do rascunho.
- `scripts/fluidsim-import-smoke.ts`, `grafcet-construction-ui-smoke.mjs` e
  `docs/FLUIDSIM-IMPORT.md`: regressão e documentação.

Artefacto entregue: `runtime/grafcet-atec/Grafcet-ATEC.grafcet`, na raiz do cofre,
com os textos originais repostos depois do teste de edição. Destina-se à versão
atualizada que reconhece `importReview`; não foi introduzido na conta/projeto
ativo do utilizador.

## Verificações e evidências

| Verificação | Resultado |
| --- | --- |
| BrainNet: `npm test` | 45 testes passaram |
| BrainNet: `npm run check` | Passou |
| Aplicação: `npm test` | Passou |
| `test:fluidsim` com `FLUIDSIM_ATEC_SAMPLE` | 28 verificações passaram, incluindo a amostra real |
| `test:grafcet-construction-ui` com a amostra real em modo desenho | 26 verificações passaram |
| `test:grafcet-ladder-sync` | Passou |
| `test:grafcet-ladder-word` | Passou, incluindo comparação de evolução GRAFCET/Ladder |
| `test:grafcet-links` | 27 verificações passaram |
| `npm run typecheck` | Passou |
| `npm run build` | Passou; avisos existentes de tamanho/importação de chunks |
| `git diff --check` | Passou |

O teste de interface usou Chromium isolado, serviços externos bloqueados e dados
de teste. Cobriu seleção do modo, confirmação, importação do CT, edição de texto,
desfazer, bloqueio da conclusão com erros e reabertura do `.grafcet` com os 16
textos e a revisão pendente. As contagens do canvas excluem a cópia do minimapa.

Evidências locais em `runtime/grafcet-atec/`: `reference.png`,
`atec-before-text-edit.png`, `fluidsim-import-canvas.png`,
`construction-final-state.png` e o ficheiro convertido. Logs adicionais em
`dc-simu/runtime/atec-ui-test.log`, `atec-app-smoke.log` e `atec-build.log`.

## Estado

Preparado, implementado e testado localmente. A entrega inicial não incluiu
publicação, commit, push ou reinício do contentor ativo.

O pedido seguinte do utilizador autorizou commit e push nos dois repositórios.
A aplicação foi enviada para `origin/main` no commit
`b1b763e014f850be79de290b4374ad2f663dd584`, com carimbo de release #116.
O BrainNet acompanha o relatório e a referência atualizada do submódulo.

Pendente: revisão funcional dos pontos do original e atualização autorizada da
instância em uso. Não foi efetuado reinício Docker nem publicação manual nesta
entrega. A importação do desenho não comprova equivalência de execução com o
FluidSIM.

[[README|DC-Simu]] · [[FluidSIM-Import]]
