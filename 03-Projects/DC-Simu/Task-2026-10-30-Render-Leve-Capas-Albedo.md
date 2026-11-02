---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-30
updated: 2026-10-30
tags: [dc-simu, performance, zustand, lazy, covers, pbr, albedo]
---
# Tarefa 2026-10-30 — Renderização mais leve e capas com textura real

Relacionado com [[Validation-2026-10-30-Render-Leve-Capas-Albedo]], [[Task-2026-10-29-Texturas-Capas-Vistas]] e [[Design-Principles]].

## Pedido
1. Renderização/carregamento mais leves, com medições.
2. Capas da biblioteca com textura real (ainda pareciam «gesso»).

## Diagnóstico (medido)
- **Cópias por varredura:** `pushRuntime` copiava `components` e `wires` a cada ciclo (10 Hz). Todos os subscritores destas listas re-renderizavam e os memos pesados (rotas 3D `buildAllWirePaths3D`, `obstaclesKey`, `wiresGeoKey`, `positions`, `terminalIndex`) recalculavam sem necessidade.
- **Subscrições à store inteira:** `Toolbar`, `GrafcetSimBar` e `SchematicView` usavam `useSimStore()` sem selector → re-render da barra completa a cada tick.
- **Arranque:** Esquema, Ladder, GRAFCET e Monitor importados de forma síncrona no `App.tsx`.
- **Capas:** a biblioteca gerava todas as capas WebGL no mount, mesmo fora do ecrã.
- **«Gesso»:** as famílias PBR (polímero, pintura, metais) só aplicavam normal/roughness; sem mapa de cor, a superfície ficava lisa.

## Implementado (dc-simu `0865d6d`)
- `useSimStore`: novo escalar `simTick`; `pushRuntime` deixa de copiar as listas (o motor muta no sítio, a referência fica estável).
- Subscrição explícita a `simTick` onde há estado elétrico ao vivo: raiz do `Panel3D` (LEDs são props React), `Wires3D`, `SchematicView` (`displayComponents`/`terminalIndex`), `Sidebar` (inspetor), `PlcSignalPanel` (lâmpadas I/Q), `MonitorPanel`.
- `Toolbar`, `GrafcetSimBar` e `SchematicView` com selectors granulares (`useShallow` para os objetos de ações). O número do scan no título do selo RUN é lido ao passar o ponteiro (já não força re-render).
- `App.tsx`: `lazy()` + `Suspense` (fallback `RouteLoading`) para Esquema/Ladder/GRAFCET/Monitor.
- `ComponentThumb`: a capa só é gerada quando o cartão está a ≤480 px do ecrã (`IntersectionObserver`).
- `cadSurface.ts`: `tintedAlbedo` — mapa de cor ambientCG dessaturado (85 %) e com a média normalizada para ~96 % de branco, aplicado como `material.map`. Multiplica a cor de fábrica: detalhe fotográfico real sem mudar a cor.
- `scripts/component-cover-audit.html`: diagnóstico `coverMaterialInfo(type)` (família, map/normal/rough/bump por material).

## Riscos / seguimento
- Qualquer novo painel que mostre estado elétrico ao vivo deve subscrever `simTick` (as listas já não mudam de identidade em RUN).
- Long task de ~4 s no primeiro render 3D continua lá (geração de capas/rotas visíveis). Próximo passo: passar as capas para um worker/OffscreenCanvas.
