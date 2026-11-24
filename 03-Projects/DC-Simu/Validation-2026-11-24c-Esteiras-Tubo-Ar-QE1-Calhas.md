---
type: validation
status: IMPLEMENTED
created: 2026-11-24
updated: 2026-11-24
tags: [dc-simu, esteiras, tubo-de-ar, cabos, QE1, calhas, bucim, filacamento]
---

# Esteiras: tubo de ar alinhado e cabos dentro · QE1: cablagem pelas calhas, sem diagonais

## Pedido (2026-11-24c)
- «Melhorar e resolver erros e melhorar passagem de cabos e tubos, distribuição nas calhas e esteiras.»
- «Na esteira parece que o tubo de ar não está alinhado; o cabo preto da tomada está fora da esteira; garantir que os cabos passam no bucim.»
- «Melhorar organização dos cabos e fios no quadro elétrico.»
- Capturas do site (projeto `Teste_coppy`): IMG_6017 (vista de topo do T da esteira) e IMG_6023 (interior do QE1).

Continuação de [[Validation-2026-11-24b-Bainha-Veias-Tubo-Ar]] — reaproveita as pistas, a bainha e o encaminhador interior do QE1 já existentes; não foi reescrito nada de raiz.

## Diagnóstico
Reproduzido montando a maquete `atec-estampagem` num fixture Playwright (mesma cena do site) e medido por dados:

1. **3G2,5 fora da esteira de parede.** As pistas eram `wallTray.z + 45 + AIR_LANE_DZ` (+115 mm) e `−55 − AIR_LANE_DZ` (−125 mm) numa esteira de 200 mm (±100): os dois cabos corriam fora das abas. É o cabo preto «fora da esteira» da IMG_6017.
2. **Tubo de ar com gancho no T.** Na esteira de parede o tubo passava 40 mm além do T (`benchDropX + 60`) e voltava (`benchDropX + 20`); a spline centrípeta global sobre pontos afastados cortava as esquinas com raios de vários decímetros → diagonal através do T.
3. **Tubo e cabo na mesma pista no ramal QGD → BANCADA** (tubo +20 mm, cabo +25 mm) e o tubo a 50 mm do fundo da descida, junto à boca.
4. **Tubo a atravessar as tomadas.** XS-COMP e XS-MAQ estão por baixo das descidas, encostadas à parede/pilar: o tubo descia pelo meio da caixa.
5. **QE1 em diagonal** (até 48 cm): o encaminhador ia do borne (à frente) direto ao eixo da calha (atrás, a outra cota) num só troço.
6. **Bundle partilhado `qe1-alimentacao-plc`** entre o cabo da ficha F-MAQ (com bainha), X20 → S7-300 e PS1 → X20: a bainha e o aperto ao eixo agrupam por bundle e puxavam os outros fios para o eixo do cabo.
7. **`snapCoreToJacket` puxava as veias nuas** (já dentro do quadro) para a ponta da bainha → diagonal bucim → borne.

## Solução
### Esteiras (`stampingBenchWiring.ts`)
| Esteira | Cabos 3G2,5 | Tubo de ar |
|---|---|---|
| Parede (200 mm) | compressor −50 mm (lado da parede) · maquete atravessa a +15 mm | +55 mm (lado da nave) |
| Ramal QGD → BANCADA (150 mm) | +30 mm | −30 mm |
| Descidas (100 mm) | +30 mm | −30 mm |

- `TRAY_LANES` substitui `AIR_LANE_DZ`; todas as pistas ficam ≥ 15 mm dentro das abas. A disposição evita cruzamentos tubo ↔ cabo (o tubo vira para o ramal pelo lado −X; o cabo da maquete vai no +X).
- Tubo `ar-cmp-frl` **assente no fundo** das esteiras (`AIR_ON_FLOOR`), sem o recuo no T.
- `besideSocket()`: nas duas descidas o tubo sai da pista no vão topo da caixa ↔ fundo da esteira e desce **ao lado da caixa** (30 mm de folga), encostado à parede, longe da ficha.

### Curvas do tubo (`wireGeometry3D.ts`)
- `isAxisRouted()`: um tubo pneumático com troços manuais alinhados com os eixos (percurso de esteira) passa a ter **arco de raio fixo em cada canto** (`roundCorners`, ≈ 6,5 × Ø) e troços retos; a spline global fica só para tubos desenhados em curva livre.

### QE1 (`stampingBenchWiring.ts`, `Panel3D.tsx`)
- Encaminhador interior **estritamente ortogonal** (`into()`): borne → vertical até ao bordo da calha → dedos da calha (só profundidade) → pista. Também na descida do bucim de topo.
- Ponte entre bornes do **mesmo aparelho** (KS1 S12 → S52) em «L» à frente dos bornes, em vez de ir à calha e voltar.
- Bundles próprios: `qe1-cabo-ficha-maq`, `qe1-x20-plc`, `qe1-ps1-x20`.
- `snapCoreToJacket`: veias para lá das pontas da bainha mantêm o seu percurso (só a parte revestida é apertada ao eixo).

### Bucins
- Verificado nas capturas: 3G2,5 entram pelos bucins das tomadas e do QGD; cabo da ficha F-MAQ pelo M25 e chicote de campo pelo M50 no topo do QE1.

## Verificação
- **Novo** `npm run test:bench-routing` — **18/18** (pistas dentro das abas, separação tubo ↔ cabos, sem recuos, tubo fora das caixas das tomadas, QE1 sem troços em diagonal, bundles coerentes). Falha no código anterior (`mq-3g25-compressor-l` fora da esteira de parede).
- `npm test` — todos os testes passaram.
- `test:sockets` 16/16 · `test:maquetes` 10/10 · `estampagem-guiao` 76/76.
- `tsc -p tsconfig.json` — 0 erros.
- Fixture 3D (cena renderizada, medição nas `TubeGeometry`): maior troço diagonal dentro do QE1 **483 mm → 75 mm** (o que resta é a curva do cabo revestido por cima do quadro); soma dos troços diagonais 22,4 m → 15,2 m (o restante está fora do QE1, nas pernas da mesa).

## Evidências
`Evidence-2026-11-24c-Esteiras-QE1-Calhas/`
- `01-antes-T-esteira.png` / `02-depois-T-esteira.png` — T visto de cima: tubo em diagonal e 3G2,5 na aba → tubo na sua pista com curva, cabos dentro.
- `03-depois-T-iso.png` — T em perspetiva.
- `04-tubo-contorna-XS-MAQ.png`, `05-tubo-contorna-XS-COMP.png` — tubo ao lado das caixas; 3G2,5 a entrar no bucim.
- `06-antes-QE1.png` / `07-depois-QE1.png` / `08-depois-QE1-iso.png` — interior do QE1.
- `09-bucins-QE1.png` — cabo da ficha no M25 e chicote de campo no M50.

## Commits
- dc-simu `351f7770` — fix(maquete): tubo de ar e 3G2,5 dentro das esteiras, contorno das tomadas e QE1 sem diagonais.

## Pendências
- **Projetos já guardados** (ex.: `Teste_coppy`, montado antes de c5fb7d66) guardam os pontos dos cabos. As correções de desenho (curvas do tubo, veias nuas, bundles por cabo) aplicam-se ao abrir, mas as **pistas novas** só aparecem numa maquete montada de novo (Biblioteca → Maquetes → Estampagem) ou com uma futura ação «Reencaminhar cablagem da maquete».
- O chicote de campo entra no M50 como feixe de fios soltos; um cabo multicore de campo (com bainha até ao bucim) é um passo seguinte possível.
