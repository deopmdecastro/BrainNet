---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-09
updated: 2026-11-09
tags: [dc-simu, grafcet, estampagem, atec, nativo]
---
# Estampagem — guião ATEC 1185 (GRAFCET de raiz)

## Pedido
Criar, a partir do guião «Estampagem_Guião_1185 v2», um projeto GRAFCET novo, feito de raiz. Deve ter cinco GRAFCETs: controlo, emergência, funcionamento, reset e manual.

## Resultado (dc-simu `315b0aa`)
- Projeto nativo «Estampagem — Guião ATEC 1185» (`grafcet-estampagem-guiao-1185-v1`). Aparece no painel e nos Modelos GRAFCET.
- Ficheiro para abrir na aplicação: `Downloads/dc-simu-estampagem-guiao-1185.json`.
- Entradas e saídas do guião:
  - Entradas: I0.0–I1.6 (fins de curso, sensor de cor B11, sensor indutivo, Start, Stop NF, seletor).
  - Saídas: Q4.0–Q5.6 (Y1–Y9, K1/K2 do motor M1, LEDs).
- **G0 Controlo:** por referenciar (0), reset (1), parada (2), automático (3), a terminar o ciclo (4), pausa (5), manual (6) e emergência (7).
- **G1 Emergência:** segue o contacto do relé de segurança. O rearme faz-se no S6.
- **G2 Funcionamento:**
  - Alimentar a peça e identificar o tipo: o sensor indutivo dá a metálica, o sensor ótico dá a branca, sem deteção é preta.
  - A ventosa pega na peça, o M1 leva-a à estampagem e o Cil3 posiciona-a.
  - Estampar durante 5, 6 ou 8 s, conforme o tipo.
  - Devolver a peça e contá-la. A rampa fica cheia com 2 peças.
- **G3 Reset:** sobe a ventosa, recua os cilindros, leva o braço ao alimentador e limpa as memórias. «Reset_Rampas» esvazia os contadores das rampas.
- **G4 Manual:** os comandos Man_* do HMI só atuam em modo manual. Avanço e recuo não atuam juntos, e o M1 só roda com a ventosa em cima.
- **Ladder:** MOVE do tempo de estampagem para o MW100. O «Gerar Ladder» com MOVE está disponível.

## Verificação
- `test:estampagem-guiao`: 76 verificações.
  - Ciclos preta, branca e metálica com os tempos de 5, 6 e 8 s.
  - Rampa cheia à 2.ª peça, seguida do reset das rampas.
  - Pausa (o M1 para), emergência e reset, e modo manual com encravamentos.
- `test:ci` e `vite build` verdes.

## Pendências
- Convenções a confirmar no guião ou na bancada:
  - O Cil2 avança para baixo.
  - O M1 roda para a direita em direção à estampagem.
  - O sensor de cor dá 1 para a peça branca.
  - O sítio da descarga para as rampas.
- O contacto do relé de segurança (I1.7 Seguranca_OK) não consta da tabela do guião. Tem de ser ligado a uma entrada livre.
- Sem sensor de peça no carregador, um ciclo em vazio é contado como peça preta.
- Disposição das páginas sem revisão visual no browser.
