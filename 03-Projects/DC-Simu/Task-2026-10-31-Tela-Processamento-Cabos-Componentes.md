---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
commit: 6872dbb
tags: [dc-simu, loading, cabos, componentes, 3d, ux, render]
repos: [dc-simu, BrainNet]
---

# Tela de processamento quando cabos ou componentes ainda não renderizaram

## Objectivo
Garantir que a indicação de processamento (ecrã «A carregar o editor…» / overlay «A calcular os cabos…» / ModelLoading3D) aparece de forma coerente e útil quando os cabos ou outros componentes ainda não renderizaram, evitando estados confusos ou cenas incompletas sem feedback.

## Evidência (capturas do utilizador)
1. Vista 3D do painel com overlay centrado «A calcular os cabos…», componentes (B0, B1, H1/H2, PS1, PLC1, QM1, KM1, Q0, motor M1 DRN80MK4/B3 parado, multímetro MM2) parcialmente presentes, e indicação de cálculo ativo.
2. Ecrã completo de carregamento do editor (marca DC-SIMU / raio, barra indeterminada, «A carregar o editor…»).

## Contexto técnico actual
- `src/ui/RouteLoading.tsx` + `src/account.tsx`: fallback Suspense da rota do editor («A carregar o editor…»).
- `src/three/Panel3D.tsx`:
  - `ModelLoading3D` (Suspense + `useProgress`) por modelo GLB: «A carregar {ref}…» com barra de progresso %.
  - Overlay Html «A calcular os cabos…» enquanto `!coordinatedPaths` (worker em `useWireRouting`).
- Worker assíncrono (`useWireRouting` + `wireRouting.worker.ts`) evita bloqueio da página (correção anterior em Validation-2026-10-30-Bloqueio-Pagina-Cabos).
- Último commit em dc-simu antes desta tarefa: `beaa3c5` «fix: show loading state instead of GLB fallback» — introduz ModelLoading3D com progresso.

## Problema observado
Quando os cabos ou um componente ainda não renderizou, a tela/overlay de processamento aparece (ou permanece). Em particular, o overlay centrado «A calcular os cabos…» podia sobrepor-se a ModelLoading3D enquanto GLBs ainda estavam em Suspense, produzindo uma tela de processamento sobre uma cena incompleta.

## Implementação
- Em `Wires3D` (`src/three/Panel3D.tsx`): obter `active` de `useProgress()`.
- Condicionar o overlay: `{!coordinatedPaths && !modelsLoading && <Html …>}`.
- O cálculo no worker continua a correr normalmente; apenas o feedback visual do overlay de cabos é suprimido enquanto modelos carregam. Assim que os modelos terminam, se o cálculo ainda estiver em curso o overlay aparece.
- Comentário no código explica a intenção (evitar sobreposição confusa).

## Ficheiros
- `src/three/Panel3D.tsx` (gate do overlay)

## Critério de aceite
- [x] Overlay «A calcular os cabos…» só aparece quando existem cabos, o cálculo está em curso **e** os modelos já não estão em loading activo.
- [x] ModelLoading3D continua a mostrar progresso por componente.
- [x] RouteLoading do editor inalterado (comportamento de rota).
- [x] Sem alteração ao worker / performance.
- [ ] Testes existentes a confirmar no ambiente local do utilizador (`test:wire-routing-ui`, `test:native-wires-3d`, typecheck).

## Commit
`6872dbb` em dc-simu.

## Notas
Prioridade do utilizador: trabalhar no cofre (BrainNet) primeiro, depois commit/push em ambos os repositórios. Autorização explícita para git commit/push.
