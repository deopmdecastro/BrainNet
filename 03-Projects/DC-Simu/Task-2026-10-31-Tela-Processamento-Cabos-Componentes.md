---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
commit: 1061ae8
tags: [dc-simu, loading, cabos, componentes, 3d, ux, render]
repos: [dc-simu, BrainNet]
---

# Tela de processamento — só carregamento de página (sem cartões escuros por GLB)

## Objectivo
Enquanto os GLB de cada componente não carregaram, o **único** carregamento visível deve ser o de página («A carregar o editor…»). Remover o outro tipo de carregamento em cartão/tela escura (ModelLoading3D).

## Evidência
- Captura: ecrã de página «A carregar o editor…» (marca + barra).
- Pedido do utilizador: «rem um outro tipo de carregamento em tela preta. e em cada componente, enquanto gbl não carregou, o unico carregamento deve ser de pagina».

## Alterações (dc-simu)
1. **Removido** o componente `ModelLoading3D` (cartão escuro `rgba(15,23,42,.92)` com % por modelo).
2. Todos os `<Suspense fallback={<ModelLoading3D …/>}>` dos modelos 3D passaram a `fallback={null}` (12 ocorrências).
3. Novo `ModelsProgressReporter` dentro do Canvas: propaga `useProgress().active` para o estado do `Panel3D`.
4. Overlay a cobrir o stage com o **mesmo** `RouteLoading` da aplicação (`label="A carregar o editor…"`) enquanto `modelsLoading` é verdadeiro.
5. O overlay «A calcular os cabos…» continua a só aparecer quando os modelos já não estão a carregar (gate anterior mantido).

## Ficheiros
- `src/three/Panel3D.tsx`

## Critério de aceite
- [x] Sem cartões de carregamento escuros por componente.
- [x] Enquanto GLBs carregam, só se vê o carregamento de página sobre a vista 3D.
- [x] Após os modelos, a vista e (se necessário) o overlay de cabos comportam-se como antes.
- [ ] Confirmar visualmente no browser do utilizador.

## Notas
Trabalho prioritário no cofre; commit + push em ambos os repositórios após a alteração de código.
