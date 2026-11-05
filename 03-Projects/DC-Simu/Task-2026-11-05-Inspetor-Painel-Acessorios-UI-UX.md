---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-11-05
updated: 2026-11-05
tags: [dc-simu, ui, ux, inspetor, calha, quadro, painel, icons]
---
# Melhorar UI/UX dos painéis laterais do inspetor (quadros, calhas e componentes)

## Pedido
Melhorar os painéis laterais do inspetor dos quadros, calhas e componentes: espaçamentos, trocar emojis por ícones, e etc. Trabalhar prioritariamente no cofre (BrainNet) e depois commit/push em ambos os repositórios.

## Contexto lido
- [[Design-Principles]] — área de trabalho técnica, compacta; azul para seleção; hierarquia clara; alvos de toque ≥ 40 px em coarse; reutilizar `src/ui/icons.tsx` e `SidePanelHeader`.
- [[Task-2026-11-05-Inspetor-Calha-Tablet-Estreito]] — `.dc-acc` com `minmax(0, 1fr)`, filhos `min-width: 0`, medidas em cabeçalho + range, `DraftNumber`.
- Sistema de ícones único em `src/ui/icons.tsx` (Font Awesome sólido).

## Alterações (dc-simu)

### `src/components/PanelAccessoryControls.tsx`
- Importados ícones: `IconArrowLeft/Right/Up/Down`, `IconCamera`, `IconClose`, `IconDistH`, `IconImage`, `IconLayers`.
- Substituídos todos os emojis e glifos:
  - `◀/▶` → `IconArrowLeft` / `IconArrowRight` (medidas laterais da calha e prolongar/ramificar).
  - `↔` → `IconDistH` («Ajustar ao conteúdo»).
  - `📷` → `IconCamera` (carregar imagem da tampa).
  - `✕` → `IconClose` (remover decal e furo), com `aria-label`.
  - Faces dos furos (`🚪⬆️⬇️⬅️➡️⊡`) → ícones de direção / `IconImage` / `IconLayers`.
  - `↕` → combinação `IconArrowUp` + `IconArrowDown` (orientação vertical).
- Botões de prolongar/ramificar passam a `inline-flex` com ícone + texto.
- Botões de face de furo com `inline-flex gap-1.5`.

### `src/index.css`
- Adicionadas regras completas para `.dc-acc` e filhos:
  - Grelha `minmax(0, 1fr)` + `min-width: 0` (evita overflow horizontal no tablet estreito).
  - Espaçamento consistente (`gap: 12px` no contentor, 6 px nas medidas).
  - `.dc-acc-seg`, `.dc-acc-swatch`, `.dc-acc-measure-head`, `.dc-acc-unit`, etc. com tipografia e estados claros.
  - `@media (pointer: coarse)`: alvos maiores (36 px em botões de segmento e campos numéricos).

## Reaproveitamento
- Ícones e padrões de `toolbarKit` / `SidePanelHeader` / `icons.tsx` (não inventar novos glifos).
- Classes e estrutura já existentes em `PanelAccessoryControls` e no inspetor da Sidebar.

## Validação sugerida
- Abrir inspetor de quadro metálico, calha técnica e calha DIN em desktop e tablet (≤ 768 px / janela dividida).
- Confirmar ausência de scroll horizontal, cartões sem sobreposição e ícones legíveis.
- Toque: botões de face, segmentos e ranges com área confortável.
