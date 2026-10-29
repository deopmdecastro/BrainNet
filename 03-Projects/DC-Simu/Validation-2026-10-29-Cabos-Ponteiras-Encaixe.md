---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, 3d, wires, ferrules, motor, validation]
---
# Cabos organizados e ponteiras alinhadas

## Resultado

Corrigida a referência da ponteira dupla: colar centrado no borne e condutores
centrados nas duas bocas. Dimensões e canais partilhados entre cálculo e desenho;
comprimentos ajustados à saída do isolamento e sonda na entrada livre.

O afastamento entre cabos conserva as terminações e a passagem física no motor.
Eliminadas as grandes deformações para cima/baixo; afastamento mantido no bucim,
percursos internos separados e aproximação axial aos bornes.

O volume orientado do motor substitui a caixa mundial na verificação exata de
colisões. Resolve as duas ligações do PLC bloqueadas em cantos vazios e conserva
a proteção da carcaça, incluindo rotação, espelho e escala.

## Ficheiros

- `src/three/wireGeometry3D.ts`, `solidWireRouting.ts`, `WireEnd3D.tsx`, `Panel3D.tsx`.
- `src/electrical/sharedFerrules.ts`.
- `scripts/native-wires-3d-smoke.ts`, `solid-cables-meter-smoke.ts`,
  `multimeter-terminals-ui-smoke.mjs`.
- [Documentação técnica](./dc-simu/docs/CABOS-PONTEIRAS-ENCAIXE-3D.md).

## Verificações e evidências

Núcleo do simulador, regressão dos cabos/multímetro e build TypeScript/Vite/PWA
passaram. O build mantém o aviso de chunks grandes. BrainNet: 45 testes e check.

Nativo: 37 cabos visíveis e zero colisões entre cabos; quatro entradas no bucim,
cauda do motor preservada e chegada axial. Mais quatro poses verificadas com
rotação, espelho e escala, sem cabos ocultos ou travessias da carcaça.

Chrome local: 22 contactos alinhados com as bocas renderizadas, desvio lateral
inferior a 0,01 mm; medição 0 → 400 → 0 V e zero erros JavaScript.

Logs `runtime/wires-fit-*.log`. Capturas em `runtime/wires-fit-ui/`, incluindo
`power-supply-ferrule-seating.png`, `plc-ferrule-seating.png` e
`native-motor-double-ferrule-detail.png`. Testes sintéticos sem alterar projetos reais.

## Estado e pendências

Implementado e testado localmente no commit `f11eaac`, enviado para `origin/main`
conforme o pedido de seguimento. Aprovação funcional final a cargo do utilizador;
produção e reconstrução da imagem Docker não verificadas nesta tarefa.
