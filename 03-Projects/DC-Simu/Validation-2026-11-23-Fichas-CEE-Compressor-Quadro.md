---
type: validation
status: IMPLEMENTED
created: 2026-11-23
updated: 2026-11-23
tags: [dc-simu, fichas, CEE, compressor, quadro, cabo-revestido, maquete]
---

# Fichas CEE no compressor e no quadro (tomada maquete)

## Pedido
- Ficha no compressor que liga na tomada do compressor; cabo editável (arrastar waypoints).
- Ficha no quadro/maquete que liga na tomada; no lado do quadro, fios L/N/PE aos bornes.
- Cabo da ficha revestido.

## Solução
### Novo componente `ceePlug16A`
- Catálogo: ficha CEE 16A 2P+T 230V IP44
- Bornes L, N, PE (lado do cabo / bucim)
- 3D: corpo azul, pinos macho, bucim traseiro

### Maquete Estampagem
| Key | Ref | Função |
|-----|-----|--------|
| `plug-compressor` | F-COMP | Encaixada em XS-COMP |
| `plug-bench` | F-MAQ | Encaixada em XS-MAQ |

### Cablagem
1. **Contacto** tomada OUT.* ↔ ficha L/N/PE (troços curtos = pinos encaixados)
2. **Compressor**: cabo **3G2,5 H07RN-F revestido** F-COMP → motor L/N (`sheathed`, bundle, **sem locked** → arrastável)
3. **Quadro**: fios revestidos F-MAQ → PS1 L/N e PE → terra X20

## Commits dc-simu
- f84de0e socketDevices, ede3d48 types, 818407e factory, c8ec60c model
- 7e0defd modelPaths, be0adae Panel3D, 3140f1e stampingBench, bb875b7 wiring

## Passo 5 (carregamento) — nota
A otimização de 23 Nov (`a86bd964` / Validation-2026-11-23-Otimizacao-3D-Esteiras-Build) já aplica lazy-loading, pooling, LRU e perfis adaptativos. O tempo de “A carregar a vista…” residual deve-se sobretudo ao número de TubeGeometry dos cabos e GLBs da maquete no first load; mitigação futura: pre-warm de materiais e progress por fases.

Estado: **implementado e publicado**. Remontar a maquete para ver fichas e cabos.
