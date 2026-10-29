---
project_id: BN-DCSIMU-001
type: task
status: VALIDATED
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, 3d, pbr, emergency-button, cables, demo, toolbar, landing]
---
# Tarefa 2026-10-29 — Realismo PBR do simulador, botão de emergência vermelho/preto/latão, cabos 3D sem colisão com curvas suaves e barra minimalista na demonstração

Relacionado com [[Task-2026-10-29-Landing-Sim-Polish]], [[Validation-2026-10-29-Realismo-PBR-Emergencia-Cabos-Toolbar-Demo]], [[Design-Principles]] e [[Testing-Plan]].

## Pedido do utilizador
1. **Texturas realistas no simulador + botão de emergência fiel à referência:** as texturas no simulador tinham ficado opacas/baças e o botão de emergência (`B0`) continuava todo preto; pretendia-se material realista e o cogumelo igual à fotografia de referência (cabeça e saia em vermelho vivo, gola/porca e bloco de contacto NF em preto, clip metálico e parafusos traseiros em latão).
2. **Cabos nunca atravessam dentro de outros cabos:** eliminar sobreposições/penetrações cabo-dentro-de-cabo (incluindo saídas multipolares em `XG`/`X0` e calhas horizontais/verticais partilhadas).
3. **Melhorar as curvas dos cabos:** substituir quebras poligonais e dobras em V na frente dos bornes por curvas industriais suaves e contínuas.
4. **Barra de ferramentas da demonstração reduzida ao essencial:** no painel de demonstração manter apenas **Pause** e **Play** e os botões de mudar do ambiente **3D** para **Ladder** ou **GRAFCET**.

## Alterações efetuadas
- **Materiais PBR industriais e iluminação (`src/three/catalogMaterials.ts`, `Panel3D.tsx`, `CatalogComponent3D.tsx`, `componentTurntable.ts`, `LandingShowcase.tsx`):**
  - Enriquecido `finishCadMaterial` (metais maquinados em aço/latão, caixas anodizadas azuis, policarbonato com *clearcoat*, poliamida acetinada com micro-textura) preservando `material.color` para não afetar a deteção do LCD do Siemens LOGO! nem de tampas/sinalizadores.
  - Criado `applyEmergencyButtonFinish` para corrigir as malhas frontais `mesh0_mesh*` do `P20AKR-1.glb` (exportadas originalmente como `Metal técnico` escuro), atribuindo vermelho tráfego `#dc2626` com *clearcoat* à cabeça do cogumelo, poliamida preta `#181a20` à gola/bloco NF, aço zincado `#dce2ea` ao aro/clip e latão `#d6b465` aos parafusos traseiros — aplicado tanto no `Panel3D` como no `CatalogComponent3D` (catálogo publicado na Vercel), `componentTurntable` e `LandingShowcase`.
  - Chapa de montagem RAL 7035 com acabamento metálico acetinado, mapeamento tonal `ACESFilmicToneMapping`, `hemisphereLight` + luzes direcionais de estúdio e `invalidate()` imediato no `StudioEnvironment` para `frameloop="demand"`.
- **Encaminhamento coordenado 3D sem colisão entre cabos e curvas suaves (`src/three/wireGeometry3D.ts`, `Panel3D.tsx`):**
  - Viés vertical por posição local do borne (`localY`) para bornes frontais superiores (`XG`), eliminando o retorno em V pela frente do conjunto de bornes.
  - Novo `buildAllWirePaths3D` com coloração por intervalos nas calhas horizontais (confinada ao corredor livre `[yFloor, yCeil]` acima de `PS1`), separação em dois planos Z entre calhas horizontais e prumadas verticais, e relaxação física 3D cápsula-a-cápsula (**`158 → 0`** pares de cabos em colisão nos 35 cabos de «Partida direta»).
  - Curvas em arco circular (`roundCorners` com `radiusFactor = 5.6`, coalescência de micro-troços) combinadas com *spline* centrípeta C¹ em `cableCurve3D` e PVC semibrilhante de 14 faces radiais.
- **Barra minimalista na demonstração (`src/components/Toolbar.tsx`, `src/schematic/SchematicView.tsx`, `src/App.tsx`):**
  - Em `demoMode`, a demonstração abre diretamente em **3D** (ocultando o seletor inferior `Esquema 2D / Visualização 3D` e `SelectionBar`), esconde a 2.ª linha da barra, o emblema `STOP`/`RUN` e botões extra, deixando exclusivamente **`3D`**, **`Ladder`**, **`GRAFCET`**, **`Play`** e **`Pause`**.

## Critérios de aceite
- [x] Materiais PBR realistas no simulador e iluminação de estúdio imediata em modo `demand`.
- [x] Botão de emergência `B0` com cogumelo vermelho vivo, gola/bloco NF pretos e ferragens metálicas/latão em todos os caminhos de renderização (`Panel3D` e catálogo Vercel).
- [x] `0` colisões cabo-dentro-de-cabo (`test:native-wires-3d` com verificação geométrica cápsula-a-cápsula estrita nos 35 cabos), `0` colisões com motor e `0` penetrações na chapa.
- [x] Curvas C¹ suaves nos cabos e saída limpa para cima nos bornes superiores de `XG`.
- [x] Barra da demonstração apenas com `3D / Ladder / GRAFCET` e `Play / Pause` em desktop e telemóvel (`390 px`).
