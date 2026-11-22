---
type: validation
status: IMPLEMENTED
created: 2026-11-22
updated: 2026-11-22
tags: [dc-simu, siemens, s7-300, plc, 3d, catalogo]
---
# Siemens S7-300 — CPU 315-2 PN/DP, SM321, SM322, SM334

## Pedido

Criar componentes realistas (3D CAD, serigrafia, botões, LEDs, bornes, texturas, datasheet PDF, esquema IEC, acabamentos e etiquetas) para:

1. **6ES7315-2EH14-0AB0** — CPU 315-2 PN/DP  
2. **6ES7321-1BL00-0AA0** — SM 321 DI 32×DC24V  
3. **6ES7322-1BL00-0AA0** — SM 322 DO 32×DC24V/0,5A  
4. **6ES7334-0CE01-0AA0** — SM 334 AI 4 / AO 2  

## O que já existia (reutilizado)

- Tipos em `ComponentType` e entradas em `factory.ts` (bornes, estado, `paletteName`, grupo Controladores).
- Tabelas de bornes em `siemensPlc.ts` (`s7300Sm321TerminalRows`, etc.).
- Links de datasheet (actualizados para Siemens Industry Support).
- Estavam em `hiddenCatalogTypes` com nota «AGUARDA GLB 3D e capa».

## Entrega (`be2ff25`)

| Artefacto | Conteúdo |
|-----------|----------|
| `src/three/siemensS7300Model.ts` | Modelos 3D procedurais (cotas datasheet, corpo RAL 7021, serigrafia canvas, LEDs, seletor RUN/STOP/MRES, MMC, MPI/DP, 2×RJ45, conector 40 pólos, clip TS35, MLFB) |
| `src/three/SiemensS7300Devices3D.tsx` | Wrapper React + animação de LEDs pelo estado |
| `Panel3D.tsx` | Renderização em calha e fora de calha |
| `modelPaths.ts` | Dimensões físicas + `hasComponent3DVisual` + snap DIN |
| `hidden.ts` | Removidos da lista oculta — **visíveis na biblioteca** |
| `plcStatusLights.ts` / `siemensPlc.ts` | Integração na família S7 |

### Cotas (datasheet Siemens)

| Módulo | W × H × D (mm) |
|--------|----------------|
| CPU 315-2 PN/DP | 40 × 125 × 130 |
| SM 321 / SM 322 / SM 334 | 40 × 125 × 120 |

### Interacção

- Clique no seletor da CPU alterna **RUN ↔ STOP** (com LEDs).
- LEDs de canal nos SM reflectem `state.inputs` / `state.outputs` quando alimentados.

## Limitações / próximos passos

- Modelo **procedural** (não GLB STEP oficial) — fidelidade visual elevada mas não CAD Siemens nativo.
- Capas WebP da biblioteca e símbolos IEC dedicados aos SM (no esquema de comandos) podem ser refinados.
- PDF datasheet: link para Siemens Support (não embutido em `public/datasheets/`).

Estado: **implementado e publicado** em `origin/main` (`be2ff25`).
