---
type: validation
status: IMPLEMENTED
created: 2026-11-23
tags: [dc-simu, cablagem, calhas, filaçamento, bucins, maquete, quadro]
---

# Cablagem organizada — calhas, filaçamento e bucins

## Pedido
Melhorar cablagens na maquete e no quadro: fios afilaçados, dentro de calhas, organizados, a sair nos bucins.

## Alterações
1. **Campo** (`fieldWire`): `bundleId` `mq-campo` / `mq-campo-operadores` → abraçadeiras nas calhas perimetrais e na perna até ao bucim do QE1.
2. **Ficha compressor**: cabo 3G2,5 sai pelo **bucim** da ficha, desce em pistas L/N, chicote `chicote-ficha-comp`.
3. **Ficha maquete → quadro**: L/N/PE sobem à **calha técnica** do QE1 até PS1 e terra X20 (`qe1-alimentacao-plc`).
4. **Montagem**: `lacePairBundles` corre automaticamente após criar os cabos da maquete.

## Commits
- `635bd0dd` stampingBenchWiring
- `3d02cfbe` useSimStore

Remontar a maquete para aplicar.
