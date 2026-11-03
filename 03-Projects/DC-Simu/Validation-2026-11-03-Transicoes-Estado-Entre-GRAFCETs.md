---
project_id: BN-DCSIMU-001
type: validation
status: PUBLISHED
created: 2026-11-03
updated: 2026-11-03
repo: https://github.com/deopmdecastro/dc-simu
commits:
  - 2ea1e8f
tags: [dc-simu, grafcet, transicao, modal, comparacao, paginas, ux]
---
# Validação 2026-11-03 — Modal de transição e dependências de estado entre GRAFCETs

## Pedido
«A modal de transição ficou muito mal: organizar, fazer UI e UX. Quero uma funcionalidade que depende de etapa de outro GRAFCET ou do mesmo GRAFCET — comparações como `G0 <> X5`, `G1 == X11` — de forma intuitiva.»

Contexto relido antes de alterar código: `AGENTS.md`, [[../../00-Dashboard/Home|Home]], [[../../00-Dashboard/Architecture|Architecture]], [[Design-Principles|Design-Principles]], [[Requirements|Requirements]], [[Decision-Log|Decisões]] e a iteração anterior em [[Task-2026-11-02-Transicoes-Comparativas]].

## O que já existia (reaproveitado, não reescrito)
- `ConditionEditor` (receptividade com sugestões, operadores e histórico de cursor) — mantido tal e qual.
- `PropertyDialog` (moldura, foco, Esc/Ctrl+Enter), `Select` da plataforma, `toolbarKit`/ícones de `src/ui/icons.tsx`.
- Seletor de etapas das origens/destinos (combobox com lista, teclado e mensagens) — mantido, agora limitado à página.
- Leitura de `G0X9` / `G0 <=> X9` / `/X9` já usada na modal anterior — promovida a função única no motor.
- `grafcet-dialog-ux.css` como folha da modal (sem tokens novos, sem barras de destaque).

## Implementado no DC-Simu (`2ea1e8f`)
### Funcionalidade nova — etapa de outro GRAFCET na receptividade
- `G1 <=> X11` exige a **etapa 11 da página G1** ativa; `G1 <> X11` exige-a inativa. `G0` é a primeira página (o grafo principal), `G1`, `G2`… as seguintes — as páginas já corriam no mesmo motor, faltava a leitura por página.
- `grafcetGraphs`, `graphStepNumbers`, `graphNumberOfStep` e `graphStepIsActive` no motor: contagem de etapas **por página** e resolução do prefixo. Se a página existir mas não tiver essa etapa, cai na numeração global (projetos antigos e importações FluidSIM continuam válidos).
- `stepStateReferences` é agora a **única** leitura das referências de estado: a modal, a validação do programa e a avaliação usam a mesma interpretação. `referencedSteps` mantém-se para compatibilidade.
- `validateGrafcet` identifica a página em falta («usa X11 na página G1, mas essa etapa não existe»).
- Formas aceites: `G1X11`, `G1 <=> X11`, `G1 == X11`, `G1 <> X11`, `G1:X11`, `G1.X11`, `G1=X11`, `G1=>X11`; `5s/G2X4` continua a ser temporizador por etapa.

### UI/UX da modal
- **Nome + Receptividade na mesma linha**: a configuração essencial cabe sem deslocar o formulário (a queixa da captura: a modal abria já a meio, com as origens à vista e a condição fora do ecrã).
- **Ligações** com a página à vista (`G0`); origens e destinos limitados às etapas dessa página (antes oferecia etapas de outras páginas, que não se podem ligar no desenho).
- **«Depende do estado de etapas»** substitui «Estado de outras etapas»: construtor `GRAFCET → etapa → ativa/inativa → Adicionar`, com a lista de etapas **só** da página escolhida (número + nome + descrição) e nota com o código resultante. Cada termo aparece como linha legível (página, etapa, estado, código, alternância, «Usar como origem», remover); os termos de outra página ficam com etiqueta «outro GRAFCET» e traço tracejado.
- **Equivalências documentais** deixam de ser quatro campos de largura total: passam a cartões compactos 2×2 (GRAFCET · Transição · Condição · Nota), com contagem, remoção por registo, estado vazio próprio e uma linha a explicar que é documental.
- **Pré-visualização** mostra «SE · ETAPAS CONSULTADAS» com a página (`G1 · X11 inativa`), o número de dependências externas e o de equivalências.
- Texto de ajuda atualizado com a convenção `G0/G1…` e a nota de que as páginas correm em simultâneo.
- Guarda de estilo: removida a barra lateral de 3 px de `.grafcet-state-item` (`test:style` falhava antes).

## Verificações
- `npx tsc -b` sem erros.
- `npm test` — **todos** passam, com 7 verificações novas (numeração por página, `G1 <=> X11` a disparar e a bloquear, `G1 <> X11`, forma das referências, compatibilidade sem páginas).
- `test:grafcet-dialogs` (31), `test:grafcet-examples` (52), `test:grafcet-signals` (32), `test:grafcet-links` (27) — OK.
- `test:style` — OK (deixou de falhar).
- `test:grafcet-modals-ui` — 64 verificações, incluindo as novas do construtor (`G1` na lista, etapas só da página, `G1 <=> X11`, termo «outro GRAFCET», alternância para `G1 <> X11`, origens limitadas à página, gravação). Falha apenas no passo de importação por o clique ser intercetado pelos separadores do painel GRAFCET — **já falhava antes** desta alteração.
- `git diff --check` OK. Evidência em `evidence-transicao-modal/` (1440 e 390).

## Pendências
- `npm run build` (`vite build`) **não concluiu** neste ambiente (≈1,2 GB de RAM disponível; o processo foi terminado sem mensagem de erro do TypeScript). O `tsc -b` completo passou e o servidor de desenvolvimento compilou todos os módulos nos testes de interface.
- `test:grafcet-links` mantém a falha conhecida em `grafcet-action-layout-smoke` (posição de ações), anterior a esta alteração.
- Falta ensinar o mesmo prefixo na exportação Ladder: `toLadder` continua a avaliar pela numeração global (documentado, sem alteração de comportamento).
- Escrever `G1X11` na condição já funciona, mas a lista de sugestões do `ConditionEditor` ainda propõe apenas etapas da numeração global.
- Testar em projeto real com várias páginas e transições cruzadas (o exemplo `examples/grafcet-atec-com-manuais.json` tem `G1X75`/`G2X135` mas sem páginas definidas, pelo que cai na numeração global).

[[Design-Principles]] · [[Task-2026-11-02-Transicoes-Comparativas]] · [[Decision-Log]]
