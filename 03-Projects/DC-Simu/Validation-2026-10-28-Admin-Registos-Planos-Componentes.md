---
project_id: BN-DCSIMU-001
type: validation
status: PARTIAL
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, admin, mobile, desktop, logs, plans, components]
---
# Validação 2026-10-28 · Administração: Registos, Planos e Componentes

Origem: 5 capturas do telemóvel (Registos, Planos e preços ×2, Componentes).

| Sintoma | Correção (`mobile-refine.css` §10) |
| --- | --- |
| Campos de data a sair do cartão (iOS) | `min-width:0; width:100%` no `input[type=date]`, altura 42 px |
| Registos com colunas de 1 letra («P.», «S.») | áreas de grelha: ação + data / utilizador / alvo e detalhe |
| Filtros de Componentes truncados («Todos o…», «Ord…») | 2 colunas; pesquisa e «Exportar CSV» em linha inteira |
| Linha de componente com plano + 2 botões apertados | plano em linha própria; Bloquear e Mais ações lado a lado (40 px) |
| Barra «Guardar planos» colada à barra do Safari | `bottom` com safe-area, vidro suave, espaço reservado no fim |
| Desktop | foco visível, hover de linha, barra de gravar com largura máxima |

Verificações: `tsc`, teste de estilo e `vite build` OK. **Render visual não verificado** (sem navegador no ambiente); correr `npm run test:admin-ui` localmente e confirmar a 390/768/1440 px após o deploy.
