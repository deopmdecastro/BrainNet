---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED_PENDING_VISUAL_APPROVAL
created: 2026-11-20
updated: 2026-11-20
tags: [dc-simu, validação, medidores, d52-2066, kws-306, lcd, serigrafia, bornes, capas]
---
# Validação 2026-11-20 — Medidor trifásico KWS-306 e LCD branco do D52

## Âmbito

Ramo `main` do dc-simu, depois do incremento Easy9 Switch (`d711733`).

Dois pedidos do utilizador, a partir de capturas de ecrã no telemóvel (IMG_5901/IMG_5902,
projeto «Teste»):

1. «O medidor trifásico fazer igual o monofásico, acabamentos, estilo de bornes, serigrafia.»
   → o KWS-306 estava num vocabulário visual diferente do D52-2066.
2. «Porém o lcd do monofásico está branco, não é o correto.»
   → o ecrã do D52 aparecia como uma placa branca.
3. Atualizar também o cover dos dois e publicar na main dos dois repositórios.

## Causa raiz do LCD branco

`applyRenderMode` (`Panel3D.tsx`) trata **qualquer** `MeshStandardMaterial` como superfície
física e força `opacity = 1` e `transparent = false`, a menos que o material traga
`userData.keepTransparent`. O vidro do visor (`digital_meter_glass`) não trazia essa marca,
por isso deixava de ser vidro e passava a ser uma placa branca opaca **por cima** do ecrã.
O canvas do LCD sempre esteve correto — verificado por leitura de píxeis no painel
(`[6,9,8,255]` no centro do ecrã).

## Correções

| # | Item | Correção | Evidência |
|---|------|----------|-----------|
| 1 | LCD branco (D52) | `glassMaterial.userData.keepTransparent = true`, a mesma idioma já usada em `busbar`, `combBusbar` e `industrialFinish` | `meterD522066-front.png`: dígitos verdes/azuis/vermelhos/laranja visíveis |
| 2 | KWS-306 do zero, no mesmo acabamento | Corpo perfilado com degraus de borne (face a 43 mm), tampa frontal boleada, aro preto + ecrã + vidro, parafusos de latão captivos em gaiola com poço de chave pela frente | `meterKws306-front.png`, `meterKws306-iso.png` |
| 3 | Serigrafia do KWS-306 | `A B C N` nos degraus de cima e de baixo, seta de sentido de corrente ao centro, `KWS-306` no filete inferior do visor — tudo como no produto | idem |
| 4 | Teclas | Coluna de quatro pastilhas separadas (M, +, −, ON/OFF) à direita da janela. A quarta não leva tinta por cima; a legenda «ON/OFF» fica ao lado, abaixo, como no aparelho | idem |
| 5 | Cotas dos bornes alinhadas | Boca do túnel a 37 mm da traseira (corpo 65 mm) e passo real de 18 mm: `realInterfaces` (z 30/65 → 37/65, x ±28/±9,3 → ±27/±9), `factory` (z 0,65 → 0,5692) e `legacyRealInterfaces` | `meters-schneider-smoke` PASS |
| 6 | Envelope frontal | A pilha (tampa + janela + vidro + teclas) recuada para dentro dos 65 mm nominais, para o GLB continuar a medir 74,3 × 86,5 × 65,9 mm | `builtin-sync-smoke` 975 verificações OK |
| 7 | Capas | `build-component-covers.mjs --only meterD522066,meterKws306` → capa 3/4 (`component-covers/*.webp`) e vista frontal ortográfica (`component-covers/front/*.webp`) regeneradas a partir do modelo final | `cover-version-smoke` PASS |

## Resultado dos testes

- `npx tsc -b --noEmit` — limpo.
- `npm run test:ci:fast` — **16/19**. As 3 que falham (`test`, `test:mechanical`,
  `test:industrial`) são exatamente as mesmas do baseline registado em
  [[Validation-2026-11-20-Easy9-Switch-Frente-Serigrafia-Manipulos]]; nenhuma regressão nova.
- `test:builtin-sync` e `test:meters-schneider` falharam a meio do trabalho por causa das
  cotas novas e ficaram resolvidas com o item 5 e o item 6 — ambas PASS no fim.
- Suites do protocolo: `terminal-geometry`, `terminal-seat`, `imported-components`,
  `thermal-controls`, `siemens-plc`, `breaker-cut`, `panel-accessories`, `test:style` — todas PASS.
- `build-component-covers.mjs --check`: as 4 capas em falta (`buttonNO`, `buttonNC`,
  `selector2`, `selector3`) faltam **igualmente no baseline** — não é regressão.

## Estado

| Estado | Item |
|--------|------|
| **Preparado** | Fotografia do produto KWS-306 e do D52 como referência de cotas |
| **Implementado** | Itens 1–7 |
| **Testado** | typecheck, `test:ci:fast` 16/19 sem regressões, 8 suites do protocolo, `builtin-sync` 975, `meters-schneider` |
| **Aprovado** | — (falta confirmação visual do utilizador) |

## Limites declarados

- Os dois medidores continuam reconstruções cotadas a partir das fotografias do produto;
  **não** são CAD oficial do fabricante, e as capas não implicam certificação.
- O ecrã mostra apenas os campos reais do aparelho (V/A/kW por fase, SUM de energia, Hz, °C);
  não se inventa firmware nem menus que o produto não documente.
- `buttonNO/buttonNC/selector2/selector3` continuam sem capa — dívida anterior.

## Ficheiros alterados (dc-simu)

`src/three/digitalMeterModel.ts`, `src/electrical/realInterfaces.ts`,
`src/electrical/factory.ts`, `src/electrical/legacyRealInterfaces.ts`,
`public/component-covers/{meterD522066,meterKws306}.webp`,
`public/component-covers/front/{meterD522066,meterKws306}.webp`,
`public/component-covers/manifest.json`.
