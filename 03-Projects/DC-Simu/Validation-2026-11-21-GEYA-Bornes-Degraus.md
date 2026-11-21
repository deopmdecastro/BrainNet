---
type: validation
status: IMPLEMENTED_PENDING_VISUAL_APPROVAL
created: 2026-11-21
updated: 2026-11-21
tags: [dc-simu, geya, temporizadores, bornes, parafusos, validacao]
---
# GEYA GRT8-M1, M2 e B1 — bornes e parafusos nos degraus corretos

## Resultado

Corrigida a disposição dos poços, parafusos cativos, etiquetas, divisórias e entradas dos condutores nos três temporizadores. O gerador anterior punha os parafusos de todas as filas na parede intermédia, a Z38, e sobrepunha as duas filas inferiores do M2 nessa mesma parede. As fotografias dos manuais mostram a alimentação e o primeiro inversor nas paredes traseiras e o segundo inversor M2 no degrau seguinte, mais à frente.

| Modelo | Superior traseiro | Inferior traseiro | Inferior intermédio | Total |
| --- | --- | --- | --- | --- |
| GRT8-M1 | A1 / S / A2 | 15 / 16 / 18 | Sem bornes | 6 |
| GRT8-M2 | A1 / S / A2 | 15 / 16 / 18 | 25 / 26 / 28 | 9 |
| GRT8-B1 | A1 / S / A2 | 15 / 16 / 18 | Sem bornes | 6 |

As cabeças ficam rebaixadas 1,25 mm relativamente à respetiva parede. A parede traseira usa Z24 e a intermédia Z38 no referencial de construção; são cotas da reconstrução visual, não medições certificadas do produto. Os números assentam no mesmo degrau dos seus parafusos. A patilha DIN inferior foi recuada para a traseira, deixando 15/16/18 desimpedidos.

Cada entrada tem uma cavidade finita e independente. A cavidade intermédia M2 termina antes do veio do parafuso, evitando que o encaixe do cabo atravesse metal. Os envelopes mantêm **18,08 × 95 × 65,35 mm**. Serigrafias frontais e laterais, seletores, LEDs e lógica de temporização foram conservados.

## Projetos existentes

As entradas A1/S/A2 e 15/16/18 mantêm as posições anteriores. A fila 25/26/28 do M2 acompanha a prateleira intermédia corrigida. Um snapshot imutável permite reconhecer a revisão publicada anterior, além da primeira revisão já suportada.

A migração aplica-se apenas a posições e encaixes automáticos conhecidos, no projeto e no editor de componentes. Conserva IDs elétricos e nomes de autoria; não reposiciona bornes fixados, movidos à mão, com normais/encaixes personalizados ou geometria nativa de autoria. É idempotente. As verificações mecânicas incluem a conservação do grafo completo de cabos após guardar/reabrir.

## Ficheiros

- `dc-simu/scripts/build-industrial-devices.mjs`: perfil lateral e disposição coerente de cada bloco de bornes.
- `dc-simu/src/electrical/legacyRealInterfaces.ts`, `factory.ts` e `src/admin/editor3d/builtinComponents.ts`: migração da revisão M2 anterior.
- `dc-simu/src/data/industrial-device-geometry.json`: três interfaces M2 atualizadas; restantes interfaces conservadas.
- `dc-simu/public/models/industriais/timerGeyaGrt8M1.glb`, `timerGeyaGrt8M2.glb`, `timerGeyaGrt8B1.glb` e `sources.json`: modelos regenerados e hashes.
- `dc-simu/public/component-covers/`: seis capas atualizadas e índice.
- `dc-simu/scripts/geya-terminal-steps-smoke.ts`, `geya-terminal-steps-ui-smoke.mjs` e `package.json`: regressões geométricas, migração e integração. A regressão geométrica integra `test:industrial`, já utilizado na CI.
- `dc-simu/src/three/industrialFinish.ts`: documentação do hardware incluído nos GLB, sem duplicação em runtime.

## Referências e evidências

- [Manual GEYA GRT8-M, fotografias M1/M2 e desenho dimensional](https://www.geya.net/wp-content/uploads/2021/05/GRT8-M-Instruction-Manual.pdf).
- [Manual GEYA GRT8-A/B, fotografias e disposição dos contactos](https://www.geya.net/wp-content/uploads/2022/10/GRT8-AB-Manual.pdf).
- [M1 em perspetiva](dc-simu/docs/validation/geya-terminal-steps/timerGeyaGrt8M1-perspetiva.png).
- [M2 visto de baixo — dois degraus distintos](dc-simu/docs/validation/geya-terminal-steps/timerGeyaGrt8M2-inferior.png).
- [B1 em perspetiva](dc-simu/docs/validation/geya-terminal-steps/timerGeyaGrt8B1-perspetiva.png).
- [Medições dos três modelos no Painel e editor](dc-simu/docs/validation/geya-terminal-steps/results.json). A pasta contém também as vistas frontal e inferior de cada modelo.

## Verificações

- **120 verificações** específicas: contagem, parede física medida por raios, rebaixo, acesso à cabeça, serigrafia desimpedida, posição das entradas e migração nativa/Admin.
- **204 verificações industriais**: hashes dos GLB, escala, cavidades abertas e comportamento elétrico.
- **233 verificações mecânicas**: incluindo projetos antigos, conservação de cabos e idempotência.
- **56 verificações de interface** nos três modelos e no editor M2: parafusos e números expostos, entradas distintas, seletores funcionais, guardar/reabrir; zero exceções React/WebGL. Execução em modo `uitest`, IndexedDB isolado e pedidos externos bloqueados.
- `npm test` da aplicação: aprovado; `npm test` do cofre: **45/45**.
- TypeScript, build e verificação de hooks: aprovados. O build mantém o aviso global de tamanho de bundles.
- As seis capas pedidas foram geradas. O inventário global continua a indicar quatro capas genéricas em falta: `buttonNO`, `buttonNC`, `selector2` e `selector3`.
- `npm run check` do cofre mantém os erros anteriores: frontmatter ausente em seis README de evidências e dois links inválidos em `.claude/skills/gsap-scrolltrigger/assets/examples/README.md`.

## Estado

**Preparado:** referências, gerador e regressões. **Implementado:** três modelos, entradas M2, migração e capas. **Testado:** verificações acima e inspeção das capturas. **Aprovado:** aceitação visual pelo utilizador pendente. Commit `f9e16fb` no DC-Simu, enviado para `main` em 2026-11-21; sem publicação em produção. As pendências globais de documentação e capas permanecem fora do âmbito.
