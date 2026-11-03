---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_TYPECHECK_OK_NOT_VISUALLY_VERIFIED
created: 2026-11-03
updated: 2026-11-03
repos: [dc-simu, BrainNet]
tags: [dc-simu, iec, grafcet, import, modal, ui]
---
# Modal «Importar» do Esquema IEC com o layout do GRAFCET

## Pedido
A modal de importar no Esquema IEC deve ter o mesmo layout que a do GRAFCET.

## Contexto reutilizado
[[Design-Principles]] («um painel não inventa o desenho só porque pertence a outra vista»), [[Validation-2026-10-30-Importacao-Grafcet-ATEC-Textos]] e o CSS `grafcet-import-*` de `grafcet-editor.css`. Nenhum CSS novo: a modal IEC já usava `PropertyDialog` e a casca `grafcet-import-dialog`; só o conteúdo diferia.

## Alterações (`src/commands/CommandsImportDialog.tsx`)
- Subtítulo igual («Escolha um ficheiro ou arraste-o para a zona abaixo.»).
- Zona de largar igual: ícone circular `IconFileUpload`, «Arraste e solte o ficheiro aqui», «ou», botão primário com `IconImport` e foco inicial, nota por baixo; `aria-label` e tratamento de arrasto (`dropEffect`, `dragleave`) como no GRAFCET.
- Secção «Formatos aceites» em cartões `.ct` (FluidSIM 4), `.cad` (CADe SIMU) e `.json` (intermédio), em vez do bloco de texto «Origem».
- Nota final no mesmo estilo. Lógica de importação, erros e `busy` inalterados; sem limite de tamanho novo (o IEC nunca o teve).

## Verificação
`tsc -b` e `test:style`: OK. Nenhum teste referia o texto antigo.

## Pendências (não verificado)
Ver a modal no browser (PC, tablet e telemóvel) ao lado da do GRAFCET.
