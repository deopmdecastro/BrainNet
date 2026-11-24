---
type: validation
status: IMPLEMENTED
created: 2026-11-24
updated: 2026-11-24
tags: [dc-simu, QE1, calhas, ranhuras, S7-300, esteiras, tubo-de-ar, fichas-CEE, tomadas, inspetor]
---

# Fios pelas ranhuras das calhas, tubo pela face aberta das descidas e encaixar/desencaixar fichas CEE

## Pedido (2026-11-24e)
- «Cada fio que liga um dispositivo na calha sai de uma ranhura no quadro.» (`FullSizeRender.jpeg`: fios do S7-300 a passar por cima dos dentes da calha.)
- «Melhorar também esses detalhes da fotografia» — `IMG_6025/6026/6027`, ampliações das capturas de [[Validation-2026-11-24d-Cabo-3G-Terra-Bucins]]: tubo de ar a sair da descida pela aba, peça a atravessar a esteira junto ao pescoço do QGD, cabo a passar por baixo dela.
- «Adicionar uma ação de plugar e desplugar as fichas das tomadas.»

## Diagnóstico
1. **Fios por cima dos dentes.** O encaminhador do QE1 (`into()`) descia na vertical do borne até à calha, a qualquer abcissa; os dentes estão a 12,5 mm (vão de 4,5 mm), por isso o fio caía quase sempre sobre um dente. No front connector do S7-300 os 16 fios de um módulo desciam todos na mesma coluna e o 3D afastava-os em caracóis.
2. **Pescoço do QGD a invadir a esteira de parede.** `cableTrayDimsOf` impunha comprimento mínimo de **300 mm**; as junções (`trayDimsMm`) usam o real (210 mm). O pescoço era desenhado 45 mm mais comprido para cada lado: entrava na esteira de parede (a aba e o rebordo enrolado eram a «peça» com ponta e o 3G2,5 do compressor passava-lhe por baixo) e as aparas `endTrim` ficavam no sítio errado.
3. **Tubo de ar pela aba.** Mudava de pista no vão de 20 mm entre a caixa da tomada e o fundo da descida; o arco de raio fixo subia para dentro da descida e atravessava a aba lateral.

## Solução
### QE1 (`stampingBenchWiring.ts`)
- `slotX()`: centro do vão entre dentes mais próximo, com o passo e o vão de `CABLE_DUCT` (a mesma fonte de `buildCableDuct`). O fio desce na vertical do borne e **só a 8 mm do bordo da calha** desvia (≤ 6 mm) para a ranhura, entra pelo vão e assenta na pista.
- Bornes de face (front connector): os fios de um módulo **escalonam-se em profundidade** pela distância à calha (0,45 mm/mm) — pente plano à frente do módulo, cada fio larga o feixe à altura do seu borne, sem cruzar os outros.

### Esteiras (`structuresModel.ts`, `stampingBenchWiring.ts`)
- `cableTrayDimsOf`: mínimo **50 mm**, igual às junções. O pescoço fica encostado à esteira de parede e a aba deixa de atravessar a pista dos cabos.
- `besideSocket()`: o tubo sai/entra da descida **pela face aberta**, 90 mm acima do fundo (fora das abas: +14 mm além da aba de 60 mm), e desce ao lado da caixa da tomada (30 mm de folga, lado −X, longe da ficha). Nas duas descidas (compressor e bancada).

### Fichas CEE (`useSimStore.ts`, `socketDevices.ts`, `engine.ts`, `phases.ts`, `Panel3D.tsx`, `DeviceControls.tsx`, `SocketDevices3D.tsx`)
- Ação **`togglePlug(plugId)`**: desencaixa/encaixa a ficha. A ficha recua **90 mm** ao longo do seu eixo (−Z local rodado pela orientação), os pontos do cabo a ≤ 16 cm acompanham-na (reversível ao milímetro), a tampa da tomada **fecha** ao tirar e **abre** ao encaixar; evento no registo e som de manobra.
- `openPlugContacts()`: com `plugged: false`, os condutores ficha ↔ tomada **não conduzem** (motor elétrico e fases) e não se desenham no 3D (os pinos ficam à vista fora da tomada).
- Inspetor: botão **«Desligar ficha F-… (tirar da tomada)» / «Ligar ficha F-… (encaixar na tomada)»** na ficha e na tomada onde está ligada (azul de ação, nome e explicação na dica). No 3D, **duplo clique** na ficha faz o mesmo; clique simples continua a selecionar.
- Gesto físico: funciona com ou sem simulação e com a peça bloqueada (bloqueio = não arrastar). Projetos antigos: ficha encaixada por omissão.

## Verificação
- `npm run test:bench-routing` — **50/50** (novas: todas as entradas do QE1 pelo vão entre dentes, pior desvio 0,05 mm; tubo sem atravessar as abas das duas descidas). O código anterior falha na verificação das ranhuras (desvio 6,15 mm).
- `npm run test:sockets` — **17/17** (nova: desencaixar abre L/N/PE e tira a tensão ao borne da ficha, recua 90 mm no eixo, fecha a tampa, o cabo junto à ficha acompanha e o resto não; encaixar repõe posição, cabo, tensão e tampa).
- Fixture 3D com a maquete: após `togglePlug` nas duas fichas, nenhum contacto desenhado e `plugged: false` (capturas 08/09).
- `npm test` OK · `test:maquetes` 10/10 · guião 76/76 · `test:panel-accessories` 40/40 · `tsc` 0 erros.
- `test:style` acusa `.dc-objects-children` em `src/index.css` — **pré-existente** (igual sem estas alterações).

## Evidências
`Evidence-2026-11-24e-Ranhuras-Tubo-Fichas/`
- `00-pedido-fios-calha.jpg` (pedido) · `01-depois-fios-pelas-ranhuras.png` · `02-depois-pente-S7-300.png`
- `03-antes-pescoco-invade-esteira.png` / `04-depois-pescoco-encostado.png`
- `05-antes-tubo-pela-aba.png` / `06-depois-tubo-face-aberta.png`
- `07-ficha-encaixada.png` / `08-ficha-desencaixada.png` · `09-ficha-maquete-desencaixada.png`

## Commits
- dc-simu `71859d82` — feat(maquete): fios pelas ranhuras das calhas, tubo pela face aberta das descidas, pescoço sem invadir a esteira e encaixar/desencaixar fichas CEE.

## Pendências
- Projetos já guardados: a ação de ficha e o comprimento correto do pescoço aplicam-se ao abrir; as ranhuras do QE1 e o novo traçado do tubo só numa maquete montada de novo.
- Com a ficha fora, o cabo acompanha só junto à ficha (≤ 16 cm); não há simulação de cabo solto a cair.
