---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
repo: deopmdecastro/dc-simu
commit: af0bb27 (apenas local — push bloqueado, ver Nota de rede)
date: 2026-10-28
---

# Landing Demo: verificação funcional e contrato fixado por testes

## Estado da funcionalidade (já implementada antes desta sessão)

A demonstração da landing (`/`) é uma **vista real do editor em modo só-simulação**,
alimentada por um **projeto nativo** do simulador e por uma **publicação** de qualquer
projeto da plataforma:

1. **Vistas reais, um só estado** — `src/landing/Landing.tsx` alterna três vistas
   sobre o mesmo estado partilhado (`plcRunning`/`motorOn` → `demoTable`):
   - Ladder: `src/ladder/NetworkDiagram.tsx` (renderizador real do editor, lazy);
   - GRAFCET: `src/landing/LandingGrafcetDemo.tsx` (motor `grafcet/engine.ts`);
   - Visualização 3D: `src/three/LandingShowcase.tsx` (cena do painel com fios
     coloridos por energização, HUD LOGO! e sinaleiros que reagem ao estado).
2. **Projeto nativo editável na conta** — `src/project/nativeProjects.ts`:
   semente única e estável `native-partida-direta-v1` («Partida direta (nativo)»),
   com painel/instâncias de catálogo, fios ligados a bornes, Ladder, GRAFCET e tags.
   Aparece sempre na conta admin e pode ser editado (guarda como qualquer projeto;
   se eliminado, é reposto).
3. **Publicação na landing** — admin (painel de administração) escolhe **qualquer
   projeto, de qualquer utilizador**: `Publicar na landing` guarda a revisão atual;
   pode «Remover da landing». Origem: `src/project/landingPublish.ts`
   (`sliceLandingDemo`) — a publicação tem prioridade sobre o nativo; conteúdo
   vazio/parcial cai para o nativo. Backend: endpoints `/landing/published` em
   `src/auth/localBackend.ts` e `src/supabase/supabaseBackend.ts`.

## Este conjunto de validações (novo)

`scripts/landing-demo-smoke.ts` (corre com `test:landing-demo`, sem rede nem browser):

- **Integridade do projeto nativo**: ID estável; ≥5 componentes; cada fio liga
  bornes existentes; Ladder/GRAFCET/tags preenchidos.
- **Contrato do corte**: extração de Ladder+GRAFCET+nomes do payload; publicação de
  utilizador sobrepõe nome/Ladder/tags; conteúdo vazio → fallback nativo.
- **Tabela online (`nativeDemoTable`)**: STOP ⇒ tudo desligado; RUN sem marcha ⇒ H2
  ativo; marcha ⇒ KM1+H1 ativos e H2 inativo — o mesmo estado que anima as três vistas.

Resultados da sessão (nr. de suítes passadas):

- Typecheck limpo; `npm test` (smoke principal) OK.
- Suites puros: style, saas, component-validate, diagnostics, ladder-integration,
  ladder-math, grafcet-links, grafcet-dialogs, grafcet-signals, grafcet-ladder-sync,
  ladder-rename, project-names, excel, pdf-export, server, interactables, motion — todas OK.
- Playwright (`test:landing-ui`, `test:admin-ui`, …): não corre no sandbox (falta de
  browsers); ficam para CI/local com `npx playwright install chromium`.

## Nota de rede (push bloqueado)

- dc-simu main remoto: `591453f` (em dia com BrainNet `111ffc1`).
- Commit local `af0bb27` adiciona o smoke de contrato **mas o push falhou**:
  o PAT guardado passa no `fetch` (leitura) e falha no `push` com
  `Invalid username or token` — sintoma de revogação parcial ou permissão
  *contents:write* em falta. Re-submeter com um PAT válido (com repo:write)
  ou confirmar a revogação.
- Reverter estado local não é necessário: o commit é aditivo (teste + script npm).
