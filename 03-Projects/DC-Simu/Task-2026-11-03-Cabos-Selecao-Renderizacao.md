---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-03
updated: 2026-11-03
repos: [dc-simu, BrainNet]
tags: [dc-simu, cabos, selecao, renderizacao, nativo]
---
# Cabos nativos: seleção, organização e renderização

## Contexto reutilizado
- O BrainNet é a fonte de contexto de UI/UX, decisões e evidências.
- O DC-Simu já possui roteamento nativo determinístico (`src/project/nativeRouting.ts`) e cálculo 3D assíncrono com retenção do último resultado (`src/three/useWireRouting.ts`).
- As curvas nativas existentes e os testes `native-wires-3d`/`wire-curves-refresh` devem ser preservados.

## Implementação
- Reutilizado o encaminhamento existente; a alocação de faixas agora calcula uma única vez o índice de dispersão para manter a mesma ordenação entre os eixos horizontal e vertical.
- Reduzido o volume invisível de picking dos cabos para 16–48 segmentos, mantendo a geometria visível e as curvas renderizadas sem redução equivalente. Isto diminui o trabalho de reconstrução ao selecionar um cabo.
- Mantido o worker e o último traçado válido durante refresh para impedir que a seleção limpe ou recarregue visualmente o conjunto de cabos.

## Validação pendente
- `npm run typecheck`
- `npm run test:native-wires-3d`
- `npm run test:wire-curves-refresh`
- verificação browser do editor nativo e seleção repetida de cabos

## Entrega
O commit do código deve ser feito em `dc-simu`; depois o BrainNet atualiza esta evidência e referencia o commit do submódulo antes do push de ambos os repositórios.
