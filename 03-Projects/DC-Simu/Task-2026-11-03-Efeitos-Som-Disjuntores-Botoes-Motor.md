---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-03
updated: 2026-11-03
tags: [dc-simu, sfx, audio, disjuntor, botao, motor, ux]
---
# Tarefa 2026-11-03 — Efeitos de som: cliques de disjuntores/botões e motor a girar

## Pedido

Adicionar efeitos de som nos cliques dos disjuntores, botões, e no motor a girar.

Preferência: trabalhar no cofre e depois commit/push em ambos os repositórios.

## Contexto

- Já existe `src/catalog/beep.ts` (Web Audio, bip de continuidade do multímetro) — reutilizar o mesmo padrão (AudioContext partilhado, só após gesto do utilizador).
- Sem dependências npm de áudio (howler, etc.).
- Interações passam por `pressButton`, `actuateImported` e `setComponentState` no `useSimStore` (3D e Esquema IEC).
- Motor: `state.running` / `rpmVisual` em `motor3ph` / `motor1ph`; animação em `MotorShaftFan3D`.
- Design: feedback sonoro discreto, volume baixo, silenciável; respeitar ausência de AudioContext e preferências do utilizador.

## Caminho

1. Novo módulo `src/audio/sfx.ts`:
   - `ensureAudio()` — AudioContext único, resume após gesto.
   - `playClick(kind)` — `button` (clique curto), `breaker` (clack mais grave), `selector` (clique médio).
   - `setMotorHum(on, intensity?)` — oscilador baixo + ruído suave em loop enquanto algum motor estiver a correr; desliga quando nenhum corre.
   - `setSfxEnabled(enabled)` + leitura de `localStorage['dc-simu-sfx']` (default on).
2. Hooks no store:
   - `pressButton` → `playClick('button')` quando o estado muda.
   - `actuateImported` → click conforme control/behavior (breaker/thermal/button/selector).
   - Após recompute / quando `running` de motores muda → `setMotorHum`.
3. Não bloquear a simulação se o áudio falhar; try/catch como no beep.
4. Opcional UI: toggle silencioso na barra (fase 2 se necessário); nesta entrega o default é ligado e desligável por localStorage.

## Critérios de aceite

- [x] Clique em botoeira (START/STOP/emergência) produz clique curto.
- [x] Manobra de disjuntor / térmico (TEST/RESET/STOP/corpo) produz clack distinto.
- [x] Motor em marcha produz zumbido contínuo baixo; para ao parar.
- [x] Sem som se o utilizador ainda não interagiu (política do browser) ou se sfx desligado.
- [x] `typecheck` e smokes existentes não quebram.

## Ficheiros

- `src/audio/sfx.ts` (novo)
- `src/store/useSimStore.ts` (hooks)
- eventualmente um toggle mínimo se couber na barra sem densidade extra

## Notas

- Volumes baixos (didático, não arcade).
- Motor hum correlacionado com `rpmVisual` quando disponível.


## Publicação

- Aplicação: `deopmdecastro/dc-simu` @ `cb11251` (`main`).
- Módulo: `src/audio/sfx.ts`; hooks em `useSimStore` (pressButton, setComponentState, toggleTerminal, runOneTick, stop).
