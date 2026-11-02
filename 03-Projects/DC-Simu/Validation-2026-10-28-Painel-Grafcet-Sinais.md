---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_LOCAL
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, ui, grafcet, simulation, validation]
---
# Painel único de GRAFCET e entradas/saídas

## Resultado

O Esquema 2D/3D passa a usar o painel direito existente para GRAFCET,
Entradas/Saídas e Objetos. O botão Simulação abre o separador de sinais;
a coluna de simulação que ocupava parte do canvas foi removida.

Os controlos de execução, sinais de PLC, contactos INT/NO/NC, saídas,
E/S virtuais e resumo de etapas reutilizam os componentes existentes.
Trocar de separador ou recolher a gaveta não interrompe RUN. O botão
Simulação acompanha a visibilidade do separador de sinais.

## Ficheiros

No submódulo `dc-simu/`: `src/App.tsx`, `src/components/Toolbar.tsx`,
`src/components/SimulationDock.tsx`, `src/schematic/SchematicView.tsx`,
`src/styles/schematic-editor.css` e regressão de interface em
`scripts/toolbar-shortcuts-sim-ui-smoke.mjs`.

## Verificações

- Aplicação: `npm test`, `npm run typecheck` e `npm run test:style` passaram.
- `npm run test:toolbar-ui` passou integralmente, sem erros JavaScript:
  painel integrado, E/S virtuais, RUN, 2D/3D, gaveta móvel e regressões
  Ladder/GRAFCET/Monitor. A fixture monta o App real sem autenticação/backend.
- Avaliação visual independente: aprovada em 1440, 768 e 375 px.
- BrainNet: `npm test` passou, com 45 testes.
- Verificação manual do editor real, montado com projeto nativo sintético e
  API bloqueada: um painel direito, ausência do dock separado, injeção de
  I0.1, saídas visíveis e RUN preservado ao mudar para GRAFCET.
- A 390 × 844 px: gaveta com 340 px, três separadores sem transbordo;
  Escape fecha os sinais, desativa o botão Simulação e mantém RUN.
- Capturas locais sintéticas em `runtime/dcsimu-painel-unificado/desktop.png`
  (1440 × 1000) e `runtime/dcsimu-painel-unificado/mobile.png` (390 × 844).

## Limites e publicação

`npm run check` do BrainNet já falhava antes desta alteração: oito notas
anteriores sem propriedades obrigatórias de frontmatter, seis em
`02-Execution/Validation-2026-10-28-*` e as notas
`Validation-2026-10-28-Demo-Cabos-ISO-Canvas-Leve.md` e
`Validation-2026-10-28-Demo-Ladder-Grafcet-View-Only.md`.

O utilizador pediu explicitamente commit e push nesta sessão. A evidência
de interface usa apenas dados sintéticos; não valida contas ou persistência
reais. A aprovação visual do utilizador continua por recolher.

Commit da aplicação enviado para `origin/main`: `4788efd`. O BrainNet
acompanha esse commit através do ponteiro do submódulo.
