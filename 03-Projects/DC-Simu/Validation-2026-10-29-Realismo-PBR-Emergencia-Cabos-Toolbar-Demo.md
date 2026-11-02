---
project_id: BN-DCSIMU-001
type: validation
status: VALIDATED
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, 3d, pbr, emergency-button, cables, demo, toolbar, validation]
---
# Validação 2026-10-29 — Realismo PBR, botão de emergência fiel à referência, zero colisões cabo-a-cabo com curvas suaves e barra minimalista na demonstração

Relacionado com [[Task-2026-10-29-Realismo-PBR-Emergencia-Cabos-Toolbar-Demo]], [[Validation-2026-10-29-Landing-Sim-Cabos-Motor-Glow]], [[Design-Principles]] e [[Testing-Plan]].

**Commit `dc-simu`:** `3221cd8` (`main`, push concluído · carimbo `#101`)

## Causas-raiz diagnosticadas e resolvidas

1. **Botão de emergência `B0` preto e texturas opacas no simulador:**
   - **Causa-raiz:** no ficheiro CAD `public/models/comando/P20AKR-1.glb`, as 117 malhas frontais da cabeça do cogumelo (`mesh0_mesh`..`mesh0_mesh_116`, `z ∈ [+0,010; +0,0305]`) vinham classificadas com o material `Metal técnico` e mapas escuros, enquanto apenas um pino interno minúsculo usava `Cogumelo vermelho`. Adicionalmente, componentes publicados via catálogo (`CatalogComponent3D.tsx`) passavam apenas por `finishCadMaterial` genérico, e `StudioEnvironment` não chamava `invalidate()` após gerar o mapa PMREM em `frameloop="demand"`.
   - **Solução:** implementado `applyEmergencyButtonFinish` em `src/three/catalogMaterials.ts` (aplicado em `Panel3D.tsx`, `CatalogComponent3D.tsx`, `componentTurntable.ts` e `LandingShowcase.tsx`), separando geometricamente o cogumelo frontal em vermelho tráfego `#dc2626` (*clearcoat* `0,42`), gola e bloco NF em poliamida preta `#181a20`, clip metálico em aço `#dce2ea` e parafusos traseiros em latão `#d6b465`. Enriquecido `finishCadMaterial`, aplicado acabamento PBR em `TerminalAssembly3D`, chapa RAL 7035 acetinada, `ACESFilmicToneMapping` e `invalidate()` imediato no `StudioEnvironment`.

2. **Interseções cabo-dentro-de-cabo (`158 → 0`) e dobras em V nos bornes de `XG`:**
   - **Causa-raiz:** os 5 bornes superiores de `XG` (`powerSource3ph`, `localY = 0,91`, `normal = [0, 0, 1]`) não tinham componente Y na normal e ficavam ligeiramente mais perto da calha inferior (`-0,44`) do que da superior (`+1,21`, elevada pela altura de `PS1`), dobrando para baixo sobre a frente de `XG` antes de subir para `QG`. Nas calhas partilhadas, o passo de `trunkSpread` (`1,2 mm`) era inferior ao diâmetro exterior dos cabos (`2,45–3,07 mm`), gerando 158 pares de cabos sobrepostos.
   - **Solução:** adicionado `localY` a `WireEndpoint3D` para encaminhar bornes superiores diretamente para a calha superior e criado `buildAllWirePaths3D` em `src/three/wireGeometry3D.ts`: coloração por intervalos por calha dentro do corredor livre `[yFloor, yCeil]`, separação em dois planos Z (calhas horizontais atrás e subidas/descidas verticais à frente) e relaxação geométrica 3D cápsula-a-cápsula com suavização C¹ em `cableCurve3D`.

3. **Barra de ferramentas da demonstração:**
   - **Solução:** em `demoMode` (`Toolbar.tsx`, `SchematicView.tsx`, `App.tsx`), a vista abre diretamente no ambiente **3D** (sem a barra flutuante `Esquema 2D / Visualização 3D`), oculta a segunda linha da barra e emblemas auxiliares, e exibe apenas **`3D`**, **`Ladder`**, **`GRAFCET`** e **`Play` / `Pause`** (ajustados sem transbordo desde `390 px` até desktop `1440 px`).

## Evidência de verificação

### DC-Simu (`03-Projects/DC-Simu/dc-simu`)
- `npx tsc --noEmit`: **0 erros**.
- `npm run test:style`: **PASS** (`no-accent-border: ok`).
- `npm run test:native-wires-3d`: **7/7 PASS**, incluindo:
  - **`0` colisões cabo-dentro-de-cabo** nos 35 cabos de «Partida direta» (reduzido de 158 para **0** pares com folga estrita entre bainhas de isolamento),
  - saída limpa ascendente nos 5 bornes superiores de `XG`,
  - `0` cabos a passar pelo motor,
  - `z mínimo = -0,182 >= -0,250` (nenhum cabo nem ponteira atravessa a chapa).
- `npm test`, `test:native-sim`, `test:emergency-actuator`, `test:terminal-geometry`, `test:terminal-seat`, `test:motor`, `test:glow`, `test:landing-hero`, `test:landing-editor` (64/64 PASS), `test:landing-demo`, `test:builtin-sync` (359 verificações), `test:editor3d-functional` e `test:logo-editor`: **100 % PASS**.
- Build de produção (`vite build --minify false`): **1346 módulos transformados sem erros**.
- Verificação visual WebGL Playwright (`390×844` mobile e `1200×760` desktop): barra da demonstração exclusivamente com `[3D | Ladder | GRAFCET]` e `[Play | Pause]` (`right = 356 px <= 390 px` em mobile), botão de emergência `B0` vermelho/preto/latão idêntico à referência, materiais PBR nítidos e cabos suaves sem cruzamentos internos.

### BrainNet (raiz do cofre)
- `npm test` e `npm run check`: executados e validados sem erros.
