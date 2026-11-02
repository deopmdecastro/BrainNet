---
project_id: BN-WEBSITE-001
type: architecture
status: PROPOSED
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, architecture]
---
# Arquitetura técnica do website

Escolha proposta: páginas estáticas e um endpoint server-side pequeno para contactos. A decisão final depende de edição, alojamento e funcionalidades confirmadas. Não foram instalados frameworks.

| Alternativa | Adequada quando | Custos de manutenção |
| --- | --- | --- |
| HTML/CSS e conteúdo versionado | Poucas páginas e edição técnica | Poucas dependências; componentes manuais |
| Gerador estático com componentes | Serviços/casos reutilizam estruturas | Build e atualizações de framework |
| Framework com servidor | Área autenticada ou lógica dinâmica confirmada | Operação de servidor e gestão de sessões |
| CMS | Edição frequente por equipa não técnica | Permissões, atualizações, backups e integração |

Esta é uma comparação de modelos arquiteturais; não certifica funcionalidades ou preços de versões específicas de produtos.

## Percurso de contacto proposto
Browser → endpoint próprio → validação/rate limit → registo durável com chave única → encaminhamento autorizado para n8n → acompanhamento humano. O segredo n8n fica no servidor, nunca no bundle do browser. Estado de entrega separado do estado comercial.

## Ambientes
Desenvolvimento com fixtures; staging com sandbox de integrações; produção só após autorização do responsável. Secrets diferentes por ambiente. Fixar versões e lockfile quando a stack for selecionada. Separar exportações de configuração de dados e credenciais.
