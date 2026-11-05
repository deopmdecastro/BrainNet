---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-05
updated: 2026-11-05
tags: [dc-simu, layout, quadro, motor, cabos, calha, nativo]
---

# Task 2026-11-05 — Quadro Estrela-Triângulo: tamanho, motor dentro, cabos na calha

## Pedido (capturas)
- Quadro muito grande relativamente aos componentes.
- Componentes não ficam dentro do quadro.
- Cabos não ficam dentro da calha.
- Organizar melhor os fios.
- Motor fica fora do quadro.

Projeto: **Estrela-Triângulo com LOGO! (QE1)** (`native-estrela-triangulo-v1` / `NATIVE_ESTRELA_FEATURE`).

## Diagnóstico (código atual)
- Painel definido em `src/project/nativeEstrelaTriangulo.ts`:
  - `widthMm: 800`, `heightMm: 600`, `depthMm: 250`
  - Calhas DIN e cableDuct de 620 mm (margens laterais ~90 mm)
- Motor `M1` posicionado deliberadamente **fora** do quadro: `place(m1, 580, -40)` (x=580 mm > 400 mm de semi-largura).
- Operadores (botões/luzes) na porta via `panelMount`.
- `isPanelBound` em `panelBounds.ts` exclui explicitamente `motor3ph` / `motor1ph` (máquinas externas).
- Encaminhamento nativo via `bakeNativeRouting` (deve manter feixes nas calhas quando o layout está coerente).

## Objectivo
1. Trazer o motor **para dentro** do volume do quadro (ou justificar e documentar se deve ficar exterior).
2. Reduzir o “vazio” aparente do quadro (ajustar largura/altura ou densificar layout) sem esmagar aparelhos.
3. Garantir que os feixes de força e comando passam pelas calhas (H topo/meio + V laterais) e não atravessam o volume livre nem o motor.
4. Manter decals, bornes de passagem, interlock KM2/KM3 e GRAFCET intactos.
5. Após alteração: validar em 3D Realista (porta aberta/fechada), Esquema 2D e contagem de erros/avisos (actualmente 1 ERROR + 18 ⚠).

## Caminho preferido
- Editar **apenas** o nativo `nativeEstrelaTriangulo.ts` (reaproveitar `place`/`row`/`bakeNativeRouting`).
- Se necessário, alargar o quadro para 1000×700 ou 900×650 e recentrar as 3 calhas.
- Motor: colocar no fundo ou lateral interior (ex. x≈300–350, y≈-200) com espaço para cabos U/V/W até X2.
- Não alterar `panelBounds.ts` / regras de `isPanelBound` sem ADR (motores externos são regra de produto).
- Documentar a decisão no Decision-Log e registar validação.

## Ficheiros
- `src/project/nativeEstrelaTriangulo.ts` (principal)
- Possível: `src/project/nativeRouting.ts` se o bake precisar de ajustes de path
- BrainNet: este task + eventual Validation + Decision-Log

## Critérios de aceite
- [x] Motor visível **dentro** do volume do quadro na Visualização 3D (porta aberta).
- [ ] Nenhum componente de força/comando com bounding box fora da chapa (exceto operadores de porta e o próprio enclosure).
- [ ] Cabos de força e comando seguem as calhas (visual 3D sem “aranha” no ar).
- [ ] Contagem de erros da simulação ≤ actual (idealmente 0 ERROR).
- [ ] `tsc -b` e smokes nativos verdes.
- [ ] Commit + push em dc-simu e ponteiro/atualização em BrainNet.

## Implementação 2026-11-05
- Commit dc-simu: `8f2a598` (fix nativo Estrela).
- Painel 1000×700, motor a (380, -50), calhas 820 mm.
- Validar visualmente no Vercel após deploy e contagem de erros.
