---
type: validation
status: IMPLEMENTED
created: 2026-11-23
updated: 2026-11-23
tags: [dc-simu, performance, 3d, threejs, esteiras, build, lazy-loading, otimizacao]
---
# Otimização 3D adaptativa, lazy loading, realismo das esteiras e correção do build

## Pedido

1. Otimizar o desempenho do **DC-Simu** em projetos pequenos e montagens 3D complexas (ex.: Maquete Estampagem com 168 peças e >100 cabos), reduzindo consumo de CPU/GPU e memória, eliminando re-renderizações desnecessárias, aplicando *lazy loading* e garantindo FPS estável mesmo em computadores modestos.
2. Corrigir o erro de build de produção (Vercel / `tsc -b`).
3. Refinar o realismo estrutural das esteiras porta-cabos 3D (junções em T, descidas verticais, cantoneiras aparafusadas, tampas terminais e corte dos feixes de cabos), mantendo todas as funcionalidades e a identidade visual.

## Solução (`dc-simu` `a86bd964`)

### 1. Desbloqueio do build (`src/electrical/stampingBenchWiring.ts`)
- Corrigida a cor literal `'#2563eb'` (incompatível com o tipo `WireColor`) para `'blue'` na ligação do tubo pneumático e removida a constante `trim` não utilizada, restaurando `tsc -b` com zero erros.

### 2. Infraestrutura partilhada de otimização 3D (`src/three/renderOptimization.ts`)
- **Perfil de qualidade adaptativo (`detectDevicePerformanceTier` + `resolveSceneQuality`)**: ajusta automaticamente `dpr`, resolução do mapa de sombras (`1024×1024` vs `2048×2048`), segmentos radiais/tubulares dos cabos, projeção de sombras em fios finos e `steadyRunFps` consoante o número de componentes/cabos da cena e a capacidade do dispositivo (ou WebGL por software).
- **Cache LRU com gestão de memória GPU (`DisposableLruCache`)**: aplica limite máximo e invoca `.dispose()` explícito em `BufferGeometry` expulsas, evitando fugas de memória VRAM em sessões longas de edição.
- **Pooling de materiais e geometrias**: `getSharedWireMaterial`, `getSharedSheathMaterial`, `SHARED_WIRE_HIT_MATERIAL` (`colorWrite: false`), `SHARED_WIRE_SELECT_MATERIAL`, `SHARED_UNIT_BOX_GEO`, `SHARED_UNIT_CYL_10_GEO`, `SHARED_HEX_BOLT_GEO` e `getSharedPbrTextures` (reduz ~200 materiais independentes de cabos para ~10–15 instâncias partilhadas).

### 3. Otimização de `Panel3D.tsx`, `FactoryEnvironment3D.tsx`, `StructuresDevices3D.tsx` e `Toolbar.tsx`
- **Lazy loading**:
  - 12 módulos 3D especializados carregados sob pedido via `React.lazy` + `<Suspense fallback={null}>` (`StructuresDevices3D`, `FactoryEnvironment3D`, `MechatronicsDevices3D`, `LightingDevices3D`, `TriProofBatten3D`, `JunctionWagoDevices3D`, `WireMeshTrayDevices3D`, `ConduitDevices3D`, `ConveyorDevices3D`, `HydraulicsDevices3D`, `PneumaticsDevices3D`, `FaultEffects3D`).
  - `ComponentTableDialog` carregado sob pedido em `src/components/Toolbar.tsx`.
