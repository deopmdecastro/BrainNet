---
type: validation
status: IMPLEMENTED
created: 2026-11-22
updated: 2026-11-22
tags: [dc-simu, pneumatica, hidraulica, unioes, push-in, reservatorio, capas]
---

# Uniões Push-In realistas + entrada do reservatório

## Problema
- Entrada/saída do reservatório (passa-parede) pouco realista (anel cinza simples).
- Faltavam as uniões pneumáticas do catálogo comercial (reta, cotovelo, Y, T melhorado) com corpo preto e anéis azuis.

## Alterações (dc-simu)

### Reservatório (`HydraulicsDevices3D.tsx`)
- Porta **IN** e **OUT**: junta EPDM, porca sextavada oca, niple e **canal interior oco** (já não é um “tampão” maciço).

### Uniões pneumáticas (`PneumaticsDevices3D.tsx` + modelo/factory)
- `FestoQsPushInPort` com variante `black` (corpo PBT + anel azul).
- **T** (`pneumaticTee`) refeito com núcleo esférico + braços pretos + 3 portas azuis.
- **Novos**:
  - `pneumaticUnion` — união reta 2 vias
  - `pneumaticElbow` — cotovelo 90°
  - `pneumaticY` — derivação em Y 3 vias
- Continuity store: todas as uniões fazem bridge entre bornes pneumáticos.
- Capas: placeholders a partir de `pneumaticTee` (regenerar com `build-component-covers.mjs --only pneumaticUnion,pneumaticElbow,pneumaticY,pneumaticTee` quando o dev server estiver disponível).

## Critérios
- [x] Entrada do reservatório com passa-parede oco e porca realista
- [x] Família de uniões Push-In (reta / cotovelo / T / Y) em 3D
- [x] Registo em tipos, factory, Panel3D, pneumaticsModel, store
- [ ] Capas fotográficas finais (regeneração Playwright pendente)
