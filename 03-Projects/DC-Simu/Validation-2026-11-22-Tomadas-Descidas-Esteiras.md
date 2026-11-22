---
type: validation
status: IMPLEMENTED
created: 2026-11-22
updated: 2026-11-22
tags: [dc-simu, maquete, estampagem, tomadas, RoadEu, esteiras]
---
# Tomadas RoadEu 70929 no fim das descidas (compressor e mesa)

## Pedido

No final da calha do compressor e da mesa da maquete colocar a tomada com interruptor (RoadEu 70929), fixada na parede e no pilar.

## Solução

Reutilizada a tomada já existente no catálogo: `socketFamatelSwitch` — **RoadEu 70929 · CEE 2P+T 16 A 230 V · Seccionador 0–1 · IP44**.

Em `src/electrical/stampingBench.ts` (commit `43c6952`):

| Key | Posição | Fixação |
|-----|---------|---------|
| `socket-compressor` (`XS-COMP`) | Fim da descida do compressor, ~1,10 m do chão | Costas na parede (`wallZ + depth/2`) |
| `socket-bench` (`XS-MAQ`) | Fim da descida da bancada / face do pilar IPE100 | Costas na face +Z do pilar |

- Estado inicial: seccionador ligado, tampa fechada.
- Contagens da maquete ATEC: **94 peças** (antes 92), **145 componentes** no total (base + 94 + QGD 50). Testes `ready-maquettes-smoke` e `maquettes-build-smoke` atualizados.

## Verificação

- Push `origin/main` em `43c6952`.
- Revisão visual após build: orientação da face (CEE + manípulo 0/1) para a nave e alinhamento com o fim das esteiras.

Estado: **implementado e publicado**.
