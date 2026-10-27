---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-10-27
updated: 2026-10-27
tags: [dc-simu, ui, panels, sidepanelheader, admin, componentization]
---
# Validação 2026-10-27 — painéis laterais uniformes (SidePanelHeader)

## Pedido
Garantir que Sidebar, Library, propriedades GRAFCET/Ladder e Admin usam `SidePanelHeader` + `CollapsedPanelRail` de forma uniforme e com o mesmo comportamento de folha em mobile.

## O que já estava alinhado
- Shell (`App.tsx`): Library / GRAFCET-objetos com `SidePanelHeader` (folha) e `CollapsedPanelRail`.
- `Sidebar.tsx` (biblioteca + inspetor do esquema).
- `GrafcetEditor.tsx` (toolbox + propriedades).
- `LadderEditor.tsx` (projeto + elementos).
- Admin inspetor direito: `InspectorNavigation.tsx` já usava `SidePanelHeader`.

## Incremento desta sessão
- **Admin Hierarquia (esquerda)**: `Hierarchy.tsx` migrou o bloco `ce-hierarchy-title` para `SidePanelHeader` (mesmo contrato: eyebrow, title, detail, actions, collapsed, onToggle).
- **CSS** (`catalog-editor.css`): recolha do painel esquerdo passa a usar a mesma anatomia do inspetor (`dc-side-panel-collapsed-label` vertical), em vez de um `.ce-collapsed-label` próprio.

## Efeito
Menos markup e CSS específicos; cabeçalhos de gaveta falam a mesma língua visual em todos os editores. Mobile close e toggle continuam nas actions / toggleClassName.

## Próximo
1. Rever WirePanel e docks restantes.
2. Landing: CTAs + showcase 3D em viewports estreitos.
3. Admin tabs / lista de componentes alinhados ao sistema de painéis.
4. Overlays Ladder + Esquema 3D.

## Estado
- Preparado: sim · Implementado: sim · Testado: pendente (typecheck + smoke UI) · Aprovado: pendente.
