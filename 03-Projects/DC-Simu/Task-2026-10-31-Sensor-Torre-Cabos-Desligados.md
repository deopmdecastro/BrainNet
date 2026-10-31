---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
commit: eee2eaf
repos: [dc-simu, BrainNet]
tags: [dc-simu, 3d, sensores, torre, cabos]
---

# Sensor e torre: cabos aparentemente partidos e marcadores deslocados

## Evidência e diagnóstico
As capturas mostram a bainha CAD do sensor XUKT separada da bainha e dos condutores gerados, além de esferas e legendas flutuantes. O GLB contém uma bainha curva própria; o centro medido da sua extremidade está em aproximadamente `(-0,169, -0,323, -0,323)` no referencial centrado. As raízes automáticas existentes foram colocadas noutra profundidade. As esferas/legendas decorativas são posicionadas por comprimento numa direção intermédia e não na ponta real de cada fio.

## Plano
- Ajustar as posições automáticas dos três condutores ao fim real da bainha CAD e migrar exclusivamente os valores antigos reconhecidos, mantendo IDs, ligações e ajustes manuais.
- Retirar marcadores decorativos flutuantes; manter os alvos reais no modo de ligação e os fios da torre individuais.
- Verificar continuidade da bainha/condutores, correspondência entre pontas visuais e terminais, transformações e migração, além de testes existentes.

## Implementação
- Raízes do XUKT medidas no fim real do cabo CAD e continuação com Ø5 mm; pontas abertas em leque sem cruzamento.
- Migração seletiva da posição automática antiga para o novo traçado: mantém ID e dados dos contactos e respeita contactos fixados ou deslocados à mão.
- Retiradas as esferas/legendas decorativas erroneamente deslocadas; os marcadores e nomes reais permanecem no modo de ligação.
- Torre continua com quatro fios separados. O cálculo geométrico foi extraído para permitir teste direto.

## Validação
- `test:lead-pigtails`: passou, mede a bainha contra os vértices do GLB real, continuidade dos condutores, pontas/terminais, torre, migração, rotação/espelho/escala.
- Renderização isolada em Chromium do sensor real + pigtails: bainha contínua e pontas separadas; não é uma verificação do fluxo completo do editor.
- `typecheck`, `test:native-wires-3d`, `test:solid-cables-meter` e `wire-routing-ui-smoke`: passaram.
- `test:imported-components` falhou em «sensor sem alimentação não cria uma saída»; reproduzido na revisão anterior independente `1061ae8` (teste desatualizado face à alteração anterior de contactos COM/NA/NF).
- Push DC-Simu `eee2eaf`; deploy de produção não confirmado.
