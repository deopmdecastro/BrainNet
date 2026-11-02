---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_PARTIAL
repo: deopmdecastro/dc-simu
commit: ad49cbd, 8e60355
date: 2026-10-28
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, landing, performance, hero, demo, pwa, cabos]
---

# Landing mais leve, hero do motor enquadrado e demo em isométrica

## Pedido
Verificar o estado operacional; aliviar a landing e melhorar a renderização; motor da primeira
ecrã demasiado grande (sem cartão); vista do motor isométrica no simulador; organizar os cabos.

## Verificação inicial
Node 22: `npm ci`, `tsc -b` e `vite build` passam; `npm test` passa. Os percursos Playwright do
projeto não correram (Chromium do projeto em falta no ambiente); capturas feitas com o Chromium
instalado e WebGL por software.

## Causas encontradas e correções
| Problema | Evidência | Correção |
| --- | --- | --- |
| Precache PWA de ≈ 39,5 MB (todos os GLB, PDFs, texturas) na primeira visita | saída do `vite build` | `globIgnores` + `runtimeCaching` (CacheFirst modelos/texturas); precache **6,2 MB** |
| HDR do `Environment preset` descarregado de CDN externo; falha derrubava o hero | `Could not load potsdamer_platz_1k.hdr` | Luz de estúdio local (`Lightformer`), sem rede |
| Falha do Google Fonts ativava a recuperação de «asset antigo» (apagava caches e recarregava) | URL `?_fresh=` após carregar | Recuperação só para o mesmo domínio; fontes sem bloqueio de render |
| Motor do hero enorme/cortado; câmara fixa | captura do utilizador | Câmara isométrica enquadrada por `Box3` (`FILL` 0,78) |
| Contentor do motor com largura 0 em telemóvel (canvas 300×150, motor invisível) | medição Playwright 390 px | `.dx-hero-motor { width:100%; align-self:stretch }` |
| Render contínuo fora do ecrã | leitura de código | `frameloop` suspenso por `IntersectionObserver`; dpr ≤ 1,5; sombras de contacto 256 px |
| Demo abria em câmara frontal; motor (fora do painel) ficava enorme junto da câmara | `Panel3D` `frontEdit` + `fitDistance` só pelo carril | Em `demoMode` a câmara inicial é isométrica |
| Cabos paralelos sobrepostos na calha (5 faixas por hash, sem profundidade) | `trunkSpread` | 9 faixas de 1,2 cm + 3 camadas de profundidade (`trunkLayer`) |

## Evidência
- Capturas do hero a 1440 px e 390 px: motor inteiro, isométrico, sem cartão.
- `scripts/landing-editor-showcase-smoke.mjs` estendido (isométrica na demo; faixas/camadas) — passa.
- `tsc -b`, `npm test` passam.

## Pendências (não testado / não feito)
1. **Demo 3D e cabos sem confirmação visual**: no ambiente de teste o editor da demo não terminou
   de carregar em tempo útil. Confirmar em navegador real (Esquema 2D e Visualização 3D).
2. **`three` core (≈ 795 KB) ainda no arranque**: importado por `dinRailGeometry`, `terminal3D`,
   `componentTerminalViews`, `terminalAssembly` (via `useSimStore` e `catalog/registry`). Remover
   exige separar a matemática de `three` da store/catálogo.
3. **CSS único de ≈ 723 KB (125 KB gzip)** carregado no arranque; separar CSS dos editores.
4. **Pedido ao jsDelivr** (fontes do texto 3D do troika) na demo: falha offline; pré-alojar.
5. Testes UI Playwright do projeto por correr num ambiente com o seu Chromium.
