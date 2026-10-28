---
project_id: BN-DCSIMU-001
type: task
status: IN_PROGRESS
created: 2026-10-27
updated: 2026-10-28
tags: [dc-simu, ui, mobile, desktop, glb, componentization, grafcet, ladder, landing, admin]
---
# Tarefa 2026-10-27: UI Mobile/Desktop + GLB-only + Componentização

## Objetivo
Melhorar as telas do DC-Simu para mobile e desktop de forma consistente, usando componentização para evitar layouts diferentes e código repetido.

### Requisitos específicos
1. **GLB-only para elementos**: Para todos os elementos que já possuem modelo GLB, remover definitivamente qualquer Elemento SVG (ou equivalente "fake") — nunca renderizar o símbolo SVG de fallback. Usar apenas a representação derivada do GLB (imagem ortográfica / captura do modelo).
2. **Landing page**: Melhorar.
3. **Editor de componentes do Admin**: Melhorar as telas.
4. **GRAFCET**: Melhorar.
5. **Ladder**: Melhorar.
6. **Esquema 3D**: Melhorar.
7. **Mobile + Desktop**: Padrão único, responsivo, componentizado.

## Contexto das screenshots (2026-10-27)
- Simulação I/O (entradas físicas, saídas CLP, memórias) — mobile.
- GRAFCET com etapas 11–79.
- Ladder (Main OB1) vazio, com entradas virtuais.
- Visualização 3D com componentes sobre placa (VFD, disjuntor, multímetro, borne).
- Admin: Biblioteca 3D, componentes integrados / rascunhos, edição de bornes.

## Prioridade de trabalho
1. Atualizar sempre o contexto neste cofre (BrainNet).
2. Implementar no código do dc-simu.
3. Commit + push em ambos os repositórios (dc-simu e BrainNet).

## Estado atual da renderização (análise)
- Em `SchematicView.tsx`, `renderComponentEl` já prioriza imagens derivadas de GLB para tipos com `hasComponent3DVisual`.
- Fallback `SymbolGlyph` só ocorre quando `!hasComponent3DVisual(c.type)`.
- Placeholders "A carregar modelo 3D…" / "Modelo 3D indisponível" aparecem enquanto a captura não está pronta ou falha.
- Alguns tipos têm ramos especiais (contactor Weg, fonte Proauto, LOGO Siemens) que usam `<image href={model}>`.
- O eixo HUD no Panel3D usa SVG (legítimo, não é componente elétrico).

## Próximas ações
- [x] Garantir que SymbolGlyph nunca é chamado para tipos com GLB (já é o caso; reforçar e remover qualquer caminho residual).
- [x] Unificar o ramo de renderização de componentes com GLB (eliminar ramos especiais duplicados).
- [x] Componentizar transporte de simulação (SimTransportControls partilhado por SimulationDock + GrafcetSimBar).
- [x] Componentizar layout mobile/desktop restante (painéis laterais, docks, overflow de toolbars). — Hierarquia Admin migrada para SidePanelHeader (mesmo padrão do inspetor / Sidebar / GRAFCET / Ladder). CSS de recolha alinhado.
- [ ] Landing page: melhorar hero, showcase 3D, CTAs (base mobile já existe).
- [ ] Admin editor3d: polish UI dos tabs, viewport, lista de componentes.
- [ ] GRAFCET e Ladder: melhorar responsividade e consistência visual com o resto do editor.
- [ ] Esquema 3D: polish de controlos e overlays mobile.

## Notas técnicas
- Repositórios: `deopmdecastro/dc-simu` e `deopmdecastro/BrainNet`.
- Trabalho preferencialmente no cofre + sync.
- Autorizado commit/push com o token fornecido na sessão.

## Progresso 2026-10-27 (sessão)

- Contexto da tarefa criado e commitado no BrainNet.
- Em `dc-simu` (`SchematicView.tsx`): reforçado comentário e política GLB-only — tipos com `hasComponent3DVisual` nunca usam `SymbolGlyph` (SVG simbólico). Push em main.
- Próximo: unificar ramos especiais de renderização de imagens GLB, componentizar toolbars/painéis para mobile/desktop, polish landing/admin/GRAFCET/Ladder/3D.

### Commit dc-simu `b2387be`
refactor(schematic): unificar renderização GLB — eliminar ramos duplicados.
Ramos Weg/Proauto removidos; overlays LOGO/pilot/dual no ramo único de `<image>` do GLB.

### Commit dc-simu `fd208e1` (2026-10-27)
refactor(ui): componentizar SimTransportControls partilhado.

- `SimTransportControls` em `toolbarKit.tsx` (variantes `dock` / `bar`).
- `SimulationDock` e `GrafcetSimBar` passam a consumir o mesmo componente.
- Elimina duplicação de botões de transporte da simulação entre Esquema e GRAFCET.
- Base CSS em `toolbar-spacing.css`.

