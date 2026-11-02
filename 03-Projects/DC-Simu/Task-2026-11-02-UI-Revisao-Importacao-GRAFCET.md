---
project_id: BN-DCSIMU-001
type: task
status: IN_PROGRESS
created: 2026-11-02
updated: 2026-11-02
tags: [brainnet, dc-simu, ui, ux, grafcet, import-review]
---
# Task: Melhorar UI/UX do painel de revisão de importação GRAFCET

## Contexto
Após importação (FluidSIM ou JSON) o desenho entra em modo `importReview`. A simulação e a geração de Ladder ficam bloqueadas até o utilizador concluir a revisão.

O aviso no editor (banner no topo do GRAFCET) estava implementado como um simples `<details>` com lista plana de avisos:

```tsx
<details className="shrink-0 border-b border-line-soft bg-surface px-3 py-2 text-xs">
  <summary>Desenho importado para revisão · simulação e Ladder bloqueados</summary>
  <p>...</p>
  <ul className="list-disc pl-5 max-h-32 overflow-auto">{warnings.map(...)}</ul>
  <button>Concluir revisão</button>
</details>
```

Resultado visual: lista densa, sem agrupamento, sem hierarquia, difícil de escanear, pouco alinhada com os princípios de design (compacto técnico, hierarquia clara, reutilização de padrões existentes).

Já existe o componente `GrafcetImportReview` (usado no diálogo de confirmação de importação) que:
- Mostra métricas (etapas, transições, ações, textos)
- Agrupa avisos por categorias (Ações e qualificadores, Ligações e destinos, Condições, Estrutura, Referências, Outros)
- Tem estado visual de revisão vs pronto
- Inclui dicas contextuais

## Objetivo
Melhorar a apresentação da informação de revisão **no editor** (não só no diálogo de importação):

1. Reutilizar a lógica de agrupamento de `GrafcetImportReview`.
2. Criar um banner/painel de revisão mais legível, com:
   - Cabeçalho claro com contagem de avisos e estado bloqueado
   - Grupos colapsáveis ou seções claras
   - Tipografia e espaçamento consistentes com o resto da UI (`--pn-*` / tokens existentes, `dc-btn`, etc.)
   - Botão primário «Concluir revisão» bem visível
   - Dica útil para transições-fonte quando aplicável
3. Manter o banner colapsável (details ou equivalente) para não ocupar espaço permanente.
4. Garantir que funciona em telemóvel/tablet (altura limitada, overflow).

## Critérios de aceite
- [ ] Banner no topo do editor GRAFCET (modo full) mostra estado de revisão de forma organizada.
- [ ] Avisos agrupados por categoria (reutilizar `groupWarnings`).
- [ ] Contagem visível de avisos.
- [ ] Botão «Concluir revisão» com estilo `dc-btn` / primário.
- [ ] Não regredir o diálogo de importação.
- [ ] Visual alinhado com Design-Principles (hierarquia, compacto, azul/seleção, neutros).
- [ ] Typecheck e smoke relevantes passam.

## Notas de implementação
- Extrair `groupWarnings` para um util partilhado se fizer sentido (ou duplicar minimamente).
- Preferir classes existentes ou adicionar bloco mínimo em `index.css` sob `.grafcet-review-banner` se necessário.
- Não introduzir novas dependências.
- Trabalhar primeiro no cofre (esta nota), depois código em `dc-simu`, commit + push em ambos.

## Estado
Preparação · implementação em curso.

## Implementação proposta (código)

### 1. Novo componente `src/grafcet/GrafcetReviewBanner.tsx`

Reutiliza a lógica de agrupamento do diálogo de importação. Banner colapsável com:

- Cabeçalho: ícone de aviso + título + badge com contagem + indicação de bloqueio
- Corpo: texto introdutório + grupos de avisos (título + contagem + lista) + tip para ligações + botão primário «Concluir revisão»
- Aberto por omissão quando ≤ 6 avisos (evita lista enorme fechada)
- CSS dedicado com tokens existentes e estados de aviso (âmbar)

O ficheiro foi preparado localmente. Substituir o bloco `<details>` em `GrafcetEditor.tsx` (por volta da linha 3771) por:

```tsx
{program.importReview && full && (
  <GrafcetReviewBanner
    warnings={program.importReview.warnings}
    onFinish={finishImportReview}
  />
)}
```

e adicionar o import:

```tsx
import GrafcetReviewBanner from './GrafcetReviewBanner'
```

### 2. Estilos em `src/index.css`

Bloco `.grafcet-review-banner*` acrescentado no final (hierarquia visual, badge, grupos em cartões, tip azul, responsivo).

### 3. Reaproveitamento

- Mesma categorização de avisos do `GrafcetImportReview` (ações, ligações, condições, estrutura, referências).
- Botões e tipografia já usados no resto da plataforma (`dc-btn`, `dc-btn-primary`).
- Não altera o diálogo de confirmação de importação.

## Próximos passos
1. Aplicar as alterações no repositório `dc-simu` (clone completo + edit + typecheck).
2. Validar visualmente no editor (importar um FluidSIM com avisos).
3. Commit + push em ambos os repositórios após aprovação visual.

## Estado
Preparação · código do banner e CSS preparados · integração no Editor pendente de clone estável do repositório.
