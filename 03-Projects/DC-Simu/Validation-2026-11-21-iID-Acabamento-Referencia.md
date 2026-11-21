---
type: validation
status: IMPLEMENTED_PENDING_VISUAL_APPROVAL
created: 2026-11-21
updated: 2026-11-21
tags: [dc-simu, schneider, iid, acabamento, manipulo, visitrip, validacao]
---
# Schneider iID 4P — fidelidade visual e mecânica à referência (v2)

## Resultado

O diferencial `residualBreakerSchneiderIid4p` (Schneider Electric Acti9 iID 4P 40A 30mA Tipo AC, ref. `A9R11440`) foi reconstruído a partir da malha STEP original (`MCADFD0001753`, sem sobreposição de correções antigas) e afinado para reproduzir com fidelidade a fotografia de referência do produto real:

- **Manípulo, berço e indicador VisiSafe (`O.OFF` / `I.ON`):**
  - Substituído o tambor sobredimensionado (`R ≈ 11,9 mm`) que sobressaía abaixo do rebordo frontal por um tambor concêntrico contido no berço (`R = 8,50 mm`, largura `9,50 mm`, `y_min ≈ 26,5 mm` com folga de `5,5 mm` acima do rebordo `y = 21 mm`), aliado a um pescoço sólido fechado e pega antracite mate (`#383e45`), garantindo zero transparência e zero passagens visuais para o interior em OFF, ON e TRIP.
  - Berço fixo moldado em branco acetinado contínuo com a carcaça (removendo o artefacto cinzento esférico anterior) e cinemática corrigida para o eixo real do cubo (`(-26,90, 35,00, 60,50) mm`, curso `66°`), colocando a pega na posição correta em OFF (baixo), TRIP (horizontal) e ON (cima).
  - Faixas **VisiSafe** convertidas de placas planas flutuantes para setores cilíndricos curvos concêntricos (`R = 8,68 mm`, `O.OFF` verde `#0e7d40` em OFF/TRIP e `I.ON` vermelho `#c92228` em ON), sem colisões nem oclusões.
- **Botão de ensaio `T` e janela VisiTrip:**
  - Cavidade fechada (`schneider_test_recess`, `z = 66,2..69,1 mm`) que veda integralmente a abertura STEP e elimina a transparência amarela das patilhas traseiras.
  - Botão `T` 3D sólido com chanfro suave (`RoundedBoxGeometry`) saliente `~2,2 mm` e letra `T` gravada em relevo centrado.
  - Acrescentada a janela **VisiTrip** funcional imediatamente acima do degrau frontal (`x = -26,9 mm, y = 47,05 mm`): branca em serviço normal (OFF/ON) e vermelha viva (`#d92027`) em disparo diferencial (TRIP).
- **Acabamentos da carcaça, bornes e serigrafia:**
  - Oito poços de parafuso profundos (`Ø 7,2 mm`, `~5,2 mm` de profundidade até à cabeça, mantendo `~18 mm` livres face às cavidades dos condutores) com colarinhos brancos chanfrados e parafusos de aço zincado (`#d8dde0`) com fenda combinada PZ2.
  - Suavização da aresta horizontal simplificada na face inferior dos polos 2–4, substituição do degrau negro duro por um friso chanfrado limpo a 45° com linhas cinzento-claras de moldagem, juntas intermodulares, moldura lateral esquerda e patilhas DIN superiores amarelas visíveis (`y_max ≈ 88,7 mm`).
  - Serigrafia frontal e lateral redesenhada com escala uniforme em píxeis/mm (eliminando o achatamento horizontal): `N` azul Schneider no canto superior e inferior esquerdo, numeração `1/3/5` e `2/4/6`, bloco técnico `A9R11440 · 40A IΔn 30mA 400V~ · IEC/EN 61008-1 · T Regular test`, esquema unifilar 4P, símbolo Tipo AC e faixa verde `Schneider Electric · iID`.

Não se alteraram as oito interfaces elétricas dos condutores, a escala nominal física (`72 × 85 × 73,5 mm`), a compatibilidade com o Editor 3D/Admin nem o acabamento do iDPN Vigi.

