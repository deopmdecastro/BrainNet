---
project_id: BN-DCSIMU-001
type: task
status: VALIDATED
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, simulation, start-gating, current-flow, ferrules, motor-gland, cables]
---
# Tarefa 2026-10-29 — Arranque estrito apenas ao clicar Start, passagem de corrente limpa, ponteiras duplas automáticas e entrada dos cabos pelo bucim do motor

Relacionado com [[Task-2026-10-29-Realismo-PBR-Emergencia-Cabos-Toolbar-Demo]], [[Validation-2026-10-29-Start-Gating-Corrente-Ponteiras-Bucim]], [[Design-Principles]] e [[Testing-Plan]].

## Pedido do utilizador
1. **Funcionamento estritamente ao clicar em `Start` (`Play`):** na demonstração e no simulador, luzes de sinalização (`H2`), iluminação/brilho de botões (`B1`), displays (`PLC1`, `MM1`), GRAFCET (`Etapa X0`) e comandos operavam mesmo em `STOP` antes de clicar em `Start`, ficando o `Start` reduzido à animação de corrente. Tudo deve manter-se desligado e inerte em `STOP` e funcionar apenas ao clicar em `Start`.
2. **Melhoria visual da passagem de corrente:** o efeito de passagem de corrente (`NeonCurrent3D` em 3D e `.dc-flow` em 2D) apresentava halos largos e sobrepostos que poluíam visualmente os feixes de cabos; pretendia-se um indicador técnico limpo e nítido.
3. **Ponteira dupla automática em todos os bornes partilhados:** qualquer borne com mais de um cabo deve usar ponteira dupla (`ferruleDouble`, DIN 46228-4); se já existir um cabo num borne, ao ligar outro cabo ambos convertem-se automaticamente em ponteira dupla (e regressam a ponteira simples se voltar a ficar apenas um cabo).
4. **Organização dos cabos e passagem pelo bucim do motor (`M1`):** eliminar o feixe congestionado à esquerda de `XG` e encaminhar os quatro condutores de alimentação/PE do motor através do bucim M20 frontal da caixa de ligação em vez de entrarem verticalmente pela tampa superior.

## Alterações efetuadas
- **Bloqueio estrito de energização, atuação e iluminação em `STOP` (`src/store/useSimStore.ts`, `src/catalog/stateAnimator.ts`, `src/catalog/runtimeControls.ts`, `src/three/CatalogComponent3D.tsx`, `src/three/Panel3D.tsx`, `src/schematic/SchematicView.tsx`, `src/schematic/symbols.tsx`):**
  - Em `loadJSON`, `newProject` e `stop()`, `deenergizeComponents` limpa todas as grandezas dinâmicas (bobinas, sinalizadores, displays, rotação do motor, etapas GRAFCET e `scanCount: 0`), preservando apenas estados mecânicos/configuração (`closed` de disjuntores e `on` de fontes de rede).
  - Bloqueada atuação de botões, sensores, disjuntores e controlos de catálogo (`triggerControl`, `pressButton`, `toggleSwitch`, `setComponentState`) enquanto `runState === 'stopped'`, exceto quando `step()` já iniciou varrimento passo-a-passo (`scanCount > 0`).
  - No 3D (`StateAnimator` via `$simStopped`, `PilotLightAd22Real3D`, `Lamp3D`, `TowerLight3D`, `PowerSupply3D`, `EquipmentStatusLights`, `LogoFrontPanel`, `MultimeterDm20Panel`, `ContactorReal3D` e `CadComponentReal3D`) e no 2D (`symbols.tsx`), nenhuma luz, halo ou ecrã acende em `STOP`.
- **Passagem de corrente técnica e limpa (`src/three/NeonCurrent3D.tsx`, `src/index.css`, `src/schematic/SchematicView.tsx`):**
  - Substituído o duplo tubo aditivo largo (`2,6×` o raio do cabo) por uma bainha única justa (`1,06×` o raio do condutor) com pulsos direcionais espaçados e subtis em `RUN`, preservando a cor IEC do isolamento sem poluir cabos paralelos; refinado também o traço `.dc-flow` no esquema 2D.
- **Ponteiras duplas automáticas (`src/electrical/sharedFerrules.ts`, `src/store/useSimStore.ts`, `src/three/WireEnd3D.tsx`, `src/three/Panel3D.tsx`, `src/project/nativeProjects.ts`):**
  - Criado `syncSharedTerminalFerrules` ligado a `addWire`, `deleteWire`, `deleteComponents`, `reconnectWire`, `updateWire` e `loadJSON`: qualquer borne elegível com `>= 2` cabos promove automaticamente as extremidades partilhadas a `ferruleDouble` e reverte para `ferrule` ao regressar a `1` cabo.
  - Deduplicada a geometria 3D da gola partilhada (`sharedFollower`) em `Panel3D.tsx` e parametrizado `portCount` em `WireEnd3D.tsx`, reorganizando as pontes de 24 V de `PS1` em pares limpos de 2 condutores (**11** bornes partilhados com `ferruleDouble` / **22** entradas `ferrulePort` no projeto nativo).
- **Organização das calhas e entrada pelo bucim M20 do motor (`src/three/motorTerminalBox.ts`, `src/three/motorTerminalLayout.ts`, `src/three/solidWireRouting.ts`, `src/three/wireGeometry3D.ts`, `src/project/nativeProjects.ts`):**
  - Modelado `MOTOR_GLAND` (`x = 128`, `y = 114`, `innerRadius = 7,5 mm`, `z = 56,5..72,5 mm`) e `buildMotorGlandBody3D`, encaminhando os quatro condutores do motor (`W4`, `W8`, `W12`, `W18`) em grelha 2×2 `(±2,6; ±2,6) mm` pelo interior do bucim frontal da caixa de bornes de `M1` até aos pernos `U1`, `V1`, `W1` e `PE`, mantendo as pontas de prova do multímetro pela abertura superior.
  - Aproveitamento dos corredores locais entre aparelhos da calha DIN e recozimento (`bakeNativeRouting`) do projeto nativo, eliminando a subida de 10 cabos à esquerda de `XG`.
  - Otimização de geometria 3D dos cabos (limite de `<= 180` segmentos tubulares por cabo, reduzindo ~11× o número de triângulos) e adaptação automática para rasterizadores WebGL por software em CI (`IS_SOFTWARE_WEBGL`).

## Critérios de aceite
- [x] Em `STOP` inicial e após clicar `Stop`, todos os sinalizadores, halos, ecrãs (`LOGO!`, `DM-20`), GRAFCET e comandos permanecem desligados; tudo arranca apenas ao clicar em `Start` (`Play`).
- [x] Efeito de passagem de corrente limpo, sem halos sobrepostos entre condutores vizinhos.
- [x] Conversão automática `1 ↔ 2+` cabos em ponteira dupla (`ferruleDouble`) em qualquer borne elegível, com uma única gola partilhada renderizada por borne.
- [x] Todos os 4 cabos de força/PE de `M1` entram horizontalmente pelo bucim M20 frontal sem colidir com a carcaça, chapa ou outros cabos (`0` colisões nos 37 cabos).
