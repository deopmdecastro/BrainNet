---
type: validation
status: IMPLEMENTED_LOCAL
created: 2026-11-22
updated: 2026-11-22
tags: [dc-simu, maquete, estampagem, esteiras, calhas, parede]
---
# Correção: calhas/esteiras na parede não se apoiam nas costas

## Pedido

As calhas (esteiras de cabos) na parede da maquete de estampagem estavam erradas: a parte das costas apoiava-se/encostava na parede.

## Causa

O offset `wallTrayZ = wallZ + 160` (com largura 200 mm) deixava a face traseira a apenas ~60 mm da parede. Em certas vistas e com a orientação vertical (rot Z 90°) das descidas/subida, a face lateral/fundo das esteiras parecia apoiada na parede.

## Correção

Em `src/electrical/stampingBench.ts` (commit `2d9800f6`):

- Aumentado o offset para `wallTrayZ = wallZ + 220` (face traseira a ~120 mm da parede).
- Comentário explicativo no código.
- O ramal (`branch.from`) e as posições das esteiras verticais (riser QGD e descida compressor) seguem o novo valor automaticamente.

Não se alterou a orientação Euler das esteiras verticais (mantém-se `{ x: 0, y: 0, z: 90 }`) para não introduzir regressões visuais sem validação interativa; o afastamento resolve o contacto/apoio indevido.

## Verificação

- Alteração isolada e localizada.
- Sem impacto nas cotas da bancada, do QGD nem do compressor.
- O pilar IPE100 e as descidas para a bancada mantêm-se.

## Próximos passos (se necessário)

- Revisão visual no Painel 3D após deploy.
- Se a abertura das esteiras verticais continuar a parecer virada ao longo da parede em vez de para a nave, experimentar orientação `{ x: 90, y: 0, z: 90 }` ou equivalente e validar com captura.

Estado: **implementado**. Commit e push em dc-simu concluídos (`2d9800f6`).
