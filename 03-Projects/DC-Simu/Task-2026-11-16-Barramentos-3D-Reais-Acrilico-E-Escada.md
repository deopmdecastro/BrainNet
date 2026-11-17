# Task — 2026-11-16 — Barramentos 3D reais (Terra PE, Neutro N, Fase com acrílico e Fases em escada)

## Contexto
Criação de quatro barramentos industriais 3D realistas na secção `Bornes e barras`, com texturas PBR digitalizadas, bornes reais ligáveis em 2D/3D, funcionamento elétrico real (continuidade, propagação de fases, medição no multímetro e deteção de curtos) e configuração completa no Inspetor.

## Alterações efetuadas (`dc-simu` — release `#199` / `mwkp92gt`, commit `9edc8d2`)
1. **`src/three/busbarParts.ts` e `scripts/build-busbar-glb.ts`** (novos):
   - Geometria CAD paramétrica à escala milimétrica real para os barramentos unipolares isolados em poliamida PA66 marfim com orelhas laterais M4 oblongas, barra maciça perfurada de latão CuZn39Pb3, parafusos M4 roscados e tampa superior de encaixe em acrílico translúcido de `9,6 mm` (12 bornes = `128 × 36,5 × 13 mm`, corpo `98 mm`, entre-eixos M4 de `115 mm`):
     - `earthBar` — **Barramento de terra (PE)** com acrílico **verde** translúcido fixo (`PE1…PEn`).
     - `busbarNeutral` — **Barramento de neutro (N)** com acrílico **azul** translúcido fixo (`N1…Nn`).
     - `busbarPhaseAcrylic` — **Barramento de fase (L)** com acrílico translúcido de **cor selecionável** no Inspetor (vermelho, amarelo, verde, azul, castanho L1, preto fumado L2, cinzento L3, laranja comando, transparente e cor personalizada; bornes `L.1…L.n`).
   - Geometria CAD paramétrica do **`busbarPhaseStepped` — Barramento de fases em escada** (tipo modular DIN 125 A): suportes laterais PA66 RAL 7035 com pés DIN, barreiras dielétricas anti-arco, 2/3/4 barras maciças de latão escalonadas (por omissão `4P`: `L1`, `L2`, `L3`, `N`, cada uma com furo de entrada M6 de 25 mm² e saídas M5 com parafusos zincados) e tampa articulada em policarbonato cristalino com rebordo fumado.
   - Exportação dos 4 GLB oficiais em `public/models/bornes-e-barras/` e das respetivas capas 3/4 e frontais em `public/component-covers/` (52/52 modelos com GLB real).
2. **`src/three/Busbar3D.tsx` e `src/three/Panel3D.tsx`**:
   - Aplicação dos mapas PBR reais da biblioteca local (`latao`, `aco-inox`, `plastico-claro`) combinados com micro-relevo escovado/injetado e `MeshPhysicalMaterial` translúcido (`userData.keepTransparent` preservado em `applyRenderMode`).
   - Dobradiça superior com amortecimento crítico (`0° ↔ 92°`) no barramento em escada, abertura/fecho por duplo clique em 3D ou pelo Inspetor, ocultação/exibição imediata da tampa (`coverVisible`) e passagem transparente do raycast em modo de cablagem/sonda para ligar todos os bornes com ou sem tampa.
3. **`src/electrical/{factory,engine,phases,meterModel,iecAssociation}.ts` e `src/utils/errorDetection.ts`**:
   - Continuidade real em todos os bornes das barras unipolares (`earthBar`, `busbarNeutral`, `busbarPhaseAcrylic`) e continuidade independente por degrau isolado no repartidor em escada (`L1.*`, `L2.*`, `L3.*`, `N.*`).
   - Propagação real de fases (`L1`/`L2`/`L3`/`N`/`PE`) e tensão CC (`+24 V`), corte real quando a fonte/disjuntor a montante abre, modo opcional de alimentação direta no Inspetor, leituras exatas no multímetro (`400 V AC` fase–fase, `230,9 V AC` fase–neutro) e deteção de curtos entre fases.
4. **`src/store/useSimStore.ts`, `src/components/{BusbarControls,Sidebar}.tsx` e `src/schematic/{Busbar2D,SchematicView,symbols}.tsx`**:
   - Ações `setBusbarPoleCount` (`4…24` bornes nas barras unipolares; `4…16` bornes por barra e `2P`/`3P`/`4P` na barra em escada, preservando os cabos ligados e o histórico de desfazer) e `setBusbarAcrylicColor`.
   - Secção `Configuração do barramento` no topo do Inspetor (PT-PT, sem bordas de acento) com controlo do n.º de bornes, seletor de cores do acrílico (Fase), controlos **`Fechada` / `Aberta`** e **`Ocultar tampa` / `Mostrar tampa`** (Escada) e modo elétrico.
   - Vista ortográfica dinâmica `Busbar2D` sincronizada com o n.º de bornes, a cor do acrílico e o estado da tampa.

## Validação
- `tsc -b` + bundle ESM de produção (`esbuild`): OK (0 erros).
- `npx tsx scripts/smoke.ts`: OK (todos os testes passaram, incluindo 11 novas verificações de cotas 12P, cores PE/N/Fase, redimensionamento com preservação de cabos, 230,9 V AC / 400,0 V AC no multímetro, rotação horária de motor 3F, corte a montante e abertura/ocultação da tampa).
- `npm run test:style`: OK (`no-accent-border: ok`).
- `node scripts/build-component-covers.mjs --check`: OK (`52/52` capas e vistas frontais).
- Playwright visual e interativo em `1440×900` e `390×844`: 0 `pageerror`, `overflow: false`, tampas translúcidas com parafusos e barras de latão nítidos por dentro, abertura amortecida e ocultação da tampa confirmadas, cabos 3D centrados nos furos reais e simulação elétrica ativa sem erros nem avisos.
