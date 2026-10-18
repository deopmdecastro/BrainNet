---
type: review
status: COMPLETE_STATIC_REVIEW
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, workflows, reference]
---
# Revisão do DC-SIMU

Fonte fornecida: `DC-SIMU (2).json`, lida sem modificar o original. O export contém 65 nós e `active: true`, várias origens, providers de IA, escrita em serviços externos, deploy, reporting e saúde. Foi analisado estaticamente; não foi executado nem importado na instância ativa.

## Ideias aproveitadas
Normalizar origens, preparar contexto por especialidade, separar destinos e manter observabilidade. A biblioteca nova divide responsabilidades e começa por transformação local com revisão.

| Evidência no export | Problema | Tratamento na nova fundação |
| --- | --- | --- |
| `Autorizar Deploy`: `else if (j.auto || j.via_token) authorized = true` antes da verificação de produção | Flags de fluxo ultrapassam a regra de utilizadores de produção | Nenhum executor; campos extra rejeitados; QA verde continua sem autorização |
| `Normalizar e Delegar`, ramo GitHub, confia em headers/body sem verificar assinatura nesse código | A origem não é comprovada pelo parser | Não expor parser como webhook; adaptador autenticado fica como trabalho explícito |
| Fixture marca dry_run, mas vários ramos seguem até HTTP/IA e escrita em registos | Simulação não é garantia global de ausência de efeitos | Exports novos só têm transformação e trigger manual; testes sem rede |
| `Montar Resposta` usa `.first()` do normalizador | Vários itens podem reutilizar contexto do primeiro | Transformação item a item com pairedItem e teste de batch |
| `Parsear Plano` faz fallback para criar issue de texto livre | Falha de esquema ainda pode produzir escrita externa | Plano é proposta; validação antes de qualquer criação |
| `Avaliar Estado` combina resposta/serviço por índice e guarda estado em static data | Associação frágil e estado inadequado a garantias fortes | Especificação exige identidade de serviço e persistência própria |
| Commits com `continueRegularOutput` e `alwaysOutputData` | Erro pode parecer lista vazia e gerar relato incorreto | Relatório futuro distingue fonte vazia de falhada |
| IDs de credenciais e metadados da instância no export | Acoplamento à instalação de origem | Não copiar credenciais, IDs de conta ou metadados privados |

Não foram identificadas ou reproduzidas aqui chaves secretas; um ID de credencial é uma referência, não prova de exposição do segredo. Ainda assim, deve ser removido de artefactos reutilizáveis. Integrações de bases de dados presentes na referência não são dependência desta fase.

## Melhorias deliberadamente adiadas
Arena de modelos, notificações, comentários/issues, healthchecks HTTP e deploy exigem credenciais, custo, autorização, proveniência e testes próprios. Não foram apresentados como funcionalidades prontas. Os contratos e os três workflows novos são a implementação segura do primeiro incremento, não uma substituição completa de todas as integrações originais.
