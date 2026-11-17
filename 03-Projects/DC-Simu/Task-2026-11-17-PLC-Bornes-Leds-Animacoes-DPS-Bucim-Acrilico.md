---
project_id: BN-DCSIMU-001
type: task
status: COMPLETED
created: 2026-11-17
updated: 2026-11-17
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, plc, siemens, bornes, leds, animacao, contactor, rele-termico, dps, bucim, motor, acrilico, barramento, simulacao-gate, inspetor, ui-tema]
---

# Task 2026-11-17 — PLC bornes/LEDs, animações de botões, DPS, bucim do motor, acrílico dos barramentos e gating de simulação

## Pedido (utilizador)

1. **PLC**: Os bornes estão errados — no lugar dos LEDs indicadores de funcionamento das entradas e saídas foram postos os bornes do PLC. Fazer vistoria de todo o material PLC (Siemens S7-1500 DI32, CPU 1511C, S7-300 CPU 315), confirmar bornes, LCD, luzes e botões.
2. **Cabo do multímetro**: Não passa dentro do bucim do motor.
3. **Barramentos com acrílico**: Ficaram na posição errada — a parte que entra o parafuso fica na chapa (orientação invertida).
   - **Clarificação 2026-11-17**: Não é só o acrílico. O **barramento completo** está invertido. A face de montagem (orelhas M4, lado de entrada do parafuso) está virada para a chapa de forma incorrecta.
4. **Animações e funcionalidade de botões**:
   - Atracar o contactor manualmente clicando no botão de teste.
   - Botões do relé térmico (Test/Reset e outros).
5. **Gating de simulação**: Alguns componentes funcionam sem estar em simulação (ex.: gaveta do fusível). Corrigir para só responderem em modo simulação (exceto quando explicitamente permitido pela regra de UI).
6. **Verificar funcionamento e animação**: Disjuntor motor (QM1 / GV2ME / TeSys), e muitos outros componentes.
7. **DPS**: Mal posicionado; serigrafia colocada na parte de trás do componente. Corrigir pose e textura/serigrafia para a face frontal correta.

## Contexto lido (obrigatório)

- Design-Principles — regras de UI/UX, painéis, tema, botões, luzes, LCDs, texturas.
- Validation-2026-11-02-PLC-Siemens-Pose-Bornes-Leds — pose, bornes e lâmpadas dos S7 (já implementado; rever se regressão).
- Task-2026-11-16-Barramentos-3D-Reais-Acrilico-E-Escada — geometria e orientação do acrílico dos barramentos.
- Task-2026-10-29-Motor-Bucim-Curvas-Cabos e Task-2026-11-07-Motor-Posicao-Bucim — bucim e passagem de cabos/sondas.
- Validation-2026-11-01-Rele-Termico-3RU1116 e Validation-2026-11-02-Test-Reset-Rele-Termico — botões Test/Reset do relé térmico.
- Regras de simulação: componentes interativos (gavetas, botões de teste, alavancas) só animam/funcionam quando simulation.running ou estado de simulação ativo (exceto edição de pose em editor 3D).

## Análise do barramento (clarificação)

Em `src/three/busbarParts.ts` → `buildAcrylicBusbar`:

- Painel frontal (furos de entrada de cabos) em **+Z**.
- Painel traseiro em **−Z**.
- Orelhas M4 construídas como **placas horizontais XZ** na base (Y baixo), com eixo do parafuso ao longo de **Y** e rebaixo da cabeça em Y+.

No painel a face de montagem é a **traseira (back = −Z)** — ver `terminalFaces.ts` (`back` = «Face de montagem»). As orelhas devem apresentar face vertical à chapa, eixo do parafuso ao longo de **Z**, rebaixo da cabeça do parafuso acessível pelo lado da frente (+Z da orelha).

**Causa**: geometria das orelhas orientada para montagem horizontal (parafuso de cima), não para montagem em chapa vertical. O barramento completo fica com o lado de entrada do parafuso incorrecto relativamente à chapa.

**Correção**: reconstruir as orelhas como placas verticais nas extremidades, alinhadas com a face traseira, eixo do furo M4 ao longo de Z, rebaixo no lado +Z. Regenerar os GLB (`scripts/build-busbar-glb.ts`).

## Plano de trabalho

