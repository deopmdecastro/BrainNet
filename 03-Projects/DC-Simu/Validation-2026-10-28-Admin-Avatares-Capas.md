---
project_id: BN-DCSIMU-001
type: validation
status: PARTIAL
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, admin, avatar, cover, mobile, desktop, ux]
---
# Validação 2026-10-28 · Administração: avatares, capas e ações do cabeçalho

Commit da aplicação: `d9e2b69` (dc-simu, `main`).

Origem: 4 capturas do telemóvel (Projetos, Componentes, Biblioteca 3D, Sistema) e o pedido de avatares, capas, ícones e melhores botões «Novo componente» e «Projetos».

## O que mudou

| Área | Antes | Agora |
| --- | --- | --- |
| Utilizadores | Inicial numa bola azul igual para todos | `Avatar` partilhado: fotografia (`avatarUrl`) ou iniciais com 8 tons estáveis por e-mail; ponto de estado ativa/bloqueada |
| Projetos | Tabela só com texto; no telemóvel cartão de linhas cinzentas | Capa do projeto (`ProjectThumb`) + nome + revisão; proprietário com avatar; cartão com cabeçalho de capa e «Eliminar» com ícone a toda a largura |
| Componentes | Só texto e etiquetas | Capa 3D real (`ComponentCover` → `ComponentThumb`), montada só quando a linha se aproxima do ecrã |
| Cabeçalho | Dois botões com o mesmo peso | «Novo componente 3D» com ícone em medalhão e subtítulo; «Projetos» com seta que recua ao passar; 44 px (48 px no telemóvel) |
| Biblioteca 3D | Dois «+ Novo componente 3D» seguidos no telemóvel | Um só (o do cabeçalho); backup, recuperar e sincronização com ícones, 44 px |
| Sistema | Números e linhas sem ícone | Indicadores e linhas de armazenamento/aplicação com ícone por significado; ações a toda a largura no telemóvel |
| Últimas contribuições | Só texto | Avatar do autor em cada linha |

## Ficheiros (repositório dc-simu)

- Novos: `src/ui/Avatar.tsx`, `src/admin/AdminCovers.tsx`, `src/styles/admin-polish.css` (importado depois de `admin-refine.css`, antes de `mobile-refine.css`).
- Alterados: `AdminPanel.tsx`, `ComponentsTab.tsx`, `UsersTab.tsx`, `SystemTab.tsx`, `editor3d/CatalogTab.tsx`, `adminTypes.ts` (`avatarUrl`, `preview`), `auth/localBackend.ts` e `server/admin.mjs` + `server/index.mjs` (a lista admin de projetos devolve `preview`, em cache por revisão; o conteúdo bruto não sai).
- Supabase: `supabaseGetAdminProjects` não devolve `preview`; as capas caem na versão de cor + ícone.

## Verificações

| Verificação | Resultado |
| --- | --- |
| `tsc -b` | OK |
| `npm run test:style` | OK (sem barras laterais de destaque) |
| `npm test`, `test:saas` (58), `test:project-names` (14), `test:server` (166) | OK |
| `vite build` | OK |
| `test:admin-ui` / capturas a 390, 768, 1024 e 1440 px | **Não executado**: sem navegador no ambiente (download do Playwright bloqueado) |

O smoke `admin-ui-smoke.mjs` exige dois botões no cabeçalho, ao mesmo nível e com ≥ 40 px: mantidas as classes `.dx-admin-head-actions .dx-btn`. Estado: **implementado e verificado por tipos/build/testes; render visual pendente**.

## Pendente

- Correr `npm run test:admin-ui` e confirmar visualmente em telemóvel físico (UI-VISUAL-01): capas de projeto com `preview`, avatar com foto, cartão de projeto a 390 px.
- Ecrã onde o utilizador possa carregar a fotografia de perfil (hoje só há o campo `avatarUrl` e o fallback).
- Aplicar `Avatar` ao centro de conta (`AccountControls`) e ao Dashboard, que ainda usam `dx-avatar`.
