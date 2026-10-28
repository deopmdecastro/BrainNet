---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
repo: deopmdecastro/dc-simu
commit: b05219b
date: 2026-10-28
---

# Projeto nativo «Partida direta» materializado na conta admin (Supabase)

## Problema observado

Na imagem do Espaço de trabalho do utilizador Admin só aparecia o projeto «Teste».
O projeto nativo «Partida direta (nativo)» — alimenta a demo real da landing — só
era semeado no **backend local** (`auth/localBackend.ts` → `ensureNativeProjects`).
Com a conta em Supabase (`accountApi` → `supabaseApi` → `supabaseGetProjects`),
a semente nunca era criada.

## Solução (dc-simu `b05219b`)

1. **`supabaseGetProjects`**: para contas `admin`, antes de devolver a lista,
   materializa na base cada semente nativa (`nativeProjectSeeds()`) cujo marcador
   **`content.nativeId`** ainda não exista entre os projetos carregados. O INSERT
   ocorre uma única vez por conta; a partir daí o projeto existe como qualquer
   outro: editável, com revisões, e elegível para «Publicar na landing»
   (`platform_settings.landing_published_project`).

2. **Idempotência robusta**: deteção por `content.nativeId` e não por nome —
   sobrevive a renomeações. Para que a marca não se perca após «Guardar», a loja
   ganhou `nativeId: string | null`: `loadJSON` lê a marca do ficheiro,
   `saveJSON` volta a escrevê-la, `newProject` limpa-a.

3. **Testes**: `landing-demo-smoke` cresceu para 27 asserções — preservação da
   marca saveJSON/loadJSON/newProject e asserts estruturais da semeadura admin.

## Validação

- typecheck limpo; `npm test` OK; 23 suites verdes (incl. landing-demo,
  landing-editor, style, saas, ladder×5, grafcet×5, server, fluidsim…).
- Comportamento esperado no próximo carregamento do dashboard: a entrada
  «Partida direta (nativo)» passa a constar dos projetos do Admin (painel de
  administração → projetos → «Publicar na landing» fica também disponível).

## Notas operacionais

- Sem necessidade de migração SQL — a marca viaja dentro de `content`.
- Contas não-admin não recebem semente (intencional: projeto interno de demo).
