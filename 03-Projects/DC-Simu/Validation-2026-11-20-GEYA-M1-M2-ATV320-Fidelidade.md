---
type: validation
status: IMPLEMENTED_PENDING_VISUAL_APPROVAL
created: 2026-11-20
updated: 2026-11-20
tags: [dc-simu, geya, schneider, temporizadores, variador, 3d]
---
# GEYA GRT8-M1/M2 e Schneider ATV320U04M2C — fidelidade visual

## Resultado implementado

**GRT8-M1 e M2:** aplicação do acabamento geométrico desenvolvido para o B1 aos três seletores, lentes convexas, tampa moldada, ranhuras, juntas e cabeças de parafuso acessíveis. O logótipo frontal usa agora os traçados originais extraídos do manual GEYA, em vez de uma aproximação tipográfica. Impressão lateral com os diagramas das dez funções, a referência e o esquema dos contactos.

**M2:** a fila 25/26/28 passou a um degrau frontal próprio. Os seus três acessos inferiores têm posições distintas dos de 15/16/18; antes os dois inversores partilhavam indevidamente as mesmas entradas geométricas. As nove identidades elétricas são conservadas. O carregador migra apenas as posições automáticas antigas; preserva bornes fixados, deslocados à mão, direções/encaixes personalizados e geometria de autoria. A migração é idempotente no projeto e no Admin.

**ATV320U04M2C:** base no STEP Schneider existente e comparação com a fotografia frontal oficial. Visor de quatro dígitos reposicionado e proporcionado, legendas sem sobreposição, indicadores FAULT/CAN Run/CAN Err, moldura e ESC arredondados com inscrição centrada, pega triangular em relevo no encoder, junta da placa opcional, avisos e marcas inferiores refeitos. O logótipo Schneider mantém o traçado vetorial original, agora em branco. Os 33 bornes de potência/comando receberam cabeças metálicas com cruzeta geométrica. Encoder, ESC, tampa e visor dinâmico continuam funcionais.

Os envelopes exteriores permanecem iguais aos anteriores: temporizadores **18,08 × 95 × 65,35 mm**; ATV **72,900237 × 142,950153 × 128,059998 mm**. No ATV, os pontos de ligação mantêm-se. No M2, apenas as posições de entrada de 25/26/28 mudam.

## Referências utilizadas

- [Manual GEYA GRT8-M](https://www.geya.net/wp-content/uploads/2021/05/GRT8-M-Instruction-Manual.pdf): fotografias, disposição dos seletores, contactos, dimensões e grafismo original.
- [Fotografia frontal oficial Schneider](https://download.schneider-electric.com/files?p_Doc_Ref=ATV320U0xM2C_front&p_File_Type=rendition_1500_jpg): apresenta expressamente a referência ATV320U04M2C.
- STEP `MCADID0000926_3D-simplified.stp`, SHA-256 `f88134f58af2d9f9b00b5ea17df978257c1683fee3dc28b683e7ece1f50bd2c9`. O arquivo de origem e as alterações constam de `dc-simu/public/models/industriais/sources.json`.

O corpo CAD original do ATV foi conservado. A pele frontal do encoder foi recuada 0,23 mm para acomodar o relevo dentro do envelope existente. Os temporizadores, o degrau do M2 e os pormenores acrescentados são reconstruções por referência; não são CAD oficial nem cotas certificadas. O código QR representa apenas a referência pública, sem número de série inventado.

## Ficheiros e evidências

- [Comparação dos três modelos](dc-simu/docs/validation/industrial-fidelity/comparacao.png), renderizada com os materiais e o estúdio partilhado da aplicação.
- [M1 no Painel](dc-simu/docs/validation/industrial-fidelity/timerGeyaGrt8M1-perspetiva.png).
- [M2 no Painel](dc-simu/docs/validation/industrial-fidelity/timerGeyaGrt8M2-perspetiva.png).
- [ATV frontal com visor ativo](dc-simu/docs/validation/industrial-fidelity/vfdSchneiderAtv320-frente.png) e [bornes de comando expostos](dc-simu/docs/validation/industrial-fidelity/vfdSchneiderAtv320-bornes.png).
- [Resultados da aceitação no Painel](dc-simu/docs/validation/industrial-fidelity/results.json).

Fontes alteradas: `scripts/build-industrial-devices.mjs`, `scripts/build-geya-labels.mjs`, `scripts/build-atv320-labels.mjs`, `scripts/extract-geya-brand.py`, `src/three/industrialFinish.ts`, `src/electrical/legacyRealInterfaces.ts`, `src/electrical/factory.ts` e `scripts/mechanical-refinement-smoke.ts`. Novo teste `scripts/industrial-fidelity-ui-smoke.mjs`. Artefactos em `public/brands/`, `public/models/industriais/`, `public/component-covers/` e `src/data/industrial-device-geometry.json`.

O gerador dos rótulos ATV usa SVG/Chromium. A extração do logótipo GEYA usa PyMuPDF e o PDF local; a aplicação consome apenas os ficheiros gerados e não depende de Python.

## Verificação

| Verificação | Resultado |
| --- | --- |
| Painel React/R3F real, projeto isolado, pedidos externos bloqueados | 30 verificações aprovadas, zero exceções React/WebGL |
| `npm run test:industrial` | 174 verificações aprovadas; inclui cavidades abertas, hashes, escala e comportamento elétrico |
| Migração M2 na suite mecânica | Casos aprovados, incluindo preservação de autoria, normais, identidades e idempotência no projeto/Admin |
| `npm run typecheck` | Aprovado |
| `npm run build` | Aprovado |
| `npm run test:hooks` | Aprovado, zero avisos ESLint |
| `git diff --check` | Aprovado |
| `npm test` do cofre | 45/45 aprovados |
| Capas dos três aparelhos | Frontal e biblioteca regeneradas; o inventário global continua a falhar por quatro capas genéricas ausentes |

## Pendências discriminadas

- `npm test` da aplicação apresenta 22 falhas em PLC, geometria Easy9 e cadeia Hager/DF101V/DF81N. Não houve alteração desses aparelhos nesta tarefa.
- `npm run test:mechanical` avança pelos casos M2 e falha depois em `Legacy wired project still energizes the actual CWBC65 coil and GEYA supply after migration`, caso com CWBC65/M1 já identificado na entrega do B1.
- `npm run check` do cofre falha por frontmatter ausente nos seis README de evidências anteriores indicados no log.
- Inventário de capas: faltam `buttonNO`, `buttonNC`, `selector2` e `selector3`; as capas dos três modelos pedidos foram geradas.
- Aceitação visual pelo utilizador e publicação permanecem pendentes. Não foi feito deploy nem escrita numa conta externa.

Logs locais: `dc-simu/runtime/m1-m2-atv-*.log` e `runtime/m1-m2-atv-root-*.log`, ignorados por Git.

**Preparado:** referências e geradores. **Implementado:** modelos, serigrafia, capas e migração M2. **Testado:** verificações acima, com falhas gerais discriminadas. **Aprovado:** sem aprovação visual ou de publicação registada.
