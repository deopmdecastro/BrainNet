---
project_id: BN-DCSIMU-001
type: decision
status: IN_PROGRESS
created: 2026-11-02
updated: 2026-11-02
tags: [dc-simu, ui, ux, toolbar, responsive, tablet, mobile, design-principles]
---

# Reorganização e Modernização das Barras de Ferramentas — 2026-11-02

## Contexto

Pedido para melhorar a organização e experiência das barras de ferramentas do DC-Simu, tornando a interface mais profissional, intuitiva, limpa e responsiva, sem perder a identidade visual.

Screenshots analisados mostram:

- Barra superior de projeto (Novo, Abrir, Salvar, BOM, PDF) + tabs de vistas (3D Realista, Ladder, GRAFCET, Esquema IEC, Monitor) + controlos de simulação.
- Segunda linha de ferramentas contextuais por editor (Selecionar, Cabo, Apagar, Mover vista, Comentário, Texto, etc.).
- Em alguns modos muitos botões lado a lado, com risco de overflow ou aparência de excesso de informação.
- Já existe lógica de compactação (`narrowBar`, `compactBar`, `useOverflowCompact`, `ToolMenu`) e kit partilhado (`toolbarKit.tsx`).

## Análise prévia (obrigatória)

### Repositórios
- DC-Simu: estrutura React + Tailwind + Zustand; componente central `src/components/Toolbar.tsx` (~1028 linhas); kit partilhado em `src/ui/toolbarKit.tsx`; estilos em `src/styles/toolbar-spacing.css` e `header-refine.css`.
- BrainNet: Design-Principles.md já define regras claras:
  - Usar sempre elementos de `toolbarKit` (HistoryGroup, ViewControls, TbButton, ToolSep, ToolMenu...).
  - Overflow → `ToolMenu`, nunca fora do ecrã.
  - Espaçamento: 6 px intra-grupo, 12 px inter-grupo.
  - Hierarquia clara: modo → ferramenta ativa → objeto → simulação.
  - Mobile/tablet: não esconder ações principais; dicas longas a pedido.
  - Um símbolo, uma função; controlos de simulação presentes em todas as vistas.

### Decisões anteriores relevantes
- Validation-2026-10-26-Toolbar-Atalhos-Simulacao.md
- Validation-2026-10-28-Barras-Espacamento-Scroll
- Task-2026-10-27-UI-Mobile-Desktop
- Design-Principles (atualizado 2026-11-01): painéis padronizados, réguas, RightDockTabs, etc.

### Estado atual positivo
- Já existe agrupamento (ficheiro, vistas, ferramentas, painéis, mais).
- Já existe modo compacto para telefone (`compactBar` via PHONE_TOUCH_QUERY + max-width 743px).
- Overflow inteligente com `useOverflowCompact`.
- Consistência visual via classes `dc-tool-btn`, `dc-seg`, tokens.

### Oportunidades de melhoria
1. **Tablet (768–1199 px)**: atualmente tratado quase como desktop; muitos botões ainda visíveis. Introduzir breakpoint intermédio para forçar mais ToolMenus e labels mais curtos.
2. **Agrupamento**: reforçar grupos semânticos (Projeto / Edição / Visualização / Simulação / Ferramentas) e reduzir botões isolados.
3. **Labels**: em ecrãs médios, preferir só ícone + tooltip; texto só quando espaço permite ou no menu.
4. **Hierarquia visual**: destacar mais a ferramenta ativa e o modo atual; reduzir peso visual de ações secundárias.
5. **Touch targets**: garantir ≥ 40–44 px em compact/tablet.
6. **Orientação**: verificar landscape phone/tablet.

## Estratégia de implementação

1. **Não reinventar**: estender `toolbarKit` e a lógica já existente em `Toolbar.tsx`.
2. **Breakpoint tablet**: adicionar query ~ `(max-width: 1100px) and (min-width: 744px)` para layout "tablet-compact" (mais menus, menos labels).
3. **Agrupamento inteligente**:
   - Projeto: Novo / Abrir / Guardar / BOM / PDF → já em grupo ou ToolMenu.
   - Edição: Selecionar, Cabo/Wire, Apagar, Mover/Pan, Desfazer/Refazer.
   - Visualização: Zoom, Fit, Grelha, Íman, Alinhamentos (quando aplicável).
   - Simulação: Play / Pause / Stop / Step / Reset (já partilhado).
   - Secundário: Comentário, Texto, Nova página, Variáveis, etc. → menus.
