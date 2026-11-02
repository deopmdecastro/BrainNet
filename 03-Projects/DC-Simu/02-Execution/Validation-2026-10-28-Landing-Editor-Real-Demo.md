---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
repo: deopmdecastro/dc-simu
commit: 1ea8b61
date: 2026-10-28
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, landing, editor, demo, validation]
---

# Landing: demonstração passa a ser o EDITOR REAL em modo só-simulação

## Motivação

O utilizador comparou a demonstração (janela estilizada com Árvore/KPIs sintéticos)
com o editor real (Toolbar, vistas, painéis, barra de estado) e apontou:
**«ainda não parece igual»**. Decisão: abandonar o mock e montar a própria aplicação.

## Implementação (dc-simu `1ea8b61`)

1. **`src/landing/LandingEditorShowcase.tsx`**
   - Guarda `saveJSON()` antes de mexer na loja + nome + demoMode.
   - `stop()` → `ensureLoaded()` do catálogo → `accountApi('/landing/published')`
     (fallback `nativeLandingPayload()`) → `loadJSON(content)` → `setCurrentProjectName`
     → `setDemoMode(true)` → monta `<App demo onEnterEditor={onAccess} />`.
   - Unmount: `stop()` + `setDemoMode(wasDemo)` + `loadJSON(snapshot)` + nome anterior.

2. **`store/useSimStore.ts`** — `demoMode: boolean` + `setDemoMode`; espelho síncrono
   em `store/demoMode.ts` (para módulos leves sem ciclos de import). `setTool` ignora
   ferramentas de edição (wire/probe/erase/…) em demo → atalhos 1–5 incluídos.

3. **`store/demoMode.ts`** — `isDemoMode()/syncDemoMode()`; usado pelo `grafcetBus`
   para impedir o modo «connect» em demo.

4. **`components/Toolbar.tsx`** — prop `demo?: boolean` + `onEnterEditor?: () => void`:
   - Linha 1: pill «Demonstração» + CTA «Abrir no editor»; grupo Ficheiro
     (Novo/Abrir/Salvar/BOM/PDF) omitido.
   - Linha 2: histórico, painéis móveis, Bloco/Nova network, paleta GRAFCET,
     variáveis/modelos/gerar-ladder/organizar/exportar (menu «Mais»), Organizar/Tabela
     do esquema, edição de componente/bornes e caixa-preta — todos fora da demo.
   - Canvas: só Selecionar/Mover vista; GRAFCET: só Selecionar/Arrastar.
   - Mantidos: vistas (tabs), Run/Pausa/Stop/Passo/Reset + modo/velocidade,
     botão Simulação, Compilar, validação GRAFCET, atalhos, malha/zoom, Clean.

5. **`App.tsx`** — props `demo`/`onEnterEditor`; vistas sem Monitor; PlanLocked
   não tranca ladder/grafcet na demo; raiz sem `w-screen` (embed da landing).

6. **`landing/Landing.tsx`** — removido o `EditorAnatomy` (mock) e imports órfãos;
   a secção `#editor` monta `LandingEditorShowcase`. `LandingGrafcetDemo`/`NetworkDiagram`
   deixam de ser usados na secção (hero mantém `LandingShowcase`).

7. **CSS** — `.landing-editor-embed` (moldura, altura 74vh, sombra) em `dx-landing.css`.

8. **Contrato estrutural** — `scripts/landing-editor-showcase-smoke.mjs`,
   `npm run test:landing-editor` (23 asserções: hidratação, restore, gates, pill/CTA,
   remoção do mock).

## Validação

- typecheck limpo; `npm test` OK; 21 suites (style, saas, ladder×5, grafcet×5,
  rename, names, excel, pdf, server, interactables, motion, fluidsim, diagnostics,
  component-validate) + landing-demo + landing-editor — **todas verdes**.
- Playwright (landing-ui/admin-ui) não corre no sandbox (sem browsers) — CI.

## Pendências conhecidas

- Edições iniciais em demo não ficam guardadas (comportamento pretendido: sandbox);
  o CTA «Abrir no editor» conduz ao login para a experiência completa.
- O hero da landing mantém a cena `LandingShowcase` própria — substituí-la pelo
  mesmo embed seria possível numa iteração futura.
