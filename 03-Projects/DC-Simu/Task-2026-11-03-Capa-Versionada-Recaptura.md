---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_TESTED_NOT_VISUALLY_VERIFIED
created: 2026-11-03
updated: 2026-11-03
repos: [dc-simu, BrainNet]
tags: [dc-simu, capa, dashboard, 3d, cache, nativo]
---
# Capa do projeto fiel ao projeto real (capa versionada e recaptura)

## Pedido
As capas do dashboard ainda não são fiéis ao projeto real: o cartão do «Partida direta com emergência (nativo)» mostra só a chapa, com cabos a sair do enquadramento, sem motor nem multímetro, mesmo com o projeto em rev. 27.

## Contexto reutilizado
[[Task-2026-11-03-Tablet-Dois-Canvas-Som-Capa]] (enquadramento = chapa + aparelhos + cabos, cabos a 1,2×), [[Task-2026-11-03-Cabos-Nativo-Capa-Tablet]] (`wire-curves` retira a capa) e [[Validation-2026-10-29-Texturas-Capas-Vistas]]. O enquadramento em `CoverSnapshotBridge` já estava certo; não foi reescrito.

## Diagnóstico
A imagem do cartão é uma capa **antiga** (chapa enquadrada, cabos grossos pendurados), não uma captura do código novo. Ela nunca era substituída:
- `leave()` só recapturava quando **não** havia capa guardada (`!hasStoredCover()`); uma capa antiga, mas existente, ficava para sempre.
- A migração `wire-curves-v7` só retira a capa de projetos que ainda não têm essa marca; um projeto já gravado com ela mantinha a capa antiga.
- Capturar com os cabos por traçar (ou voltar a gravar uma capa antiga) dava capas sem cabos e escondia a falta de recaptura.
- Só há captura com a cena 3D montada (Esquema 2D ou 3D); em Ladder, GRAFCET, IEC ou Monitor não há.

## Alterações (`dc-simu`)
- `coverCapture.ts`: `COVER_VERSION = 2`, versão guardada junto da capa (`coverVersion` no conteúdo do projeto). Capa sem versão ou de outra versão = desatualizada (`hasStoredCover()` falso, `hasStaleCover()` verdadeiro).
- Nunca se captura com os cabos por traçar (antes capturava se não houvesse capa anterior); `canCaptureFreshCover()` = cena montada **e** cabos prontos.
- `account.tsx`: ao guardar grava `coverVersion` da última captura **real** — uma capa antiga mantida (sem cena montada) continua marcada como antiga e não é dada por fresca. Ao sair do editor, recaptura se a capa estiver em falta/antiga e a captura for possível.
- `useSimStore.loadJSON` passa `coverVersion` ao registo da capa.
- Teste novo `npm run test:cover-version`.

## Verificação
`tsc -b`, `npm test`, `test:cover-version`, `test:wire-curves-refresh`, `test:style`: OK. Sem WebGL nem browser neste ambiente: a imagem da capa não foi gerada nem vista.

## Pendências (não verificado)
- **A capa só muda depois de uma recaptura:** abrir cada projeto, estar no Esquema 2D ou 3D com os cabos já desenhados e **Guardar** ou voltar aos projetos. Antes disso o cartão continua com a capa antiga (nada a gera sozinho).
- Se, mesmo assim, a capa nova não incluir motor e multímetro, o problema passa a ser o enquadramento em `CoverSnapshotBridge` (capturar na vista frontal vs 3D, ou a caixa dos aparelhos fora da chapa): enviar a nova imagem do cartão.
- Considerar recaptura silenciosa ao abrir um projeto com capa antiga (hoje evitada para não criar revisões sem o utilizador guardar).