- **Eliminação de loops `useFrame` e re-renders desnecessários**:
  - `OrientedInstance`: removido o `useFrame` por componente (~336 callbacks/frame eliminados na Maquete Estampagem) e substituído o *merge* estático por até 2 passagens em `requestAnimationFrame`; `<RenderModeWatcher>` só monta quando o modo não é `'solid'` ou há `bodyColor`.
  - `Wires3D`: `wireGeomCache` migrado para `DisposableLruCache` (capacidade 450 com `.dispose()` automático), extração de `memo(WireBodyMesh3D)`, `TubeGeometry` memorizadas e materiais do pool partilhado.
  - `Panel3D`: memorizados `ductOpeningsMap` (evita recálculo O(N²) por frame/seleção), `basePivotTuples` (51 referências `[x,y,z]` estáveis que ativam `React.memo` nos 7 componentes de `StructuresDevices3D` e demais dispositivos) e `wireDrawObstacles` (calculado apenas quando a ferramenta de desenho/religação de cabos está ativa).
  - `FaultEffectsLayer`: mapa O(1) de terminais e `return null` imediato em cenas saudáveis (não carrega `FaultEffects3D` nem anima partículas quando não há curto-circuito nem sobreaquecimento).
  - `ShadowsOnDemand` e `RunFrameBudget`: atualização de sombras sincronizada com o fim do carregamento dos modelos (`modelsLoading`) e cadência adaptada ao perfil de qualidade (`steadyRunFps`).
- **Texturas PBR persistentes (`FactoryEnvironment3D.tsx`)**: cache singleton `getSharedFactoryTextures()` preserva os mapas 1024×1024 de betão/paredes/sinalização entre trocas de vista/separador sem regeneração nem *stutter*.

### 4. Realismo das junções de esteiras 3D (`src/schematic/ductJunctions.ts` + `src/three/StructuresDevices3D.tsx`)
- Distinção rigorosa entre ramal **vertical** a chegar por baixo do fundo (`arrivesFromBelowFloor` → abre janela no fundo com moldura de borracha e suportes inferiores) e ramal **horizontal** em T (`endTrim` mínimo na ponta encostada à parede sem furar o fundo).
- Cantoneiras aparafusadas em L (`TrayTeeCornerBracket`) nas junções horizontais, tampas terminais nas pontas abertas e feixes `TrayCableBundle` aparados nas zonas de corte/descida.
- Todos os 7 componentes exportados em `StructuresDevices3D.tsx` envolvidos em `React.memo` e a partilhar geometrias/materiais/texturas.

## Verificação

- `npx tsc -b` (com `NODE_OPTIONS="--max-old-space-size=1536"`): **0 erros**.
- `npx eslint` nos 7 ficheiros alterados/criados: **0 erros, 0 avisos**.
- `npm run test:render-optimization` (`scripts/render-optimization-smoke.ts`): **15/15 PASS** (perfis de qualidade pequeno/grande/baixo-desempenho/software, LRU com `.dispose()`, pooling de materiais e geometrias, junções horizontais vs verticais e desempenho na Maquete Estampagem — 18 calhas/esteiras e 38 aberturas em ~1,0 ms).
- `npm run test:maquetes`: **9/9 PASS** (168 componentes, 59 tipos, orientações das esteiras, aberturas `top`/`bottom`/`floor`/`endTrim`, folga de 20 mm nas tomadas).
- `npm run test:maquetes-build`: **PASS** (168 e 6 componentes no bundle minificado).
- `npm run test:native-wires-3d` (`native-wires-3d-smoke.ts`), `test:wire-lacing`, `test:wire-isolation` (18/18), `test:sockets` (15/15), `test:cad-surface`, `test:enclosure-move` (10/10): **todos PASS**.
- Verificação de *code-splitting* e minificação ESM (`esbuild --bundle --splitting --minify`): **185 chunks** gerados sem erros em 1,2 s, com separação efetiva dos 12 módulos 3D lazy e `ComponentTableDialog`.
  - Nota de ambiente: a sandbox local dispõe de 1,98 GB RAM / 0 swap, abaixo do pico de heap do Rollup/Vite full build (~1,3+ GB); no Vercel (8 GB RAM) o `npm run build` (`tsc -b && npm run test:maquetes-build && vite build`) corre sem esta limitação.
