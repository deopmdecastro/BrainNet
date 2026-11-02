---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED
created: 2026-11-02
updated: 2026-11-02
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, nativo, simulacao, logo, powered, regressao, s7]
---

# Validação 2026-11-02 — Simulação do projeto nativo «Partida direta» voltou a funcionar

## Sintoma

No projeto nativo a simulação não energizava o contactor, as lâmpadas nem o motor:

- PLC1 aparecia sem alimentação (`state.powered = false`);
- H2 (parado) não acendia em repouso;
- START não fechava KM1 nem punha o motor a rodar;
- a sequência TEST/RESET do F1 falhava a cascata física (embora o GRAFCET/IEC já lesse I0.3).

O teste `npm run test:native-sim` falhava em 11 asserções.

## Causa

Na integração dos PLC Siemens S7, a avaliação de alimentação DC L+/M ficou restrita a `SIEMENS_S7_TYPES`:

```ts
const logo = SIEMENS_S7_TYPES.includes(plc.type)
  ? logoElectricalInputs(plc, components, wires)
  : null
```

O LOGO! 12/24RC (`plcSiemensLogo1224RC`) deixou de receber `logoElectricalInputs`. O `state.powered` permanecia no valor de fábrica (`false`).

No motor de continuidade as pontes dos contactos de relé só fecham com `c.state.powered !== false`:

```ts
if (c.state.powered !== false && c.state.outputs[q]) pair(la(q), la(`${q}·2`))
```

Com `powered === false` as pontes Q0.x ↔ Q0.x·2 nunca fechavam: o Ladder corria (bits Q a 1), mas o grafo elétrico não energizava bobina, sinalizadores nem motor.

## Correção (`dc-simu`)

Em `src/store/useSimStore.ts`, a alimentação DC aplica-se a **LOGO! e a todos os S7**:

```ts
const needsDcSupply =
  plc.type === 'plcSiemensLogo1224RC' || SIEMENS_S7_TYPES.includes(plc.type)
const logo = needsDcSupply
  ? logoElectricalInputs(plc, components, wires)
  : null
```

Assim o LOGO! volta a marcar `powered` quando L+ está no potencial positivo e M no retorno da PS1, e as pontes de relé voltam a conduzir.

## Verificação

| Verificação | Resultado |
| --- | --- |
| `npx tsx scripts/native-sim-smoke.ts` | ✅ 22/22 PASS |
| PLC1 alimentado (L+/M) | PASS |
| Repouso: H2 acesa | PASS |
| START → KM1 + H1 + motor CW | PASS |
| STOP → KM1 abre, H2 acende | PASS |
| TEST/RESET F1 + bloqueio START | PASS |
| IEC partilha o mesmo disparo do F1 | PASS |

## Notas para agentes

- Qualquer PLC com bornes L+/M deve passar por `logoElectricalInputs` (ou equivalente) antes do scan; não restringir só a `SIEMENS_S7_TYPES`.
- `state.powered === false` (explícito) bloqueia pontes de relé; `undefined`/`true` permitem.
- Reaproveitar sempre o teste `test:native-sim` antes de alterar o caminho de alimentação dos PLC.
