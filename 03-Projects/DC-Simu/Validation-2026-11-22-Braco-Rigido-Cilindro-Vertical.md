---
type: validation
status: IMPLEMENTED_TESTED_LOCAL
created: 2026-11-22
updated: 2026-11-22
tags: [dc-simu, mecatronica, estampagem, cilindro, validacao]
---
# Manipulador: estrutura rígida e cilindro vertical com ventosa

## Correção confirmada pelo utilizador

O braço é uma estrutura metálica rígida. O cilindro fica na extremidade, e a
ventosa está montada na ponta da haste. O movimento de subida/descida é linear
e vertical; a estrutura não se articula nem se inclina.

Esta descrição direta substitui a interpretação anterior do manipulador, incluindo
a articulação Z descrita na evidência original da maquete.

## Implementado

- Removidos o cilindro diagonal junto à torre, a charneira e a inclinação do braço.
- Acrescentados o corpo fixo do cilindro compacto, cabeças, flange, parafusos e racor
  na ponta da estrutura; a haste cromada leva a ventosa e a peça suspensa.
- A rotação continua na torre. O curso Z desloca apenas a haste e a ventosa.
- A geometria de contacto usa a mesma translação vertical, com alcance radial constante.
- Atualizados o volume do manipulador, o alcance de montagem, a identificação na
  biblioteca, o inspetor e a posição dos bornes pneumáticos.

O cilindro da ventosa foi representado com **Ø16 mm, corpo de 32 mm e curso de
18 mm, todos estimados**. O topo das peças nas estações continua à cota de 172 mm.
Para permitir a passagem do corpo do cilindro sob o prato recolhido, o curso
estimado da prensa passou de 50 para 80 mm e o prato recolhido subiu 30 mm.
Estas adaptações são construtivas do simulador, não medições confirmadas da máquina.

## Ficheiros

- `dc-simu/src/three/mechatronicsModel.ts`: dimensões e cinemática linear partilhada.
- `dc-simu/src/three/MechatronicsDevices3D.tsx`: estrutura, cilindro e animação da haste.
- `dc-simu/src/electrical/mechatronicsContact.ts`: contacto e descarga sem inclinação.
- `dc-simu/src/electrical/factory.ts`: catálogo e portas pneumáticas.
- `dc-simu/src/components/MechatronicsControls.tsx`: nome do comando de curso vertical.
- `dc-simu/src/schematic/mechatronicsSymbols.tsx`: legenda da prensa coerente com o modelo.
- `dc-simu/scripts/mechatronics-smoke.ts`: regressão de alcance constante e pivôs novos.
- `dc-simu/scripts/mechatronics-ui-smoke.mjs`: medição das peças reais no Painel 3D.

## Testado

| Verificação | Evidência |
| --- | --- |
| `npm run test:mechatronics` | 13 verificações aprovadas |
| `npm run test:mechatronics-ui` | 23 verificações aprovadas |
| Movimento no 3D | Estrutura e corpo do cilindro imóveis; curso vertical medido de 18,0 mm, sem desvio horizontal nem rotação da haste/ventosa |
| Contacto com as peças | Folga de −0,2 mm na recolha e −0,3 mm na gaveta, desvio horizontal de 0,0 mm |
| Passagem sob a prensa | Folga de 34,7 mm acima do braço e de 15,0 mm acima do corpo do cilindro |
| React/WebGL | Sem exceções detetadas pela suite visual |
| `npm test` na aplicação | Aprovado |
| `npm run typecheck` e `npm run test:hooks` | Aprovados |
| `npm run test:builtin-sync` | 1282 verificações aprovadas; avisos de texturas GLB no ambiente Node |
| `npm test` no cofre | 45 testes aprovados |
| `npm run check` no cofre | Mantém erros documentais preexistentes, fora dos ficheiros desta tarefa |

Capturas sintéticas locais inspecionadas: `dc-simu/runtime/mechatronics/cylinder-up.png`
e `dc-simu/runtime/mechatronics/cylinder-down.png`. A suite também guarda `bench.png`.
O diagnóstico documental completo fica em `runtime/checks/foundation.json`, na raiz.

## Pendências e aprovação

- Confirmar as dimensões reais do cilindro vertical e a folga/curso reais da prensa.
- A alteração do volume do manipulador muda o seu centro geométrico; montagens
  antigas com posições 3D fixas podem precisar de reposicionar o braço (21 mm
  para cima) e ajustar o alcance (1 mm), ou voltar a montar a bancada.
- Mantêm-se as pendências anteriores de cablagem/tubagem automáticas e acompanhamento
  das peças pelos sensores ótico e indutivo.
- Implementado e testado localmente. Versionado em `dc-simu@0c63f95` e enviado
  para `origin/main` a pedido do utilizador em 2026-11-22. Sem revisão independente
  de QA, aprovação de publicação ou deploy.
