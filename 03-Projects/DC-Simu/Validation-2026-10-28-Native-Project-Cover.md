---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, projects, cover, native]
---
# Validação 2026-10-28 — Capa do projeto nativo no painel de projetos

## Pedido
O projeto nativo no painel de projetos estava sem capa; colocar capa como nos outros, mostrando o projeto real.

## Causa
`ensureNativeProjects` só inseria a semente se o id não existisse. Uma entrada antiga sem `components` permanecia e `buildProjectPreview` devolvia capa vazia («Projeto vazio»).

## Correção
Em `src/auth/localBackend.ts`:
- Se o nativo existir mas não tiver componentes, repõe o conteúdo da semente `nativePartidaDiretaContent()`.
- `previewFor` faz o mesmo fallback em tempo de listagem para a composição do esquema aparecer no cartão.

## Commit
`146bc32` — fix(projects): show real schematic cover for native project
