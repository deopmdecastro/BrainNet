---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, qa, ui, ladder, toolbar, scrollbar]
---
# Ladder: barra com «Bloco»/«Nova network», network automática e barra de deslocamento — 2026-10-26

## Resultado
- LADDER-TB-ADD-01: «+ Bloco» e «+ Nova network» estão na barra de ferramentas do Ladder, a seguir a «Compilar», e saíram da barra do programa e da barra do bloco.
- LADDER-AUTO-NET-01: ao colocar o primeiro elemento numa network vazia, aparece uma network vazia em baixo (Main e blocos FC/FB). Um «Anular» remove as duas.
- TOOLBAR-SCROLL-02: a barra de deslocamento das barras de ferramentas é a mesma das outras zonas (10 px, polegar cinzento-claro arredondado, sem setas). A causa era `scrollbar-width`, que no Chrome ≥ 121 mostra a barra nativa.

## Ficheiros (dc-simu)
- `src/ladder/autoNetwork.ts` (novo), `src/ladder/LadderEditor.tsx`, `src/ladder/ladderBus.ts`, `src/store/useSimStore.ts`, `src/components/Toolbar.tsx`, `src/styles/clean-mode.css`
- `scripts/ladder-auto-network-smoke.ts` (novo), `scripts/toolbar-shortcuts-sim-ui-smoke.mjs`, `package.json`
- `docs/LADDER-BARRA-NETWORK-AUTO.md`

## Evidência
- Commit dc-simu `9a005ad` (carimbo #62), push verificado (`HEAD` = `FETCH_HEAD`).
- `test:ladder-auto-network`: 16 verificações OK.
- `test:toolbar-ui`: botões na barra; já não estão na barra do programa; «Nova network» cria network no Main; elemento numa network vazia → 2 networks; mais elementos não criam outra; «Bloco» abre «Adicionar novo bloco»; barra de deslocamento personalizada em Esquema/Ladder/GRAFCET (`rgb(203, 213, 225)`, raio 9999 px).
- `test:ci` OK (com Monta-Carga.ct), `test:server` 166/0, `vite build` OK.
- UI: ladder-blocks, admin-saas (22; 1.ª corrida falhou de forma intermitente no seletor «Anual», passou ao repetir), editors-sweep, plc-signals, grafcet, blocks, grafcet-modals, grafcet-construction, editor3d, motor — todos OK.
- Inspeção visual: captura com barras de deslocamento ativas (`--hide-scrollbars` desligado) mostra o polegar cinzento arredondado sem setas; `ladder-network-automatica.png` mostra Network 1 com %I0.0/%I0.1 e Network 2 vazia.

## Estado
- Preparado: sim · Implementado: sim · Testado: sim (automático + visual) · Aprovado: pendente (utilizador).

## Pendências
- Validar o deslize das barras em ecrã tátil (≤ 800 px a barra fica oculta, desliza com o dedo).
- Em ecrãs ≤ 1024 px os componentes do GRAFCET abrem como painel sobreposto que bloqueia cliques nas abas até ser fechado (comportamento já existente, a rever).
