---
type: validation
status: IMPLEMENTED
created: 2026-11-24
updated: 2026-11-24
tags: [dc-simu, cabos, bainha, multicore, H07RN-F, tubo-de-ar, esteiras, QGD, tomadas]
---

# Cabo multicore com uma só bainha, pontas nos bucins e tubo de ar separado na esteira

## Pedido (2026-11-24b)
- «O cabo das tomadas, os três fios deve estar no mesmo isolamento; dentro do quadro o isolamento termina na entrada do quadro; dentro do quadro as linhas estão sem isolamento.»
- «Nas tomadas também o isolamento termina na entrada da Tomada.»
- «O cabo que sai do compressor para ficha também é isolado; o isolamento termina na entrada da ficha e no bucim do compressor.»
- «O tubo de ar que passa na esteira: melhorar as curvas e afilar/afastar na esteira, separado dos cabos de alimentação do compressor e do cabo da alimentação da maquete.»
- Referência visual: `IMG_5982.jpeg` — H07RN-F 3G2,5 mm² INVOLT preto, bainha contínua, veias castanho/azul/verde-amarela só na ponta.

## Diagnóstico
A bainha (`CableSheaths3D`) já existia, mas nunca chegava a parecer um cabo:

1. **Cada veia era encaminhada como um cabo independente.** O encaminhador resolve L, N e PE à sua
   maneira (um vem da régua X1, o PE da barra de terra) e afastava-os até 1–2 cm no meio do
   percurso. A bainha era a **média** das três e tinha de **engordar até ao limite** para as cobrir:
   um "charuto" preto que afinava/inchava ao longo do cabo (raio 0,062…0,095 m no modelo).
2. **Cada veia era desenhada com o diâmetro do CABO inteiro** (`cableOuterDiameterMm` com
   `sheathed: true` → Ø≈4,55 mm), ou seja três tubos mais grossos do que a bainha que os devia
   conter: saíam sempre para fora dela, sobretudo nas curvas.
3. **Reamostragem por fração de comprimento.** As veias têm comprimentos diferentes (0,2 % num cabo
   de 30 m = 7 cm); comparar o índice *i* de cada uma obrigava a bainha a seguir a diferença
   **longitudinal** como se fosse lateral.
4. **Bainha não chegava às bocas.** No QGD acabava 14 mm acima da chapa (o selo do bucim fica a
   2,6 mm) e na tomada 12 mm acima da boca do bucim: via-se o fim da capa a flutuar com L/N/PE nus.
5. **Tubo de ar sem pista própria.** `ar-cmp-frl` partilhava o centro da esteira com os 3G2,5 do QGD
   e com a alimentação da maquete e entrava na esteira com um cotovelo de 90°.

## Solução
### 1. A bainha define o cabo (`Panel3D.tsx`)
- `buildCableSheaths()` passou a ser função de módulo (era um `useMemo` dentro do componente) e é
  chamada em `Wires3D` **antes** de desenhar as veias.
- Registo `cableJackets: bundleId → { curve, cum, points, maxCoreRadius }`.
- `snapCoreToJacket()`: cada veia de um cabo multicore é **empurrada para o eixo da sua bainha**
  (projeção no segmento, estação monotónica, desvio lateral máximo = raio da veia); só o primeiro e
  o último ponto se mantêm, para continuar a chegar ao borne e à boca do bucim. Segue-se uma
  suavização (média 1-2-1) para não ficarem cotovelos.
- Resultado medido: afastamento máximo veia↔eixo **0,043–0,045 m** (era 0,14 m); o raio da bainha
  passou a **nominal** em todo o percurso, só alargando nos 6 % finais de cada boca.

### 2. A veia é um fio, não um cabo (`coreDiameterMm`)
- `coreDiameterMm(wire)` devolve o diâmetro do **condutor isolado** para veias de cabo multicore
  (`sheathed && bundleId && conductorCount > 1`) e o diâmetro normal nos restantes casos. Usado no
  `cachedWireGeometry`, no raio desenhado e no encaixe dos waypoints.

### 3. Alinhamento por estação física
- `polylineCum`, `projectOnRange` e `resamplePolylineAligned`: as veias são reamostradas para o
  **ponto mais próximo ao longo do cabo**, não para a mesma fração do comprimento. A referência é a
  veia de comprimento mediano.

### 4. Pontas da bainha nos bucins (`stampingBenchWiring.ts`)
| Cabo | `sheathFromMm` | `sheathToMm` |
|---|---|---|
| `mq-3g25-*` (QGD → tomada) | topo do QGD `panelTop + 3` (selo do bucim a +2,6 mm) | boca do bucim da tomada `g.y + 21` (bore a 21 mm) |

### 5. Tubo de ar com pista própria
- `AIR_LANE_DZ = 70 mm`: os 3G2,5 do QGD correm do lado da nave da esteira e o `ar-cmp-frl` do lado
  da parede (`wallZ + AIR_LANE_DZ − 40`).
- Entrada na esteira em **três tramos** (antes era um cotovelo de 90°): `laneY−150 → laneY−60 →
  laneY−14 → laneY`.
- Distância mínima medida entre o tubo e os seis condutores 3G2,5 na esteira: **55 mm**.

### 6. Chicote próprio para X1 → PS1
- `qe1-x1-ps1` em vez de `qe1-alimentacao-plc`: as três pontes curtas dentro do QE1 deixam de se
  agrupar com o cabo de alimentação da ficha.

## Verificação
- `test:sockets` — **16/16**.
- `test:maquetes` (ready-maquetes) — **10/10**.
- `estampagem-guiao` — **76/76**.
- `npm test` — **✅ todos os testes passaram**.
- `tsc -p tsconfig.check.json` (Panel3D, stampingBenchWiring, useSimStore, types) — **0 erros**.
- ESLint nos ficheiros alterados — limpo (o erro `useLoader` condicional em `PneumaticsDevices3D.tsx`
  é pré-existente, documentado em `Backlog.md`).
- Fixture Playwright com o QGD mínimo: `coreVsJacket.maxMid` 0,0428 / 0,0449 / 0,0449 m;
  raios de bainha 0,0535–0,0642 m sem picos.

## Evidências
`Evidence-2026-11-24b-Bainha-Veias-Tubo-Ar/`
- `01-tomada-bucim-cabo-unico.png` — cabo preto único a entrar no bucim da tomada, veias só dentro.
- `02-qgd-bucim-bainha-no-selo.png` — bainha a acabar no selo do bucim do QGD (sem fios nus acima).
- `03-tubo-ar-pista-propria.png` — tubo azul na pista da parede, cabos pretos do lado da nave.
- `04-tubo-ar-esteira-separado.png` — entrada do tubo na esteira em três tramos.
- `05-cabos-3g25-continuos.png` — os dois 3G2,5 do QGD como cabos contínuos até às tomadas.

## Notas
- O aperto das veias é recalculado a cada mudança de `wires`/`coordinatedPaths`; durante o arrasto de
  um cabo a veia arrastada usa o traçado direto (sem aperto), para o utilizador ver o ponto que move.
- O raio nominal da bainha usa `2,15 × raio da veia + 16 mm` (mínimo 30 mm), que é o necessário para
  conter três fios encostados com folga.
