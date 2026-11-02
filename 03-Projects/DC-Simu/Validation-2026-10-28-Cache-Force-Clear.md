---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, cache, pwa, vercel, deploy]
---
# Validação 2026-10-28 — Forçar limpeza de cache (domínio com UI antiga)

## Problema
Domínio (`dc-simu.vercel.app`) continuava a mostrar design antigo apesar do push do refinamento UI (`ee27064`).

## Diagnóstico
- HTML de produção já com `Cache-Control: no-cache, no-store, must-revalidate` e `x-vercel-cache: MISS/HIT` recente.
- Assets com hashes Vite e `max-age=31536000, immutable` (correto).
- Causa principal: **Service Worker / Cache Storage / PWA** no cliente a servir HTML ou assets antigos.

## Ação
1. Bump da chave de recuperação em `index.html`: `dcsimu:startup-asset-recovered:v2` → `v3`.
2. Commit + push (`037cdc4`) para forçar novo deploy e novas hashes de assets.
3. Mecanismo já existente documentado: abrir com `?limpar-cache` chama `hardRefresh()` (purge total de caches + unregister SW + reload).

## Como o utilizador limpa agora
- Abrir: https://dc-simu.vercel.app/?limpar-cache
- Ou hard-refresh no browser (Ctrl+Shift+R / limpar dados do site).
- Em iOS PWA: remover da ecrã inicial e voltar a adicionar, ou usar o link acima.

## Estado
Implementado e publicado.
