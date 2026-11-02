---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
commit: cfffd03
tags: [dc-simu, cabos, curvas, terminal, 3d, wire]
repos: [dc-simu, BrainNet]
---

# Melhorar curvas dos fios no terminal e outras curvas (não partir)

## Objectivo
Melhorar as curvas na criação/roteamento dos fios junto aos terminais (saída axial das ponteiras) e nas restantes curvas do traçado 3D, para que não “partam” (kinks, descontinuidades ou arcos demasiado apertados que parecem quebrados).

## Evidência
- Captura do utilizador: ponteira/terminal vermelho com cabo amarelo horizontal e laranja vertical — curva de saída a precisar de suavidade.
- Pedido: “Melhorar as curvas das criações dos fios no terminar e ouras curvas, para não partir.”
- Botão «Criar esquema IEC» já abre canvas vazio pronto a usar (setEmptyDismissed + open-library).

## Plano
1. Aumentar `leadStep` na saída axial do borne (mais espaço antes de curvar).
2. Em `roundCorners`: raio mínimo maior, mais subdivisões por arco, cortes um pouco mais generosos nas extremidades.
3. Manter `coalesceShortJogs` e proteção de placa/obstáculos.
4. Validar visualmente no Painel 3D e em exemplos com muitos cabos (motor, torre, sensor).

## Ficheiros
- `src/three/wireGeometry3D.ts` (leadStep, roundCorners)
- (opcional) `src/commands/CommandsEditor.tsx` — botão já ok

## Critério de aceite
- [x] Saída do terminal com curva contínua, sem kink visível (leadStep ↑)
- [x] Arcos de cotovelo mais suaves (sem “partir”) — raio e steps ↑
- [ ] Sem regressão em colisões com chapa/motor/calhas (a validar visualmente)
- [x] Botão «Criar esquema IEC» continua a abrir canvas vazio utilizável

## Implementação
- Commit `cfffd03` em dc-simu (`src/three/wireGeometry3D.ts`)
- leadStep: outerMm×4.8 (antes ×3.0), min 0.085
- roundCorners: raio min 14, cuts 0.9/0.55, steps ≥16 / 0.08 rad
- radiusFactor: 6.8 rígido / 8.5 flexível

## Notas
Prioridade: trabalhar contexto/workflows no BrainNet e depois commit + push em ambos os repositórios.
