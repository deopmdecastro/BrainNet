---
project_id: BN-DCSIMU-001
type: validation
status: VALIDATED
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, simulation, start-gating, current-flow, ferrules, motor-gland, validation]
---
# Validação 2026-10-29 — Arranque estrito no Start, passagem de corrente limpa, ponteiras duplas universais e encaminhamento pelo bucim do motor

Relacionado com [[Task-2026-10-29-Start-Gating-Corrente-Ponteiras-Bucim]], [[Validation-2026-10-29-Realismo-PBR-Emergencia-Cabos-Toolbar-Demo]], [[Design-Principles]] e [[Testing-Plan]].

**Commit `dc-simu`:** `8642f8e` (`main`, push concluído · carimbo `#105`)

## Causas-raiz diagnosticadas e resolvidas

1. **Sinalizadores, ecrãs, GRAFCET e comandos ativos mesmo em `STOP`:**
   - **Causa-raiz:** `loadJSON` e `newProject` executavam um ciclo elétrico inicial que deixava `H2` aceso, `PLC1` e `MM1` alimentados e a `Etapa X0` ativa antes de o utilizador clicar em `Start`; além disso, `pressButton`/`triggerControl` reavaliavam o circuito em `STOP` e `StateAnimator` acendia zonas luminosas de catálogo (`state?.on`) mesmo com a simulação parada.
   - **Solução:** introduzido `deenergizeComponents` em `loadJSON`, `newProject` e `stop()` (com `scanCount: 0`), bloqueada atuação de campo enquanto `runState === 'stopped'` (preservando `step()` passo-a-passo quando `scanCount > 0`) e inibidas todas as luzes/halos/displays em `STOP` (`$simStopped` em `StateAnimator`, `PilotLightAd22Real3D`, `Lamp3D`, `LogoFrontPanel`, `MultimeterDm20Panel` e símbolos 2D).

2. **Efeito de passagem de corrente visualmente poluído:**
   - **Causa-raiz:** `NeonCurrent3D` desenhava duas malhas aditivas concêntricas até `2,6×` o raio do cabo, fundindo o brilho entre condutores vizinhos nas calhas partilhadas.
   - **Solução:** substituído por uma única bainha justa (`1,06×` o raio do cabo) com pulsos direcionais espaçados e opacidade controlada, mantendo a leitura nítida da cor normalizada de cada condutor em 3D e 2D.

3. **Ponteira dupla automática em bornes com múltiplos cabos:**
   - **Causa-raiz:** apenas os bornes `U1`/`V1` do motor recebiam `ferruleDouble` por migração específica; adicionar um segundo cabo a qualquer outro borne mantinha duas ponteiras simples sobrepostas.
   - **Solução:** criado `src/electrical/sharedFerrules.ts` (`syncSharedTerminalFerrules`) integrado em todas as mutações de cabos da loja (`addWire`, `deleteWire`, `reconnectWire`, `updateWire`, `deleteComponents`, `loadJSON`), deduplicada a gola partilhada em `Panel3D.tsx` (`11` golas `ferruleDouble` com `22` entradas `ferrulePort` no projeto nativo) e reorganizadas as pontes de `PS1` em ligações limpas de 2 condutores por borne.

4. **Organização dos cabos do painel e entrada pelo bucim M20 de `M1`:**
   - **Causa-raiz:** os quatro cabos de força/PE do motor subiam até ao topo da caixa de ligação e desciam verticalmente pela abertura superior, enquanto ligações entre a base e o topo da calha DIN contornavam toda a fileira pela esquerda de `XG`.
   - **Solução:** modelado o bucim frontal M20 (`MOTOR_GLAND`) em `motorTerminalBox.ts`/`motorTerminalLayout.ts` com `buildMotorGlandBody3D` em `wireGeometry3D.ts` e `glandBypass` em `solidWireRouting.ts`, conduzindo `W4`, `W8`, `W12` e `W18` pelo interior do bucim até `U1`, `V1`, `W1` e `PE`, e encaminhando os cabos do painel pelos corredores locais entre equipamentos. Adicionalmente, limitado o número de segmentos tubulares (`<= 180`) para reduzir ~11× os triângulos dos cabos 3D.

## Evidência de verificação

### DC-Simu (`03-Projects/DC-Simu/dc-simu`)
- `./node_modules/.bin/tsc -b` e `npm run test:style`: **0 erros / PASS**.
- `npm run test:native-wires-3d`: **18/18 PASS**, incluindo:
  - todos os 4 cabos de força/PE (`W4`, `W8`, `W12`, `W18`) dentro do furo do bucim M20 (`MOTOR_GLAND`),
  - `0` penetrações na carcaça do motor, na chapa (`z mínimo = -0,187 >= -0,250`) e nos restantes componentes,
  - `0` colisões cabo-dentro-de-cabo nos **37** cabos do projeto nativo.
- `npm run test:solid-cables-meter`: **4/4 PASS** (medição `0 V → 400 V → 0 V`, conversão automática `1 ↔ 2` cabos para `ferruleDouble` e persistência guardar/reabrir).
- Smokes Playwright e estruturais:
  - `scripts/multimeter-terminals-ui-smoke.mjs`: **9/9 PASS** (`STOP` inicial totalmente desligado, `11` ponteiras duplas / `22` entradas e `400,2 V` no DM-20 em `RUN`).
  - `scripts/workspace-panels-ui-smoke.mjs`: **PASS** nas 5 larguras (`1440`, `1024`, `768`, `390`, `375 px`) com contrato `STOP → Start`.
  - `scripts/toolbar-shortcuts-sim-ui-smoke.mjs`: **PASS** em todas as vistas e larguras.
  - `scripts/landing-editor-showcase-smoke.mjs` e `npm run test:glow`: **100 % PASS**.
- Build de produção Vite: concluído sem erros.

### BrainNet (raiz do cofre)
- `npm test` e `npm run check`: validados a 100 % sem erros.
