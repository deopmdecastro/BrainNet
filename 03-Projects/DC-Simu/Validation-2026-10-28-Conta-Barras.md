---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_VISUAL_PENDING
created: 2026-10-28
updated: 2026-10-28
tags: [brainnet, dc-simu, account, toolbar, responsive]
---
# Validação — conta do criador e barras (2026-10-28)

**Commit:** `3c4a9df` (dc-simu, branch `feat/account-page-toolbar-refine`, sobre `b8b6017`).

## Alterações
- Barra: «Novo» `+`, «PDF» `IconPdf`, vista/botão GRAFCET `IconGrafcet`, reiniciar sequência `IconRotate`; menu «Ficheiro» (`ToolMenu`) abaixo de 720 px; Run/Pausa/Stop/Passo/Reiniciar sempre visíveis, também no GRAFCET.
- Cabeçalho: `header-refine.css` (48/52 px, controlos 34/38 px, safe-area, o nome do projeto cede por último). A altura do editor passa a `calc(100dvh - var(--hdr-total))` em vez de `calc(100vh - 42px)` inline.
- Conta: `/account`, `AccountPage.tsx`, `account-page.css`; `PATCH /api/account/profile`; `supabaseUpdateProfile`; perfil local (`updateLocalProfile`); coluna `users.avatar`.
- Comentários verificados: `ProjectComments` (SQLite/Supabase/local, âncoras geral/esquema/3D/Ladder/GRAFCET, plano `comments`, atualização a 20 s) e pins de canvas (`a4905fb`).

## Evidência
| Verificação | Resultado |
| --- | --- |
| `tsc -b` | passa |
| `vite build` | passa (`AccountPage` em chunk próprio) |
| `npm test`, `test:style`, `test:saas` | passam |
| `test:server` | 11 verificações novas de perfil passam |

## Por confirmar
Render visual a 390/768/1024/1440 px (sem navegador no ambiente); Supabase real; a integração com o `main` do dc-simu.
