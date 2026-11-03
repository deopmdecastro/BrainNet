---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-03
updated: 2026-11-03
tags: [dc-simu, tablet, toolbar, header, ui]
---
# Tarefa 2026-11-03 — Tablet 100% igual ao PC (barra de ferramentas)

## Pedido

Não quer barra de ferramentas «de telemóvel» no tablet. Layout 100% igual ao PC; botões funcionais; Voltar e Comentários em mau estado.

## Correção

- `isPhoneTouch()` exclui tablet → sem `compactBar`, sem dock inferior, sem `is-compact`.
- Toolbar tablet = 2.ª linha completa do PC (não ToolMenus compactos).
- Cabeçalho: Voltar / Comentários com área de clique clara; texto oculto ≤1100 px (só ícone) para não cortar «ProjeComentá»; Guardar mantém rótulo.
