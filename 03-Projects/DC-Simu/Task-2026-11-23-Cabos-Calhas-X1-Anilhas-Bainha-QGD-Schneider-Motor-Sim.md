---
project_id: BN-DCSIMU-001
type: task
status: DONE
created: 2026-11-23
updated: 2026-11-23
tags: [brainet, dc-simu, cabos, calhas, qgd, schneider, tia-portal, anilhas]
---
# Tarefa Concluída: Cabos nas calhas, X1 L/N/PE, anilhas IEC, bainha única, QGD 100 % Schneider e seletor do motor do simulador (2026-11-23)

## Pedido

1. Melhorar a passagem e a distribuição dos cabos **nas calhas** (corrigir erros).
2. Calha com dois tubos azuis: deve existir **apenas um** tubo até à saída do compressor.
3. O **borne do quadro para a maquete** que recebe a alimentação da ficha deve ser **fase (castanho/preto), neutro azul e terra**; a fonte distribui depois para os outros.
4. Melhorar a organização: **passar sempre em calhas quando der**.
5. Usar as **marcações/anilhas** já existentes nos inspetores dentro dos quadros (estilo CAB3/WIC, anilha por dígito — `IMG_5981.jpeg`).
6. Cabos das fichas: **dentro** do cabo os condutores vão sem isolamento individual; **fora**, 3 fios dentro de **um cabo isolado** (bainha única), não uma linha por condutor.
7. **Quadro geral (QGD): usar apenas Schneider.**
8. Criar a **parte visual para escolher o motor do simulador: TIA Portal ou DC-Simu** (`TiaPortalControls.tsx`, [[Validation-2026-11-22-Ligacao-TIA-Portal]]).
9. Gerar um **zip com o commit** no fim.

## Resultado por tarefa

| # | Estado | O que mudou |
| --- | --- | --- |
| 1 | Implementado | Cablagem de alimentação da maquete passa a ser calculada pelo `qeRouter` (calha de topo → riser → calha do destino → borne); nenhum troço atravessa a frente dos aparelhos. |
| 2 | Implementado | `AIR_TUBE` decorativa removida de `stampingBench.ts`; fica **um** tubo azul (PU, `bundleId: 'ar-comprimido'`) até à saída do compressor. |
| 3 | Implementado | Régua **X1** (rail A) com `L`, `N`, `PE`; `F-MAQ → X1.{1,2,3}` (fase preto/castanho, neutro azul, terra verde-amarelo) e `X1 → PS1.{L,N,PE}`. A fonte distribui para X20 (+24 V / 0 V / PE). |
| 4 | Implementado | Regra «borne → calha horizontal desse lado → riser → calha do destino → borne» aplicada à alimentação e às ligações interiores do QE1. |
| 5 | Implementado | Anilhas da bancada passam de `style: 'yellow'` para `style: 'iec'` (anilha por dígito, CAB3/WIC). |
| 6 | Implementado | `CableSheaths3D` no `Panel3D.tsx`: **um tubo por `bundleId`** com ≥ 2 condutores `sheathed`, com a bainha por condutor suprimida (`sheathedBundleIds`). |
| 7 | Implementado | QGD só Schneider: `ID_GERAL` → iDPN N Vigi C25 30 mA, `DPS1–4` → **Acti9 iPRD 1P** (tipo novo), `PM1` → **Acti9 iEM3255** (tipo novo). |
| 8 | Implementado | `EngineSelector` (rádio nativo em cartões) + `EngineBadge` no painel «Simulação»; mostra quem **está mesmo a comandar** (TIA sem ponte ligada não é o motor). |
| 9 | Pendente | Zip do commit gerado no fim da sessão. |

## Correção pedida a meio da tarefa — cabos dos sensores

**Pedido:** os sensores dos cilindros passam a ter o cabo a sair diretamente para os bornes do quadro, **sem ligação
com ponteiras em cima da saída dos sensores** (referência `IMG_5988.jpeg`: cilindro com cabo preto até ao borne).

