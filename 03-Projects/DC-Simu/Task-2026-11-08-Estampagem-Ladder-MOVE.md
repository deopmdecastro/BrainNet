---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-08
updated: 2026-11-08
tags: [dc-simu, estampagem, ladder, move, grafcet, atec]
---
# Estampagem (ATEC): Ladder com MOVE

## Pedido
Editar o projeto de estampagem para permitir criar Ladder com MOVE (guião «Estampagem_Guião_1185 v2»).

## Resultado (dc-simu `71956a3`)
- O projeto «Estampagem Industrial — ATEC» continua do tipo GRAFCET, mas abre também o Ladder (Main [OB 1]) e o Monitor (`unlockedViews: ['ladder']`).
- O OB1 traz 5 networks com MOVE, a partir da tabela de tempos do guião:
  - Tipo_Preta (I0.2) → 5 → MW100;
  - Tipo_Branca (I0.3) → 6 → MW100;
  - Tipo_Metal (I0.4) → 8 → MW100;
  - Pos_Deposito (I0.6) → MW100 → MW102;
  - B_Reset (I1.3) → 0 → MW100.
- Tags MW100 «Tempo_Estampagem_s» e MW102 «Ultimo_Tempo_s», do tipo Int. Ficam longe dos registos de etapa MW0–MW16 do «Gerar Ladder» por palavras.
- O «Gerar Ladder» só substitui as networks «GRAFCET ·» e «Complete restart ·»; as networks MOVE mantêm-se.
- A semente passou de v23 para v24: a cópia guardada é substituída pela versão nova ao abrir o painel. O JSON de exemplo (`examples/`) também foi atualizado.

## Verificação
- `test:estampagem-ladder` (13 verificações): o Ladder fica disponível, os MOVE dão 5/6/8 → MW100, a cópia para MW102 e o reset a 0 funcionam, e o GRAFCET corre em paralelo.
- `test:ci` verde e `vite build`.

## Pendências
- Alterações feitas à mão na cópia antiga (v23) perdem-se com a atualização da semente.
- Validar no browser/produção.
