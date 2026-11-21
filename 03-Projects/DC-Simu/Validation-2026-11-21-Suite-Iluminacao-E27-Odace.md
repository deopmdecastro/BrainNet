---
type: validation
status: IMPLEMENTED_PENDING_VISUAL_APPROVAL
created: 2026-11-21
updated: 2026-11-21
tags: [dc-simu, iluminacao, philips, schneider-odace, e27, iec-60617, validacao]
---
# Suíte de Iluminação — 3 Lâmpadas E27 (Philips) + 3 Interruptores Schneider Electric Odace

## Resultado

Foi criada a categoria dedicada **`lighting` («Iluminação»)** no DC-Simu com 6 componentes integrados de alta fidelidade 3D/CAD, fichas técnicas PDF oficiais incorporadas, simulação elétrica real a 230 V~ AC, símbolos IEC 60617 2D e exemplo pronto de comutação de escada:

- **Lâmpadas E27 já montadas em casquilho de parede com bornes `L` e `N` (64 mm largura × 64 mm profundidade):**
  1. `lampIncandescentE27` — **Lâmpada Incandescente E27** (*Philips Classic A60*, `40/60/75/100 W`, por defeito `60 W`, `2700 K`, cos φ `1,00`, `1 ano (~1 000 h)`, `0 %` poupança): ampola A60 em vidro transparente suave, pé de vidro, fios condutores, filamento helicoidal de tungsténio incandescente, casquilho roscado E27 em latão dourado e iluminação âmbar quente realista.
  2. `lampFluorescentE27` — **Lâmpada Fluorescente Compacta (CFL) E27** (*Philips Genie*, `8/12/15/20 W`, por defeito `12 W`, `2700/4000/6500 K`, cos φ `0,60`, `6–10 anos`, `até 80 %`): tubos triplos em U com brilho branco uniforme, balastro eletrónico ventilado com tampografia `PHILIPS Genie CFL` e arranque breve realista com pulso de ignição do balastro.
  3. `lampLedE27` — **Lâmpada LED E27** (*Philips CorePro LEDbulb A60*, `4/6/8/10 W`, por defeito `8 W`, `2700/4000/6500 K`, cos φ `0,70`, `15–25 anos`, `até 95 %`): cúpula opalina A60 suave, dissipador térmico com tampografia `PHILIPS CorePro LED` e acendimento instantâneo.
- **Interruptores de parede Schneider Electric Odace (RAL 9003, `85 × 85 × 38 mm`, `10 AX · 250 V~ 50 Hz`):**
  4. `wallSwitchSimple` — **Interruptor Simples** (`S520201`, 1 tecla circular basculante ±8,5°, bornes `L` e `1`).
  5. `wallSwitchDouble` — **Interruptor Duplo** (`S520214`, 2 teclas independentes `Tecla 1` e `Tecla 2` clicáveis separadamente no 3D e no inspetor, bornes `L`, `1` e `2`).
  6. `wallSwitchStaircase` — **Comutador de Escada** (`S520204`, contacto inversor SPDT real `L↔1` / `L↔2` com ícone `1 ⇄ 2` para comutação de escada a 2 pontos).
- **Simulação elétrica, inspetor, datasheets e IEC 60617:**
  - Energização real a 230 V~ AC entre `L` e `N` (recusa falta de neutro, 24 V DC e curto-circuito na mesma fase); cálculo de corrente `I = P / (230 · cos φ)` em `panelMeterModel.ts`; STOP apaga as lâmpadas conservando a posição mecânica dos interruptores.
  - Inspetor dedicado (`LightingControls`) com seleção de potência (W), temperatura de cor (K), fluxo luminoso (lm), equivalência incandescente, corrente, vida útil e indicador comparativo de poupança energética, além das 4 fichas técnicas PDF em `public/datasheets/lighting/` associadas em `DatasheetPanel.tsx`.
  - 6 símbolos IEC 60617 dedicados em `src/commands/` (`Iluminação`), conversão 3D → IEC em `fromPhysical.ts` e exemplo interativo pronto **«Comutação de escada (Iluminação)»** em `src/commands/examples.ts`.

## Validação executada

- `npm run typecheck` (`tsc -b`): **0 erros**.
- `npm run test:lighting` (`scripts/lighting-smoke.ts`): **49/49 PASS** (catálogo, GLBs, PDFs, 230 V~ AC vs 24 V DC vs sem neutro, Simples, Duplo 4 combinações, Comutação de Escada 4 combinações, correntes/fotometria e exemplo IEC 60617).
- `npm run test:lighting-ui` (`scripts/lighting-ui-smoke.mjs` em Chromium real): **33/33 PASS** (montagem dos 6 GLBs no `Panel3D`, serigrafia, cliques 3D reais nas teclas simples/dupla/escada, painel completo com as 3 lâmpadas acesas em simultâneo, biblioteca «Iluminação» e inspetor LED com atualização dinâmica de `10 W → 1055 lm`).
- `npm run test:builtin-sync`: **1033 verificações OK (135 integrados, 84 com GLB)**.
- `npm run test:cover-version`, `npm run test:inspector-contracts` (8/8), `npm run test:hooks` (0 warnings), `npm run test:commands-symbols`, `npm run test:manobra-gate`: **todos PASS**.
- Capas WebP estáticas e vistas frontais ortográficas geradas em `public/component-covers/` e validadas visualmente.

## Referências relacionadas

- [[03-Projects/DC-Simu/Validation-2026-11-21-iID-Acabamento-Referencia]]
