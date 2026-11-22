---
project_id: BN-DCSIMU-001
type: task
status: DONE
created: 2026-11-22
updated: 2026-11-22
tags: [brainnet, dc-simu, ui, ux, objetos, arvore]
---
# Objetos do projeto: árvore igual à Biblioteca e olho para ocultar

## Alterações implementadas no `dc-simu`

1. **Modelo (`src/types/index.ts`)**
   - Adicionada a propriedade opcional `hidden?: boolean` a `ElectricalComponentBase` para ocultar componentes na vista 3D/esquema mantendo-os no projeto e na simulação.

2. **Vista 3D (`src/three/Panel3D.tsx`)**
   - Filtrados os componentes com `hidden === true` na renderização de `mountingRails`, `railComponents`, `offRail` e `accessories`.

3. **Painel «Objetos do projeto» (`src/components/ProjectObjects.tsx` e `src/index.css`)**
   - Reaproveitado `paletteDomains()` de `src/electrical/factory.ts` para organizar os objetos em árvore idêntica à Biblioteca: **Domínio → Subgrupo → Componentes** (com fallback para «Outros»).
   - Adicionado botão de expandir/recolher árvore e expansão automática durante a pesquisa.
   - Adicionado botão de **olho** (`IconEye` / `IconEyeOff`) em cada componente, subgrupo e domínio para ocultar/mostrar na vista 3D, com estado visual `.is-hidden`.

## Commit

- Repositório `dc-simu`: `63ba6f1` (`main`).
