---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-04
updated: 2026-11-04
tags: [dc-simu, exportacao, pdf, iec, ui]
---
# Export PDF: Esquema IEC e aspeto compacto

Continua [[Task-2026-11-02-Modal-Exportar-PDF]].

## Pedido
- O PDF não mostrava o Esquema IEC e a modal não deixava escolhê-lo (a opção «Esquema elétrico» lia só os componentes 3D; um projeto com 3D vazio e módulo IEC aparecia «vazio — omitido»).
- Aspeto do PDF fraco; logótipo e barra azul demasiado grandes.

## Resultado
- **IEC por folha**: nova opção «Esquema IEC» na secção Diagramas, com chips por folha quando há mais de uma (vazias ficam de fora). Uma página por folha, desenho com os mesmos `CmdSymbol`, `wirePoints` e cores de cabo do editor IEC, em repouso (sem simulação), mais títulos e textos livres da folha. Código: `src/export/IecPageStatic.tsx`, `captureIecPages` em `realCapture.ts`, secção em `pdfExport.ts`.
- **3D e IEC independentes**: «Esquema 3D — vista atual» mantém a regra dos componentes; IEC conta pelos símbolos. Capa, rodapé do modal, estimativa de páginas e «Nada/Tudo» passam a contar o IEC.
- **Capa**: faixa azul 150 → 78 pt e símbolo 64 → 34 pt; estatísticas em cartões 4×2 (inclui Símbolos IEC); nota «gerado automaticamente» passou a ficar acima da esquadria (antes sobrepunha-se-lhe).
- **Cabeçalho das páginas**: faixa 30 → 22 pt, símbolo 20 → 14 pt, nome do projeto truncado à largura.
- **Esquadria**: «Autor · Função» quebra na coluna da empresa em vez de invadir «Projeto».

## Verificações
- `tsc --noEmit`, `npm test`, `npx tsx scripts/pdf-export-smoke.ts` (15 OK, 4 novos de IEC), `npm run build`.
- PDF headless rasterizado (capa e página IEC com imagem de teste) para confirmar proporções e ausência de sobreposição.

## Pendências
- **Não validado em browser**: a captura real do IEC (`captureIecPages`) não correu num browser neste ambiente (sem Chromium disponível). Confirmar no iPhone: exportar com o módulo IEC e ver se as folhas saem com símbolos, etiquetas e cabos.
- O estado exportado é sempre «em repouso»; não reflete a simulação em curso.
- Se um símbolo não aparecer, o suspeito é `cloneWithStyles` (estilos vindos de `commands.css`).

Commit DC-Simu: `8cdfd98`.

## Atualização — logótipo na esquadria e modal v3
- **Esquadria**: símbolo DC-Simu ao lado do nome da empresa (opção «Logótipo na esquadria», ligada por omissão, `titleBlock.logo`); corrigida a sobreposição do rótulo «Folha» com o valor.
- **Modal**: cartão de resumo fixo no topo (páginas estimadas + conteúdo incluído) com seleção rápida segmentada (Tudo/Só ladder/Nada); itens sem conteúdo (tags, 3D, GRAFCET vazios) passam a uma nota «Sem conteúdo, omitido» em vez de caixas desativadas; campos da esquadria recolhidos por omissão («Editar campos da esquadria»); pré-visualização da esquadria com logótipo.
- Verificações: `tsc`, `npm test`, `test:pdf-export` (15 OK), `build`; esquadria rasterizada. Modal **sem captura em browser** — validar no iPhone.
- Commit DC-Simu: `c5d8607`.
