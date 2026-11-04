---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-04
updated: 2026-11-04
tags: [brainnet, dc-simu, auth, ux, esquadria, canvas]
---
# Login, criar conta, esquadria e imagens no canvas

## Objetivo
Melhorar a UI/UX de login e criação de conta; recolher função/cargo e instituição no registo; permitir atualizar depois; preencher a esquadria com esses dados; logótipo personalizado em planos pagos; permitir anexar imagens nas notas do canvas dos editores.

## Alterações (dc-simu)

### Autenticação (`src/account.tsx`, `src/styles/dx.css`)
- Ecrã de acesso com separadores **Entrar** / **Criar conta**.
- Registo pede: nome, e-mail, palavra-passe (+ confirmação e medidor de força), função/cargo, tipo de instituição (escola / trabalho / projeto próprio) e nome da instituição.
- Textos laterais e dicas alinhados ao uso na esquadria.
- Fluxo `/register` com os novos campos.

### Perfil de utilizador
- `User` alargado: `jobTitle`, `institution`, `institutionKind`, `customLogo`.
- Perfil local (`localBackend`) e metadados Supabase (`supabaseBackend`, `accountApi`) persistem e devolvem estes campos.
- Página da conta: editar função, instituição e tipo; carregar/remover logótipo da esquadria (planos Pro / Escola / Empresa ou admin).

### Esquadria PDF
- `ExportPdfDialog` preenche empresa, subtítulo, autor e função a partir do perfil (viewer).
- `PdfTitleBlock.customLogo` e desenho no PDF quando existe logótipo personalizado.

### Canvas dos editores
- `CanvasNote.image` opcional (data URL).
- UI na nota: anexar imagem (máx. 2 MB) e remover; pré-visualização no cartão.

### Viewer
- `getViewer` passa jobTitle, institution, institutionKind, customLogo e plan para o diálogo de exportação e outras vistas.

## Reaproveitamento
- Estilos e tokens existentes (`dx-auth`, `dx-field`, `dx-btn`, `AccountPage` / `acp-*`).
- `resizeAvatar` reutilizado para o logótipo da esquadria.
- Sem reescrita do motor de PDF — só preenchimento e célula de logótipo.

## Verificação sugerida
1. Abrir `/login` → alternar Entrar / Criar conta; validar campos obrigatórios e força da palavra-passe.
2. Com Supabase: criar conta e confirmar metadados no perfil.
3. Conta local: atualizar função/instituição na página da conta e exportar PDF — esquadria pré-preenchida.
4. Plano pago: carregar logótipo e verificar na pré-visualização / PDF.
5. Num editor (esquema / GRAFCET / comandos): criar nota, anexar imagem, guardar projeto e reabrir.

## Commits
- Código: repositório `deopmdecastro/dc-simu`.
- Contexto: esta nota em BrainNet.
