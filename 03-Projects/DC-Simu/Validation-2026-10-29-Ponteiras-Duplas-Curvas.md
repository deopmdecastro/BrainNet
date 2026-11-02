---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, 3d, multimeter, wires]
---
# Curvas das sondas e ponteiras duplas

## Resultado

Implementadas curvas contínuas nos cabos de ensaio, com saída axial da ficha
e do punho. Os desvios junto aos aparelhos reservam folga e voltam a verificar
a interseção com os sólidos depois do arredondamento.

A alimentação de U1/V1 do motor nativo recebe ponteiras duplas com manga
comum e duas entradas distintas: cabo de alimentação e ponta da sonda.
A atualização de cópias antigas preserva cores, traçados e aparelhos,
não repõe sondas eliminadas e fica assinalada como alteração por guardar.

## Ficheiros

- Aplicação: `src/three/wireGeometry3D.ts`, `WireEnd3D.tsx`, `Panel3D.tsx`;
  `src/project/nativeMotorMeter.ts`, `nativeProjects.ts`, `src/store/useSimStore.ts`.
- Regressão: `scripts/native-wires-3d-smoke.ts`, `solid-cables-meter-smoke.ts`
  e `multimeter-terminals-ui-smoke.mjs`.
- Documentação técnica: [Cabos e ponteiras](./dc-simu/docs/MULTIMETRO-CABOS-PONTEIRAS.md).

## Verificações e evidências

- Núcleo do simulador, geometria dos terminais e encaixes passaram.
- Migração/persistência e medição passiva 0 → 400 → 0 V passaram.
- 37 cabos visíveis, zero colisões entre cabos; saídas axiais e entradas separadas.
- Interface em Chrome: quatro entradas nos dois colares duplos, duas sondas,
  duas fichas banana, 400 V em marcha e zero erros JavaScript.
- Build TypeScript/Vite/PWA passou, com o aviso existente de chunks grandes.
- BrainNet: 45 testes e verificação documental passaram.

Logs locais `runtime/motor-leads-{regression,wires,ui,build}.log`;
captura ampliada `runtime/motor-leads-ui/native-motor-double-ferrule-detail.png`.
Validação com dados sintéticos e API bloqueada.

## Estado e pendências

Implementado e testado localmente. Aplicação no commit `69ef2d4`, enviado para
`origin/main` pelo pedido direto do utilizador. A aprovação funcional final cabe ao utilizador; publicação em
produção não verificada. Nas cópias já guardadas, abrir o nativo atualizado
e premir **Guardar** para conservar os colares duplos.
