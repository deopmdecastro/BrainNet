---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, diagnostico, ladder, 3d, esquema-iec, grafcet, ux, nomes]
---
# Diagnóstico em todas as vistas e novos nomes (3D Realista, Esquema IEC)

## Pedido

1. Uma etiqueta com avisos, erros ou «tudo OK», como a do GRAFCET, nos outros simuladores (Ladder, 3D e Comandos).
2. Renomear: «Esquema» → **3D Realista**, «Comandos» → **Esquema IEC**.
3. «Diagnóstico» com os erros e avisos no painel lateral direito do 3D e do Esquema IEC.

## O que mudou

### Etiqueta por vista
- Cada vista da barra «Vistas» (3D Realista, Ladder, GRAFCET, Esquema IEC) tem um selo no canto do ícone:
  - **✓ verde** quando está tudo OK;
  - **número âmbar** com os avisos;
  - **número vermelho** com os erros.
- O selo não ocupa largura. Quando a barra fica estreita, as vistas inativas mostram só o ícone (o nome fica no título) e a ativa mantém o nome. Isto usa uma *container query* na barra.
- A barra de estado («0 erros · 2 avisos») passa a mostrar o diagnóstico da **vista aberta**, e clicar abre o detalhe:
  - 3D Realista e Esquema IEC: separador «Diagnóstico» do painel direito;
  - Ladder: separador «Verificação» do painel inferior;
  - GRAFCET: separador «Diagnóstico».

### Separador «Diagnóstico» no painel direito
- No 3D Realista e no Esquema IEC o painel direito ganhou um 4.º separador, «Diagnóstico», com etiqueta.
- O separador «Entradas/Saídas» passou a mostrar «E/S» no ecrã, mas o nome acessível continua a ser «Entradas/Saídas».
- O painel tem o mesmo aspeto do GRAFCET: resumo, lista clicável e, quando está tudo bem, as verificações feitas.
- **3D Realista**, quando clica num problema, seleciona o componente.
  - Com a simulação parada, verifica a montagem: cabos sem destino, bobinas sem alimentação, motor sem proteção, PE, sobreposições…
  - A correr, mostra o diagnóstico da simulação, sem repetidos.
- **Esquema IEC** tem uma verificação nova (`commandsDiagnostics`), e clicar num problema seleciona e enquadra o símbolo.
  - **Erros:**
    - falha da simulação (curto-circuito ou oscilação);
    - falta de alimentação;
    - bobina repetida;
    - cabo para um símbolo apagado;
    - bobina, sinalizador ou motor com bornes soltos.
  - **Avisos:**
    - contacto sem a respetiva bobina ou relé térmico;
    - símbolo sem referência IEC;
    - bornes soltos;
    - temporizador sem atraso;
    - motor sem proteção contra sobrecarga.

### Nomes
- Barra «Vistas»: **3D Realista** (F1) e **Esquema IEC** (F6).
- Também foram renomeados:
  - o tipo de projeto («Esquema IEC»);
  - a capa e o painel de projetos;
  - o editor vazio («Esquema IEC vazio»);
  - os atalhos.
- Os nomes técnicos internos não mudaram (`schematic`, `commands`), por isso os projetos guardados continuam compatíveis.

### Falsos alarmes corrigidos
Com isto, o projeto de referência mostra ✓ em 3D Realista, Ladder e GRAFCET.
- A calha DIN aparecia «sobreposta» a todos os aparelhos: as calhas e barras são suportes e ficam fora dessa verificação.
- «Motor sem relé térmico» quando o motor está protegido por disjuntor-motor (PKZM, GV2ME): agora este também conta como proteção.
- **Ladder:** «A saída Q0.0 está declarada mas nenhuma network a escreve» quando é escrita num FC chamado por CALL.
  - A verificação passa a seguir o programa realmente executado: a Main e os blocos chamados, recursivamente (`executedRungs` + `callableFunctions`).
  - Vale também para o separador «Verificação» do editor Ladder.

## Ficheiros
- `src/diagnostics/viewDiagnostics.ts`: modelo comum, verificação do Esquema IEC e *hooks* por vista.
- `src/diagnostics/DiagnosticsUi.tsx`: etiqueta, selo e painéis.
- `src/components/Toolbar.tsx`: nomes e selos; `src/App.tsx`: separador e barra de estado.
- `src/ladder/ladderLint.ts`: programa executado.
- `src/utils/errorDetection.ts`: falsos alarmes.
- `src/index.css`: estilos.
- `scripts/view-diagnostics-smoke.ts`: novo, incluído em `test:ci`.

## Validação
- `npm run test:view-diagnostics`: 18 verificações, incluídas em `test:ci`.
  - Os exemplos do Esquema IEC não dão erros nem avisos.
  - Um esquema estragado de propósito dá os erros e avisos esperados.
  - Projeto nativo «Tudo OK» no 3D Realista e no Ladder.
- Browser, com o projeto «Partida direta com emergência»:
  - selos ✓ no 3D Realista, Ladder, GRAFCET e Esquema IEC;
  - painel «Diagnóstico» no 3D Realista: «Tudo OK»;
  - no Esquema IEC, um esquema com cabos apagados mostra os avisos, e clicar seleciona o símbolo;
  - na barra de estado, «avisos» abre a «Verificação» no Ladder e o «Diagnóstico» no GRAFCET.
- `test:commands-ui`: 29 verificações. Os testes de interface foram atualizados para os novos nomes das vistas.
- Já falhavam antes desta alteração (verificado com `git stash`): `test:toolbar-ui`, `test:workspace-panels-ui` e `test:grid-ui`. Ficam no backlog como UI-SUITES-02.
