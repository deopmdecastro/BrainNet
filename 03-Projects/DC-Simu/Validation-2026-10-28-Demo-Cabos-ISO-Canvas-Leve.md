---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, landing, demo, cabos, 3d, performance, validation]
---
# Validação 2026-10-28 — Demo da landing: cabos organizados, ISO e canvas leve

**Commit dc-simu:** `4dd9821` (main, push ✔, carimbo #94)
**Tipo:** Revisão da demonstração da landing (Partida direta)

## Pedido do utilizador
- Cabos nunca podem atravessar os componentes; organizar fios/cabos.
- Motor na vista isométrica.
- GRAFCET/Ladder da demo com menos ferramentas — ambiente de visualização com a cara do editor real.
- Renderização mais leve («está meio pesado»).

## Implementado

### 1. Routing 2D sem atravessar equipamentos (`src/project/nativeRouting.ts`, novo)
- Router determinístico cozido na semente do projeto nativo:
  - **Candidatos ortogonais Manhattan** (H-V-H, V-H-V, H-V-H-V-H) sobre faixas a meio/quartis **e canais livres junto às arestas** dos equipamentos (`edgeChannels`).
  - Cada candidato é testado contra as caixas dos componentes com margem de 14 px (excepto os dois equipamentos-limite).
  - Seleção: zero atravessamentos → faixa menos usada → traçado mais curto.
- Resultado cozido em `waypoints` por cabo — o editor continua a poder editar ponto a ponto.
- **Verificação funcional:** `nativeWireCrossesFree` corre no `landing-demo-smoke.ts` (33 cabos, 0 atravessamentos).

### 2. Cabos 3D em calhas (`src/three/wireGeometry3D.ts`)
- `trunkLaneHints(obstacles)` descobre as faixas horizontais livres entre filas de equipamentos.
- O corpo dos cabos automáticos passa a correr na calha mais próxima do nível médio das pontas (`trunkHint`), com afastamento estável por cabo (`trunkSpread` ±3,2 cm → fios paralelos não se pisam).
- `clearObstacles` mantém a profundidade: nenhum corpo de cabo atravessa a chapa nem os componentes.

### 3. Vista isométrica na demo (`src/schematic/SchematicView.tsx`)
- Quando `demoMode`, o tilt 2D arranca em `{ yaw: -45, pitch: 35 }` (preset ISO do cubo de vista) — o painel/motor aparecem logo em perspetiva.

### 4. Menos ferramentas na demo
- **Toolbar:** `viewControls` em demo passa a ter **só zoom** (sem grelha/ímã/passo); no editor completo nada muda. `grid` em `ViewControlsProps` passou a ser opcional (`toolbarKit`).
- **Painel 3D:** botão «+ Comentário» escondido em `demoMode`.
- (Mantidos os gates anteriores: arrastar/editar/mutar bloqueado na demo, paletas fora, etc.)

### 5. Render mais leve
- Canvas do Painel 3D com `dpr={[1, 1.5]}` e `powerPreference: 'high-performance'` (antes herda 1–2).

### 6. Correção JSX
- `Landing.tsx` hero: `</span>` → `</div>` (quebrava o typecheck).

## Verificação
- `typecheck` limpo; `npm test` OK.
- `landing-editor-showcase-smoke.mjs`: 6 asserts novos PASS (53 no total).
- `landing-demo-smoke.ts`: 2 asserts funcionais novos PASS (routing).
- Loop completo de ~70 suites: sem falhas (Chromium do Playwright reinstalado entre execuções).

## Repo multi-sessão
- Tip remoto verificado antes de editar (`d474cf9` inalterado desde o último push nosso).
- `.git` local tinha evaporado de novo → recovery padrão + `read-tree`.
- URL correta: `github.com/deopmdecastro/dc-simu.git` (não `danicunhac`).
