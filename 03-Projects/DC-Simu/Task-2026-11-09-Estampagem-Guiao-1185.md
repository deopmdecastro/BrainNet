---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-09
updated: 2026-11-11
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

## Revisão e correções (dc-simu `590bbd1`, 2026-11-11)
- **Diagnóstico sem falsos avisos:**
  - Ações N em várias etapas fazem um OU (IEC 60848). O Diagnóstico só avisa quando essas etapas podem estar ativas ao mesmo tempo, ou quando se misturam S/R com ações contínuas.
  - A receptividade «1» só avisa quando a etapa de origem tem ações contínuas.
  - Resultado: a Estampagem ATEC passou de 26 avisos para 0 e o guião 1185 de 33 para 0, sem esconder problemas reais.
- **Aviso novo:** transições entre as mesmas etapas ficam sobrepostas no desenho. Foi o que aconteceu na etapa 35 do G2. A estampagem passou a uma só transição, com o tempo de cada tipo (5/6/8 s).
- **Referências:** uma referência a um GRAFCET que falta passou a dizer qual é a página em falta.
- **Modelos corrigidos:**
  - Reset G2: a etapa 135 estava duplicada, a temporização dizia `20s/X15` em vez de X115 e o retorno apontava para 51 em vez de 81.
  - Seleção OU: a etapa E5 bloqueava a sequência; agora tem retorno a E0.
- **Projeto do guião:**
  - A luz de emergência passou para o G0 X7.
  - O nativo passou a v2, para o painel repor a versão nova.
  - O ficheiro `Downloads/dc-simu-estampagem-guiao-1185.json` foi gerado de novo.
- **Verificação:**
  - Páginas G0–G4 vistas no browser (offline): 0 erros, 0 avisos e sem erros de JavaScript.
  - `test:ci` e `vite build` verdes.
  - `test:estampagem-guiao` (76), exemplos (129) e diálogos (37) verdes.
- **Pendências:**
  - Os modelos G0 Controlo e Reset G2 referem outras páginas (G1/G2). Inseridos sozinhos, mostram erro até se juntar o resto do conjunto.
  - No G3, a linha de retorno da etapa 56 cruza o tronco da etapa 51. É a regra do organizador e o diagrama continua inequívoco.
  - Não foi possível ver o estado dos deploys no Vercel: o acesso à equipa tem de ser autorizado de novo.
