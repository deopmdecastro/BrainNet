# Validação 2026-10-28 — Demo: GRAFCET e Ladder em modo visualização

**Commit dc-simu:** `6d78771` (main, push ✔, carimbo #95)
**Tipo:** Revisão 2 da demonstração da landing — «ambiente de visualização, sem muitas ferramentas, com a cara do editor real»
**Capturas do utilizador:** `/uploads/image-1.png` (Ladder demo cheio) e `/uploads/image-2.png` (GRAFCET demo cheio)

## O que as capturas mostravam (agora removido em demoMode)

### Ladder
- Painel esquerdo «Projeto» com a árvore PLC1 (Blocos de programa, Blocos de dados, Objetos tecnológicos, Fontes externas, Variáveis, Tabelas, Backups, Documentação)
- Grelha «Ferramentas» (Contato, Bobina, Temporizador, Contador…)
- Por network: interruptor «ativa», botões ↑ ↓ ⧉ 🗑
- Comentário da network editável

### GRAFCET
- Paleta «Componentes» (Etapa inicial / Etapa / Transição solta / Ações)
- Botões «+ Nova página» e apagar página
- Barra: Modelos, Gerar Ladder, Organizar, SVG, Exportar JSON, Importar
- Botões «Editar propriedades» (etapa, transição, ação solta)
- Dica do canvas orientada a edição («arraste os pontos para ligar»)

## Mantido na demo (visualizar + simular)
- Ladder: tabs Main [OB1]/Tabela de Tags, cartões de estatísticas, estado «Simulação ativa/Parado», painel SIMULAR SINAIS, «Repor memórias», zoom
- GRAFCET: ferramentas Selecionar/Arrastar, simulação, inspetor só de leitura, páginas existentes

## Implementação
- `LadderEditor.tsx`: gate `!demoMode` no painel do Projeto (ternário inteiro inclui o rail colapsado), switch «ativa» e `ladder-rung-actions`; `demoMode` dentro de `RungRow`; `readOnly={demoMode}` no comentário
- `GrafcetEditor.tsx`: gates `!demoMode` na paleta completa (backdrop, aside, rail), «Nova página», `grafcet-page-del`, 3× «Editar propriedades»; dica do canvas troca em demo
- `Toolbar.tsx`: os 3 grupos `grafcet-toolbar-secondary` (Modelos e Ladder / Disposição / Ficheiro) embrulhados em `{!demo && …}`

## Verificação
- Typecheck limpo; `npm test` OK
- `landing-editor-showcase-smoke.mjs`: 9 asserts novos (62 total), todos PASS
- `landing-demo-smoke.ts` (funcional, routing dos cabos): PASS
- Suites Playwright de UI (browser, `/dashboard`): falham no bootstrap de autenticação — a app proxy `/api/*` para `localhost:3000` (backend ausente neste sandbox) e redireciona para `/login`. **Pré-existente, alheio a este commit** (as gates só atuam já dentro do editor em demoMode). Suites puras (.ts/.mjs de ficheiros) continuam verdes.
- Fixture ambiental desta sessão: dev server precisa `VITE_SUPABASE_URL=" " VITE_SUPABASE_ANON_KEY=" "`; suites UI-dependentes precisam ainda do backend :3000 (não disponível).

## Repo multi-sessão
- Tip remoto verificado antes de editar: `4dd9821` (inalterado); `.git` voltou a evaporar → recovery padrão; `chmod +x .githooks/pre-commit` antes do commit.
