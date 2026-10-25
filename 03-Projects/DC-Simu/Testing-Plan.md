---
project_id: BN-DCSIMU-001
type: qa
status: PARTIALLY_VERIFIED
created: 2026-10-18
updated: 2026-10-25
tags: [brainet, dc-simu, qa]
---
# Validação do DC-Simu

Executar os comandos do produto na pasta [dc-simu/](./dc-simu/); os scripts estão no [package.json](./dc-simu/package.json).

## Execução mais recente — 2026-10-25

A validação foi repetida no runtime exigido, Node.js v22.23.4. O Node global do sandbox (v20.20.2) não satisfaz `>=22.12.0`; por isso a evidência do produto usa Node 22 temporário.

- `tsc -b`: **PASS**.
- `tsx scripts/smoke.ts`: **PASS**, 643 verificações e 0 falhas.
- `scripts/server-e2e.mjs`: **PASS**, 111 verificações e 0 falhas, depois de reconstruir `better-sqlite3` para ABI Node 22.
- `test:n8n-client`: **PASS**, 7 verificações.
- Quatro smoke tests Playwright (GRAFCET, blocos, modais e construção/importação): **PASS**; os dois últimos reportaram respetivamente 23 e 17 verificações.
- `vite build`: **pendente de runner com mais memória**. Os heaps de 768 MiB e 900 MiB atingiram OOM durante a transformação; uma tentativa anterior com 4 GiB chegou a `rendering chunks` e foi terminada pelo host. Não é uma assertion funcional falhada, mas não é evidência de artefacto de produção aprovado.

O detalhe de ambiente, comandos e limitações está em [[Validation-2026-10-25]].

## Verificações previstas

| Área | Verificação prevista | Evidência esperada |
| --- | --- | --- |
| Tipos e build | npm run typecheck; npm run build | Resultado e commit; identificar alterações geradas em dist |
| Motores | npm test | Casos de continuidade, Ladder e sequência de fases |
| Interação e movimento | npm run test:interactables; npm run test:motion | Resultado dos casos existentes |
| API e permissões | npm run test:server | Resultado em dados temporários, sem alterar projetos reais |
| Percurso manual | Criar circuito, alternar 2D/3D/Ladder, simular e guardar/reabrir | Registo dos passos, resultado e ambiente |
| n8n | Validar contrato, autenticação, destino, sucesso e falha | Resposta coerente e identificador de execução; ausência de falsos sucessos |
| Copilot | Confirmar leitura das instruções e concluir uma tarefa pequena | Conta/plano identificados, referências às instruções e diff revisto |
| Piloto de IA | Mesmas três tarefas e critérios em ferramentas selecionadas | Tempo, correções, consumo e custo registados; nenhuma sugestão tomada como teste passado |

## Evidências anteriores
A revisão de integração histórica não foi copiada para o cofre. O [guia local de infraestrutura](./dc-simu/infra/n8n/README.md) documenta o ambiente; não comprova o envio GRAFCET completo nem o estado atual dos serviços.

## Validação do registo no BrainNet
Verificar frontmatter, ligações internas e existência dos caminhos locais. Executar `npm test` e `npm run check` na raiz do BrainNet e comunicar os resultados da execução. Estes checks validam a fundação e a documentação, sem substituir os testes do produto acima.

[[Project-Brief|Briefing]] · [[Requirements|Requisitos]].
