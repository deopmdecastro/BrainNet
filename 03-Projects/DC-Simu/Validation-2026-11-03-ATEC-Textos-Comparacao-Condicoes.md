---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED_PARTIAL
created: 2026-11-03
updated: 2026-11-03
repo: https://github.com/deopmdecastro/dc-simu
commits:
  - 63e88bd
tags: [dc-simu, grafcet, atec, guard, condicoes, textos-livres, migracao]
---
# ATEC — textos de comparação passam a condições das etapas

## Pedido
No projeto ATEC os textos livres de comparação (`G3 <> X149`, `G4 <> X159`…) são as condições de ativação dessas etapas: pôr as condições e, depois de confirmado, remover os textos livres.

## Contexto lido
[[Design-Principles]], [[Validation-2026-11-03-Transicoes-Estado-Entre-GRAFCETs]], [[Validation-2026-10-30-Importacao-Grafcet-ATEC-Textos]]. O motor já tinha a «condição de estado da origem» (`guard`, «Só se»), avaliada em `receptivityOf` (simulação, validação e Ladder), e o exemplo `examples/grafcet-atec-com-manuais.json` já a usava (commit `8b9a9ef`).

## Diagnóstico
O exemplo do repositório já está convertido (8 transições-fonte com `guard`). O projeto aberto no telemóvel (`dc-simu.vercel.app`, 1 página, 54 etapas) é uma cópia guardada **antes** dessa conversão e ainda tem os textos livres. O projeto da conta do utilizador não é acessível a partir do repositório, por isso a conversão foi entregue como funcionalidade do editor, reaproveitando o `guard` existente em vez de um modelo novo.

## O que mudou (`dc-simu` 63e88bd)
- `src/grafcet/textGuards.ts` (lógica pura): `scanTextGuards` reconhece textos que são só referências de estado (`G4 <> X159`, `G1 == X11`, várias ligadas por `*`), encontra a etapa pelo número **dentro do GRAFCET indicado** (títulos `G<n> - …` da mesma página) e liga o texto à transição que a ativa (transição-fonte mais próxima; sem fonte, a mais próxima até 200 unidades). `applyTextGuards` acrescenta o `guard` (junta com `*`, sem duplicar); `removeTextGuardComments` apaga os textos.
- `TextGuardsDialog`: duas fases com conferência pelo meio — **Aplicar N condições** (os textos ficam no desenho) → lista «texto → T5 · ativa a etapa 159 do G4 · `G0X9 * G4 <> X159`» → **Remover N textos** (desativado se alguma condição for inválida). Cada passo é uma entrada própria no histórico (Ctrl+Z). Textos sem transição correspondente ficam como estão e são listados.
- Menu GRAFCET da barra: **Textos → condições** (ícone `IconSwap`, único na barra).
- Títulos («G0 - Grafcet Controlo») e legendas («Maquina Parada») nunca são tocados.

## Como usar
Abrir o projeto ATEC → GRAFCET → menu de ferramentas → «Textos → condições» → **Aplicar** → conferir as receptividades (ex.: T5 do G3 fica `G0X9 * G3 <> X149`) → **Remover textos**.

## Verificações
- `tsc -b`, `npm test`, `test:grafcet-dialogs` (31), `test:style` ✅.
- `scripts/text-guards-smoke.ts` (17, em `test:ci`): reconstrói o projeto «antigo» a partir do exemplo (uma página, sem `guard`, 8 textos 44 unidades acima de cada barra) e confirma 8/8 ligações corretas, receptividade `G0X9 * G4 <> X159`, validação sem novos erros, idempotência, junção com `guard` existente e remoção só dos 8 textos.

## Não verificado
- Sem browser: a modal e o menu não foram vistos no ecrã nem no telemóvel, e o projeto real do utilizador não foi aberto — o varrimento assume textos iguais aos do exemplo; textos com outra forma aparecem como «sem transição» e ficam por tratar.
- Ladder: `toLadder` continua a usar a numeração global (pendência anterior), pelo que a conversão para Ladder de condições `Gk <> Xn` entre GRAFCETs não foi validada aqui.
