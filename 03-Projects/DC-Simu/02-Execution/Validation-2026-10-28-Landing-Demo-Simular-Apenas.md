---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
repo: deopmdecastro/dc-simu
commit: 4887980
date: 2026-10-28
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, landing, demo, lock, validation]
---

# Demo da landing (editor real): «apenas visualizar e simular», elementos bloqueados

## Pedido
«Melhorar isso, espaçamentos, reduzir funcionalidades, pois vai ser apenas para
simular; deixa apenas o básico e bloqueia os elementos, ferramentas de GRAFCET e
elementos de Ladder.» (captura do editor embutido na landing).

## Alterações (dc-simu `4887980`)

### Toolbar — só o essencial de simulação
- Linha 1: Run / Pausa / Stop + modo (Tempo real) + velocidade + badge — ficam;
  Passo, Reset, Clean saem na demo.
- Linha 2: esquema perde o grupo inteiro de ferramentas de edição (Cabo/Sonda/
  Apagar…); restam «Simulação» e (Ladder) «Compilar»; GRAFCET mantém validação +
  Ajustar/Mapa; Atalhos fora dos três modos.

### Bloqueios de edição (choke points)
- **Store**: `moveComponent` no-op em `demoMode` — arrastar componentes no canvas
  não faz nada; `setGrafcet` recusa mutações estruturais (permite apenas
  `historyKey: grafcet:pages*` para navegador de páginas bootstrap).
- **Ladder**: paleta «Elementos» (INSTRUÇÕES) e rail escondidos; teclas
  Insert / Ctrl+Shift+N / Ctrl+D / Ctrl+Delete / Alt+Shift+↑↓ e Ctrl+Z/Y travados;
  navegação (Alt+↑↓) e painel de simulação ativos.
- **GRAFCET**: «Abrir editor» escondido no painel compacto; diálogos de edição
  (etapa/ação/transição) não abrem; «Editar etapa…» desativado no menu de contexto;
  ferramenta «Ligar» já recusada (turno anterior). Forçar etapa/disparar transição
  (sim) continua funcional.
- **App**: biblioteca esquerda + rail colapsável fora da demo; canvas sem painel.

### Espaçamentos
`.dc-demo-root`: toolbar 52px (52↔46 row2), `.dc-seg` com mais ar, statusbar 30px.

## Contrato / validação
- `landing-editor-showcase-smoke.mjs` sobe para **38 asserções** (gates novos +
  espaçamentos confirmados).
- typecheck limpo; `npm test` OK; **23 suites** + landing-demo(27) +
  landing-editor(38) + landing-hero(14) — todas verdes. Release stamp #92.

## Pendências possíveis para toques finais
- Diálogo de opções de fios, «BOM/PDF» — já fora (row1 sem ficheiro na demo).
- Clicks de edição profunda restantes (prop de tag) seriam traváveis mais tarde
  se o utilizador reportar; até hoje são inertes para a simulação.
