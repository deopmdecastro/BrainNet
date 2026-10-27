---
project_id: BN-DCSIMU-001
type: task
status: IN_PROGRESS
created: 2026-10-27
updated: 2026-10-27
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
- [ ] Garantir que SymbolGlyph nunca é chamado para tipos com GLB (já é o caso; reforçar e remover qualquer caminho residual).
- [ ] Unificar o ramo de renderização de componentes com GLB (eliminar ramos especiais duplicados).
- [ ] Componentizar layout mobile/desktop (toolbar, painéis laterais, bottom bars).
- [ ] Landing page: melhorar hero, showcase 3D, CTAs.
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
