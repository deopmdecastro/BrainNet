---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, iec, 60617, 81346, 3d, esquema-iec, catalogo, associacao]
---

# Associação elemento 3D ↔ símbolo IEC

## Pedido
Cada elemento 3D deve estar associado a um símbolo IEC.

## Contexto
O DC-Simu separa:
- **3D Realista** — componentes físicos (`ComponentType`) com modelo GLB / footprint
- **Esquema IEC** — símbolos gráficos IEC 60617 (`CmdKind`) no editor de comandos

Antes não existia ponte formal entre os dois. O inspetor e o catálogo não indicavam o símbolo normativo correspondente.

## Solução
1. Módulo `src/electrical/iecAssociation.ts`
   - Mapa `ComponentType` → `{ primary?: CmdKind, related?: CmdKind[], iec60617?, refLetter?, note? }`
   - Cobertura de todos os tipos integrados (proteção, comando, sensores, contactores, relés, sinalização, motores, PLCs, bornes, fontes…)
   - Resolução para componentes do catálogo Admin via `meta.iecSymbol`, `meta.kind` ou `meta.category`
   - Helpers: `iecAssociationOf`, `iecPrimaryLabel`, `iecRelatedLabels`, `hasIecSymbol`, `iecKindsOf`

2. Catálogo (`CatalogMeta`)
   - Novo campo opcional `iecSymbol?: string` (CmdKind) para o autor fixar a associação no Editor 3D

3. Inspetor (3D Realista / Esquema)
   - Secção **Símbolo IEC**: principal, letra IEC 81346-2, referência 60617, símbolos relacionados e nota

## Exemplos de mapeamento
| 3D | Símbolo IEC principal | Relacionados |
| --- | --- | --- |
| `breaker3p` | `breaker3` | — |
| `motorBreaker` | `breaker3` | thermal3, thermalNC/NO |
| `contactor` | `coil` | contact3, contactNO, contactNC |
| `buttonNO` | `pushNO` | — |
| `emergencyButton` | `emergency` | — |
| `motor3ph` | `motor3` | motor6 |
| `ledGreen` | `lamp` | — |
| `plcLogo` | (só 60617 / letra A) | — |

## Fora de âmbito (próximos passos)
- Sincronização automática de instâncias entre 3D e Esquema IEC
- Miniatura do glifo IEC na biblioteca 3D
- Campo `iecSymbol` editável no formulário do Admin Editor 3D
- Aviso de diagnóstico «componente 3D sem associação IEC»

## Aceitação
- [x] Cada tipo integrado resolve uma associação (primary e/ou iec60617)
- [x] Catálogo pode declarar `iecSymbol`
- [x] Inspetor mostra a associação ao selecionar um componente
- [ ] (opcional) Editor Admin permite escolher o CmdKind
