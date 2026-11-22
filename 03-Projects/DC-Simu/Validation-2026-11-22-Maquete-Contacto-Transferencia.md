---
type: validation
status: IMPLEMENTED_TESTED_LOCAL
created: 2026-11-22
updated: 2026-11-22
tags: [dc-simu, mecatronica, estampagem, simulacao, validacao]
---
# Maquete: contacto da ventosa e transferência de peças

## Resultado

Implementado e testado localmente, sem publicação. A recolha e a deposição na gaveta
passam a exigir contacto entre o lábio da ventosa e o topo da peça. A descarga segue
a rampa sob a peça, em vez de escolher automaticamente o destino pelo material.

Antes, o braço podia recolher do magazine ou da gaveta sem estar alinhado e enviar
uma peça estampada para a rampa correta a partir de qualquer ângulo. Agora:

- A recolha exige vácuo, braço em baixo e contacto geométrico com a estação.
- O contacto considera posição, altura, ângulo, escala, orientação e espelho da instância,
  segundo a transformação usada no Painel 3D. Sem posição 3D explícita, usa o pivô
  derivado do esquema, como o renderizador.
- A folga radial nominal de vedação é 7,5 mm (peça Ø40 e ventosa Ø25); a tolerância
  vertical do fole é 4 mm, medidas nas coordenadas locais da estação.
- A gaveta ocupada não é substituída. Recolher e repor uma peça preserva a estampagem.
- A descarga projeta a peça verticalmente sobre o plano inclinado da calha real.
  Uma manobra de triagem errada deposita na rampa errada; o material não corrige o programa.
- Soltar sem gaveta em contacto nem rampa por baixo perde a peça, retirando-a da ventosa.
- FC1 reflete a retirada da peça no mesmo passo de simulação.

## Ficheiros da implementação

- `dc-simu/src/electrical/mechatronicsContact.ts`: cálculos geométricos de contacto e queda.
- `dc-simu/src/electrical/mechatronicsSim.ts`: aplicação das condições ao fluxo de peças.
- `dc-simu/scripts/mechatronics-smoke.ts`: ciclo com posições reais e regressões negativas.

As alterações concorrentes em `useSimStore.ts`, `Panel3D.tsx`, ponte PLC e arrasto da nave
não fazem parte desta correção.

## Verificações e evidências

| Verificação | Resultado observado |
| --- | --- |
| Aplicação: `npm run test:mechatronics` | 12 verificações aprovadas; inclui ângulos errados, ausência de vácuo, braço em cima, deslocações X/Y/Z, outra bancada, gaveta ocupada, estampagem preservada, três materiais nas três rampas, ordem invertida dos componentes e conjunto rodado/escalado |
| Aplicação: `npm run test:mechatronics-ui` | 18 verificações aprovadas; modelos 3D, contacto visual nas estações e ausência de exceções React/WebGL |
| Aplicação: `npm test` | Aprovado |
| Aplicação: `npm run typecheck` | Aprovado |
| Aplicação: `npm run test:hooks` | Aprovado |
| Cofre: `npm test` | 45 testes aprovados |
| Cofre: `npm run check` | Reprovado: 48 erros de metadados e ligações em documentos fora desta alteração |
| Diff dos ficheiros alterados nesta tarefa | Sem erros de espaços em branco |

A suite visual mediu folgas de −1,6 mm na recolha e −1,7 mm na gaveta (compressão
do fole), desvio horizontal de 1,5 mm e folga de 4,7 mm entre prato recolhido e braço.
Captura sintética local: `dc-simu/runtime/mechatronics/bench.png`.
O diagnóstico documental completo fica em `runtime/checks/foundation.json`, na raiz do cofre.

## Limites e pendências

- O modelo continua didático: a descarga é resolvida no passo de libertação, sem animação
  de queda, dinâmica de colisões ou simulação de segurança de uma máquina real.
- A montagem automática continua sem criar cablagem nem tubagem; os sensores ótico e
  indutivo continuam sem acompanhamento automático das peças.
- Esta entrega não altera o emparelhamento global dos alimentadores, prensas ou motores
  de várias bancadas; a correção incide no contacto e transferência pelo manipulador.
- Versionado em `dc-simu@0c63f95` e enviado para `origin/main` a pedido do utilizador
  em 2026-11-22. Não foi feita revisão independente de QA, aprovação de publicação ou deploy.
  Os testes e o push são evidência de entrega do código, não aprovação de publicação.
