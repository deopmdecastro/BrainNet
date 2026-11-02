---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, qa, 3d, plc, ux]
---
# Editor de componentes — painéis, ferramentas e PLC LOGO!

## Pedido e âmbito

Melhorar as barras laterais, ferramentas e funcionalidades do editor. Nas imagens do utilizador, o PLC LOGO! tinha LCD e teclas no CAD, mas a hierarquia só mostrava corpo e bornes. A última imagem também mostrava o botão de entrada GRAFCET sobreposto ao campo de nome.

Implementação local sobre DC-Simu `9a005ad` e BrainNet `e22eb97`. Sem commit, push, publicação de catálogo ou deploy deste incremento. Foram usados rascunhos e projetos sintéticos em contextos de browser descartáveis, com API e atualização de versão bloqueadas. Node.js v24.13.1, Chrome/Playwright e Vite local.

## Resultado implementado

- Hierarquia com pesquisa fixa, filtros e contagens, secções recolhíveis e LCD/controlos antes dos 19 bornes. Rótulos iguais deixam de se repetir como «L+ · L+».
- Inspetor contextual por Construção, Funcionamento e Componente; seleção abre a secção certa. Linhas do LCD recolhíveis e propriedades das teclas acessíveis.
- Ferramentas em duas linhas; ações avançadas no menu Organizar. Painéis ajustáveis por rato e teclado, com preferência local; áreas alternadas em ecrãs pequenos.
- Importação do LOGO com um LCD de texto na janela real do CAD e seis teclas com áreas de clique independentes. Seleção direta no modelo e navegação do LCD na pré-visualização, sem mover o corpo do PLC.
- Atualização aditiva de rascunhos anteriores, conservando IDs e elementos personalizados. A marca de introdução impede recriar elementos posteriormente eliminados pelo autor.
- Instâncias do catálogo derivadas do LOGO recebem dados do PLC no visor: alimentação, RUN/STOP/PAUSE, I/O, data/hora e diagnóstico.
- Cartão GRAFCET com coluna do botão dimensionada e composição vertical em largura reduzida, eliminando a sobreposição com o nome.

Guia: [Editor e esquema 3D](./dc-simu/docs/EDITOR-3D-UX.md). Ficheiros centrais: [importador do LOGO](./dc-simu/src/admin/editor3d/seedLogoPanel.ts), [hierarquia](./dc-simu/src/admin/editor3d/Hierarchy.tsx), [navegação do inspetor](./dc-simu/src/admin/editor3d/InspectorNavigation.tsx), [separadores de largura](./dc-simu/src/admin/editor3d/PanelResizer.tsx), [áreas dos controlos](./dc-simu/src/catalog/controlArea.ts) e [runtime do LCD](./dc-simu/src/three/logoRuntime.ts).

## Verificações e evidências

| Verificação | Resultado |
| --- | --- |
| `test:logo-editor` | PASS — 10 verificações: seis áreas independentes, geometria LCD, ações, migração, preservação de ajustes, idempotência, transformações e I/O reais |
| `test:logo-editor-ui` | PASS — 32 verificações com cliques reais: migração, IDs, filtros, propriedades, LCD/teclas no canvas, navegação, resizer, menus, 1920/1024/768/390 px e cartão GRAFCET; zero exceções JavaScript |
| `test:editor3d-functional` | PASS — 29 verificações, incluindo os 20 modelos e 142 bornes |
| `npm test` da aplicação | PASS — 668 verificações |
| `test:builtin-sync` | PASS — 323 verificações sobre 68 integrados, 21 com GLB |
| `test:component-validate`, `test:interactables`, `test:motion`, `test:plc-signals`, `test:style` | PASS |
| `typecheck` e `build` | PASS — build Vite em 32,91 s; mantém o aviso de tamanho dos chunks |
| `test:editor3d-ui` (regressão do editor e esquema 3D) | PASS — pesquisa e seleção, teclado, bloqueios, manobra, apagar/desfazer, sonda, enquadramento e responsividade a 1024/768/390 px; sem exceções JavaScript |
| `npm test` e `npm run check` do BrainNet | PASS — 45 testes; verificação documental com 117 Markdown, 301 ligações e 3 workflows, sem erros |
| Revisão visual independente | PASS — capturas de desktop, portátil, tablet e telemóvel revistas; ajustes de largura dos painéis e menus confirmados. Capturas em `runtime/logo-editor-ui-20261026/` (local, ignorado por Git) |

Os novos testes funcionais e de UI foram acrescentados aos comandos de CI existentes. Os resultados locais não comprovam uma execução remota de CI.

Capturas/logs em `runtime/logo-editor-ui-20261026/` (ignorados pelo Git): capturas `logo-*`, `eval-*`, `eval2-*`, `refined-*`, `implementation-*` e `grafcet-inputs.png`; `logo-ui.log`, `editor-regression.log`, `brainnet-tests.log`, `brainnet-check.log`, `build.log` e logs dos testes. A avaliação visual independente usa apenas o fornecedor de modelos disponível; outro fornecedor não estava acessível.

## Limites

O LCD suporta texto, variáveis e navegação de páginas; não implementa programação do firmware físico do LOGO. Ao encontrar controlos ou ecrãs personalizados, a atualização automática preserva essa configuração. Um rascunho sem o CAD original reconhecível pode precisar de configuração manual dos elementos. As áreas de clique editam a interação sobre a malha, sem separar fisicamente cada tecla do CAD.

[[README|Índice]] · [[Backlog]] · [[Validation-2026-10-26|Revisão 3D anterior]].
