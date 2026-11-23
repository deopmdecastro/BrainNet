---
type: validation
status: IMPLEMENTED
created: 2026-11-23
updated: 2026-11-23
tags: [dc-simu, maquete, estampagem, qe1, io, cpv10, cablagem, ex10]
---
# QE1 e cablagem alinhados com o I/O do relatório Ex10

## Pedido

Resolver as pendências da tarefa anterior:
- B7 e Y5 sem aparelho elétrico;
- alimentação +24 V / 0 V dos sensores por cablar.

Como referência, foi enviado o relatório «Sistema de Estampagem Industrial — Relatório Final Ex10» (S7-300 CPU 315-2 PN/DP, TP700 Comfort). Opção escolhida pelo utilizador: **alinhar tudo ao relatório**.

## Solução (dc-simu `9c3b067`)

### Réguas do QE1 (tags do relatório, secção 2 «Entradas e saídas»)
| Régua | Bornes | Conteúdo |
|---|---|---|
| X21 | 16 | DI I0.0…I1.7: C1_FC_0/1, C3_FC_1/0, C4_FC_0/1, SENSOR_COR, FC2, FC1, SENSOR_INDUTIVO, C2_FC_1/0, B_START, B_STOP_NF, INT_MAN, B_EMERG_NF |
| X22 | 14 | DO Q0.0…Q1.5: Y0…Y6, VACUO_ON/OFF, M1_ESQ, M1_DI, L_VERDE, L_AMRL, L_VERM |
| X23 | 4 | Motor M1 (M+, M−, ENC A, ENC B) |
| X24 | 2 | REARME e CICLO (reservas: não constam das entradas do relatório) |
| X25 / X26 | 7 / 3 | Distribuição +24 V / 0 V (calha A), 2 condutores por borne com ponteira dupla, pontes entre bornes, alimentadas de X20 |

- Relés: só K1 (Q1.1 M1_ESQ) e K2 (Q1.2 M1_DI), como no relatório; K3…K6 removidos.

### Aparelhos
- **B7 → C2_FC_0:** o Cilindro 2 (braço) passa a ter os reeds B6 (ventosa em cima, C2_FC_1) e B7 (em baixo, C2_FC_0), com bornes e lógica no simulador (B6 com a ventosa ≤ 4 %, B7 com ≥ 96 %).
- **Y5 → Y5_C3−:** novo componente **Terminal de válvulas Festo CPV10** (`mecValveTerminalCpv10`, biblioteca Pneumática → «Maquete de estampagem»). Tem 5 estações e 9 bobinas: C1, C2 e C3 biestáveis (Y0/Y1, Y2/Y3, Y4/Y5), C4 monoestável (Y6) e vácuo ON/OFF. Inclui módulo elétrico com bornes, LEDs e comandos manuais, e substitui as duas ilhas de 2 bobinas. No simulador, as estações biestáveis memorizam a última bobina comandada.
- Coluna luminosa: R/Y/G em Q1.5/Q1.4/Q1.3 e COM no 0 V.

### Cablagem
- 0,75 mm²; ponteiras; cores: DI preto, DO violeta, +24 V castanho, 0 V azul.
- 14 cargas a +24 V (reeds, sensores de 3 fios, fins de curso, comum dos botões, motor) e 5 a 0 V (sensores de 3 fios, motor, CPV10, coluna).
- Percurso: os cabos saem pela borda da base e descem por fora (antes atravessavam o tampo e eram desviados). A grelha de 7 × 7 pistas nas calhas evita cabos sobrepostos. As bobinas do CPV10 e a coluna seguem rente à base até à calha traseira.

## Verificação

- `npm run test:maquetes`: 9 verificações OK. Novas: 16 DI, 12 DO de campo (Q1.1/Q1.2 internos), mapeamentos I0.0, I0.2, I1.2, I1.3, I1.7, Q0.4, Q0.6, Q1.5; 14 + 5 alimentações com ponteira dupla; pontes X25/X26; reeds B6/B7. Maquete: 110 peças, 161 componentes.
- `npm run test:mechatronics`: 14 OK (B6/B7 conforme a posição da ventosa).
- `npm test`, `npm run build`: OK.
- `test:native-sim` falha também sem estas alterações (8 falhas iguais), tal como `wire-locks` e `structures-pneumatics` já assinalados.
- Diagnóstico: os erros voltaram aos 3 pré-existentes do QGD. O 0 V DC passou a condutor de comando, não «neutro».
- Cálculo dos 140 cabos em Node: ~58–76 s, sem cabos bloqueados.
- Capturas locais: CPV10 com as bobinas ligadas ao módulo elétrico, QE1 com X25/X26 na calha A e DI/DO na calha B, bancada sem fios por cima dos aparelhos.

## Pendências / a confirmar na maquete

- O PLC S7-300 não está modelado no QE1: a ligação interna PLC → X21/X22 (bornes `1`) e PLC → K1/K2 fica por fazer.
- Potenciómetro do M1 (SM 334, canal 0, 0–10 V): o motor do catálogo tem encoder A/B, não potenciómetro.
- B_EMERG_NF: o relatório recomenda ligar I1.7 a um contacto NA do PNOZ X3. Aqui está ligado ao NF da emergência.
- Revisão visual do utilizador.

Estado: **implementado, testado e publicado em `origin/main`**; aprovação visual pendente.
