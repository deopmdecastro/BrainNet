---
type: validation
status: IMPLEMENTED
created: 2026-11-23
updated: 2026-11-23
tags: [dc-simu, tomadas, RoadEu, fixacao, parafusos, esteiras]
---

# Tomadas aparafusadas no final das esteiras (Passo 2)

## Pedido
As tomadas devem estar fixas aparafusadas no final das esteiras (parafusos de fixação visíveis).

## Alterações (`src/three/socketDeviceModel.ts` — `caseShell`)
1. **Orelhas de parede** (`socket-wall-lug`) com furo e **parafuso** em **todos** os tipos de tomada (antes só no Combo).
2. **Parafusos da fascia** sempre metálicos (removida a variante “quarter” plástica).
3. **RoadEu 70929** (`socketFamatelSwitch`): abas laterais (`socket-side-mount-ear`) com 2 parafusos por lado, adequadas a fixação em pilar IPE100 ou final de esteira.

## Integração
- Commit dc-simu: `4201dbeaa1cd31c6ebe0944083841c939392f817`
- Já existiam parafusos na flange CEE e no isolador; agora a caixa em si fica claramente aparafusada à estrutura.

Estado: **implementado e publicado**. Revisão visual pendente.
