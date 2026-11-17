---
project_id: BN-DCSIMU-001
type: task
status: IN_PROGRESS
created: 2026-11-17
updated: 2026-11-17
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, plc, siemens, bornes, leds, animacao, contactor, rele-termico, dps, bucim, motor, acrilico, barramento, simulacao-gate]
---

# Task 2026-11-17 — PLC bornes/LEDs, animações de botões, DPS, bucim do motor, acrílico dos barramentos e gating de simulação

## Pedido (utilizador)

1. **PLC**: Os bornes estão errados — no lugar dos LEDs indicadores de funcionamento das entradas e saídas foram postos os bornes do PLC. Fazer vistoria de todo o material PLC (Siemens S7-1500 DI32, CPU 1511C, S7-300 CPU 315), confirmar bornes, LCD, luzes e botões.
2. **Cabo do multímetro**: Não passa dentro do bucim do motor.
3. **Barramentos com acrílico**: Ficaram na posição errada — a parte que entra o parafuso fica na chapa (orientação invertida).
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

### 3. Acrílico dos barramentos
- Em src/three/busbarParts.ts / Busbar3D.tsx / script de build GLB: inverter a orientação da tampa de acrílico para que o lado de entrada do parafuso fique voltado para fora (não para a chapa).
- Validar com as 3 variantes (PE verde, N azul, Fase cor selecionável).

### 4. Animações de botões
- Contactor (ex. WEG CWC / TeSys): botão de teste (ou “Test”) atraca manualmente o contacto (estado manualLatch ou equivalente) e anima a armadura.
- Relé térmico: botões Test e Reset já existentes — confirmar animação e que só funcionam em simulação; adicionar feedback visual se faltar.
- Disjuntor motor (GV2ME / QM1): alavanca ON/OFF e botão de teste se existir — animação de trip/reset e estado ligado.

### 5. Gating de simulação
- Localizar handlers de clique em gavetas de fusível, alavancas, botões de teste.
- Guardar com if (!simRunning && !editorMode) return; (ou a regra canónica do projeto).
- Componentes que devem continuar a permitir inspeção visual fora de simulação (abrir tampa para ver bornes) ficam com animação de tampa, mas sem alteração de estado elétrico.

### 6. DPS (DPS1 / DPS2 — WEG SPW)
- Corrigir pose base (rotação/posição relativa à calha).
- Mover serigrafia/textura para a face frontal (atualmente na traseira).
- Confirmar bornes e LEDs de estado se existirem.

## Critérios de aceitação
- PLC: bornes nos conectores frontais; LEDs de canal e de estado nos sítios certos; LCD e botões corretos.
- Multímetro: cabo/sonda entra pelo bucim do motor.
- Acrílico: lado do parafuso voltado para o observador/fora da chapa.
- Contactor e relé térmico: clique no botão de teste atraca/desarma com animação, só em simulação.
- Fusível e alavancas: não alteram estado elétrico fora de simulação.
- DPS: pose e serigrafia frontais corretas.
- tsc -b + smoke + visual Playwright sem regressões.

## Notas de implementação
- Preferir reaproveitar padrões já existentes (ex. manualTest do contactor, testReset do relé térmico, gating de useSimStore).
- Não inventar novas UI; seguir Design-Principles e o kit de toolbar/painéis.
- Após correções: commit em dc-simu + nota de validação aqui + push em ambos os repos.

## Estado
- [ ] Vistoria PLC completa
- [ ] Correção bornes vs LEDs
- [ ] Bucim motor
- [ ] Orientação acrílico
- [ ] Animações contactor / relé / disjuntor motor
- [ ] Gating simulação (gavetas etc.)
- [ ] Pose + serigrafia DPS
- [ ] Testes e evidências
- [ ] Commit + push
