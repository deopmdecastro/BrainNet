---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-05
updated: 2026-11-05
tags: [dc-simu, grafcet, atec, estampagem, exemplo]
---
# GRAFCET — Sistema de Estampagem Industrial (ATEC)

## Pedido
Criar o GRAFCET do projeto de formação «Sistema de Estampagem Industrial» (guião ATEC) para uso no DC-Simu, alinhado com o funcionamento descrito e com os exemplos nativos existentes.

## Fonte
- Guião PDF: objetivos, descrição de funcionamento, tempos de estampagem (Preta 5 s, Branca 6 s, Metálica 8 s), depósitos com limite de 2 peças, modos Manual/Automático no HMI.
- Tabela IN/OUT parcial fornecida (incompleta).
- Esquemas pneumáticos e elétricos do anexo.

## Decisões de modelação
- Foco no **modo Automático** (ciclo completo). O Manual fica para um segundo GRAFCET ou ações condicionadas por memória de modo.
- Sinais legíveis (não os nomes genéricos `Y0_C1+` da tabela incompleta) para facilitar o relatório do formando e a simulação.
- Tempos de estampagem implementados com condições de temporização nativas do motor GRAFCET (`5s/X4P`, `6s/X4B`, `8s/X4M`).
- Rampas cheias modeladas como memórias M0.4–M0.6 (bloqueiam START). Reset independente previsto via HMI (R nos M).
- GRAFCET de segurança paralelo (etapas 10/11) para emergência + rearme, no mesmo estilo dos exemplos avançados.

## Entrega
- Ficheiro: `examples/grafcet-estampagem-industrial.json` no repositório dc-simu.
- Pode ser importado diretamente no editor GRAFCET do DC-Simu.
- Contém 14 etapas, 18 transições, 29 tags e 3 notas de apoio no canvas.

## Critérios de aceitação
- [x] JSON válido no formato `version: 6` / `projectKind: "grafcet"`.
- [x] Etapa inicial + ciclo fechado de produção.
- [x] Ramos por tipo de peça com tempos corretos.
- [x] Segurança (emergência NC + rearme).
- [x] Tags com nomes e comentários úteis para HMI e relatório.
- [x] Notas «Como testar», «Rampas» e «HMI» no canvas.
- [ ] Validação visual e de scan no DC-Simu (próximo passo).
- [ ] Ligação opcional a contadores reais e modo Manual.

## Próximo
1. Abrir o JSON no DC-Simu e validar o layout automático + scan.
2. Ajustar posições se necessário (o motor de layout pode reposicionar).
3. Acrescentar GRAFCET Manual (atuadores individuais) se o formando precisar.
4. Mapear os sinais reais do quadro (quando a tabela IN/OUT estiver completa).

[[Project-Brief]] · [[Design-Principles]] · exemplos em `src/project/grafcetExamples.ts`
