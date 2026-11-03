---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-02
updated: 2026-11-02
tags: [dc-simu, exportacao, pdf, ui]
---
# Modal «Exportar para PDF»

## Resultado
- Conteúdos primeiro (Documento, Diagramas, Ladder); depois uma secção única «Folha e esquadria».
- Orientação em cartões com miniatura A4 (mostra a faixa da esquadria quando ativa) e dimensões.
- Campos da esquadria agrupados (Autoria, Projeto, Folha), rótulos à esquerda, campos de largura total com exemplos; antes as regras genéricas de `label` centravam e encolhiam os campos.
- Pré-visualização da esquadria em direto; rodapé resume o que será exportado e explica porque o botão fica inativo.

## Verificações
- `typecheck`, `npm test`, `scripts/pdf-export-smoke.ts` (11 OK), `build`, `git diff --check`.
- Capturas a 1440×900 e 390×844 sem transbordo horizontal (Vite temporário sem Supabase, Edge).

## Pendências
- Validação pelo utilizador na aplicação; o PDF gerado não mudou (só a modal).

Commit DC-Simu: `5867be1`.

## Barra «Revisão da importação» do GRAFCET — 2026-11-03
O bloco de avisos em lista solta passou a barra compacta: estado, erros por corrigir em direto (Diagnóstico), número de notas, «Ver detalhes» e ação principal coerente («Corrigir erros» enquanto bloqueado, «Concluir revisão» quando limpo). Detalhes em duas colunas: erros clicáveis (selecionam o elemento) e notas da importação agrupadas por tema, com repetições juntas (×n). Testado: `typecheck`, `npm test`, `test:grafcet-dialogs`, `build`, `grafcet-construction-ui-smoke` com `Grafcet ATEC.ct` (45 OK), capturas 1440 e 390 px. Commit DC-Simu: `6c5b32f`.

## Dicas ocultáveis nos painéis GRAFCET — 2026-11-03
Os parágrafos de ajuda (rodapé de Componentes, «Nada selecionado» e separador Transições) passaram a cartões com uma frase de estado sempre visível e dicas em lista curta com teclas destacadas. «Ocultar dicas / Mostrar dicas» aplica-se a todos os painéis GRAFCET e fica guardado no navegador. Testado: `typecheck`, `npm test`, `test:grafcet-dialogs`, `build`; captura a 1440 px com ocultar → recarregar → mostrar. Commit DC-Simu: `d9d6334`.

## Revisão da importação em modal — 2026-11-03
«Ver detalhes» deixou de expandir a barra (empurrava a tela) e abre um modal com os erros por corrigir (clicar fecha e seleciona o elemento) e as notas agrupadas; «Concluir revisão» no rodapé só fica ativo sem bloqueios. Testado: `typecheck`, `npm test`, `build`, `grafcet-construction-ui-smoke` com `Grafcet ATEC.ct` (45 OK), capturas a 1440 px. Commit DC-Simu: `cc9076e`.
