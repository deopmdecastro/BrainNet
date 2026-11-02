---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, dashboard, projeto, esquema-iec, commands]
---

# Criar projeto só com Esquema IEC

## Pedido
No diálogo «Criar novo projeto», adicionar opção para criar apenas esquemas IEC.

## Estado
O tipo `commands` (Esquema IEC) já existia em `ProjectKind` / `VIEWS_BY_KIND` (`só vista commands`). A versão em produção mostrada no ecrã ainda listava só Tudo / Ladder / GRAFCET (texto antigo de «Tudo»).

## Alteração
- Ordem no diálogo: **Tudo → Esquema IEC → Ladder → GRAFCET**
- Texto do tipo Esquema IEC: *«Só o editor de esquemas IEC 60617… e o seu simulador.»*
- Lista de tipos com scroll em ecrãs baixos (4 opções no telemóvel)

## Aceitação
- [x] Opção visível no radiogroup
- [x] Projeto `commands` abre só a vista Esquema IEC
- [ ] Deploy produção a confirmar após push