### 1. PLC (prioridade alta)
- Inspecionar src/electrical/siemensPlc.ts, factory.ts (funções plcS71500*Terminals), realInterfaces.ts e o rendering 3D dos LEDs de canal (IO status LEDs vs bornes de conector frontal).
- Confirmar que:
  - Bornes (L+/M + I/Q) estão nos pinos dos conectores frontais X10/X11 (colunas medidas no CAD).
  - LEDs de estado do módulo (RUN/ERROR/MAINT, SF, etc.) e LEDs de canal por entrada/saída estão nas posições corretas do painel frontal (não coincidentes com bornes).
  - LCD/visor e botões (RUN/STOP, etc.) do CPU 1511C estão corretos.
- Se os bornes estiverem a ser renderizados no sítio dos LEDs de canal, separar as duas geometrias (terminals vs channelLeds).
- Evidência: capturas do painel 3D com fios nos bornes e LEDs acesos em simulação.

### 2. Bucim do motor
- Rever geometria do bucim e o raycast/routing de cabos e sondas do multímetro (src/three/ motor parts, cableRouting ou equivalente).
- Garantir que o cabo/sonda entra pelo centro do bucim e não colide com a carcaça.

### 3. Barramentos acrílico (PRIORIDADE desta mensagem)
- Reconstruir orelhas M4 em `buildAcrylicBusbar` (face de montagem = back, eixo Z).
- Regenerar GLBs oficiais.
- Validar PE / N / Fase: frente = furos + acrílico no topo; trás = orelhas contra a chapa; parafuso entra pelo lado acessível.

### 4. Animações de botões
- Contactor (ex. WEG CWC / TeSys): botão de teste atraca manualmente o contacto e anima a armadura.
- Relé térmico: botões Test e Reset — confirmar animação e gating de simulação.
- Disjuntor motor (GV2ME / QM1): alavanca ON/OFF e animação de trip/reset.

### 5. Gating de simulação
- Handlers de clique em gavetas de fusível, alavancas, botões de teste só activos em simulação (excepto inspeção visual de tampas).

### 6. DPS (DPS1 / DPS2 — WEG SPW)
- Corrigir pose base e mover serigrafia para a face frontal.

## Critérios de aceitação
- PLC: bornes nos conectores frontais; LEDs de canal e de estado nos sítios certos; LCD e botões corretos.
- Multímetro: cabo/sonda entra pelo bucim do motor.
- **Barramento**: orelhas com face de montagem na traseira; lado de entrada do parafuso acessível (não escondido na chapa); frente com furos e acrílico no topo.
- Contactor e relé térmico: clique no botão de teste atraca/desarma com animação, só em simulação.
- Fusível e alavancas: não alteram estado elétrico fora de simulação.
- DPS: pose e serigrafia frontais corretas.
- tsc -b + smoke + visual Playwright sem regressões.

## Estado
- [x] Vistoria PLC completa
- [x] Correção bornes vs LEDs
- [x] Bucim motor
- [x] Análise orientação barramento (completo, não só acrílico)
- [x] Reconstrução orelhas M4 em busbarParts.ts (commit 88800f43)
- [x] Regeneração GLB oficiais (`npx tsx scripts/build-busbar-glb.ts`)
- [x] Animações contactor / relé / disjuntor motor
- [x] Gating simulação (gavetas etc.)
- [x] Pose + serigrafia DPS (rotação corrigida para π radianos)
- [x] Botões do inspetor harmonizados com o azul do tema do site
- [x] Testes e evidências completos (smoke, audit-models, siemens-plc, imported-components)
- [x] Commit + push

## 2026-11-17 — Encaixe pente (busbarComb) nos disjuntores

Pedido: melhorar e criar funcionalidades de encaixe dos pinos do pente (BP1 / LEXman) nos bornes superiores dos disjuntores (QF2 Easy9, etc.), no padrão do relé térmico sob o contactor.

### Implementado
- `src/three/combMount.ts` (novo) — espelho de `thermalMount.ts`:
  - `findCombMountTarget` / `combMountPosition` / `syncCombMounted`
  - `combMountPairs` / `combMountBridges` (pin → 1/3/5 sem cabos)
  - suporte a vários disjuntores adjacentes (passo DIN 18 mm)
  - `combMountDepthOffset` para alinhamento 3D dos pinos
