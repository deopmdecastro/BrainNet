---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, editor-componentes, animacao, deteccao, botoes, seletores, sinalizadores]
---
# Editor de componentes: deteção correta de animações (botões, chaves, luzes) — 2026-10-26

## Pedido
- Animações corretas nos componentes CAD com nós genéricos: botões ON/OFF, luzes a acender, rodar chaves/seletores; que isso apareça nas listas (Interações/Botões/Luzes) do editor.

## Componentes alvo (capturas do utilizador)
- Disjuntor-motor Moeller/Eaton PKZM C-10 (`dcsimu_handle_*`, `pkzm_test_*`)
- Botoeira dupla NHD NPB22-D11 (`Node0…9`) — START/STOP com mola
- Botão de emergência Metaltex P20AKR 1NF (cogumelo) e P20ACR com chave
- Contator WEG CWC07-10E
- Sinaleiro LED AD22-22DS 24 V

## Resultado (`src/catalog/interactables.ts`)
- Cogumelo de emergência: cabeça vermelha Ø24–75 mm à face → **botão com retenção** (antes: excluído pelo filtro «ocupa a caixa» ou classificado como «seletor»). Reconhecimento por cor viva antes do filtro; retenção também pelo nome do equipamento, não só do nó.
- Chave P20ACR: disco escuro Ø22 → **seletor rotativo** que mantém a posição (rodar a chave).
- Sinaleiro AD22: lente colorida à face (mesmo sem material emissivo no GLB) → **luz ligada a `$powered`** — acende quando alimentada, sem variável manual.
- PKZM C-10: manípulo rotativo recebe movimento correto: **rotação de 90° em torno da normal da face** (OFF = pose do CAD; ON = quarto de volta), em vez do bàsculo ±9° dos disjuntores de alavanca; TEST fica com **mola**.
- A sugestão passa a trazer `device` (categoria+nome do equipamento) para afinações; NPB22 mantém botões com mola por deteção geométrica.

## Evidência
- Commit dc-simu `9b96e51` (carimbo #64), push verificado.
- `tsc -b` OK; suites de testes todas a passar; smoke `test:interactables` ampliado com os cinco casos (P20AKR latch, P20ACR seletor, AD22 $powered, PKZM 90° eixo Z, mola TEST).

## Notas
- As definições publicadas no catálogo (Supabase) mantêm-se: ao abrir o editor → «Deteção automática» aplica as novas regras e os controlos/luzes entram nas listas.
- Pendente (não desta tarefa): `electrical/engine.ts` `internalBridges` só cobre tipos integrados; cópias publicadas (`catalog:…`) ainda não conduzem corrente — registar para futura sessão.

## Estado
- Preparado: sim · Implementado: sim · Testado: sim (automático) · Aprovado: pendente (utilizador).
