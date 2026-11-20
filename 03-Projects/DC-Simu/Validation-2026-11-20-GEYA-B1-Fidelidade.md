---
type: validation
status: IMPLEMENTED_PENDING_VISUAL_APPROVAL
created: 2026-11-20
updated: 2026-11-20
tags: [dc-simu, geya, temporizador, 3d, validacao]
---
# GEYA GRT8-B1 A230 — fidelidade do modelo

## Resultado implementado
Refinamento local do TOF com desoperação por S, comparado com a fotografia fornecida pelo utilizador:

- Seis poços abertos com parafusos metálicos de cruz, recuados 1,25 mm. Removida a placa escura que tapava cada cabeça.
- Seletores vermelhos com rebaixo geométrico em cruz, assento e índice radial alinhado com as escalas.
- Tampa com cantos suaves, contorno moldado, encaixes laterais, ranhuras e patilha inferior.
- Lentes convexas que continuam a responder ao estado elétrico dos LEDs Un/R.
- Referência frontal GRT8-B1 mais leve; impressão lateral da alimentação, diagramas de temporização e ligação do inversor, sem fundo opaco.
- Capas frontal e de biblioteca regeneradas a partir do modelo.

O envelope do ficheiro permanece **18,08 × 95 × 65,35 mm**, incluindo saliências. Os seis pontos de ligação e as identidades A1/S/A2/15/16/18 mantêm-se. Não houve alteração da lógica elétrica TOF ou dos modelos M1/M2.

## Ficheiros
- `dc-simu/scripts/build-industrial-devices.mjs`: geometria do B1 e reconstrução reproduzível.
- `dc-simu/scripts/build-geya-labels.mjs`: serigrafias; opção `--b1` para regenerar apenas esta variante.
- `dc-simu/public/models/industriais/`: GLB, três texturas B1 e proveniência/hash em `sources.json`.
- `dc-simu/public/component-covers/`: capa de biblioteca, frontal e data do manifesto.
- `dc-simu/scripts/mechanical-refinement-smoke.ts`: oito verificações adicionais de acessibilidade das cabeças e rebaixo dos seletores.
- `dc-simu/scripts/geya-b1-ui-smoke.mjs`: aceitação na aplicação React/R3F real, com projeto sintético isolado e pedidos externos bloqueados.

## Evidências e verificação
- [Vista frontal no Painel](dc-simu/docs/validation/geya-b1/frente.png).
- [Perspetiva no Painel](dc-simu/docs/validation/geya-b1/perspetiva.png).
- [Resultados do Painel](dc-simu/docs/validation/geya-b1/results.json): **11 verificações**, zero exceções React/WebGL. A atuação é verificada depois de PLAY/PAUSA, conforme a regra de manobra existente.
- `npm run test:industrial`: **174 verificações aprovadas**, incluindo alimentação A230, desoperação por S e manutenção temporizada dos contactos.
- `npm run typecheck` e `npm run build`: aprovados.
- `git diff --check`: aprovado.
- `npm run test:mechanical`: os oito novos casos B1 passam; a suite falha depois em `Legacy wired project still energizes the actual CWBC65 coil and GEYA supply after migration`, com M1/CWBC65, fora da variante alterada.
- `npm test` da aplicação: falha em `programas distintos executam saídas Q0.0 independentes` (PLC).
- `npm test` do cofre: 43/45; duas falhas por timeout PowerShell em testes Maestri.
- `npm run check` do cofre: falha por frontmatter ausente em seis README de evidências anteriores (Easy9 CAD/Frente/Manípulo, GEYA Bornes, Medidores LCD e XB2 Acabamentos).
- A regeneração das capas B1 passa. O inventário global continua a indicar quatro capas genéricas ausentes: buttonNO, buttonNC, selector2 e selector3.

Os logs extensos estão em `dc-simu/runtime/geya-b1-*.log`, locais e ignorados por Git.

## Estado e pendências
**Preparado:** geradores e evidências. **Implementado:** modelo, serigrafia e capas locais. **Testado:** casos B1 e elétricos industriais aprovados, build aprovado; suites gerais com falhas discriminadas acima. **Aprovado:** a aceitação visual pelo utilizador está pendente; não foi efetuada publicação.

É uma reconstrução visual cotada, não um STEP oficial nem uma reprodução metrológica. O logótipo e os pequenos grafismos foram redesenhados; a fidelidade absoluta à serigrafia de fábrica não está certificada.