## Ficheiros alterados

- `dc-simu/src/three/schneiderRcdModel.ts`: acabamento v2 (`IID_FINISH_REV = 8`), suavização da face inferior, tambor concêntrico fechado, VisiSafe curvo, janela VisiTrip viva, botão `T` em cavidade selada e oito poços de parafuso com colarinhos.
- `dc-simu/src/three/protectionMarkings.ts`: serigrafia frontal/lateral sem distorção de aspeto, `N` azul, bloco técnico, numeração dos bornes e letra `T` em relevo.
- `dc-simu/scripts/build-schneider-rcd-glb.mjs`: reconstrução determinística a partir do STEP/GLB base (`--refresh-iid-barrel`), posicionamento das patilhas amarelas superiores e atualização do manifesto de proveniência.
- `dc-simu/public/models/protecao/schneider-acti9-iid-4p.glb` e `schneider-acti9-rcd-sources.json`: modelo GLB (`1 083 880` bytes, SHA-256 `955cd8ac8409277b62b6fc2e9a003a3736edd9f17eb1a5ee4ff5369d137668d6`) e proveniência STEP (`MCADFD0001753`) verificados.
- `dc-simu/public/component-covers/residualBreakerSchneiderIid4p.webp`, `front/residualBreakerSchneiderIid4p.webp` e `manifest.json`: capas perspetiva e frontal ortográfica regeneradas e inspecionadas visualmente.
- `dc-simu/scripts/meters-schneider-smoke.ts` e `scripts/iid-handle-closure-ui-smoke.mjs`: novas verificações automatizadas para tambor contido no berço, VisiSafe curvo, VisiTrip branco/vermelho, poços de parafuso, cavidade do botão `T`, Admin 3D e exportação para catálogo.

## Verificações e evidências

- `npm run test:meters-schneider`: **61/61 verificações aprovadas** (geometria, bornes, proveniência STEP/GLB, materiais distintos, 8 poços de parafuso sem obstrução, cavidade `T`, VisiTrip, contenção do tambor e eixo real em OFF/ON/TRIP).
- `npm run test:iid-handle-closure-ui`: **29/29 verificações de interface aprovadas** (Painel 3D em OFF/ON/TRIP com 9 raios sem visão do interior, VisiSafe curvo visível, VisiTrip branco `ebeeeb` em OFF/ON e vermelho `d92027` em TRIP, clique no manípulo, Admin 3D com rotação concêntrica e gravação/reabertura, exportação para catálogo local, zero exceções React/WebGL).
- `npm run test:meters-schneider-admin-ui` (secção `residualBreakerSchneiderIid4p`): **aprovada** (geometria partilhada, 8 bornes alinhados, ensaio físico `T`, gravação/reabertura e bake/publicação).
- `npm run test:builtin-sync`: **1001 verificações OK** (129 integrados, 78 com GLB).
- `npm run test:cover-version`: **OK**.
- `npm run typecheck` (`tsc -b`) e `npm run test:hooks` (`eslint --max-warnings 0`): **aprovados** (0 erros, 0 avisos).
- `npm test` do cofre BrainNet: **18 aprovados, 0 falhas** (27 específicos Windows ignorados em Linux).
- Capas regeneradas via `COVERS_CHANNEL=bundled node scripts/build-component-covers.mjs --only residualBreakerSchneiderIid4p` (`capa 5 KiB, frontal 13 KiB`) e revistas visualmente.

Capturas na aplicação real: [OFF em perspetiva](dc-simu/docs/validation/iid-photo-finish/off.png), [ON](dc-simu/docs/validation/iid-photo-finish/on.png), [disparado (VisiTrip vermelho)](dc-simu/docs/validation/iid-photo-finish/trip.png), [vista frontal](dc-simu/docs/validation/iid-photo-finish/front.png) e [resultados medidos](dc-simu/docs/validation/iid-photo-finish/results.json).

## Estado e pendências

**Implementado, testado e publicado:** código, modelo GLB, capas e validação comités e publicados em `dc-simu` e `BrainNet`. **Aprovação visual final:** pendente confirmação do utilizador no ambiente de produção.
