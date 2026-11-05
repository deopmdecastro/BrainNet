---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-05
updated: 2026-11-05
tags: [dc-simu, calha-tecnica, inspetor, colisao, ux]
---
# Calha: o comprimento não se consegue alterar

## Pedido
«Não consigo mexer no comprimento da calha.» Reaproveita o inspetor da calha de [[Task-2026-11-05-Inspetor-Calha-Tablet-Estreito]] e as regras de colisão do Esquema.

## Causa
`updateComponentRaw` recusa **toda** a mudança de `w/h` (e as medidas em mm) quando o novo footprint toca noutro aparelho ou atravessa a parede do quadro, e só deixa um aviso no registo. Com a calha encostada a bornes ou à moldura do quadro (caso do quadro Estrela), o slider, o campo e os atalhos pareciam mortos. O crescimento era sempre ao centro, o que duplica a hipótese de colisão.

## Resultado (dc-simu `f078afb`)
- `fitDuctResize` (`src/schematic/ductResize.ts`, função pura): tenta ancorar à esquerda, à direita e ao centro; se o pedido não cabe, aplica o maior comprimento que cabe (passos de 5 mm, nunca abaixo do atual).
- Inspetor: comprimento, atalhos e largura passam por `resizeDuct`; quando limita, avisa «CT1 limitada a N mm: encosta noutro aparelho ou na parede do quadro» (no máximo uma vez por 1,5 s, sem spam durante o arrasto do slider).
- Teste novo `test:duct-resize` (4 verificações), ligado ao `test:ci`.

## Pendências
- Validar no tablet com a calha dentro do quadro e encostada a bornes.
- O aviso fica no registo de eventos; falta uma mensagem junto ao slider se o utilizador quiser feedback mais visível.
- Altura (parede Z) não é afetada por colisão 2D.
