---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-10-27
updated: 2026-10-27
tags: [dc-simu, ui, admin, catalog, ladder, panel3d, panel-system]
---
# Validação 2026-10-27 — Admin lista + Ladder/Esquema 3D overlays

## Admin — tabs e lista no sistema de painéis
- **Biblioteca 3D**: filtro Todos / Rascunhos / Publicados / Arquivados / Integrados como `.pn-segment` (role=tablist), partilhado via `panel-system.css`.
- Cartões e ferramentas de lista usam tokens `--pn-*` (borda, raio, tipografia).
- Navegação lateral Admin e `cb-filters` afinados no mesmo idioma (versalete, brand-soft no ativo).

## Ladder + Esquema 3D
- Títulos de grupo do painel de estado (`ladder-status-title`) no estilo eyebrow dos painéis.
- Linhas, vazios e contentor inferior com `--pn-line` / `--pn-bg` / `--pn-radius`.
- Overlays 3D (eixos, barra de vistas, contexto de edição, schematic-hud) com fundo, borda e botão ativo coerentes com os painéis laterais.

## Estado
Implementado. Testes visuais / smoke pendentes nesta sessão.
