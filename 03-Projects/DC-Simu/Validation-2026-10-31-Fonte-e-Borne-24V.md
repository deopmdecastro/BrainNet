---
project_id: BN-DCSIMU-001
type: validation
status: PUBLISHED
created: 2026-10-31
updated: 2026-10-31
repo: https://github.com/deopmdecastro/dc-simu
commits:
  - 2aef470
tags: [dc-simu, fonte, borne, 24v, glb, pti6, 3d-realista]
---

# Validação 2026-10-31 — Fonte DC 24 V e borne 24 V (preto · vermelho · verde)

## Pedido
Fazer para 24 V o que já existia no borne e na fonte trifásicos: fonte e borne com corpos preto + vermelho + verde. (A mensagem original ficou cortada em «borne das mesmas cores para…»; assumido: borne 24 V.)

## Implementação
- Novos tipos `powerSource24v` («Fonte DC 24V · 0V/+24V/PE», grupo Fontes) e `terminalSet24v` («Conjunto de bornes 24V · 0V/+24V/PE», grupo Bornes e barras).
- `scripts/build-native-terminal-assemblies.mjs` gera `public/models/bornes-e-barras/conjunto-bornes-24v.glb` (3 módulos Phoenix PTI 6): **0 V preto (#171717) · +24 V vermelho (#dc2626) · PE verde (#27834a)**, ordem da esquerda para a direita. Fonte e borne partilham o GLB, como no monofásico/trifásico.
- `terminalAssembly.ts`: condutores/cores 24 V e `TERMINAL_CONDUCTOR_PATTERN` partilhado (factory e editor 3D); `terminal3D.ts` deixa de assumir 3/5 módulos por `1ph`.
- `factory.ts`: templates, cores dos terminais e calibração dos furos do PTI6 (`socket3D`).
- `engine.ts`: o borne passa cada condutor IN→OUT; a fonte ligada alimenta +24V e 0V (0V é `neutral`, não contamina o positivo), PE sempre.
- `symbols.tsx`, `iecAssociation.ts`, `modelPaths.ts`, `Panel3D.tsx`, `componentThumbnails.tsx`: símbolo do esquema (G/X), miniatura e 3D Realista.
- `public/models/README.md` atualizado. «Fonte chaveada 24Vdc» (`powerSupply`, AC→DC) **mantém-se a aguardar GLB**, não foi alterada.

## Verificações
- `tsc -b`, `vite build`, `npm test` (smoke, +11 verificações novas: cores, ordem, furos, continuidade, cores gravadas no GLB, 43 componentes 3D) e `glow-smoke` OK.
- Smokes que **já falhavam antes** desta alteração (mesma falha, confirmado com stash): commands-import, editor3d-functional, imported-components, terminal-geometry, terminal-seat, view-diagnostics.
- Teste visual em browser **não executado**.

## Pendências
- Confirmar no browser: miniatura e 3D (preto · vermelho · verde), encaixe dos cabos nos furos, e símbolo no Esquema IEC.
- `docs/model-interfaces.json` não foi regenerado (o gerador reescreve ~17 mil linhas não relacionadas).
- GLB trifásico regenerado pelo script difere em bytes do commitado (conteúdo idêntico); mantido o original.
