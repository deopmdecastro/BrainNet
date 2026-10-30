# Validação 2026-10-30 — Olhal do motor com anilha e porca

- Commit dc-simu: `2dd45d9` (`src/three/WireEnd3D.tsx`, `src/three/wireGeometry3D.ts`)
- Olhal passa de toro fino deslocado 5 mm para olhal plano real: anel furado Ø4,5, pescoço cónico, crimpagem e manga isolada; centro do anel no perno do borne.
- Nos bornes do motor (`motorContext`) acrescenta anilha Ø8,8 e porca sextavada M4 (7 mm) com ponta do perno; `studNut` em `WireEndGeometry`.
- Testes: `tsc -b`, `npm test`, `test:native-wires-3d` e `build` OK.
- Pendente: conferência visual no navegador (assentamento do olhal sobre a porca-luva do CAD).
