---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-05
updated: 2026-11-05
tags: [dc-simu, calha-tecnica, esquema, 3d, inspetor, juncoes]
---
# Calha: barras de tamanho esquerda/direita e passagem de cabos nas junções

## Pedido
Adicionar uma barra que aumenta/reduz do lado direito e outra do lado esquerdo da calha (resolve o crescimento ao centro que batia em aparelhos e na parede do quadro) e, onde as calhas se juntam, partir os pinos (dedos) da calha para deixar passagem aos cabos. Reaproveita [[Task-2026-11-05-Calha-Comprimento-Nao-Muda]] (`fitDuctResize`), o inspetor de [[Task-2026-11-05-Inspetor-Calha-Tablet-Estreito]] e as pegas de arrasto da calha DIN (`setRailResize`).

## Resultado (dc-simu `9d3274d`)
- `fitDuctSideResize` (`src/schematic/ductResize.ts`, função pura): muda uma ponta e a oposta fica exatamente onde está, em qualquer rotação (0/90/180/270°). Ao crescer, para no maior comprimento que cabe (passos de 5 mm).
- **Esquema:** com a calha selecionada aparecem duas pegas azuis, uma em cada ponta, iguais às da calha DIN (arrasto em passos de 5 mm, Alt = livre).
- **Inspetor:** duas barras, «Lado esquerdo» e «Lado direito», cada uma com slider e atalhos ±10/±50 mm; o aviso «limitada» reutiliza o do inspetor existente.
- **Junções (`src/schematic/ductJunctions.ts`):** onde uma calha perpendicular desemboca ou atravessa a parede de outra (T, L, cruz), a parede abre-se: a fita lateral parte-se em troços, os dedos/patilhas desse vão são retirados e a aba da tampa também. Vale para o 3D (`buildCableDuct`) e para o Esquema (`CableDuct2D`). Calhas paralelas lado a lado não abrem.
- Teste `test:duct-resize` passou de 4 para 19 verificações (âncora fixa nas 4 rotações, arrasto, bloqueio por aparelho, T, calha longe, paralelas).

## Criação e edição encaixadas (dc-simu `%s`)
- **Largar perto de outra calha** (alcance 80 mm) encaixa-a: além de uma ponta prolonga, ao lado da parede faz ramal em T, com a mesma largura, altura, tampa e cor. Se o encosto não cabe (aparelho/quadro), cai no comportamento anterior.
- **Inspetor, «Juntar outra calha»:** ◀ ▶ prolongar e ▲ ▼ ramal, com a calha herdada e já selecionada (`addDuctAdjacent`; funciona em qualquer rotação).
- Lógica pura em `src/schematic/ductPlacement.ts`; `test:duct-resize` passa a 29 verificações.

## Verificação
- `tsc -b`: limpo. `test:duct-resize`: 19 verificações OK.
- Resto do `test:ci`: sem regressões novas. Duas falhas **anteriores a esta tarefa**, confirmadas na base sem as alterações: `test:panel-accessories` («perfil guardado no estado») e `native-sim-smoke` («STOP: motor pára»).
- Build de produção (`vite build`) e teste visual no browser **não** foram executados neste ambiente.

## Pendências
- Validar no tablet/browser: arrasto das pegas (rato e toque; usa `onMouseDown`, como a calha DIN) e o aspeto da passagem no 3D, com e sem tampa.
- Os cabos no 3D continuam a tratar a calha como obstáculo sólido (`wireGeometry3D`): a passagem está desenhada, mas o encaminhamento automático ainda não a atravessa.
- A abertura só considera calhas perpendiculares; ângulos que não sejam múltiplos de 90° não são tratados.
- O estado da calha não guarda as aberturas: derivam sempre das posições, por isso mover uma calha atualiza-as sozinho.
