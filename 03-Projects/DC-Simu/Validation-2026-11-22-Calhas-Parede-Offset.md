---
type: validation
status: IMPLEMENTED_LOCAL
created: 2026-11-22
updated: 2026-11-22
tags: [dc-simu, maquete, estampagem, esteiras, calhas, parede]
---
# Correção: calhas/esteiras na parede não se apoiam nas costas

## Pedido

As calhas (esteiras de cabos) na parede da maquete de estampagem estavam erradas: a parte das costas apoiava-se/encostava na parede. Evidências fotográficas/3D fornecidas pelo utilizador mostram a esteira vertical e a aérea demasiado próximas dos painéis da parede.

## Causa

O offset inicial `wallTrayZ = wallZ + 160` (largura 200 mm) deixava a face traseira a apenas ~60 mm. O primeiro aumento para +220 mm (~120 mm de folga) ainda se revelou insuficiente em certas vistas e ângulos de câmara.

## Correção

Em `src/electrical/stampingBench.ts`:

1. Commit `2d9800f6` (primeiro passo): `wallTrayZ = wallZ + 220`.
2. Ajuste adicional (este commit): `wallTrayZ = wallZ + 300` → face traseira a ~200 mm da parede, folga generosa para consolas/suportes de parede.

- Comentário no código atualizado com nota sobre a orientação vertical e a possibilidade de virar a abertura para a nave (`{x:90,y:0,z:90}`) se necessário em revisão visual futura.
- O ramal (`branch.from`) e as posições das esteiras verticais (riser QGD e descida compressor) seguem o novo valor automaticamente.
- Orientação Euler das verticais mantida em `{ x: 0, y: 0, z: 90 }` para evitar regressões de junções 3D sem validação interativa.

## Verificação

- Alteração isolada e localizada em `stampingBench.ts`.
- Sem impacto nas cotas da bancada, do QGD nem do compressor.
- O pilar IPE100 e as descidas para a bancada mantêm-se.

## Próximos passos (se necessário)

- Revisão visual no Painel 3D após deploy / reload da maquete.
- Se a abertura das esteiras verticais continuar a parecer virada ao longo da parede em vez de para a nave, experimentar orientação `{ x: 90, y: 0, z: 90 }` (extensão em Z passa a ser o `sideHeightMm`) e reposicionar o `z` das verticais em conformidade; validar junções automáticas e captura.

Estado: **implementado**. Aguarda revisão visual do utilizador.
