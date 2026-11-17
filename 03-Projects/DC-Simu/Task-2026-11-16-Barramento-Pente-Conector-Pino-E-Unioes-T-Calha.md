---
project_id: BN-DCSIMU-001
type: task
status: COMPLETED
created: 2026-11-16
updated: 2026-11-16
tags: [brainet, dc-simu, task, barramento-pente, conector, calha]
---

# Task — 2026-11-16 — Barramento tipo pente (1P/1P+N/3P/3P+N), conector de pino personalizável e corte de dentes em T nas calhas ranhuradas

## Contexto
Criação de dois novos componentes industriais 3D realistas na categoria `Bornes e barras` — **Barramento tipo pente (pino)** (`busbarComb`) e **Conector para barramento pente** (`combBusbarConnector`) — com geometria CAD paramétrica à escala DIN de `18 mm`, texturas PBR reais e serigrafia dinâmica, além de revisão e aperfeiçoamento do corte dos dentes/linguetas nas **uniões em T, L e cruz** das calhas técnicas ranhuradas (`cableDuct`) em 3D e 2D.

## Alterações efetuadas (`dc-simu` — release `#202` / `mwl6lkwd`, commit `adf9fbf`)
1. **`src/three/{combBusbarParts,combBusbarMarkings}.ts` (novos), `scripts/build-busbar-glb.ts` e `src/three/{Busbar3D,busbarParts,modelPaths,Panel3D,componentTurntable}.ts(x)`**:
   - **`busbarComb` — Barramento tipo pente (pino)** (`BP`, 12 módulos de série = `214 × 28 × 9,8 mm`, passo modular DIN `18 mm`, `2…24` pinos):
     - Perfil isolante em PVC autoextinguível RAL 9003/7035 com ranhura longitudinal, topos de proteção IP20 amovíveis (`endCaps`), septos dielétricos entre fases e barras laminadas internas de cobre eletrolítico Cu-ETP com pinos escalonados em Z e ponta chanfrada.
     - Quatro modos configuráveis no Inspetor: **Barramento único (`1P` · `L.1…L.n`)**, **Fase + Neutro (`1P+N` · `L1.k`/`N.k`, com neutro à direita ou à esquerda)**, **Trifásico (`3P` · `L1.k`/`L2.k`/`L3.k`)** e **3 Fases + Neutro (`3P+N` · `L1.k`/`L2.k`/`L3.k`/`N.k`)**, além de orientação dos pinos (`down`/`up`), calibre (`63 A · 10 mm²`, `80 A · 16 mm²`, `100 A · 25 mm²`) e conectores de alimentação acopláveis (`none`/`left`/`right`, cor única ou cores normativas IEC por fase, gerando bornes reais `IN.L` / `IN.L1…IN.N`).
     - Serigrafia frontal de alta resolução gerada dinamicamente (`lexman`, `sibratec`, `schneider`, `legrand`) com marcação `CE`, código de barras EAN, símbolo REEE, corrente/secção/tensão e identificação individual de fase em cada pino, aliada aos mapas PBR reais de cobre escovado (`cobre`) e PVC acetinado (`plastico-claro`).
   - **`combBusbarConnector` — Conector para barramento pente** (`CB`, `15,8 × 35,6 × 20,6 mm`):
     - Corpo isolado em poliamida PA66 com capuz arqueado serigrafado (`4–16□ 63A`, `6–25□ 80A`, `10–35□ 100A`), bocal cilíndrico frontal IP20 com anel de gaiola em latão e parafuso Pozidriv PZ2 M6 visível no interior, rebaixos de moldagem nos 4 cantos, rasgo lateral e lâmina chata estanhada com estrias horizontais de retenção (curva frontal ou reta, pino para baixo ou para cima).
     - Cor da carcaça PA66 personalizável no Inspetor (10 presets normativos — branco RAL 9010, cinzento RAL 7035, azul Neutro, castanho L1, preto L2, cinzento L3, vermelho, amarelo, verde PE, laranja comando — mais seletor livre de cor personalizada), atualizando em tempo real em 3D e 2D.
   - Exportação dos GLB `public/models/bornes-e-barras/{barramento-pente,conector-barramento-pente}.glb` e geração das capas de estúdio e vistas frontais WebP (`54/54` componentes com 3D real).
