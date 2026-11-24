---
type: validation
status: IMPLEMENTED
created: 2026-11-24
updated: 2026-11-24
tags: [dc-simu, cabos, terra, PE, bainha, H07RN-F, bucim, tomadas, QGD, esteiras]
---

# Cabo 3G2,5 QGD → tomada da maquete: L, N e PE dentro da bainha, de bucim a bucim

## Pedido (2026-11-24d)
- «Verificar o cabo terra que sai do quadro e vai até à maquete. A alimentação da maquete é um cabo isolado de 3 linhas — fase, neutro e terra — que alimentam a tomada; os cabos entram pelo bico (bucim) da tomada. Verificar isso.»
- Referência: `IMG_5982.jpeg` — H07RN-F 3G2,5 mm² INVOLT, bainha preta contínua, veias castanho/azul/verde-amarelo só na ponta.

Continuação de [[Validation-2026-11-24c-Esteiras-Tubo-Ar-QE1-Calhas]] e [[Validation-2026-11-24b-Bainha-Veias-Tubo-Ar]].

## Verificação de partida
- **Dados (`stampingBenchWiring`)** — corretos: `mq-3g25-maquete-{l,n,pe}` partilham o bundle `chicote-mq-3g25-maquete`, `sheathed`, `conductorCount: 3`; L de X1.3, N de X1.5, **PE verde-amarelo da barra PE (PE6)** até ao borne PE da XS-MAQ; bainha do selo do bucim do QGD (+3 mm) à boca do bucim da tomada (+21 mm). O mesmo para o 3G2,5 do compressor (PE7).
- **Desenho 3D** — com defeitos, medidos no fixture (polilinhas das `TubeGeometry` vs anéis da bainha) e visíveis nas capturas:
  1. **Bucim do QGD**: o troço interior subia até ao tecto, descia 15 cm até ao primeiro ponto da bancada e voltava a subir pelo bucim. A PE, arredondada à parte, passava 3–10 cm **por cima da caixa, ao lado do bucim** (verde à vista) e as veias saíam pela ponta aberta da bainha.
  2. **Esteira e descidas**: nas curvas em «S» a PE e a fase apareciam ao lado do cabo preto (até 6 mm fora do eixo com capa de 4,4 mm de raio). Duas causas: a bainha tinha anéis a 5–6 cm (teto de 180) e cortava as curvas por corda; as veias tinham vértices só nos cantos e eram apertadas a uma polilinha média de 96 amostras, não à curva da bainha.
  3. **Bico da tomada**: o cabo descia ao fundo da descida, voltava a subir 55 mm e entrava no bucim de esguelha.

## Solução
### Encaminhamento (`stampingBenchWiring.ts`, `useSimStore.ts`)
- QGD: `glandQgd.y = topo da calha do topo + 0,27` → o último troço interior fica à cota da saída da calha e só avança em profundidade até à vertical do bucim; o primeiro ponto da bancada passa a `panelTop − 4` mm. O cabo **sobe sempre** pelo bucim.
- Tomadas: ainda dentro da descida, a +130 mm da boca, o cabo passa da pista (+30 mm) para a vertical do bucim e **desce a direito** até à boca e aos bornes.

### Desenho (`Panel3D.tsx`)
- Troço revestido de cada veia = entre os seus pontos mais próximos das **duas bocas** da bainha; fora dele a veia fica nua no seu percurso (dentro do QGD / da tomada), dentro dele é sempre apertada ao eixo.
- Veia **subdividida a ~10 mm** antes do aperto e apertada ao eixo **denso da própria curva da bainha** (`getSpacedPoints`).
- Bainha e veias de cabo multicore com **um anel/segmento a cada ~10 mm** (máx. 1200).

## Verificação
- `npm run test:bench-routing` — **46/46** (+28 do cabo 3G: mesmo bundle e bainha comum; PE verde-amarelo da barra PE ao borne PE; saída do QGD sempre a subir; entrada na tomada a direito pelo eixo do bucim; bainha a acabar na boca do bucim, no eixo das veias; da esteira à tomada só desce).
- Fixture 3D: amostras de veia fora da bainha ao longo do cabo — **L 11 · N 12 · PE 12 → 0** (as que restam estão dentro do QGD e dentro do bucim/caixa da tomada, onde a veia é nua).
- `npm test` OK · `test:sockets` 16/16 · `test:maquetes` 10/10 · guião 76/76 · `tsc` 0 erros.

## Evidências
`Evidence-2026-11-24d-Cabo-3G-Terra-Bucins/`
- `01-antes-bucim-QGD-veias-fora.png` / `02-depois-bucim-QGD.png`
- `03-antes-esteira-terra-a-vista.png` / `04-depois-esteira-cabo-unico.png`
- `05-antes-descida-terra-a-vista.png` / `06-depois-descida-bico-tomada.png`
- `07-depois-bico-tomada-topo.png` · `08-depois-subida-QGD.png`

## Commits
- dc-simu `767dc514` — fix(maquete): cabo 3G2,5 QGD → tomada com L/N/PE dentro da bainha até aos bucins.

## Pendências
- Projetos já guardados (ex.: `Teste_coppy`) recebem as correções de desenho ao abrir; o novo traçado junto aos bucins (QGD e tomada) só numa maquete montada de novo.