Próximo foco: continuar componentização (painéis laterais / docks), polish Landing, Admin editor3d, Ladder e Esquema 3D overlays.

### Commit dc-simu (2026-10-27 sessão painéis)
refactor(admin): Hierarquia do editor3D usa SidePanelHeader.

- `Hierarchy.tsx` deixa o cabeçalho custom `ce-hierarchy-title` e passa a `SidePanelHeader` (eyebrow Hierarquia, título Elementos, detail, contagem + vista lista/cartões + fechar mobile nas actions).
- `catalog-editor.css`: estado `is-collapsed` do painel esquerdo alinhado ao do inspetor (rótulo vertical `dc-side-panel-collapsed-label`).
- Objetivo: um só idioma visual de cabeçalho em Sidebar, Library, GRAFCET, Ladder e Admin (esquerdo + direito).

Pendências de painéis:
- Confirmar comportamento de folha (sheet) em mobile no Admin e no shell (App) — já partilham classes `dc-mobile-fullscreen-panel` / `dc-sheet-head` em vários sítios.
- WirePanel / docks restantes se ainda tiverem cabeçalhos ad-hoc.
- Landing CTAs + showcase 3D em viewports estreitos.
- Ladder + Esquema 3D overlays no mesmo idioma.


### Commit dc-simu (2026-10-27 · docks + landing)
refactor(ui): SidePanelHeader no SimulationDock e WirePanel; Landing mobile CTAs/showcase.

- `SimulationDock`: cabeçalho ad-hoc → SidePanelHeader (eyebrow ESQUEMA, estado RUN/STOP no detail, fechar nas actions). Corrige import em falta de `IconPlay`.
- `WirePanel` (Admin): cabeçalho ad-hoc → SidePanelHeader com recolha.
- Landing (`dx-landing.css` v4.8): CTAs a largura total ≤560px; showcase 3D com controlos legíveis ≤720px; hero mostra o viewport 3D primeiro em telemóvel.

Próximo: Admin tabs/lista de componentes; Ladder + Esquema 3D overlays.

### Commit dc-simu (2026-10-27 · Admin tabs/lista + Ladder/3D overlays)
- Admin Biblioteca 3D (`CatalogTab`): filtro de estado em `pn-segment` (tabs) em vez de Select — mesmo padrão dos filtros da Hierarquia/painéis.
- `panel-system.css`: componente `.pn-segment` partilhado; cartões da lista e títulos de estado Ladder alinhados a `--pn-*`.
- Ladder bottom panel + status rows/empty: tokens `--pn-*` (`status-panel-refine`, `ladder-editor`).
- Esquema 3D overlays (`panel3d-axis-hud`, `panel3d-viewbar`, `panel3d-edit-context`, `schematic-hud`): borda, raio, fundo e estados ativos no idioma dos painéis.
- Admin nav/filtros (`admin-refine`): labels em versalete, tabs ativos brand-soft, barra de filtros com fundo de painel.

### Commit dc-simu (2026-10-27 · Admin resumo tiles + mobile polish)
polish(admin): tiles do Resumo com acentos de cor suaves alinhados às referências visuais; classes `adm-tile-pending|approved|rejected|projects|accounts|storage`.

- Cores apenas como fundo/decoração (borda + círculo ::after), respeitando Design-Principles (cor nunca única indicação).
- Mobile (≤720px) já usava grelha 2 colunas; reforço de padding e tipografia mantém altura de toque.
- Objetivo: desktop e mobile do Resumo visualmente próximos das screenshots de referência (cartões coloridos suaves + lista de atividade + acesso rápido).

### Commit dc-simu (2026-10-27 · cabos, ponteiras, escala, não atravessar)
feat(wires): escala mm² mais próxima dos elementos; ponteira 3D com colarinho quadrado; cabos só atrás ou à frente dos componentes.

- `wireMetrics.ts`: 0,5→1,6 px · 16 mm²→8,5 px; `wireEndScale` acompanha.
- `wireGeometry3D.ts`: diâmetro exterior a 88% do físico (antes 72%).
- `WireEnd3D.tsx`: ponteira isolada com colarinho plástico aproximadamente quadrado (referência foto).
- `SchematicView.tsx` `drawOrder`: se o traçado cruza a caixa de um elemento (exceto bornes próprios), o cabo fica inteiro atrás ou à frente — nunca a meio.
- Ponteiras já existiam (`ferrule` default); SyncPanel Admin já faz varredura editor↔biblioteca publicada.

