---
type: validation
status: VERIFIED_LOCAL
created: 2026-11-17
updated: 2026-11-17
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, glb, barramento, bucim, motor, gv2me, rele-termico, plc, dps, inspetor, ui-ux, validation]
---

# Validação — Resolução dos Pendentes (GLBs, Bucim do Motor, GV2ME, Relé Térmico, PLC, DPS e Inspetor)

## Resumo

Validação completa dos 8 itens pendentes do projeto DC-Simu:
1. Regeneração dos GLBs oficiais dos barramentos com acrílico (orelhas M4 na face traseira e parafuso com entrada frontal acessível).
2. Verificação geométrica do bucim M20 do motor: passagem axial sem colisão com a carcaça para cabos de alimentação e sondas do multímetro DM-20.
3. Validação do disjuntor-motor GV2ME / QM1: molas de animação I e O com pulso axial e gating de simulação ativo.
4. Validação do relé térmico 3RU1116: gating de simulação ativo, manobra TEST retida e RESET rotativo com retorno por mola e feedback azul no inspetor.
5. Afinação do PLC Siemens S7-1500 e S7-300: bornes na superfície frontal dos conectores X10/X11 e LEDs de canal I/Q independentes.
6. Correção de rotação base do DPS WEG SPW02 / SPW12: substituição de 180 radianos por $\pi$ radianos, eliminando rotação espúria de 233° e erro de bounding box.
7. Harmonização das cores de botões no Inspetor: substituição de botões pretos (`bg-slate-800` / `#1e293b`) pelo azul oficial do tema (`bg-brand-600` / `#2563eb`).
8. Verificação de erros e regressões com testes unitários, smoke tests e typecheck.

## Detalhe das validações

### 1. Regeneração dos GLB dos barramentos acrílico
- Comando: `npx tsx scripts/build-busbar-glb.ts`
- Ficheiros atualizados em `public/models/bornes-e-barras/`:
  - `barramento-fase-acrilico.glb`
  - `barramento-neutro-n.glb`
  - `barramento-terra-pe.glb`
- Geometria: as orelhas M4 assentam no plano da face traseira (-Z) para fixação na chapa, mantendo os furos de parafuso e rebaixos acessíveis pelo lado frontal (+Z).

### 2. Bucim do motor (M20)
- Furo do bucim com raio interno de 7,6 mm (diâmetro 20 mm).
- Canais de encaminhamento:
  - Cabos de alimentação U1/V1/W1/PE nos 4 quadrantes a raio 3,67 mm.
  - Sondas do multímetro (U1: dx=0, dy=-5,8 mm; V1: dx=5,8 mm, dy=0 mm) a raio 5,8 mm da linha central do bucim.
- Trajeto axial: entrada a $Z = \text{boxZ1} + 14\text{ mm}$, boca a $+6\text{ mm}$, parede a $-2,5\text{ mm}$ e interior a $-13\text{ mm}$. A curva interna para os bornes ocorre exclusivamente dentro da caixa de ligação, sem penetrar ou cortar a carcaça do motor.

### 3. Disjuntor-motor GV2ME / QM1
- Molas de botão em `importedFinish.ts`: `button-on` e `button-off` acionam com curso axial de 2,8 mm (`pulseOn`/`pulseOff`).
- Gating de simulação: em STOP, o clique seleciona o componente no inspetor. Apenas em RUN/demoMode é comutado o estado dos polos.

### 4. Relé térmico TEST / RESET (3RU1116)
- Manobra TEST: momento do clique comuta imediatamente os contactos auxiliares (95-96 abre, 97-98 fecha) e retém o disparo térmico ao largar.
- Manobra RESET: rotação angular de $\pm 35^\circ$ com retorno à mola.
- Botão TEST no inspetor (`ThermalRelayControls.tsx`) passa a acender em azul (`dc-btn-primary`) enquanto mantido premido.

### 5. PLC Siemens S7-1500 e S7-300
- Bornes frontais situados a $Z = 0,92$ nos conectores X10/X11.
- LEDs de canal I/Q renderizados via `plcChannelLamps` desfasados em X ($x = 0,22 / 0,38$ e $0,90$), sem colisão com os bornes de ligação de condutores.
- Lâmpadas de status do módulo (RUN/STOP, ERROR, MAINT, SF, etc.) mantidas nas coordenadas medidas do CAD.
- Teste `scripts/siemens-plc-smoke.ts` ajustado e aprovado.

### 6. DPS WEG SPW02 / SPW12
- Em `src/data/imported-component-models.json`, a rotação base constava como `[0, 180, 0]`. Como Three.js interpreta ângulos de rotação em radianos, o valor 180 radianos equivalia a 233,24°, resultando num desvio de 53,24° na calha DIN e num erro de caixa de 78,8% no teste de escala física.
- Corrigido para `[0, 3.141592653589793, 0]` ($\pi$ radianos = 180° exatos). O erro dimensional desceu para 0,0% e a serigrafia ficou perfeitamente virada para a frente.

### 7. Harmonização das cores dos botões do inspetor
- Em `src/components/PanelAccessoryControls.tsx`:
  - Presets de tamanho de quadro metálico (`ENCLOSURE_PRESETS`): o botão ativo mudou de `bg-slate-800 border-slate-800 text-white` para `bg-brand-600 border-brand-700 text-white`.
  - Botão de abrir/fechar porta: quando fechada, utiliza `bg-brand-600 border-brand-700 text-white hover:bg-brand-500`.
  - Seleção de face de furos (`door`, `top`, `bottom`, etc.) e diâmetro (M16..M40): estado ativo atualizado para `bg-brand-600 text-white border-brand-700`.
  - Presets de comprimento de calha técnica PVC e botão de colocar tampa: estado ativo atualizado para `bg-brand-600 border-brand-700 text-white`.
- Em `src/index.css`:
  - `.dc-acc-seg button.is-on` corrigido de `#1e293b` (slate-800) para `#2563eb` (azul oficial), harmonizando os seletores de segmento (dobradiças, orientação de calhas, perfis DIN, tampas de barramento em escada).

## Evidências de teste

- `npm test`: todos os 4 cenários de simulação + 150+ verificações de componentes e barramentos passaram (`PASS`).
- `npm run test:siemens-plc`: 9 verificações de geometria, bornes, lâmpadas e conectores Siemens S7 passaram.
- `npm run test:imported-components`: 189 verificações de componentes importados passaram.
- `npm run test:thermal-controls`: 24 verificações de TEST/RESET passaram.
- `npm run test:breaker-cut`: 9 verificações de corte e continuidade passaram.
- `npm run test:panel-accessories`: 34 verificações de acessórios e furos passaram.
- `npm run test:style`: `no-accent-border: ok`.
- `npm run typecheck`: `tsc -b` concluído com 0 erros.
