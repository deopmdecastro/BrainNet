---
type: plan
status: IN_PROGRESS
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, planning]
---
# Plano de implementação

| Fase | Entrega | Critério de saída | Estado |
| --- | --- | --- | --- |
| 1 Fundação | Cofre, modelos, papéis e contratos | Estrutura íntegra e ligações resolvidas | Implementada |
| 2 Piloto seguro | WF-01, WF-03, WF-05 e CLI | Testes negativos, idempotência e execução n8n isolada | Testada localmente |
| 3 Ativação | Importar cópias e configurar acessos mínimos | Teste ponta a ponta numa instância de teste | Pendente |
| 4 Discovery website | Oferta, público, conteúdos e stack | Briefing revisto pelo responsável | Em preparação |
| 5 Website | Incrementos em desenvolvimento/staging | Critérios de QA e conteúdo satisfeitos | Não iniciado |
| 6 Operação | Leads, reporting e monitorização | Recuperação e deduplicação comprovadas | Planeada |

## Fundação pronta para revisão
- [ ] Conferir relatório e executar `npm test` e `npm run check`.
- [ ] Rever papéis e atribuir responsáveis reais.
- [ ] Importar os três fluxos como novas cópias, sem ativar entradas reais.
- [ ] Rever outputs sintéticos no n8n.
- [ ] Confirmar prioridades em [[../03-Projects/BraiNet-Website/Open-Questions|Open-Questions]].

## Condições para automatizar dados reais
Credenciais fora do cofre; autenticação por origem; autorização por projeto; deduplicação persistente; limites de volume; política de retenção; testes com falhas e recovery. Estes itens são trabalho pendente, não propriedades já implementadas do n8n entregue.
