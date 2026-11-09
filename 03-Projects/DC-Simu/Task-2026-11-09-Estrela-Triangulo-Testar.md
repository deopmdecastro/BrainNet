---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-09
updated: 2026-11-09
tags: [dc-simu, estrela-triangulo, logo, grafcet, simulacao]
---
# Projeto estrela-triângulo a partir do «Testar»

## Pedido
Criar um projeto estrela-triângulo a partir do projeto do utilizador `dc-simu-testar.json` («Testar» na conta).

## Resultado
- Ficheiro para abrir na aplicação («Abrir»): `Downloads/dc-simu-estrela-triangulo.json`. O «Testar» na conta não foi alterado.
- Mantém do quadro QE1 os ids, as referências, as posições, as calhas DIN e as calhas técnicas.
- **Força:** QG1 → QF1 → QM1 → KM1 → RT1 → M1 U1/V1/W1 e KM2. O KM2 liga W2/U2/V2 (triângulo) e o KM3 fecha-os (estrela). O RT1 passou do KM3 para o KM1.
- **Encravamento:** KM2 e KM3 encravados entre si.
- **Comando 230 V CA:** QF2 → RT1 95-96 → relés do LOGO! → bobinas.
- **24 V:** a PS1 alimenta o LOGO!, o KS1, a botoeira e as lâmpadas, pelos bornes X1.0 e X1.1.
- **Segurança:** emergência B0 → KS1 (canal Y11-Y12); a saída 14 do KS1 vai à I0.2 do LOGO!.
- **Porta:** botoeira dupla S1 (START/STOP), B0, H1 marcha, H3 estrela e H2 falha, pelos bornes X2.1 a X2.7.
- **GRAFCET:** 0 → 10 (estrela, 5 s) → 11 (triângulo); STOP, segurança ou térmico voltam a 0; com o térmico disparado passa à etapa 12. Tags I0.0–I0.3 e Q0.0–Q0.3.
- **Calhas verticais:** encurtadas para 600 mm e colocadas dentro do armário.
- **Simulador (dc-simu `8b3a560`):** um motor sem pontes na caixa roda quando a estrela ou o triângulo são feitos pelos contactores. Antes nunca rodava. Teste `test:motor-star-delta`.

## Verificação
- Teste local do projeto (gerador em `runtime/estrela/`, fora do Git): diagnóstico vazio.
  - START → estrela (H3, motor roda) → 5 s → triângulo (H1, motor roda).
  - KM2 e KM3 nunca fecham ao mesmo tempo.
  - STOP para o motor.
  - Emergência: o KS1 abre; só volta a arrancar com rearme e START.
  - Disparo do térmico: o motor para e acende H2.
- Vista 3D no browser, com a porta aberta e fechada.
- `test:ci` e `vite build` verdes.

## Pendências
- Com a porta fechada, os cabos dos aparelhos da porta contornam o armário por fora no 3D. É uma limitação do traçado, também presente no nativo estrela-triângulo.
- O rearme do KS1 faz-se no inspetor («Pedir rearme»).
- Dimensionamento a rever num quadro real: o RT1 (1,1–1,6 A) e o motor de 0,55 kW (para estrela-triângulo tem de ser de 400 V em triângulo).