**Feito:** os 22 cabos de sensores/cilindros (`feeder`, `drawerCylinder`, `press`, `arm`, `opticalSensor`,
`inductiveSensor`) passam a ter `fromEnd: 'none'` — o cabo sai do sensor e só recebe ponteira no borne do quadro
(`toEnd: 'ferrule'` / `'ferruleDouble'`). Nenhum outro cabo foi alterado (0 casos de `'none'` indevido).

## Ficheiros

**dc-simu**
- `src/electrical/stampingBench.ts` — X1 L/N/PE na rail A; `AIR_TUBE` removida.
- `src/electrical/stampingBenchWiring.ts` — cabos `qe1-maq-x1-{l,n,pe}` e `qe1-x1-ps1-{l,n,pe}`; X1 excluída do loop de campo; `SENSOR_CABLE_KEYS` e `fromEnd: 'none'` nos cabos dos sensores.
- `src/three/Panel3D.tsx` — `sheathedBundleIds`, `resamplePolyline`, `CableSheaths3D`.
- `src/store/useSimStore.ts` — anilhas IEC nos cabos da bancada.
- `src/electrical/stampingWallPanel.ts`, `src/project/nativeQuadroDistribuicao.ts` — QGD Schneider.
- `src/electrical/importedComponents.ts`, `src/types/imported.ts`, `src/three/protectionMarkings.ts`, `src/three/importedFinish.ts`, `src/three/combMount.ts`, `src/electrical/protectionSpecs.ts`, `src/electrical/realInterfaces.ts`, `src/data/imported-component-{models,terminals}.json`, `src/components/ProtectionControls.tsx` — novo **DPS Schneider Acti9 iPRD**.
- `src/electrical/factory.ts`, `src/three/modelPaths.ts`, `src/three/digitalMeterModel.ts`, `src/electrical/panelMeterModel.ts`, `src/electrical/engine.ts`, `src/electrical/builtinRuntime.ts`, `src/electrical/shortCircuitEngine.ts`, `src/electrical/iecAssociation.ts`, `src/components/inspectorStatePolicy.ts`, `src/components/PanelAccessoryControls.tsx`, `src/schematic/symbols.tsx`, `src/store/useSimStore.ts` — novo **medidor Schneider Acti9 iEM3255**.
- `src/components/EngineSelector.tsx` (**novo**), `src/components/TiaPortalControls.tsx`, `src/components/SimulationDock.tsx`, `src/components/Sidebar.tsx`, `src/index.css` — seletor visual do motor.
- `public/component-covers/{surgeProtectorSchneiderIprd,meterSchneiderIem3255}.webp` e `front/*.webp` — capas geradas.

## Verificações

- `NODE_OPTIONS=--max-old-space-size=6144 npm run typecheck` — OK.
- `npx tsx scripts/smoke.ts` — **todos os testes passaram** (inclui capas WebP dos dois tipos novos).
- `npx tsx scripts/quadro-distribuicao-smoke.ts` — verificações novas do QGD Schneider a passar; a falha «uma conta limpa não recebe QGD…» **já existe no HEAD** (reproduzida sem estas alterações).
- `npx tsx scripts/meters-schneider-smoke.ts`, `scripts/device-lcd-smoke.ts`, `scripts/imported-components-smoke.ts`, `scripts/native-sim-smoke.ts`, `scripts/terminal-strip-smoke.ts`, `scripts/solid-cables-meter-smoke.ts` — OK.

Ver [[Validation-2026-11-23-Cabos-Calhas-QGD-Schneider-Motor-Sim]].

## Pendências

- Confirmação visual em browser dos cartões do motor do simulador e da bainha única (capturas não tiradas nesta sessão).
- Revisão do encadeamento de PE da ficha no quadro da maquete (X1.3 → PS1.PE → X20.PE-IN) com o multímetro.
