---
type: validation
status: IMPLEMENTED
created: 2026-11-24
updated: 2026-11-24
tags: [dc-simu, maquete, tomadas, fichas-CEE, compressor, bucim, bainha, cabos]
---

# Cabos das tomadas, fichas encaixadas e bucim na entrada do compressor

## Pedido (capturas do site em produção)
- **IMG_5989** — ficha azul F-MAQ à frente da tomada RoadEu XS-MAQ, no pilar da bancada: **pinos virados para a câmara** e **3 condutores nus** a sair pelo lado dos pinos.
- **IMG_5990** — topo da carenagem do compressor: **condutores nus com anilhas e bainha azul deitados em cima**, cabo a entrar pelo topo **sem bucim**.
- Cabos das tomadas mal traçados: saíam pelo lado dos pinos, cruzavam a bancada e ficavam deitados sobre o compressor.

## Diagnóstico
1. As fichas `ceePlug16A` eram inseridas **sem orientação**: a face dos pinos (local +Z) ficava virada para a câmara e o bucim traseiro (local −Z) para a tomada — o inverso do encaixe real.
2. Os bornes da ficha (lado do cabo) ficavam assim **à frente**, e os cabos saíam por ali em vez de pelo bucim.
3. O cabo do compressor era um `direct` curto que terminava ao léu sobre a carenagem, sem prensa-cabos.
4. A bainha (`CableSheaths3D`) tinha raio fixo (`maxCoreRadius × 1,75 + 0,8 mm`) calculado com o diâmetro **sem** `sheathed` — mais pequeno do que as duas veias lado a lado: a veia azul corria por fora do cabo preto.

## Solução
### 1. Fichas encaixadas (F-COMP, F-MAQ)
- `ceePlugOn()` em `stampingBench.ts`: ficha = tomada + `CEE_PLUG = {dx:−47, dy:−3, dz:+80,5}` com **`orientation {x:0, y:180, z:0}`** — a face dos pinos vira-se para a tomada e o bucim fica do lado do cabo.
- `socketDevices.ts`: bornes da ficha nos pinos `(±9 | 0, 6 | −11, front+8)`; a tomada mantém os alvéolos em `socketOutletPoint`.
- Tampa azul do alvéolo CEE da tomada **aberta** (`blueCoverOpen: true`) porque a ficha está encaixada.
- Verificação numérica: pinos 39…53 mm dentro do cano 36…53 mm; corpo da ficha a 57 mm (fora do alvéolo); cada pino L/N/PE cai no alvéolo correspondente.

### 2. Contactos ficha → tomada
- `mq-comp-contact-*` e `qe1-maq-contact-*` passaram a **1 único waypoint** (troço curto interior, 69 mm em Z e 19 mm em X) e `locked: true` — deixaram de haver cabos a cruzar a bancada.

### 3. Cabo do compressor (3G2,5 H07RN-F revestido)
- Sai pelo **bucim traseiro** da ficha (`plug.z + 52`), desce junto à parede, curva sobre a carenagem e entra pelo **prensa-cabos** no topo.
- Novo grupo `compressor-cable-gland` em `PneumaticsDevices3D.tsx` (base hexagonal, corpo, anel e selo preto), posicionado por `AIR_COMPRESSOR_CABLE_GLAND = {x:−140,4, y:285, z:14}` — assente na carenagem (base a −441 mm, superfície a −434 mm).
- O último troço desce **pelo eixo do bucim até 68 mm dentro da carenagem** e só aí abre para os bornes. Sem este ponto o arredondamento da curva cortava a esquina e as veias passavam ao lado do bucim, à vista.

### 4. Bornes L/N do compressor
- `position3D` de L e N passou a **x = 0,23** (−140 mm) — exactamente o eixo do bucim. As duas veias descem juntas pelo prensa-cabos e separam-se apenas no interior da carenagem.

### 5. Bainha dos chicotes com raio variável
- `CableSheaths3D` deixa de usar um raio fixo: em cada estação mede o **desvio real de cada veia à linha média** (na mesma curva com que os condutores são desenhados) e o raio passa a `desvio + raio da veia + margem`, com:
  - `maxCoreRadius` calculado com o mesmo diâmetro dos tubos (`sheathed: w.sheathed`);
  - afunilamento nas pontas (as veias abrem para bornes diferentes dentro da ficha/compressor, onde não se vê);
  - média móvel do perfil (sem “nós”) e teto para nunca parecer um tubo desproporcionado.
- Resultado: a capa cobre **sempre** todas as veias — a veia azul deixou de correr por fora do cabo preto.

## Evidências
`Evidence-2026-11-24-Cabos-Tomadas-Bucim/`
- `cabo-ficha-compressor-conjunto.png` — ficha encaixada na tomada da parede, cabo pela parede e entrada no compressor.
- `cabo-ficha-compressor.png` — traçado do cabo sem veias à vista.
- `bucim-compressor-entrada.png` — bainha preta a entrar pelo bucim (sem leque, sem condutores nus).
- `compressor-topo-bucim.png` — vista de topo: cabo a entrar no prensa-cabos.
- `ficha-maq-encaixada.png` — F-MAQ encaixada na RoadEu XS-MAQ, tampa azul aberta.

## Verificações
- `npx tsx scripts/ready-maquettes-smoke.ts` — **10/10** (nova verificação 10: fichas rodadas 180°, tampa azul aberta, contactos com 1 waypoint, cabo `mq-comp-cord-*` a passar no eixo do bucim e a abrir para os bornes dentro da carenagem, F-MAQ a sair pelo bucim traseiro).
- `npm run test:sockets` — 16/16 (ficha CEE 16A com pinos, bucim traseiro e bornes alinhados).
- `npm test` — todos os testes passaram.
- `npx tsx scripts/estampagem-guiao-smoke.ts` — 76 verificações.
- Typecheck (`tsc -p` sobre os ficheiros alterados) — sem erros novos.

## Commits dc-simu
- `d7fe20b3` fix(maquete): fichas CEE encaixadas, cabo do compressor pelo bucim e bainha sem veias à vista

## Notas
- O encaixe é construtivo nesta montagem (`benchAssembly: true`), sobrevive à reabertura do ficheiro.
- O cabo do compressor continua **editável/arrastável** (sem `locked`); os contactos ficha↔tomada é que estão bloqueados.
- A maquete completa rebenta por memória no Chromium da sandbox; a validação foi feita por dados (`tsx`) e por capturas com as peças da ficha/compressor isoladas.