- Integração em `useSimStore` (snapToRails + load), `engine` (buildGraph + fedBreakerInputs), `errorDetection`, `Panel3D`.
- Commits: `600d3c1a`, `553e241f`, `0f1c4ec9`, `6cd8becb`, `78cf3f87`.

### Como usar
1. Colocar disjuntores em linha (1P/2P/3P).
2. Arrastar o pente (`busbarComb`) por cima dos bornes superiores e soltar (ou Snap à calha) — o íman encaixa e grava `mountedOn`.
3. Continuidade elétrica automática pin→borne; alimentar o pente (IN.* ou source) energiza os disjuntores a jusante.

## 2026-11-17 (noite) — Resolução dos pendentes

### Feito nesta ronda
1. **Gating de simulação** — gaveta de fusível, TEST, alavancas e restantes controlos mecânicos **só alteram estado elétrico com simulação activa** (ou demo). Em STOP apenas seleccionam o aparelho.
2. **Contactor — botão de teste / atracagem manual** — `manualLatch` + `testPressed` mantêm polos fechados sem bobina; integrado em `importedActuationPatch`, `engine` e scan do `useSimStore`.
3. **PLC Siemens** — `position3D` dos bornes fixo em z=0,92 (conectores frontais X10/X11); LEDs de canal I/Q adicionados em `plcChannelLamps` (separados dos bornes e das lâmpadas RUN/ERROR/MAINT).
4. **DPS WEG SPW02/SPW12** — rotação base `[0, 180, 0]` para a serigrafia ficar na face frontal.
5. **Barramento orelhas M4** — já corrigido em código (falta regenerar GLB).
6. **Pente ↔ disjuntor** — já implementado (`combMount`).

### Validação visual e build concluídos
1. **Regeneração GLB barramentos com acrílico**: Executado `npx tsx scripts/build-busbar-glb.ts`. Ficheiros gerados: `barramento-fase-acrilico.glb`, `barramento-neutro-n.glb`, `barramento-terra-pe.glb`, etc. Orelhas M4 com montagem vertical na traseira (-Z) e rebaixo de parafuso na frente (+Z).
2. **Bucim do motor**: Rotação e encaminhamento das sondas do multímetro e cabos de alimentação validados. Os canais 7 e 8 situam-se a raio 5,8 mm da linha central do bucim M20 (furo interno de raio 7,6 mm), entrando axialmente por z=+14 mm até ao interior da caixa de terminais sem cortar a carcaça.
3. **Disjuntor-motor GV2ME / QM1**: Molas de animação I e O (`pulseOn`/`pulseOff` com curso axial de 2,8 mm), gating de simulação ativo (em STOP apenas seleciona; em RUN manobra e comuta polos).
4. **Relé térmico TEST/RESET**: Gating de simulação ativo; animação rotativa a ±35° e feedback visual azul (`dc-btn-primary`) no botão TEST do inspetor quando premido.
5. **PLC Siemens S7**: Bornes e LEDs de canal separados. Bornes a z=0,92 (conectores frontais X10/X11), LEDs de canal a x=0,22 / 0,38 e 0,90. `scripts/siemens-plc-smoke.ts` validado com sucesso.
6. **DPS WEG SPW02 / SPW12**: Corrigida a rotação base em `imported-component-models.json` de `180` radianos (233,2°) para `3.141592653589793` radianos (180° exatos). Erro dimensional residual reduzido para 0,0% em `scripts/audit-models.ts` e serigrafia frontal alinhada perfeitamente na calha.
7. **Harmonização de botões no Inspetor**: Eliminado o fundo preto/grafite (`bg-slate-800` / `#1e293b`) em `PanelAccessoryControls.tsx` e `src/index.css` (`.dc-acc-seg button.is-on`), passando a usar o azul do tema do site (`bg-brand-600 border-brand-700 text-white` / `#2563eb`), uniforme com o `Design-Principles.md`.
8. **Verificação de erros**: Todos os testes do repositório passaram sem falhas (`npm test`, `npm run test:siemens-plc`, `npm run test:imported-components`, `npm run test:thermal-controls`, `npm run test:breaker-cut`, `npm run test:panel-accessories`, `npm run test:style`, `npm run typecheck`).

### Commits desta ronda
`c74eb29e` Panel3D · `d00cc780` importedComponents · `a973310a` engine · `a4c70d0d` factory · `8da5ab9b` store · `ca404c18` plcStatusLights · `5fd553b5` DPS models