### Commits dc-simu (2026-10-27 · Resumo da administração responsivo)
feat(admin): Resumo responsivo com ícones, cartões e atividade compacta (`606cb30`, carimbo #71), precedido da correção de deriva dos limites de cabos no smoke (`acc6ac4`, carimbo #70).

- A partir de duas capturas do telemóvel enviadas nesta sessão (Resumo + atividade): indicadores passam a cartões-botão com os ícones do sistema único e tons pelo significado; cabeçalho ≤720 px em grelha (botões lado a lado a 44 px); «Sem pendências» sem ponto órfão.
- Atividade recente: ícone por categoria/gravidade, contexto sem repetir o e-mail (alvo prevalece), data à direita — ≈50 px por evento em vez de ≈110 px.
- Acesso rápido com 4 áreas (inclui Contribuições), cartões com uma única ação em botão-pílula, estados vazios com ícone; navegação com ícones também na lateral/tablet/seletor.
- Componentização: `OverviewTile` / `OverviewCard` / `OverviewEmpty` / `activityMeta` em `AdminPanel.tsx`; 8 ícones novos em `src/ui/icons.tsx`; `test:admin-ui` passa a 58 verificações (390/768/1024/1440). `vite build` não correu neste ambiente (2 GB; ENV-01) — Vercel a partir do `main`.
- Evidência: [[Validation-2026-10-27-Admin-Resumo-Responsivo]] (inclui capturas em `evidence-admin-resumo/`). Fecha ADMIN-VISUAL-01; deriva registada como TEST-DRIFT-03.

### Commit dc-simu `67392cf` (2026-10-27 · refinamento mobile a partir de capturas)
polish(mobile): rodapé compacto, réguas finas, painel de estado limitado, inspetor de bornes com alvos de toque.

- Novo `src/styles/mobile-refine.css` (último import): rodapé sem transbordo, réguas 30 px, painel de estado ≤38dvh, compilação legível, inspetor de bornes a 40 px, cartão do componente opaco, fade nas barras deslizantes.
- Evidência e pendências: [[Validation-2026-10-27-Mobile-Refine-Ladder-Inspetor]]. Render visual **não** verificado (sem navegador no ambiente).
- Próximo: GRAFCET enquadrar à largura em ecrãs estreitos; Elementos/Projeto do Ladder; Admin editor de componentes; Esquema 3D.

### dc-simu (2026-10-27 · GRAFCET: componentes em painel lateral)
Pedido com captura do GRAFCET no telemóvel: o painel de componentes passa a seguir o padrão das outras telas.
- ≤1199 px: botão «Componentes» sai da barra de ferramentas; a régua fina «Ferramentas» (30 px) fica à esquerda e abre uma folha lateral (máx. 320 px) por cima do diagrama, com fundo escurecido. Antes era uma modal ao centro. Ctrl+B mantém-se.
- Implementado em `mobile-refine.css` §9 (sem alterar TSX). Render visual por confirmar no telemóvel.

### dc-simu (2026-10-27 · GRAFCET igual à Biblioteca do Esquema)
Feedback: o painel de componentes do GRAFCET deve ter o mesmo estilo das outras telas (régua fina com ícone + rótulo vertical; no telemóvel, folha de ecrã inteiro como a Biblioteca).
- Régua «Componentes» (ícone Layers, igual à «Biblioteca»); ≤720 px a folha ocupa o ecrã inteiro (z 80); 721–1199 px folha lateral de 320 px. Botão da barra continua removido (pedido anterior) — repor é só retirar `.grafcet-palette-tool{display:none}` em `mobile-refine.css` §9.


### dc-simu (2026-10-28 · Admin Registos/Planos/Componentes)
Ver [[Validation-2026-10-28-Admin-Registos-Planos-Componentes]]. CSS em `mobile-refine.css` §10, sem alterar TSX.

## Progresso 2026-10-28 (sessão: avatares, capas e botões)

- Pedido: melhorar as 4 telas de Administração (Projetos, Componentes, Biblioteca 3D, Sistema) com avatares, capas, ícones e melhores botões «Novo componente» e «Projetos».
- Feito: `Avatar`, `ProjectThumb`, `ComponentCover`, `admin-polish.css`, cabeçalho `adm-cta`/`adm-back`, ícones no Sistema e na Biblioteca 3D, `preview` na lista admin de projetos. Detalhe e verificações em [[Validation-2026-10-28-Admin-Avatares-Capas]].
- Pendente: `test:admin-ui` e confirmação visual; fotografia de perfil editável; `Avatar` no centro de conta e Dashboard; Landing, GRAFCET, Ladder e Esquema 3D (itens por fechar acima).
- GRAFCET: régua «Componentes» padronizada e setas do painel inferior cima/baixo — [[Validation-2026-10-28-Grafcet-Regua-Componentes]].
- Gavetas laterais padronizadas em todos os editores — [[Validation-2026-10-28-Gavetas-Padronizadas]].
