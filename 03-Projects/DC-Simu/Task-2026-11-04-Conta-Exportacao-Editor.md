---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-04
updated: 2026-11-04
repos: [dc-simu, BrainNet]
tags: [dc-simu, conta, login, exportacao, esquadria, editor]
---
# Conta, exportação e editores

## Contexto
- Reutilizado o sistema existente de conta, `accountApi`, `AccountPage`, `ExportPdfDialog` e as regras de UI documentadas em `Design-Principles.md`.
- A plataforma atualmente tem backend local SQLite/Supabase opcional e modo offline com contas fixas.

## Implementado
- Login e criação de conta com nome, função/cargo, instituição, e-mail e palavra-passe.
- Perfil editável para atualizar estes dados depois do registo.
- Exportação com modal reorganizada, espaçamento dos cartões, campos da esquadria recolhíveis e resumo fixo.
- Esquadria preenchida a partir dos dados da conta/projeto e logótipo personalizado condicionado ao plano.
- Canva dos editores com inserção de imagens e persistência no projeto.

## Verificação
- `npm run typecheck`: passou nesta sessão.
- Smoke SaaS: passou com 58 verificações.
- Preview mobile: fluxo de criação de conta confirmado por snapshot e screenshot.
- Implementação complementar já existente no remoto: DC-Simu `b64a1aa` (auth/perfil/imagens) e `c5d8607` (logótipo/exportação).
