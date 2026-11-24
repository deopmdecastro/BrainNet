---
project_id: BN-DCSIMU-001
type: validation
status: PARTIAL
created: 2026-11-23
updated: 2026-11-23
tags: [brainet, dc-simu, validacao, cabos, calhas, qgd, schneider, tia-portal]
---
# Validação: cabos nas calhas, X1 L/N/PE, anilhas IEC, bainha única, QGD Schneider e motor do simulador (2026-11-23)

Tarefa correspondente: [[Task-2026-11-23-Cabos-Calhas-X1-Anilhas-Bainha-QGD-Schneider-Motor-Sim]]

## Estado

**Implementado e testado por suíte** (scripts `tsx`/`node` sem navegador). **Aprovação visual pendente** para dois pontos:
a bainha única dos cabos de ficha e os cartões do motor do simulador em ecrã real (ver «Pendências»).

## Verificações executadas

| Comando | Resultado |
| --- | --- |
| `npx tsc -p tsconfig.check.json` (programa com os ficheiros alterados e as suas importações) | **OK, 0 erros** |
| `npx tsx scripts/smoke.ts` | **Todos os testes passaram** |
| `npx tsx scripts/quadro-distribuicao-smoke.ts` | Novas verificações Schneider **PASS**; falha restante «uma conta limpa não recebe QGD…» **já existe no HEAD** (reproduzida com `git stash`) |
| `npx tsx scripts/ready-maquettes-smoke.ts` | **9/9** — contagens atualizadas para 125 peças / 176 componentes / 60 tipos (régua X1 acrescentada, `AIR_TUBE` removida) |
| `node scripts/maquettes-build-smoke.mjs` | **PASS** (bundle minificado: 176 componentes) |
| `npx tsx scripts/estampagem-guiao-smoke.ts` | **OK — 76 verificações** |
| `npx tsx scripts/native-wires-3d-smoke.ts` | **Todos os testes passaram** |
| `npx tsx scripts/wire-lacing-smoke.ts` · `wire-lock-organization-smoke.ts` | **PASS** (filaçamento e bloqueios) |
| `npx tsx scripts/meters-schneider-smoke.ts` | **61 asserções PASS** |
| `npx tsx scripts/device-lcd-smoke.ts` | **76 asserções PASS** |
| `npx tsx scripts/imported-components-smoke.ts` | **197 verificações PASS** |
| `npx tsx scripts/native-sim-smoke.ts` · `terminal-strip-smoke.ts` · `solid-cables-meter-smoke.ts` | **PASS** |
| `node scripts/tia-panel-ui-smoke.mjs` (Chromium + ponte real) | **15/15** — inclui clicar nos rádios novos e o bloqueio em RUN |
| `npx tsx scripts/terminal-geometry-smoke.ts` | Falha **pré-existente** `breakerMurrelektronikMico46.L+` (bornes do MICO), já registada em [[Validation-2026-11-22-Ligacao-TIA-Portal]] |
| `npx eslint src --max-warnings 0` | 1 erro **pré-existente** em `src/three/PneumaticsDevices3D.tsx:2111` (`useLoader` condicional, commit `97cd090d`); ficheiro não tocado |

### Nota sobre o typecheck completo

O `npm run typecheck` (`tsc -b`) **não termina nesta sandbox**: o projeto completo exige ~1,1 GB de heap e a caixa
tem 1,98 GB sem swap — o processo entra em thrashing e não conclui (testado com 1600/2048/6144 MB). Foi usado um
`tsconfig` temporário com os 26 ficheiros alterados + `vite-env.d.ts`, que verifica o mesmo contrato de tipos
desses ficheiros e de tudo o que importam. **A verificar em CI** com `npm run typecheck`.

## Evidências

- Capas geradas para os dois tipos novos (o `smoke.ts` falhava sem elas):
  `public/component-covers/surgeProtectorSchneiderIprd.webp` e `…/front/…` (frente com «Schneider Electric · iPRD 1P ·
  DPS · T2 · L · Uc 275 V~ · Imax 20 kA · OK ↓ PE»), `…/meterSchneiderIem3255.webp` e `…/front/…` (frente com
  «Acti9 iEM3255»).
- Seletor do motor (capturas temporárias, não versionadas): dois cartões de rádio — «DC-Simu · Ladder e GRAFCET do
  simulador · **Ativo**» e «TIA Portal · S7-PLCSIM Advanced pela ponte local · **Em espera**», com a linha
  «Motor ativo: DC-Simu»; ao escolher TIA sem ponte ligada a linha passa a «Motor ativo: TIA Portal · sem ligação —
  quem manda é o DC-Simu».

## Correções feitas durante a verificação

- `scripts/quadro-distribuicao-smoke.ts` — a asserção «usa o diferencial Hager 2P» foi substituída pelas três novas
  (iDPN Vigi, iPRD, iEM3255) e por uma verificação de que não ficam tipos WEG/Hager no QGD nativo nem no QGD 3D.
- `scripts/ready-maquettes-smoke.ts` — contagens 122→125 peças, 173→176 componentes e 61→60 tipos, por causa da
  régua X1 (3 bornes) e da remoção da `AIR_TUBE`.

## Pendências

- **Aprovação visual** da bainha única (um tubo por `bundleId`) e dos cartões do motor em ecrã real.
- **Captura da bancada** com os cabos dos sensores a saírem diretos dos cilindros: o Chromium crashou por falta de
  memória ao montar a maquete completa nesta sandbox (1,98 GB). A verificação foi feita ao nível dos dados:
  22 cabos de sensor/cilindro com `fromEnd: 'none'` (sem ponteira no sensor) e `toEnd: 'ferrule'/'ferruleDouble'`
  (ponteira só no borne do quadro), 17 pontos de traçado por cabo até ao QE1.
- Revisão do encadeamento de PE (ficha → X1.3 → PS1.PE → X20.PE-IN) com o multímetro.
