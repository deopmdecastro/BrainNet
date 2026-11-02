---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, 3d, pbr, textures, covers, default-views, ls-xbm, studio-lighting]
---
# Tarefa 2026-10-29 — Texturas reais, capas e vistas por omissão dos elementos

Relacionado com [[Validation-2026-10-29-Texturas-Capas-Vistas]], [[Design-Principles]], [[Decision-Log]] (DC-ADR-073) e [[Task-2026-10-29-Realismo-PBR-Emergencia-Cabos-Toolbar-Demo]].

## Pedido
Os componentes parecem foscos e não com a textura real. Verificar as vistas por omissão dos elementos e atualizar as capas — alguns elementos têm vistas erradas.

## Diagnóstico (causas medidas)
- **Iluminação lavada:** o Painel 3D usava `RoomEnvironment` (sala difusa quase uniforme) com ACES e luz hemisférica forte; brancos ficavam cinzentos sem reflexo definido e vermelhos passavam a rosa.
- **Sem UV, sem textura:** 21 dos 26 GLB não têm coordenadas UV; qualquer mapa (incluindo o grão de poliamida já existente) era amostrado num único ponto.
- **Capas com materiais em bruto:** a capa da biblioteca era a vista frontal ortográfica com os materiais do CAD (`roughness = 1`, «gesso»), sem ambiente; a cabeça do botão de emergência saía cinzenta (material «Metal técnico» do GLB), a calha DIN reduzia-se a uma linha e o sinaleiro a um disco.
- **Miniatura do motor** capturada antes de a pintura carregar (saía prateada).
- **LS XBM-DN32S montado de lado:** a face com «EXPANSION CONNECTOR» (o lado do corpo) era a frente e os ganchos da calha saíam para a esquerda.
- **Caixas azuis pintadas** (Proauto) com metalização 0,28 — refletiam o estúdio e escureciam.

## Implementado (dc-simu `ac098ad`)
- `src/three/studioEnvironment.ts`: estúdio de produto (caixas de luz + sala em gradiente) e tone mapping «Neutral», comuns a Painel 3D, editor de elementos, capas, miniaturas e capturas do esquema.
- `src/three/cadSurface.ts`: UV de caixa em mm reais e mapas PBR da biblioteca ambientCG por família de material, com grão de injeção; cores de fábrica preservadas; mapas só atribuídos depois de carregados.
- Capas: `ComponentThumb` passa a fotografia de produto 3/4 do GLB (`getComponentCoverImage`); calha DIN num troço real de 18 cm; faixa interativa começa no ângulo de repouso.
- Capturas do esquema e conjuntos de bornes com o mesmo acabamento.
- LS XBM-DN32S: rotação base `[π/2, 0, π/2]`, frente slim de 30,2 mm, bornes 3D ao longo da profundidade, bornes 2D nas arestas da frente real, migração `upgradeLsXbmFront` para projetos guardados; LED de estado dentro das frentes slim.
- Teste `test:cad-surface` (no `test:ci`) e ferramenta visual `scripts/component-cover-audit.html`.

## Critérios de aceite
- [x] Componentes com reflexo e relevo real no Painel 3D (sem aspeto de gesso).
- [x] Capas coerentes com o 3D e sem vistas erradas (botão de emergência, calha, sinaleiro, motor).
- [x] Vista por omissão de todos os GLB verificada (frente +Z, topo +Y); LS corrigido.
- [x] Testes de geometria de bornes, CI completo e build a passar.
- [ ] Revisão visual num telemóvel real e aprovação do utilizador.

## Estado
Preparado · implementado · testado.
