---
project_id: BN-DCSIMU-001
type: validation
status: PARTIAL
created: 2026-10-27
updated: 2026-10-27
tags: [dc-simu, ui, mobile, ladder, grafcet, inspector]
---
# Validação 2026-10-27 · Refinamento mobile (Ladder, rodapé, inspetor)

## Origem
Nove capturas do telemóvel (≈390 px): GRAFCET etapas 11–79, Ladder vazio, painéis Projeto/Elementos, inspetor de bornes (PS1 · DRAN120-24A) e de cabos (W1).

## Problemas medidos nas capturas
| # | Sintoma | Causa | Correção (`mobile-refine.css`) |
| --- | --- | --- | --- |
| 1 | Rodapé com «Instalar» cortado e 6 itens numa linha | `h-[26px]` + conteúdo sem prioridade | versão/ciclos saem ≤720 px, Instalar em ícone, projeto oculto ≤420 px, safe-area inferior |
| 2 | Ladder com duas réguas de 48 px (~25 % da largura) | `.pn-collapsed-rail` fixo a 48 px | 30 px, sem seta (a régua inteira reabre) |
| 3 | Painel de estado/compilação > 50 % da altura | `flex-basis` sem teto | `max-height: 38dvh`, separadores deslizantes com fade, ações em ícone |
| 4 | Inspetor de bornes com texto 9–10 px e controlos 22–24 px | classes utilitárias fixas | controlos de 40 px, 14 px de texto, Tipo em linha própria, grelha X/Y/Ø |
| 5 | Cartão PS1 deixava ver conteúdo por trás | `sticky top:-12px` com fundo parcial | `top:0` + sombra de cobertura opaca |

## Ficheiros (dc-simu `67392cf`, carimbo #72)
`src/styles/mobile-refine.css` (novo, importado por último em `main.tsx`) · `App.tsx` (classes `dc-sb-*`) · `components/InstallApp.tsx` · `ladder/LadderEditor.tsx` (`ladder-btn-label`).

## Verificações
- `tsc -b`: sem erros. `npm test`: todos os testes passam. `test:style` (sem barras de destaque): ok. `vite build`: concluído.
- **Não verificado**: render visual a 390/768/1024/1440 px. Este ambiente não tem navegador (sem Chromium/Playwright); as regras foram derivadas das capturas e do CSS existente. Confirmar no telemóvel após o deploy da Vercel e correr `npm run test:admin-ui` localmente.

## Adenda · GRAFCET
Componentes passam a painel lateral + régua (≤1199 px), botão removido da barra. `tsc`, teste de estilo e `vite build` OK; render visual por confirmar.

## Pendências
- GRAFCET: o diagrama fica pequeno e centrado em coluna estreita; avaliar «enquadrar à largura» ao abrir em ecrãs ≤720 px.
- Ladder: separador «Elementos» (lista com ícones) pode agrupar por categoria colapsada por omissão.
- Admin editor de componentes e Esquema 3D: ainda por rever com capturas.
