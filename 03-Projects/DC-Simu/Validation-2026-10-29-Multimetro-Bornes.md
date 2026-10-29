---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, multimeter, terminals, 3d, regression]
---
# Multímetro RGK DM-20 — alinhamento dos bornes

## Problema e correção

O utilizador mostrou os bornes fora das tomadas na visualização 3D.
O CAD do multímetro era montado pela base, em `RAIL_Y`, enquanto a instância
e os cabos usavam um pivô central mais alto e 40 mm à frente. As coordenadas
dos encaixes no GLB estavam corretas; a montagem do corpo introduzia o desvio.

`CadComponentReal3D`, em `src/three/Panel3D.tsx`, aceita agora uma posição
central explícita. O multímetro recebe o mesmo pivô usado pela instância e
pelos bornes. Os componentes de calha continuam a usar a montagem pela base.
A etiqueta acompanha a altura do modelo centrado. IDs, tomadas, posições
do projeto e referências dos cabos são conservados.

## Verificação

- `npm test`: passou.
- `npm run test:terminal-geometry`: passou; 20 modelos e 142 ligações.
- `npm run build`: passou, incluindo PWA; aviso existente de chunks grandes.
- BrainNet `npm test`: 45 testes passaram; `npm run check`: passou.
- `npm run test:multimeter-ui`, com Chrome e API bloqueada: passou em duas
  orientações, com quatro cabos ligados, persistência ao guardar/reabrir e
  sem erros JavaScript.
- O teste compara o CAD realmente montado no painel com o mesmo GLB centrado
  no referencial dos bornes. No código anterior falha com **42,0595 mm** de
  desvio; na correção mede **0,0000 mm** nas duas orientações.

## Ficheiros e evidências

- `src/three/Panel3D.tsx`: alinhamento do modelo.
- `scripts/multimeter-terminals-ui-smoke.mjs` e `package.json`: regressão
  acessível por `test:multimeter-ui`.
- `runtime/dm20-ui-pass.log`, `runtime/dm20-regression-before.log`,
  `runtime/dm20-smoke.log`, `runtime/dm20-build.log`,
  `runtime/dm20-geometry-baseline.log`, `runtime/dm20-brainnet.log`.
- Capturas sintéticas antes/depois em `runtime/dm20-terminals-before/` e
  `runtime/dm20-terminals/`. Nenhum projeto real foi modificado nos testes.

## Estado

Implementado e testado localmente. Commit e push na `main` abrangidos pelo
pedido anterior do utilizador. Aplicação: commit `50e6152`.
Publicação em produção não verificada.
