---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED
created: 2026-11-02
updated: 2026-11-02
repo: https://github.com/deopmdecastro/dc-simu
commit: d8c548b
tags: [dc-simu, plc, siemens, s7-1500, s7-300, bornes, leds, 3d, painel, vistas]
---

# Validação 2026-11-02 — PLC Siemens S7: pose, bornes, lâmpadas e esquema IEC

## Pedido

Verificar as posições e as vistas dos PLC, se os bornes estão nos sítios certos, se o
esquema IEC está correto e como estão as lâmpadas desses componentes.

## O que estava mal

1. **Pose.** Os três CAD Siemens S7 vinham em referenciais diferentes dos restantes
   modelos e apareciam **de perfil** no Painel 3D (ver `uploads/IMG_5490.png`): a frente
   virada para o lado, os bornes escondidos e o comprimento na vertical.
2. **Medidas.** A altura e a profundidade estavam trocadas nos S7-1500, por causa da
   rotação errada (147 mm é o comprimento do perfil na calha, não a profundidade).
3. **Bornes.** A projeção genérica do catálogo punha-os nas faces superior/inferior,
   onde o módulo não tem bornes, e o DI 32/CPU 1511C ficavam sem L+/M.
4. **Lâmpadas.** Eram três círculos genéricos a 24 % da largura e 64 % da altura, à
   frente da caixa: nos S7-1500 caíam **fora** do painel frontal e na CPU 315 tapavam
   a tampa em vez das lâmpadas. Além disso o módulo nunca ficava alimentado, por isso
   nenhuma lâmpada podia acender.

## Referencial medido em cada CAD

| Modelo | Topo | Frente | Bornes/lâmpadas | Perfil de calha | Rotação base |
|---|---|---|---|---|---|
| S7-1500 DI 32 (6ES7521-1BL00-0AB0) | +Z | −Y | −X | +X | **Rx(−90)** |
| S7-1500 CPU 1511C-1 PN (6ES7511-1CK00-0AB0) | +Z | −Y | −X | +X | **Rx(−90)** |
| S7-300 CPU 315-2 DP | +Y | +Z | −X | −Z | **nenhuma** |

Depois da rotação: topo em +Y, frente em +Z, bornes/lâmpadas em −X e perfil de calha
encostado à chapa (−Z), como em qualquer equipamento de calha. A frente é sempre a face
oposta ao encaixe — a mesma regra `FACE_OUTWARD` de `realInterfaces.ts`.

Antes usava-se `Rx(+90)` nos S7-1500 (punha o comprimento para cima e a frente virada para
baixo) e `Rx(+90)` no S7-300 (deitava-o de costas e virava as aberturas de ventilação
para cima). A hipótese `Rx(90)·Rz(180)` também foi testada e rejeitada: com o CAD destes
modelos rodava o painel 90° e espelhava as legendas.

## Medidas (mm)

| Modelo | Largura | Altura | Profundidade |
|---|---|---|---|
| DI 32 | 47 | 147 | 131,7 |
| CPU 1511C | 85 | 147 | 131,7 |
| CPU 315-2 DP | 40 | 122,1 | 125,04 |

## Bornes (todos na frente, cabo a sair por +Z)

| Modelo | Ligações | Composição |
|---|---|---|
| DI 32 | 34 | L+ e M na fila de cima + 32 entradas (I0.0…I3.7) em duas colunas |
| CPU 1511C | 35 | L+/M + 16 DI (X10) + 16 DQ (X11) + port PROFINET (X1) |
| CPU 315-2 DP | 4 | L+ · M · MPI · DP, na metade inferior da frente, por baixo da tampa |

As colunas saem dos pinos que o CAD desenha nos conectores frontais (DI 32: x 0,283 e
0,974; CPU 1511C: x 0,434 e 0,97) e as filas das 17 etiquetas do conector (10,7 % a 94 %
da altura, contadas do topo). O `position3D` do inspetor conta a altura da base para o
topo, por isso a conversão é feita uma só vez, em `factory.ts`.

Os bornes declaram `face: 'front'` porque o encaixe do CAD está na lateral do módulo mas
o cabo sai pela frente — o ponto de ligação vem da geometria, a direção do cabo vem daqui.

## Lâmpadas

| Modelo | Lâmpadas | Onde |
|---|---|---|
| DI 32 e CPU 1511C | 3 — RUN/STOP, ERROR, MAINT | coluna inferior esquerda da frente, junto ao X10 |
| CPU 315-2 DP | 6 — SF, BATF, DC5V / FRCE, RUN, STOP | duas colunas no topo da frente |

