---
project_id: BN-DCSIMU-001
type: validation
status: PUBLISHED
created: 2026-10-31
updated: 2026-10-31
repo: https://github.com/deopmdecastro/dc-simu
commits:
  - 769c591
tags: [dc-simu, 3d-realista, torre, glow, lampada]
---

# Validação 2026-10-31 — Torre GLB acende como a lâmpada nativa

## Pedido
A luz da torre (3D Realista) devia acender como a lâmpada do projeto nativo: mesmo efeito, luz e brilho encostado ao vidro.

## Diagnóstico
- O 3D Realista usa o GLB `towerLightSb23011` via `CadComponentReal3D`; o `TowerLight3D` simples (que já tinha `GlowHalo`) não é o que aparece.
- O GLB só tinha emissivo em `importedFinish.ts` (`lampOf`), sem halo. O ponto de luz da lente estava em mm (`distance: 1.4`) e, após o fator 0,01 do ajuste, quase não iluminava. O emissivo passava pelo tone mapping e não saturava.

## Implementação
- `Panel3D.tsx`: após o ajuste do modelo, calcula-se o centro/raio de cada lente (`userData.towerLens`, face frontal `box.max.z`) e renderiza-se um `GlowHalo kind="lamp"` por cor (halo aditivo + luz de ponto, subida/descida suaves), ligado a `c.state.red|yellow|green` com a simulação ativa.
- `importedFinish.ts`: removido o ponto de luz em mm; lentes acesas com `toneMapped=false` (como a lâmpada nativa).

## Verificações
- 2026-10-31 (publicação): `tsc -b` sem erros, `vite build` OK e `npm test` (smoke) «TODOS OS TESTES PASSARAM» sobre o dc-simu `main` com os 3 commits aplicados.
- Teste visual em browser **ainda por fazer** (as linhas «não executados» abaixo referem-se ao ambiente anterior).
- Sintaxe TS/TSX de ambos os ficheiros validada. Build, typecheck completo e teste visual **não executados** (sem dependências neste ambiente).

## Pendências
- Confirmar no browser: halo centrado no vidro nas 3 lentes, sem corte pela lente, intensidade semelhante à lâmpada `Lamp3D`.
- Publicado em `deopmdecastro/dc-simu` `main` (cb32a08..57d3e43); submódulo do cofre atualizado.
