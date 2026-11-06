---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-06
updated: 2026-11-06
tags: [dc-simu, grafcet, estampagem, atec, nativo, io]
---
# Projeto nativo GRAFCET — Estampagem Industrial (ATEC)

## Fontes
- `grafcet-estampagem-industrial-v7-compativel.json` (estrutura GRAFCET + tags)
- `Tabela IN_OUT do PLC.xlsx` (C1_FC_0…15 → %I0.0…15; saídas %Q0.0…8)
- `Estampagem_Guião_1185 v2` (processo, tempos 5/6/8 s, HMI Manual/Auto, rampas máx. 2)

## Entregável
- `examples/grafcet-estampagem-industrial.json` (`nativeId`: `grafcet-estampagem-industrial-v8`)
- Cópia em artefactos: `grafcet-estampagem-industrial-nativo.json`

## Conteúdo
- GRAFCET automático: etapas 0→7 (alimentação, deteção, transporte, estampagem por tipo, depósito, retorno) + GRAFCET segurança 10↔11
- Tempos: Preta 5 s, Branca 6 s, Metálica 8 s (`Ns/X…`)
- Tags com comentário dual: nome lógico + endereço físico da tabela
- Notas no canvas: como testar, requisitos do guião, I/O físico, pneumática/potência
- Virtual I/O: emergência NC, START/rearme push, modos latch; I0.15 e I0.13 ativos no arranque

## Nota de mapeamento
O GRAFCET é **pedagógico** (3 rampas / 3 gavetas lógicas). A tabela física tem braço central (sobe/desce), uma gaveta avança/recua e cilindro de estampa em %Q0.0–%Q0.8. No comissionamento real, mapear saídas lógicas → válvulas do quadro RS403/409.

## Atualização — exemplo nativo no código (`23f013b`)
- Função `estampagem()` em `src/project/grafcetExamples.ts`
- Incluída em `grafcetExamples()` → projetos semeados (`nativeProjectSeeds`) e «Modelos GRAFCET»
- `nativeId`: `grafcet-estampagem-industrial-v8` (repõe se o admin apagar o projeto)
- Abrir: lista de projetos (conta admin/local) ou Modelos GRAFCET no editor
