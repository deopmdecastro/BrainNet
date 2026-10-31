---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
commit: 85dbe04
repos: [dc-simu, BrainNet]
tags: [dc-simu, loading, cabos, 3d, ux]
---

# Carregamento do canvas enquanto os cabos são calculados

## Pedido
Substituir a mensagem «A calcular os cabos…» pelo ecrã de carregamento do editor, cobrindo o canvas até o encaminhamento estar pronto.

## Plano e critérios
- Reutilizar `RouteLoading` tanto para modelos GLB como para o encaminhamento em curso.
- Quando o encaminhamento falhar, retirar o carregamento e preservar a mensagem de erro e a ação de repetição; não esconder falhas indefinidamente.
- Manter o cálculo assíncrono e apresentar o canvas após a conclusão; testar também o caso sem cabos e novo cálculo após alterações.
- Trabalhar no submódulo do cofre e atualizar a referência do DC-Simu no BrainNet após o commit.

## Implementação
- `Wires3D` comunica ao `Panel3D` o estado pendente do worker; o mesmo `RouteLoading` cobre o canvas durante carregamento de modelos ou encaminhamento.
- Um erro remove o ecrã de espera e mantém a mensagem com «Tentar novamente»; quando a geometria muda, o ecrã volta durante o novo cálculo.
- Commit DC-Simu: `85dbe04` (inclui o carimbo de release automático).

## Validação
- `npm run typecheck`: passou.
- `test:native-wires-3d`: passou.
- `wire-routing-ui-smoke.mjs` com Node 22 e Chromium: 7 verificações passaram, incluindo trabalho assíncrono, cancelamento, erro e repetição. Este teste valida o worker, não a aparência do overlay.
- `editor3d-functional-smoke.ts`: falhou em «Exportação conserva a posição dentro do furo»; a mesma falha reproduz-se na revisão original `1061ae8`, sem esta alteração.
- Build Vite: não concluiu por limite de memória do ambiente.
- Falta confirmação visual do overlay no browser do utilizador; não foi confirmado deploy em produção.
