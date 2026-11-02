---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, 3d, cover, torre, condensador]
---

# Torre capa sem textura · condensador sem modelo real

## Problemas
1. Torre com textura no painel 3D, capa da biblioteca/inspetor sem textura.
2. Condensador CBB65 aparecia como bloco amarelo (fallback), não o GLB.

## Correção
- Capas: `paintImportedModel` antes do PBR no turntable; cache `v2:`.
- `capacitorRun60uF` → `CadComponentReal3D` com `/models/motores/capacitor-run-generic.glb`.

Commit: `0fca3ca`.
