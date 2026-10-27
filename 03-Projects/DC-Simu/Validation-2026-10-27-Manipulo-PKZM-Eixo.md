---
project_id: BN-DCSIMU-001
type: validation
status: ACTIVE
created: 2026-10-27
updated: 2026-10-27
tags: [brainet, dc-simu, editor3d, catalog, componentes, protecao, manipulo, animacao]
---
# Validação 2026-10-27 — Manípulo do PKZM C-10: eixo no cubo do botão

Pergunta do responsável: **«Já terminou de fazer a correção da animação do movimento do disjuntor motor?»**,
com duas fotografias — o modelo com um **ponto verde brilhante** ao lado do manípulo (`IMG_5218`) e a
captura do editor, o mesmo modelo **sem** esse ponto (`IMG_5206`).

Conclusão: a animação **estava** feita, mas continuava **errada** — o manípulo girava em volta de um ponto
que não era o cubo do botão, e por isso orbitava. A luz verde **não existe** no código publicado; vinha de
uma versão em cache no telemóvel (ver «Luz verde» abaixo).

## Como foi observado

- Editor de componentes (`/admin/editor/<id>`) com o PKZM integrado em Chromium headless (Playwright),
  vista **Frente**, `/api/*` e rede externa bloqueados.
- Leitura numérica da cena por `window.__ceRig` (só em `vite dev`): `pivotOf`, `restBox`, `vars.closed`,
  `dcsimu_handle_1.rotation.z` e caixas em espaço do componente.
- Medição da malha do GLB **em repouso**, fora da rig (`buildDefinitionObject` + `loadGlbAssets`), para não
  medir uma pose já animada.
- Duas capturas por ensaio (OFF e ON) com um botão de vista premido depois de cada mudança, porque o
  `frameloop="demand"` do editor não repinta só por alterar variáveis.

## Problemas encontrados (antes)

| # | Onde | Observação |
| --- | --- | --- |
| 1 | `componentRig.ts` | A caixa de repouso do manípulo era medida com `matrixWorld` **no instante em que a rig é construída**. Como a rig é reconstruída sobre o **mesmo** objeto 3D (muda a definição, não o modelo), nesse instante os nós já traziam a rotação da animação anterior: a caixa vinha rodada 90°. |
| 2 | `modelPaths.ts` / `builtinComponents.ts` | O pivô (`x 0,2275 · y 0,7091` da caixa do manípulo) tinha sido convertido de um ponto transcrito do STEP, não medido no cubo. Em repouso dá **(−3,31 · 45,90) mm**, quando o cubo do botão está em **(2,60 · 41,30) mm** — 7,4 mm de erro. |
| 3 | `scripts/build-pkzmc10-glb.py` | A fração publicada vinha de `handle_hinge_fraction` calculada a partir de um ponto escrito à mão (`[2,6, −4,6, 0] − origin`), sem relação com a malha do aro; foi a origem do valor errado. |
| 4 | Testes | Nenhuma verificação cobria «rig reconstruída sobre um modelo já animado» nem a charneira do painel 3D — o defeito passava nos testes. |

## Alterações implementadas

### `dc-simu`

- `src/catalog/basePose.ts` (novo) — `stampBasePose`/`restoreBasePose`: a pose de repouso de cada nó é
  guardada em `userData` quando o modelo é montado a partir da definição (antes de qualquer animação) e
  reposta antes de medir. `userData` sobrevive a `clone()`.
- `src/catalog/definition.ts` — `buildDefinitionObject` carimba a pose de repouso de todos os nós.
- `src/catalog/componentRig.ts` — a caixa de repouso e o centro de um controlo passam a ser medidos com as
  **matrizes locais** (`matrixToRoot`), depois de repor a pose do GLB; `parentToRoot` também vem das
  matrizes locais. Deixa de depender de `matrixWorld` estar fresco.
- `src/three/modelPaths.ts` — `BREAKER_HANDLE_RIG.motorBreakerPkzmC10.hinge = { x: 0.426, y: 0.5, z: 0.5 }`
  (centro do aro, 15,5 × 15,5 mm, dentro da caixa do manípulo 29,755 × 22 mm). O editor herda o valor
  (`builtinComponents` copia `rig.hinge` para `motion.pivotRel`), o painel 3D usa-o em
  `extractBreakerHandle`.
- `scripts/build-pkzmc10-glb.py` — o eixo passa a ser o **centro da malha do aro** (`collar`), medido no
  próprio modelo, em vez de um ponto transcrito; `handle_hinge_fraction` sai coerente com o código.
- `scripts/motion-smoke.ts` — novas verificações: cubo fora do centro da caixa (o cubo não sai do sítio e o
  braço roda), rig reconstruída sobre modelo já animado (mesmo pivô, mesma caixa, manípulo pousado) e
  charneira do painel 3D no cubo (roda 90° e o cubo fica no sítio).

## Verificações

| Verificação | Resultado |
| --- | --- |
| `npm run test:motion` | 27 verificações OK (5 novas) |
| `npm run test:builtin-sync` | 355 OK (72 integrados, 21 com GLB) |
| `npm run test:editor3d-functional` | 29 OK (20 modelos, 142 bornes) |
| `npm run typecheck` (`tsc -b`) | sem erros |
| Pivô no editor, OFF e ON | `(2,60 · 41,30 · 32,80)` mm — coincide com o centro do aro |
| Capturas Frente OFF/ON | OFF: alavanca deitada sobre o aro · ON: alavanca de pé, centrada no aro (antes ficava em cima à esquerda, com o aro vazio) |
| LED verde na frente | `def.lights = []`, GLB sem `emissiveFactor` e sem nó `led`/`lamp`; `EquipmentStatusLights` devolve `null` para disjuntores |

## Luz verde da fotografia

O ponto verde de `IMG_5218` é o par `EquipmentStatusLights` (esfera `#22c55e` com halo) que foi **removido**
em `c44c419`; na versão publicada não existe nenhuma luz na frente do PKZM. A explicação coerente com as
duas imagens é uma **página/PWA em cache** no telemóvel: o editor no computador já servia o build novo.
O carimbo de release sobe para **#81** (`mvqmhqp5`) neste commit, o que invalida o precache na próxima
visita; ainda assim, pedir uma atualização forçada de `dc-simu.vercel.app` no telemóvel.

## Pendências

- **Confirmar no telemóvel** (atualização forçada de `dc-simu.vercel.app`) que o ponto verde desapareceu e
  que o manípulo roda sobre o aro também no **Esquema 3D** do simulador.
- Rascunhos de PKZM guardados **antes** de `c44c419` mantêm o controlo antigo (eixo X, pivô a 50 %):
  reimportar o componente integrado.
- `HANDLE-AXIS-02` — os restantes disjuntores (Easy9, Steck, WEG, ECB) continuam com frações transcritas à
  mão; aplicar o mesmo método (medir o cubo na malha) quando houver STEP/GLB de origem.

[[Backlog]] · [[Decision-Log]] · [[Validation-2026-10-27-Botao-Emergencia]] · [[Validation-2026-10-27-Cabos-Painel-Lateral]]
