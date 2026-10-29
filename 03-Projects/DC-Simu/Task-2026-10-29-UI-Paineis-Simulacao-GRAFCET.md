---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, ui, ux, mobile, tablet, desktop, grafcet, ladder, virtual-io, simulation-dock]
---
# Tarefa 2026-10-29 — Refinar painéis de simulação, inspetor GRAFCET e E/S

Relacionado com [[Validation-2026-10-29-UI-Paineis-Simulacao-GRAFCET]], [[Design-Principles]], [[Decision-Log]] (DC-ADR-072) e [[Task-2026-10-28-UI-Refine-Screens-Mobile-Desktop]].

## Origem
Capturas do utilizador (iPhone, `dc-simu.vercel.app`, projeto «Partida direta com emergência»):

1. Gaveta GRAFCET «Etapa 0» — separadores Etapas/Transições/Sinais/Diagnóstico a sair do ecrã; linhas com símbolos de texto (◎ □ ↑ ↓).
2. Separador **Sinais** — botões «+ Entrada / + Saída / + Memória / Tabela completa…» cortados e lista invisível.
3. Painel do projeto (Esquema) — dois cabeçalhos empilhados (PROJETO + SIMULAÇÃO), etiquetas `INT` e `1 · cabo` sobrepostas às células vizinhas.
4. Painel inferior do Ladder — separador «Memórias» tapado pela pílula «Pronto».
5. Barra de estado — ícone ⬇️ em emoji; cabeçalho e gaveta recolhida.
6. GRAFCET sem o painel de simulação/saídas que o Ladder tem.

## Pedido
Refinar UI/UX, ícones e painéis em telemóvel, tablet e desktop **sem refazer nem mudar o tema**; no GRAFCET acrescentar botões de simulação e saídas como no Ladder. Trabalhar a partir do cofre, commit e push nos dois repositórios.

## Diagnóstico (causas)
- **Sinais esmagado:** na folha do telemóvel a `aside` é que rola; `.grafcet-signals` tinha `flex: 0 1 auto; overflow: auto` e encolhia para ~31 px. A barra de ações `sticky` ficava por cima da pesquisa.
- **Separadores GRAFCET:** linha única com rolagem horizontal sem sinal; 5 separadores (com «Simulador») não cabiam a 390 px.
- **Células E/S:** `.vio-mode` e `.plc-sim-state` em `position: absolute` com deslocamentos negativos — invadiam a célula seguinte.
- **Ladder:** separadores e ações no mesmo contentor de rolagem; as ações `sticky` com gradiente tapavam o separador.

## Implementado (dc-simu)
- `src/grafcet/GrafcetSimDock.tsx` (novo): painel no fundo do canvas GRAFCET, modelo do Ladder — separadores **E/S** (sinais do PLC ativo ou E/S virtuais) e **Sequência** (`GrafcetSimPanel`), estado RUN/PAUSA/STOP com forma + rótulo, transporte Run/Pausa/Passo/Stop/Reiniciar e recolher. Aberto/fechado pelo botão «Simulação» da barra (`simVisible`), recolhido por omissão até 800 px.
- `GrafcetEditor.tsx`: canvas numa coluna (`.grafcet-canvas-col`) com o painel; o separador «Simulador» saiu do inspetor; separadores em quatro mosaicos com ícone + contagem; etapa desenhada como caixa GRAFCET com número (dupla na inicial); setas `IconArrowUp/Down`.
- `SignalsPanel.tsx` + CSS: ações de criação logo abaixo do contexto, grelha 3 + 1; separador deixa de encolher.
- `PlcSignalPanel.tsx`, `VirtualIoPanel.tsx`: rodapé da célula (`.vio-cell-foot`) com tipo e estado dentro do cartão.
- `LadderEditor.tsx`: separadores em `.ladder-bottom-tablist` próprio; ações fora da rolagem; no telemóvel separadores inativos só com ícone.
- `SimulationDock.tsx` / `App.tsx`: no painel do projeto, barra compacta (estado + transporte) em vez do segundo cabeçalho; separadores com ícone.
- `InstallApp.tsx`, `GrafcetStatusCard.tsx`: `IconDownload` em vez de emoji; `IconGrafcet` no cartão de estado.
- Estilos em `src/styles/sim-dock-refine.css` (carrega por último, só tokens `--pn-*`).

## Critérios de aceite
- [x] Separadores do inspetor GRAFCET cabem a 360–390 px, com ícone e contagem.
- [x] Separador Sinais mostra ações, pesquisa e lista sem cortes no telemóvel.
- [x] Células E/S sem sobreposição; alvos ≥ 36 px no telemóvel.
- [x] Painel Ladder sem sobreposição entre separadores e ações.
- [x] GRAFCET com painel de simulação e saídas ao estilo do Ladder.
- [x] Telemóvel (390), tablet (820) e desktop (1440) capturados.
- [x] Typecheck, testes de estilo e smoke GRAFCET a passar.
- [ ] Push para o GitHub — bloqueado na sessão (ver validação).

## Estado
Preparado · implementado · testado. Commit `dc-simu` local `701498c`. Aprovação visual do utilizador pendente.
