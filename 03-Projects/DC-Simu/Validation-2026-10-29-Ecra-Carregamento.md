---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, loading, ui, accessibility]
---
# Ecrã de carregamento

## Resultado

Cartão mais amplo e legível, com a marca existente, circuito decorativo animado
e rótulo contextual em destaque. Texto de apoio em português europeu e fundo
técnico discreto. Adaptação ao telemóvel e modo estático para movimento reduzido.
Não há percentagens, etapas artificiais ou atrasos acrescentados à navegação.

O componente extraído mantém os fallbacks e os sete rótulos das rotas existentes.

## Ficheiros

- `src/ui/RouteLoading.tsx`: componente partilhado.
- `src/account.tsx`: importação nos mesmos fallbacks.
- `src/styles/dx.css`: estilos específicos do carregamento.
- [Documentação técnica](./dc-simu/docs/ECRA-CARREGAMENTO.md).

## Verificações e evidências

Núcleo do simulador, TypeScript e build Vite/PWA passaram. O build mantém o
aviso existente de chunks grandes. BrainNet: 45 testes e verificação documental.

Chrome local: sete rótulos a 1920×1000, 768×1024, 390×844, 320×568 e 844×390,
sem transbordo horizontal nem erros JavaScript. Verificados fallback integrado
sob cabeçalho, estado acessível e ausência de animações contínuas com movimento
reduzido. Pré-visualização isolada com o componente e CSS reais, sem serviços externos.

Revisão visual independente: PASS, sem correções obrigatórias. Limitação da
revisão: modelo do mesmo fornecedor; outro fornecedor indisponível na sessão.

Logs `runtime/loading-{core-test,build,ui}.log`; capturas desktop/móvel
`runtime/loading-ui/loading-1920.png` e `runtime/loading-ui/loading-390.png`.

## Estado e pendências

Implementado e testado localmente no commit `918bc63`, enviado para `origin/main`
conforme o pedido direto.
Aprovação funcional final a cargo do utilizador. Publicação em produção e
reconstrução da imagem Docker não efetuadas nesta tarefa.