4. **Padronização**: garantir que Ladder, GRAFCET, IEC e 3D usam o mesmo `ViewControls` + `HistoryGroup` + estilos de altura/gap.
5. **Responsividade**:
   - Phone: já existe `is-compact` + menus.
   - Tablet: novo modo intermédio.
   - Desktop: manter botões principais visíveis; overflow só quando necessário.
6. **Documentação**: atualizar Design-Principles com a secção de breakpoints e agrupamentos.

## Alterações previstas no código

- `src/ui/device.ts`: exportar `TABLET_QUERY` se necessário.
- `src/ui/toolbarKit.tsx`: reforçar `ToolMenu` e possivelmente `useTabletCompact`.
- `src/components/Toolbar.tsx`: 
  - Melhorar construção de `fileSections`, `toolSections`, `panelSections`.
  - Em tablet, forçar mais itens para menus.
  - Ajustar classes de gap e min-height para tablet.
- `src/styles/toolbar-spacing.css`: tokens adicionais para tablet; garantir touch targets.
- Testes: scripts de smoke existentes (`toolbar-*-ui-smoke.mjs`).

## Princípio orientador (do pedido)
> Não quero mais botões, quero melhor organização. Não quero perder funcionalidades, quero torná-las mais acessíveis. Não quero reinventar o DC-Simu, quero evoluir a estrutura existente respeitando a identidade e o conhecimento já construído no BrainNet.

## Estado
Análise concluída. Implementação a seguir: refinamentos incrementais no Toolbar e kit, com validação visual e smoke tests.

## Progresso 2026-11-02 (continuação)

### Alterações de código realizadas

1. **src/styles/toolbar-spacing.css**
   - Alvos de toque ≥ 34 px e altura de barra 44 px em `pointer: coarse` ou ≤ 900 px.
   - Em ≤ 1100 px + estados `is-tight`/`is-dense` os labels de texto desaparecem (mantêm-se tooltip + aria-label).
   - Reforço de hierarquia visual no grupo `.tb-primary` (font-weight 700).
   - Separadores ligeiramente mais discretos.

2. **src/components/Toolbar.tsx**
   - Comentário de documentação no topo do `return` a registar a decisão BrainNet e o princípio orientador.
   - Grupo de projeto marcado com `role="group" aria-label="Projeto"`.
   - Comentário da 2.ª linha atualizado com o agrupamento semântico e o comportamento de labels.

### Decisões técnicas mantidas
- Tablet continua com parity de layout desktop (`TABLET_LAYOUT_WIDTH`).
- Overflow content-based (`useOverflowCompact`) em vez de breakpoints rígidos para esconder botões.
- Nenhuma funcionalidade removida; apenas organização e redução de ruído visual.
- Kit partilhado (`toolbarKit`) e tokens existentes preservados.

### Próximos passos
- [ ] Verificar visualmente em 3D / Ladder / GRAFCET / IEC (desktop + tablet + phone).
- [ ] Correr smoke scripts de toolbar existentes.
- [ ] Atualizar Design-Principles.md com a secção de breakpoints e o reforço de 2026-11-02.
- [ ] Commit + push DC-Simu e BrainNet.

## Progresso adicional (mesma sessão)

### Mais agrupamentos no Toolbar.tsx
- Introduzido `viewExtraItems` / `viewExtrasSections`.
- Quando `tightRow2`: Exemplos / Importar / Limpar (IEC), Tabela (3D), Variáveis (GRAFCET) → ToolMenu «Mais».
- Em desktop largo: botões visíveis como antes.
- Botão Tabela duplicado removido.
- Anotações e simulação continuam no grupo primário.

### Design-Principles.md
- `updated: 2026-11-02`.
- Nova secção de agrupamento semântico, estados de densidade, tablet e princípio orientador, com ligação a esta decisão.

### Branches
- DC-Simu: `toolbar-reorg-2026-11-02` (2 commits).
- BrainNet: `toolbar-docs-2026-11-02` (atualizado).
