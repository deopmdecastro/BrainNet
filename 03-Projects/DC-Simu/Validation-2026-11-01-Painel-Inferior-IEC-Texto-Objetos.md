---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED_PARTIAL
created: 2026-11-01
updated: 2026-11-01
repo: https://github.com/deopmdecastro/dc-simu
commits:
  - e98e3b5
  - 86b7675
tags: [dc-simu, iec, grafcet, painel-inferior, texto, objetos, telemovel]
---

# Validação 2026-11-01 — Painel inferior do IEC, texto com clique e ícones nos Objetos

## Pedido

1. O painel de baixo do Esquema IEC tinha estilo diferente do GRAFCET: usar o mesmo.
2. Edição e seleção de texto do IEC iguais às do GRAFCET.
3. Ao clicar no texto, poder escrever logo e aparecer a barra/modal de definições do texto.
4. A lista de Objetos deve mostrar os ícones dos elementos usados.

## Implementação (`dc-simu`)

- `src/commands/CommandsSimDock.tsx`: deixa de usar a casca `gdock` (separador «Painel» + STOP + chevron). Passa a ser a mesma gaveta do GRAFCET (`grafcet-properties` + `SidePanelHeader`, `side="bottom"`, cabeçalho clicável com estado RUN/STOP). O transporte fica só na barra de cima, como no GRAFCET.
- `src/styles/mobile-refine.css`: regras da gaveta do IEC copiadas das do GRAFCET (altura, rolagem, folga para a barra do iOS, estado recolhido).
- `src/commands/CommandsAnnotations.tsx`: um clique/toque sem arrastar abre já a escrita (a barra de formatação já aparece por seleção); removido o duplo toque. Tocar na barra de formatação não tira o foco ao texto.
- `src/grafcet/GrafcetFreeText.tsx` + `GrafcetEditor.tsx`: mesmo comportamento no GRAFCET, para ficarem iguais.
- `src/commands/SymbolThumb.tsx` (novo, extraído da biblioteca): miniatura do símbolo IEC partilhada; `CommandsObjects` mostra o ícone de cada aparelho e alimentação.

## Verificações

- `npx tsc -b` sem erros; `npm run build` ok; `npm test` ✅.
- `test:commands-text-parity` (10), `test:commands-touch` (20), `test:grid-parity` (27), `test:style`, `test:canvas-annotations` ok. Dois testes por contrato foram atualizados (duplo toque → clique; casca `gdock` → gaveta GRAFCET).

## Não verificado

- Sem navegador neste ambiente: nada foi visto a render. Confirmar num telemóvel: cabeçalho «Esquema IEC / Propriedades» igual ao do GRAFCET, escrita imediata ao tocar no texto com a barra visível, e ícones na lista de Objetos.
- No GRAFCET, tocar num texto já o põe em edição (antes só selecionava): arrastar continua a mover.

## Correção após ver no telemóvel (mesmo dia)

- **Lista cortada («barra branca»):** o corpo de E/S/Objetos tinha `flex: 1; min-height: 0` e, dentro de uma gaveta com altura automática, ficava reduzido a 0 e cortado. Agora ocupa a altura natural e a gaveta rola.
- **Botão de ampliar** (`grafcet-properties-tall`) adicionado ao cabeçalho do IEC; o estado RUN/STOP só aparece em marcha/pausa, como no GRAFCET (cabeçalho com a mesma altura).
- **Texto:** a barra de formatação usa o mesmo contentor (`grafcet-textbar-slot`) e os mesmos controlos do GRAFCET (sem rotação/largura); o texto deixa de quebrar linha sozinho (sem `max-width`).
- Continua sem verificação visual em navegador.
