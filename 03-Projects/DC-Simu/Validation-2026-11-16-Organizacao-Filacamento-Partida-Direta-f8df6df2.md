---
type: validation
status: VERIFIED_LIVE
created: 2026-11-16
updated: 2026-11-16
project_id: f8df6df2-c5dd-4b86-ba54-93aeeddc566b
project_url: https://dc-simu.vercel.app/projects/f8df6df2-c5dd-4b86-ba54-93aeeddc566b
tags: [dc-simu, routing, lacing, filacamento, validation]
---

# Validação — Organização e Filaçamento do Projeto `f8df6df2-c5dd-4b86-ba54-93aeeddc566b`

## Resumo

Os 43 cabos do projeto em produção **«Partida direta com emergência (nativo)»** (`f8df6df2-c5dd-4b86-ba54-93aeeddc566b`, revisão `46 → 52` no Supabase) foram organizados em 2D e 3D e filaçados com abraçadeiras PA66, preservando integralmente todos os 16 componentes (incluindo posições personalizadas `TR1 = (475, 636)`, `M1 = (1500, 993)`, `MM1 = (1849, 713)`, `KM1 = (899, 604)`), o Esquema IEC (63 ligações, páginas `Potência` e `Comando LOGO!`), Ladder (2 degraus), GRAFCET (2 etapas), tags, programas PLC, 8 notas e 66 textos de canvas.

## Chicotes aplicados (`38/43` cabos filaçados)

| Chicote (`bundleId`) | Cabos | Descrição |
| --- | ---: | --- |
| `chicote-infeed-source` | 5 | Entrada `XG` (`W1`, `W5`, `W9`, `W14`, `W17`) |
| `chicote-qg~qm1` | 3 | Potência `QG → QM1` (`W2`, `W6`, `W10`) |
| `chicote-km1~qm1` | 3 | Potência `QM1 → KM1` (`W3`, `W7`, `W11`) |
| `chicote-cmd-ac` | 3 | Comando 230 V AC (`W13`, `W15`, `W28`) |
| `chicote-cmd-dc` | 9 | Comando / alimentação / retorno (`W16`, `W19`, `W20`, `W27`, `W30`, `W33`, `W39`, `W40`, `W41`) |
| `chicote-operators` | 11 | Botoneiras e sinalizadores `B0`, `B1`, `H1`, `H2`, `H3` (`W21`, `W22`, `W24`, `W25`, `W26`, `W31`, `W32`, `W34`, `W35`, `W43`, `W44`) |
| `chicote-motor-m1` | 4 | Alimentação + PE do motor `M1` pelo bucim M20 (`W18`, `W36`, `W37`, `W38`) |

Cabos mantidos individuais (`5/43`): pontes curtas no mesmo aparelho (`W23` em `B1`, `W29` e `W42` em `PLC1`) e pontas de prova móveis do multímetro (`MM+`, `MM−`).

## Melhorias de traçado e métricas

- **Comprimento total 3D**: `19 358 mm → 18 785 mm` (`−573 mm` poupados).
- **`W18` (`XG:PE → M1:PE`)**: eliminada a volta exterior à esquerda do painel; desce pela fenda interior `XG–QG` em 2D (`x = 597`) e 3D (`x = −2,683`), segue pelo corredor inferior e entra no bucim M20 de `M1` filaçado com `W36`, `W37` e `W38` (13 abraçadeiras PA66).
- **`W43` (`PLC1:Q0.3·2 → H3:X1`)**: eliminada a volta exterior à direita de `PLC1`; sobe pela fenda interior `PS1–PLC1` (`x = 1,695`) até ao corredor superior dos sinalizadores.
- **`W33` (`KM1:A2 → Q0:4`)**: saída lateral limpa contornando `F1` (`0` colisões com sólidos) até ao corredor inferior.
- **`W32` (`PLC1:Q0.2·2 → H2:X1`)**: removidos `waypoints3D` antigos soltos, integrando-se no chicote dos operadores.
- **Colisões com sólidos**: `0` · **Sobreposições 3D cabo-a-cabo**: `0` · **Diagnóstico**: `✓ Tudo OK` (`0 erro(s)`, `0 aviso(s)`) · **Consola/página**: `0` erros · **Capa**: recapturada e guardada (`coverVersion: 4`, `rev. 52`, `Guardado na conta`).

## Melhorias no código local (`dc-simu`)

Preparadas e validadas (`tsc -b`, `esbuild --splitting`, `native-wires-3d-smoke`, `test:wire-lacing`, `test:wire-curves-refresh`, `test:wire-locks`, `test:solid-cables-meter`, `test:motor-star-delta`, `test:native-estrela-ks1`, `test:panel-accessories`, `test:enclosure-move`, `test:native-sim`, `test:native-diagnostics`, `test:wire-isolation`, `test:canvas-annotations` — 100% PASS) em `src/three/wireGeometry3D.ts`, `src/project/nativeWireCurves.ts`, `src/project/nativeMotorMeter.ts` (`wire-curves-v9`) e `src/project/nativeProjects.ts`.
