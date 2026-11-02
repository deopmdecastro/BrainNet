---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-30
updated: 2026-10-30
tags: [dc-simu, cad, componentes, texturas, animacao, luzes, bornes, 3d]
---
# Componentes CAD importados — textura, funcionamento, animação, luzes e bornes

## Pedido

Inspecionar os novos elementos 3D carregados (commit `ffebb5a`, 14 GLB) e garantir textura real,
funcionalidades de acordo com cada componente, animação ligar/desligar quando faz sentido, luzes
quando necessárias e bornes nos lugares corretos.

## Auditoria (antes)

| Requisito | Encontrado |
| --- | --- |
| Textura | 8 dos 14 STEP sem cores: tudo `#797d81` (DF103NV/DF101V/DF81N, XA2ED33, CWBC65, SPW02/SPW12, torre). |
| Animação | Nenhuma peça mexia; estado só no rótulo («Aberto», «Disparado»). |
| Luzes | Nenhuma (torre sem lâmpadas, LED do 3TK2840 e do XUKT1 apagados). |
| Bornes | 20 encaixes calibrados; 7 tipos com fila genérica (3RU1116 com 95–98 no topo, 3TK2840 com 10 bornes numa aresta, XUKT1 com V+ no corpo); torre e chave EAO sem bornes. |

## Resultado (depois)

- **Textura real** em todos: RAL 7035, poliamida preta, aço zincado, níquel-crómio nas resistências do CWBC65,
  lentes de policarbonato vermelha/âmbar/verde na torre; nomes de material reconhecidos pelo acabamento PBR comum.
- **Animação**: gaveta dos porta-fusíveis DF abre 24°; manípulo do Hager CFC225P (mecanismo de disjuntor existente);
  botões I/O do GV2ME mergulham na manobra; manípulo do XA2ED33 nas três posições; chave EAO roda 60°;
  rearme azul do 3RU1116 salta no disparo.
- **Luzes**: torre com cada cor ligada ao seu fio e ao comum (lente emissiva + luz pontual); LED POWER/CH1/CH2 do
  3TK2840; LED de alimentação e de saída do XUKT1; janela de fusível fundido nos DF; janela de estado dos DPS
  (verde → vermelho em avaria).
- **Bornes**: todos no sítio do CAD. 32 novos encaixes com cavidade verificada por raios e 20 pinos/fios/faces;
  a torre ganha R/Y/G/COM e a chave EAO o comutador 11/12/14 (o elemento de comutação está desenhado no CAD).
  Projetos gravados com a fila genérica migram sozinhos.

## Decisões

- A torre e a chave EAO deixam de estar «sem ligações»: sem fios a torre não pode acender, e o CAD da chave
  mostra as três lâminas do elemento. Hipóteses documentadas no âmbito de cada componente: torre de 4 fios
  (comum + uma cor por fio) e numeração IEC 11/12/14, por confirmar na etiqueta.
- O símbolo 2D mantém as filas legíveis; só a posição 3D usa o ponto medido (no XUKT1 os três fios saem do mesmo sítio).
- As cores dos CAD sem cores seguem as famílias habituais; não são amostras do aparelho.

## Ficheiros (dc-simu)

- `src/three/importedFinish.ts` (novo), `src/three/Panel3D.tsx`.
- `src/electrical/importedComponents.ts`, `src/electrical/factory.ts`, `src/electrical/realInterfaces.ts` (`contact`),
  `src/store/useSimStore.ts`, `src/data/imported-component-terminals.json`.
- `scripts/place-imported-terminals.py`, `scripts/measure-imported-sockets.ts`, `scripts/imported-finish-audit.html`,
  `scripts/imported-terminal-audit.html`, `scripts/imported-grid-audit.html`, `scripts/imported-finish-ui-smoke.mjs`.
- [Documentação técnica](./dc-simu/docs/COMPONENTES-IMPORTADOS-ACABAMENTO.md).

## Verificações e evidências

- `test:terminal-seat`: 194 bornes assentes nas cavidades.
- `test:terminal-geometry`: 34 modelos, 194 encaixes com cavidade (162 + 32 novos) e 20 pinos/fios.
- `test:imported-components`: 137 verificações (chave, torre, bornes medidos, migração de projetos antigos).
- `test:imported-finish-ui`: 15 verificações — página isolada com os 14 GLB e Painel 3D real sem erros JavaScript.
- `npx tsc -b` e `npm run test:ci`: passam (1331 verificações, 0 falhas); `vite build` passa. Commit `dc-simu` `575adaf`.
- Revisão visual das capturas repouso/ativo de cada modelo (`imported-finish-audit.html`).

## Pendências

- Confirmar na etiqueta: ordem física dos rótulos do 3TK2840, ordem +/−/PE do SPW12, numeração da chave EAO,
  cores dos fios e tensão da torre.
- Continua em falta o STEP/GLB do fim de curso 40.108 e dos botões START/STOP 22 mm (formato nativo Inventor/SolidWorks).
- `test:imported-components-ui` usa o canal Chrome instalado; neste ambiente sem Chrome foi substituído por
  `test:imported-finish-ui` (Chromium por software, subconjunto de modelos por limite de memória).

[[README|DC-Simu]] · [[Backlog]] · [[Validation-2026-10-30-Inspecao-Plataforma-Tablet-Barras]]