Acendem só com o módulo alimentado (L+/M com tensão) e seguem o estado da simulação:
RUN acende o verde, parado acende o STOP/MAINT, erro de diagnóstico acende o vermelho.
Os CAD não trazem as lâmpadas em cor nem emissivas (são peças cinzentas), por isso a cor
é posta por cima do sítio medido.

## Esquema IEC

O símbolo de cada PLC já desenhava o número certo de ligações — DI 32 com L+/M e 32
entradas, CPU 1511C com L+/M/PN, 16 entradas e 16 saídas (pares 1-2), CPU 315 só com
L+/M/MPI/DP. As contagens do 3D passaram a coincidir com as do símbolo, e há teste que o
verifica (32 I · 16 I + 16 Q · só alimentação).

## Simulação

Os Siemens S7 passaram a ler a alimentação como o LOGO!: `logoElectricalInputs` sobre os
bornes L+/M do conector frontal. Sem isto o módulo nunca ficava alimentado, os LEDs nunca
acendiam e as entradas alimentadas pelo próprio L+ do módulo liam sempre 0. A CPU 315 não
tem E/S a bordo: só a alimentação é lida (acende o DC5V e o RUN/STOP), como no aparelho.

## Evidência

Capturas do GLB montado no Painel 3D (projeto novo, os três PLC e dois fios):

- [[evidence-plc-siemens/01-painel-tres-plc.png|Os três PLC de pé, frentes para o observador]]
- [[evidence-plc-siemens/02-cpu1511c-frente.png|CPU 1511C: visor, teclado, dois conectores frontais]]
- [[evidence-plc-siemens/03-di32-frente.png|DI 32: conector frontal e borne I0.0 com fio]]
- [[evidence-plc-siemens/04-cpu315-frente.png|CPU 315: seis lâmpadas e o borne L+ na metade inferior]]

Provas de eixo independentes do modelo da aplicação (render ortográfico do GLB com a
rotação aplicada): `tools/posed.html` + `tools/shoot-posed.mjs`, imagens
`posed_di32.png`, `posed_1511.png`, `posed_315.png`.

## Testes

- `npm run test:siemens-plc` — **novo**: pose, medidas, bornes na frente com cabo a sair por
  +Z, contagens de E/S iguais às do símbolo, ordem das filas, lâmpadas e alimentação. 9
  verificações, todas a passar.
- `npm run test:commands`, `test:commands-symbols`, `test:plc-signals`,
  `test:component-validate` — a passar.
- Falhas anteriores ao trabalho, confirmadas iguais com o código antigo:
  `test:terminal-geometry` (towerLight: GLB em falta), `test:native-iec`
  (esquema v2 alterado pelo utilizador) e `test:editor3d-functional`
  («Exportação conserva a posição dentro do furo»).

## Ficheiros

- `src/electrical/siemensPlc.ts` — **novo**: referenciais, medidas, tabelas de bornes.
- `src/three/plcStatusLights.ts` — **novo**: lâmpadas, sítios e regras de acendimento.
- `src/three/modelPaths.ts` — rotação base e medidas dos três modelos.
- `src/electrical/factory.ts` — bornes na frente, face do cabo, conversão do eixo y.
- `src/three/terminal3D.ts` — a face declarada manda na direção do cabo.
- `src/three/Panel3D.tsx` — lâmpadas no sítio medido, com o diâmetro do aparelho.
- `src/store/useSimStore.ts` — alimentação L+/M dos Siemens S7.
- `scripts/siemens-plc-smoke.ts` — **novo** teste.

## Por fazer (registado)

- `plcSiemensLogo1224RC`: a frente é a face −X do GLB e não a −Y; a rotação base atual
  (`Rx(+90)`) deixa-o com a frente em +Z, mas sem os bornes no sítio do CAD. Merece a
  mesma medição fina.
- `plcLsXbmDn32s`: o GLB está escrito 1000× maior do que as medidas declaradas (30,2 ×
  97,49 × 82,03 mm); a escala 0,001 é o que faz o modelo caber no painel.
- Renomear as labels `L+`/`M`/`PN` dos canais 0/17 do DI 32 para o contacto que o CAD
  desenha (o programa e o símbolo usam-nas; a mudança tem de ser feita nos dois lados).
