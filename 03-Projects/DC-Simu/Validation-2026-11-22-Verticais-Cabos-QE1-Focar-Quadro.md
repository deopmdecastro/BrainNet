---
type: validation
status: IMPLEMENTED
created: 2026-11-22
updated: 2026-11-22
tags: [dc-simu, maquete, estampagem, esteiras, tomadas, cabos, quadro, camara]
---
# Verticais apoiadas na parede, cabos no QE1 e «Focar quadro»

## Pedido

1. Orientar as esteiras verticais e afinar as junções; esteiras do compressor e do quadro apoiadas na parede.
2. Tomadas no limite da calha, com uma folga pequena.
3. Ao arrastar o quadro, os fios ficavam de fora; os cabos devem correr dentro das calhas.
4. Opção «Focar quadro»: aproxima a câmara do quadro e dos seus componentes.

## Solução (dc-simu `366b65b`)

### Esteiras e tomadas — `src/electrical/stampingBench.ts`
- Verticais (subida QGD, descida compressor, descida bancada) com orientação `{0, 90, 90}`: fundo apoiado na parede/pilar (espaçadores de 10 mm), abertura virada para a nave.
- Esteira aérea mantém o afastamento de 300 mm; **pescoços** horizontais ligam cada vertical à aérea, em T. A aérea passa 60 mm além de cada pescoço.
- Tomadas RoadEu 70929 a **20 mm** da ponta de cada descida, no mesmo plano do fundo da esteira.
- Maquete: 96 peças, 147 componentes, 54 tipos.

### Junções — `src/schematic/ductJunctions.ts`
- Deteção 3D com caixas reais nos três eixos (esteiras a cotas diferentes já não cortam).
- Novo corte `floor`: a subida entra pelo fundo do pescoço; o topo da subida é aparado (`endTrim`).
- Eixo de largura corrigido para a matriz Euler XYZ do Three.js.

### Cabos e arrasto
- `src/three/wireGeometry3D.ts`: o quadro de cada borne é identificado também pela profundidade Z (o QE1 sob a mesa sobrepunha-se ao QGD em X/Y); calhas e pistas por quadro; profundidade das pistas relativa à chapa do próprio quadro.
- `src/three/panelGroupMove.ts` + `Panel3D.tsx`: arrastar um quadro livre (QE1) leva os aparelhos, calhas e bornes do seu volume e os troços de cabo que lá passam.

### Focar quadro
- Botão «Focar quadro» na barra do 3D (quadro da seleção; sem seleção, alterna entre quadros) e no Inspetor do quadro.

## Verificação

- `npm run test:maquetes`: 9 verificações OK (novas: verticais, junções, folga das tomadas, arrasto do QE1).
- `npm test`: todos os testes passaram.
- `npm run build` (tsc + bundle das maquetes + vite): OK.
- Também OK: `panel-accessories`, `enclosure-move`, `enclosure-inspector`, `duct-resize`, `panel-groups`, `wire-isolation`, `solid-cables-meter`, `wire-curves-refresh`, `wire-lacing`, `native-wires-3d` (parte 3D).
- `test:wire-locks` falha também sem estas alterações (STEP/PAUSA da simulação): pendência anterior, sem relação.
- Capturas locais (Playwright, ambiente fabril): verticais encostadas à parede, pescoços em T, tomadas por baixo das descidas, QE1 enquadrado por «Focar quadro».

## Pendências

- Revisão visual do utilizador após o deploy.
- Cabos desenhados à mão com pontos 3D no quadro principal (QGD) não são deslocados ao arrastá-lo; a correção cobre quadros livres na nave.

Estado: **implementado, testado e publicado em `origin/main`**; aprovação visual pendente.
