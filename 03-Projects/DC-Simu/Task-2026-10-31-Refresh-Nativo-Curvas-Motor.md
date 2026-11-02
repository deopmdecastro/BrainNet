---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
commit: b98ed91
repos: [dc-simu, BrainNet]
tags: [dc-simu, 3d, cabos, motor, nativo]
---

# Refresh do projeto nativo e curvas dos cabos

## Pedido
Melhorar as curvas e artefactos dos cabos nas imagens, e atualizar/recuperar o projeto nativo com olhais e porcas no motor. Preservar projetos e edições pessoais.

## Diagnóstico inicial
O motor ainda tem porcas/olhais no código, mas `withMotorMeterFerrules` substitui os olhais de U1/V1 por ponteiras duplas, apesar de `syncSharedTerminalFerrules` proteger olhais. O projeto nativo ausente já é reposto no armazenamento local; edições não devem ser apagadas por reseed geral. Em `roundCorners`, cortes de 55% em ambos os extremos de um mesmo segmento podem sobrepor-se e inverter o percurso, causando espigões e quebras.

## Plano
- Corrigir a causa das sobreposições e testar geometria, colisões e terminais.
- Restaurar os olhais na semente nativa e migrar apenas os alimentadores nativos reconhecidos, sem reconstruir nem apagar o projeto guardado.
- Confirmar o funcionamento de simulação, roteamento e recuperação da semente. Documentar limites da validação e publicar nos dois repositórios.

## Alterações
- Os cortes de cantos adjacentes são limitados em conjunto; remove-se o retrocesso quase colinear, sem modificar a secção protegida do trajeto no motor.
- A semente mantém olhais e porcas nos quatro alimentadores; as sondas contactam os pernos. As ponteiras duplas continuam disponíveis nos restantes bornes.
- Migração idempotente, ao abrir o nativo v5: repara apenas as duas pontas com IDs e bornes originais e com o tipo que a regressão impôs. Preserva cabos apagados, alterações de ligação, outros projetos e demais campos. A alteração fica por guardar no projeto.
- O armazenamento local já repõe a semente caso o projeto nativo esteja ausente; não foi alterado o ID da semente nem executada uma reposição destrutiva das edições existentes.
- Release stamp incrementado para 128 no commit `b98ed91`.

## Validação
- `npm run typecheck`: OK.
- `test:wire-curves-refresh`: OK (arcos adjacentes, retrocesso, olhais, migração seletiva e idempotente).
- `test:native-wires-3d`: OK (quatro olhais, bucim, colisões e orientações).
- `test:solid-cables-meter`, `test:native-sim` e smoke geral: OK (incluindo medição 0–400–0 V e START/STOP).
- Execuções concorrentes dos testes browser não concluíram neste ambiente (timeout/erros de carregamento); o build Vite também não terminou no limite de 180 s com memória restrita. Não há confirmação visual no browser nem confirmação de deploy de produção; rever especialmente as curvas junto à fonte/PLC e o assentamento das sondas.
