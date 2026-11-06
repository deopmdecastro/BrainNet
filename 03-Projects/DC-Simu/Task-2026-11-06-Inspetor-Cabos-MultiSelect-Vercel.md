---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-06
updated: 2026-11-06
tags: [dc-simu, inspetor, cabos, seleção, vercel, build]
---
# Inspetor/cabos/seleção múltipla + correção de build Vercel

## Pedido
Resolver erros do Vercel; antes disso melhorar o painel lateral de inspeção, garantir que os cabos podem mudar de cor e diâmetro depois de colocados; no cartão inferior ao clicar num componente, opção de seleção múltipla.

## Correção de build
- `ductJunctions.ts`: a troca `if (f > t) f, t = t, f` é inválida em JS (vírgula não troca como em Python) e partia o bundle. Corrigido para bloco com variável temporária.

## Cabos (cor / secção)
- `patchSelectedWire` no inspetor aplica o patch a **todos** os `selectedWireIds` (não só ao cabo principal).
- Cor, secção (`gauge`), tipo, flexibilidade, capa e veias passam a alterar a seleção múltipla de uma vez.
- Mensagens de «Guardar cabo» adaptadas ao número de cabos.

## Seleção múltipla no cartão inferior (`SelectionBar`)
- Novo estado `multiSelectMode` / `toggleMultiSelectMode` no `useSimStore`.
- Botão **Multi** na barra contextual (ícone camadas + etiqueta); estado `is-on` quando ativo.
- Com o modo ativo, cliques no Esquema e no 3D acumulam na seleção (equivalente a Shift/Ctrl), incluindo cabos e marquee.
- Shift/Ctrl/Cmd continuam a funcionar como antes.

## Ficheiros
- `src/schematic/ductJunctions.ts`
- `src/components/Sidebar.tsx`
- `src/components/SelectionBar.tsx`
- `src/store/useSimStore.ts`
- `src/schematic/SchematicView.tsx`
- `src/three/Panel3D.tsx`
- `src/styles/clean-mode.css`
