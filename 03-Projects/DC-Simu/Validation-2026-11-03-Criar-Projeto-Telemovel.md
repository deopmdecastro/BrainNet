---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED_PARTIAL
created: 2026-11-03
updated: 2026-11-03
repo: https://github.com/deopmdecastro/dc-simu
commits:
  - a76accd
tags: [dc-simu, dashboard, telemovel, dialogo, folha-inferior, ux]
---
# Diálogo «Criar novo projeto» no telemóvel

## Pedido
Melhorar o ecrã no telemóvel (captura do iPhone, `dc-simu.vercel.app`).

## Diagnóstico (a partir da captura)
- O diálogo era mais alto que o ecrã: o ícone/cabeçalho ficavam cortados em cima e **«Cancelar» / «Criar projeto» fora do ecrã**.
- Cinco cartões de tipo (Tudo, 3D, IEC, Ladder, GRAFCET) com descrições longas ocupavam ~1300 px. A regra `min-height: 780px` desligava o deslize da lista em telemóveis altos, e o overlay centrado cortava o topo.

## Implementado (`dc-simu` a76accd)
- `src/styles/dashboard-dialog-mobile.css` (novo, `≤ 743px`, importado em `main.tsx`): folha inferior com `max-height: 100dvh − área segura`, rola por dentro; cantos superiores arredondados; ícone escondido; texto de ajuda mais curto.
- Tipos de projeto numa linha de 48 px; **só a opção escolhida mostra a descrição** (as outras ficam com o nome). Rádio de 20 px.
- Campo de nome a 48 px e 16 px de fonte (o iOS não faz zoom ao focar).
- Ações **fixas no fundo** (`position: sticky`), acima da barra do iPhone (`safe-area-inset-bottom`); «Cancelar» 1×, «Criar projeto»/«Eliminar» 2×, 46 px. Aplica-se também a Convidar e Eliminar (mesmo `.dx-dialog`).
- Sem alterações em TSX: só CSS. PC e tablet intactos.

## Verificações
- `tsc -b` limpo; `test:style` ✅.

## Não verificado
- **Sem browser no sandbox**: nada foi visto renderizado. Confirmar no iPhone: ação visível sem deslizar, rolagem interna, teclado aberto com o campo e botões acessíveis, e Convidar/Eliminar.
- Esconder a descrição das opções não escolhidas é uma decisão de espaço; se preferires vê-las todas, basta remover a regra `:not(.is-on) small`.
