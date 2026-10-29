---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, toolbar, grafcet, annotations, supabase]
---
# Anotações nas barras e correção dos comentários

## Resultado

Comentário e Texto integrados na barra do Esquema/3D e do GRAFCET. Em ecrãs
estreitos, as ações estão em Ferramentas → Anotações. Removido o grupo flutuante
de criação do canvas. A colocação de texto tem estado ativo na barra e cancela
com Esc. O GRAFCET recebe o cartão de comentário partilhado com o 3D, com
conversa, arrasto e persistência por folha.

Corrigidos os pedidos Supabase de listar/criar/atualizar comentários: deixam
de exigir uma relação direta entre `project_comments.author_id` e `profiles`,
inexistente nas migrações atuais. Os nomes são lidos separadamente com RLS.
O erro na leitura de um nome não invalida uma escrita já concluída.

## Ficheiros

- Interface: `Toolbar.tsx`, `simUi.ts`, `Panel3D.tsx`, `CanvasAnnotations3D.tsx`,
  `CanvasNoteCard.tsx`, `GrafcetEditor.tsx`, `GrafcetNotes.tsx`, `grafcetBus.ts`,
  `types/index.ts` e `canvas-annotations.css`.
- Supabase: `src/supabase/supabaseBackend.ts`.
- Regressão: `supabase-comments-smoke.ts`, `annotation-toolbar-ui-smoke.mjs`,
  `canvas-annotations-smoke.ts` e `package.json`.
- [Documentação técnica](./dc-simu/docs/ANOTACOES-BARRA-COMENTARIOS.md).

## Verificações e evidências

Núcleo do simulador, SaaS (58 verificações), persistência das anotações,
cliente PostgREST contra REST sintético, TypeScript e build passaram.
Os testes das barras e de anotações em Chrome passaram, incluindo 1920,
1280, 768 e 390 px; sem transbordo horizontal nem erros JavaScript.
BrainNet: 45 testes e verificação documental passaram.

Logs `runtime/annotations-comments-*.log`; capturas
`runtime/annotations-comments-ui/annotations-3d.png` e `annotations-grafcet.png`.
Todos os testes usam dados sintéticos e bloqueiam chamadas aos serviços reais.

## Estado e pendências

Implementado e testado localmente no commit `56a0841`, enviado para `origin/main`
pelo pedido direto. O pull posterior integrou `bd0b4a0` na aplicação; os testes
acima referem-se à implementação das anotações antes desse pull.
O DC-Simu não consta dos projetos acessíveis pela ligação Supabase da sessão:
validação remota pendente. Publicação em produção não verificada e aprovação
funcional final a cargo do utilizador.
