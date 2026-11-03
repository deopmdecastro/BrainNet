---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED_PARTIAL
created: 2026-11-03
updated: 2026-11-03
repo: https://github.com/deopmdecastro/dc-simu
commits:
  - 0718047
tags: [dc-simu, grafcet, manuais, selecao-ou, telemovel, texto-livre, guard]
---
# Manuais GRAFCET — T3/T2 em paralelo, condições Gk <> X e texto livre no telemóvel

## Pedido
No manual do Cilindro A (G3) T3 (`G0<>X4`) e T2 (`fc_a1 * bp_Avanca_A+`) pareciam em série; devem estar em paralelo (referência: figura do G3 com ponto e linha horizontal). Fazer o mesmo nos outros manuais, concluir as condições de comparação (`Gk <> X…`) e permitir editar os textos livres do GRAFCET no telemóvel.

Contexto relido: [[Design-Principles]], [[Validation-2026-11-03-ATEC-Textos-Comparacao-Condicoes]], [[Validation-2026-11-03-Grafcet-Toque-Duplo-Arrastar]], [[Validation-2026-11-01-Texto-IEC-Igual-GRAFCET]].

## Diagnóstico
- **Série vs paralelo**: os dados estavam certos (T2 e T3 saem ambas da etapa 143, ou seja, seleção OU). O defeito era o desenho: a transição «por referência» (`wireless`) era sempre desenhada na vertical por baixo da etapa de origem, por cima da irmã T2. O mesmo acontecia em G4–G7 (T3 de cada manual).
- **Condições**: no projeto ATEC guardado só G4 tinha o `guard` (`G4 <> X159`); faltavam G0, G1, G2, G3, G5, G6 e G7.
- **Texto no telemóvel**: o toque abria a caixa de edição dentro do SVG, que não abre o teclado de forma fiável (foco fora do gesto, em iOS).

## Implementado (`dc-simu` 0718047)
- `GrafcetEditor.tsx`: transição por referência cuja origem tem outra saída ramifica (ponto preto, linha horizontal, barra e referência ao lado). Usa `transition.x` se afastado ≥ 80 u da origem; senão 260 u + 220 u por irmã. Sem irmãs, o desenho é o de antes. Reaproveitado o padrão de seleção OU já usado nas ligações normais.
- `FreeTextDialog.tsx` (novo, sobre `PropertyDialog`): no telemóvel, 1.º toque seleciona; toque no texto já selecionado (ou duplo toque) abre o diálogo com campo de 16 px, Guardar/Apagar/Eliminar. PC e tablet mantêm a escrita no sítio.
- Condições: reaproveitado `scanTextGuards`/`applyTextGuards` (sem lógica nova). Aplicado ao ficheiro do utilizador: 8/8 textos ligados (G0–G7), nenhum sem correspondência. Os textos ficam no desenho para conferência; remover pelo menu «Textos → condições».

## Verificações
- `tsc -b` limpo; `npm test`, `test:grafcet-dialogs` (31), `test:grafcet-examples` (52), `test:style`, `text-guards-smoke` (17), `double-tap-smoke` (13) ✅.
- `scripts/free-text-touch-smoke.tsx` (novo, 3 verificações, em `test:pinch`): 1.º toque seleciona, 2.º abre a edição, PC mantém o comportamento.

## Não verificado
- **Sem navegador nem telemóvel**: o novo desenho do ramo OU (posição do ponto, da barra e dos rótulos) e o diálogo de texto não foram vistos no ecrã. Confirmar G3–G7 e o teclado em iOS/Android.
- `examples/gb…ge-manual-*.json` são exemplos simples de 3 etapas, sem T3; o conjunto completo é `grafcet-atec-com-manuais.json`, que já tem os cinco manuais e os `guard`.
- O ficheiro do projeto tem uma transição solta sem origem nem destino (`5c4f047e…`, condição `1`, y 5980): não tocada.
- O projeto na conta do utilizador só muda ao importar o JSON corrigido (entregue na conversa).

## Correção — importação «Ficheiro inválido: faltam as etapas GRAFCET» (`dc-simu` 1404283)
- Causa: entreguei o **projeto completo** (`dc-simu-atec-corrigido.json`, com o GRAFCET em `grafcet`), mas o botão «Importar GRAFCET» do editor espera **só o programa** (`steps` na raiz). Erro de entrega, não do importador.
- Entregue `dc-simu-atec-grafcet.json` (só o GRAFCET: 54 etapas, 8 condições). O importador passa também a aceitar um projeto completo e usa o `grafcet` que traz dentro.
- Teste novo `scripts/grafcet-import-project-smoke.ts` (5 verificações, em `test:fluidsim`): programa direto, projeto completo, ficheiro sem GRAFCET recusado, ATEC original e corrigido.
- Não verificado: importação no editor real; importar substitui o GRAFCET atual do projeto aberto.

## Verificação do desenho T3/T2 (captura das 08:01 ainda em série)
- Vercel: o commit `0718047` (ramo OU) ficou publicado às 07:54 UTC; o `vite build` local conclui (30 s) e o bundle contém o ramo (`data-or-branch`).
- O `GrafcetEditor` real, montado em jsdom com o GRAFCET ATEC do utilizador, desenha G3·T3 como `M 200 2164 V 2192 H 500 V 2242` (ponto em 200, linha horizontal, barra em x=500) e T2 em `M 200 2164 V 2330`: **paralelo**. 10 marcadores (editor + minimapa) para G3–G7.
- Conclusão: a captura mostra a versão antiga em cache. A PWA só se atualiza quando é seguro (`beforeUpdate`): com o projeto acabado de importar e **por guardar**, a atualização fica adiada (`snoozeUntil`). Guardar e recarregar.
- CI do GitHub (`Tipos, testes e build`, `Playwright`) já falhava em `63e88bd`, antes destas alterações; causa não investigada.