2. **`src/electrical/{factory,engine,phases,meterModel,iecAssociation,terminalClassification}.ts`, `src/utils/errorDetection.ts`, `src/store/useSimStore.ts`, `src/components/BusbarControls.tsx` e `src/schematic/{Busbar2D,symbols,cad3DImage}.ts(x)`**:
   - Continuidade elétrica real por barra isolada no `busbarComb` (incluindo bocais `IN.*` acoplados e modo opcional de alimentação direta) e entre `IN ↔ PINO` no `combBusbarConnector`, preservando alimentação de disjuntores a jusante (`fedBreakerInputs`), propagação de fases AC (`L1`/`L2`/`L3`/`N`) e CC (`+24 V`), medições reais no multímetro (`400,0 V AC` fase–fase, `230,9 V AC` fase–neutro), deteção de curtos entre fases e corte imediato ao abrir proteção/fonte a montante.
   - Ações com suporte de desfazer `updateCombBusbar` e `updateCombConnector` (preservando cabos ligados ao redimensionar ou alterar modo) e controlos dedicados em PT-PT no Inspetor sem bordas de acento.
   - Renderização vetorial frontal `CombBusbar2DView` e `CombConnector2DView` no Esquema 2D sincronizada com polos, cores, serigrafia e conectores.
3. **`src/schematic/{ductJunctions,PanelAccessories2D}.ts(x)` e `src/three/{enclosureParts,PanelAccessories3D}.ts(x)` — Corte de dentes nas uniões em T das calhas ranhuradas**:
   - Deteção rigorosa de uniões em **T**, **L** e **cruz (`+`)**, incluindo calhas rodadas em 3D (`viewOrientation.z`) e ramais encostados na grelha (`TOUCH_PX = 22`) ou com sobreposição parcial: na calha principal, destaca integralmente todos os dentes/linguetas e abre a parede na boca do T mantendo a parede oposta 100% intacta; na ponta do ramal (`endTrim`), apara dentes laterais e sobreposição coplanar de fundo para eliminar invasão do canal e *Z-fighting*.
   - Geometria 3D e 2D das linguetas enriquecida com cabeça alargada de retenção de cabos, linha de pré-corte na base, furação oblonga NFC 68-102 no fundo aberto e calibração de `bumpScale` à escala real do PVC RAL 7035.

## Validação
- `npx tsc -b` + bundle ESM minificado de produção (`esbuild`): OK (0 erros).
- `npm run test` (`scripts/smoke.ts`): OK (todos os testes passaram, incluindo `54/54` componentes 3D, auditoria de escala física `<6%`, 4 modos do barramento pente, cores e calibres do conector, `400,0 V AC` / `230,9 V AC` + rotação horária de motor 3F + corte a montante e corte de dentes em duplo T / `endTrim` / rotação 3D nas calhas ranhuradas).
- `npx tsx scripts/duct-resize-smoke.ts` (`61/61` OK) e `npx tsx scripts/panel-accessories-smoke.ts` (`34/34` OK).
- `npm run test:style`: OK (`no-accent-border: ok`).
- `node scripts/build-component-covers.mjs --check`: OK (`54/54` capas e vistas frontais).
- `scripts/inspector-sweep-ui.mjs`: OK (`busbarComb` 85 controlos, `combBusbarConnector` 22 controlos, `cableDuct` 40 controlos — 0 erros).
- Inspeção visual Playwright 3D e 2D frente às 5 fotos de referência: 0 `pageerror`, serigrafia/cobre/PBR fiéis, bocal Pozidriv e cor personalizável do conector validados e dentes das calhas ranhuradas cortados de forma limpa em todas as uniões em T.
