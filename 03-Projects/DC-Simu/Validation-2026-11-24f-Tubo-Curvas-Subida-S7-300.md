---
type: validation
status: IMPLEMENTED
created: 2026-11-24
updated: 2026-11-24
tags: [dc-simu, tubo-de-ar, esteiras, cabos, QGD, S7-300, SM321, SM322, conector-frontal, bornes]
---

# Tubo de ar com curvas largas, dois cabos lado a lado na subida e S7-300 com a pinagem real

## Pedido (2026-11-24f)
- «Os ângulos do tubo de ar estão muito acentuados, deveriam ser curvos como no cabo.»
- «O cabo que desce até ao quadro parece ser apenas um; filaçar um ao lado do outro, já que são dois cabos.»
- «Deixar realistas os componentes do PLC, acabamentos mais fiéis aos originais, e verificar as entradas — se os bornes de ligação estão corretos.»

Continuação de [[Validation-2026-11-24e-Ranhuras-Tubo-Fichas-CEE]].

## Diagnóstico
1. **Tubo facetado.** O traçado já tinha arcos, mas o `TubeGeometry` era construído com **no máximo 180 segmentos** num tubo de ~10 m (≈ 5,5 cm por segmento): cada curva ficava com 3–4 facetas e parecia um cotovelo. O raio (6,5 × Ø) também era curto ao lado do cabo multicore.
2. **Subida do QGD.** Os dois 3G2,5 (maquete e compressor) subiam no **mesmo eixo** da subida — pareciam um só cabo.
3. **S7-300 — bornes.** Os pontos de ligação do SM321/SM322 eram uma grelha genérica (L+ e M lado a lado no topo, 16 endereços por coluna) que **não correspondia ao conector de 40 pólos** do aparelho. O SM321 tinha um borne L+ que o módulo real não tem.
4. **S7-300 — acabamento.** Bloco «SIEMENS» em retângulo petróleo, conector frontal cinzento sem bornes visíveis, 32 LEDs em duas colunas sem numeração.

## Pinagem verificada (Siemens)
- SM321 DI 32 (6ES7321-1BL00-0AA0) e SM322 DO 32 (6ES7322-1BL00-0AA0) usam o mesmo conector de 40 pólos (6ES7392-1AM00-0AA0).
- **SM321:** bornes 1, 11, 21 e 31 **não são usados**; entradas nos bornes 2–9, 12–19, 22–29, 32–39.
- **SM322:** 1, 11, 21 e 31 são as **alimentações +24 V dos quatro grupos de 8** (1 → saídas 0–7, 11 → 8–15, 21 → 16–23, 31 → 24–31); saídas isoladas em grupos de 8.
- Fontes: artigo técnico sobre os bornes 1/11/21/31 do SM321/SM322 (industrialmonitordirect.com) e ficha do SM 322 1BL00 (grupos de 8, LED verde por canal). Os bornes M dos grupos (10/20/30/40 no SM322, 20/40 no SM321) seguem o esquema de ligação do manual S7-300 «Module data»; **confirmar na folha de ligação do módulo antes de cablar um aparelho real.**

## Solução
### Tubo de ar (`wireGeometry3D.ts`, `Panel3D.tsx`, `stampingBenchWiring.ts`)
- Percurso de esteira com raio **≈ 14 × Ø** e 2 passagens de **Chaikin** (arredonda os vértices que sobravam em troços curtos).
- Tubos PU (`pneumatic`/`hydraulic`) desenhados a **~10 mm por segmento** (máx. 1200), como as veias dos cabos.
- Saída/entrada das descidas em diagonal suave à frente das abas até ao lado da tomada.

### Subida do QGD (`stampingBenchWiring.ts`)
- Os dois cabos sobem **lado a lado, 14 mm entre eixos** (Ø ≈ 11 mm): maquete do lado +X, compressor do lado −X — o lado para onde cada um segue na esteira de parede, sem se cruzarem.

### S7-300 (`siemensPlc.ts`, `factory.ts`, `siemensS7300Model.ts`, `stampingBenchWiring.ts`)
- `s7300Fc40Pin(pin)`: cotas dos 40 bornes (1–20 à esquerda, 21–40 à direita, de cima para baixo) — a mesma tabela serve os pontos de ligação dos cabos e o desenho 3D.
- **SM321**: `I x.0–x.7` nos bornes 2–9/12–19/22–29/32–39, `M` (1M) borne 20, `2M` borne 40, **sem L+**.
- **SM322**: `L+`/`M` (1L+/1M) bornes 1/10, `2L+`/`2M` 11/20, `3L+`/`3M` 21/30, `4L+`/`4M` 31/40; `Q` nos mesmos bornes que as entradas.
- Cablagem: X20 alimenta 1L+/1M do SM322 e **pontes curtas 1L+ → 2L+ e 1M → 2M** no conector (o guião usa Q4.x e Q5.x, grupos 1 e 2); o SM321 só leva 1M a 0 V.
- Modelo 3D do SM321/SM322: cavidade frontal com **conector preto de 40 bornes de parafuso** (cabeça com fenda e entrada do condutor) **numerados 1–20 / 21–40**, faixa superior com **SIEMENS em petróleo**, designação e **4 × 8 LEDs verdes por byte com os números .0–.7**, MLFB; porta articulada modelada (oculta, para mostrar a cablagem); LEDs do SM322 lidos no byte 4 (Q4.x).

## Verificação
- `npm run test:bench-routing` — **59/59** (novas: dois cabos lado a lado na subida; SM321/SM322 com a pinagem acima; SM321 sem L+; **31 cabos X21/X22 → S7-300, cada borne da régua ligado ao endereço que o marca**; pontes do grupo 2 do SM322).
- `test:maquetes` 10/10 (atualizado: 7 condutores de alimentação + 2 pontes) · `npm test` OK · `test:sockets` 17 · `test:siemens-plc` 9 · `test:plc-signals` 27 · `test:imported-components` 197 · guião 76 · `tsc` 0 erros.

## Evidências
`Evidence-2026-11-24f-Tubo-Curvas-Subida-S7-300/`
- `00-pedido.jpg` · `01-antes-tubo-facetado.png` / `02-depois-tubo-curvo.png`
- `03-depois-dois-cabos-lado-a-lado.png` · `04-depois-subida-QGD.png` · `05-depois-tubo-descida.png`
- `06-antes-S7-300.png` / `07-depois-S7-300.png` · `08-depois-S7-300-conector-40.png`

## Commits
- dc-simu `13b836b9` — feat(maquete): tubo de ar com curvas largas, cabos 3G2,5 lado a lado na subida e S7-300 com pinagem real do conector de 40 pólos.

## Pendências
- Projetos guardados com o SM321 antigo têm um borne `L+` que deixou de existir: o cabo X20 → L+ desse módulo é descartado ao abrir. Remontar a maquete atualiza tudo.
- CPU 315-2 PN/DP e SM334 mantêm o acabamento anterior (fora do âmbito deste pedido).
