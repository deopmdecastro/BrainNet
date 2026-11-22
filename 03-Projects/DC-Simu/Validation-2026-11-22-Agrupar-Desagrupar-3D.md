---
type: validation
status: IMPLEMENTED_TESTED_LOCAL
created: 2026-11-22
updated: 2026-11-22
tags: [dc-simu, 3d, grupos, selecao, validacao]
---
# Agrupar e desagrupar elementos no 3D

## Resultado

Os comandos «Agrupar» e «Desagrupar» ficam visíveis na barra contextual da seleção,
com os atalhos Ctrl+G e Ctrl+Shift+G. Reutilizam os grupos persistentes já existentes
no projeto, partilhados com o esquema. O inspetor mantém os mesmos comandos.

Selecionar um membro pela lista de objetos ou pelo modelo 3D seleciona o conjunto.
«Só este» continua disponível para inspecionar um membro isolado. Desagrupar
remove também a associação antiga `groupId`, quando o projeto a contém.

O arrasto do conjunto aplica a mesma translação X/Y/Z aos seus componentes,
preservando distâncias e alturas relativas. Os percursos internos dos cabos acompanham
o movimento; os percursos com ligação a objetos de fora mantêm-se. O movimento
usa um único ponto de histórico e um único Desfazer/Refazer para todo o conjunto.
Não se aplicam encaixes individuais ao largar um grupo. Colisões e limites são
validados antes da atualização, sem separar as peças para corrigir uma colisão.

Um membro bloqueado impede o arrasto parcial do grupo. Agrupar e desagrupar estão
bloqueados em RUN/PAUSA. As operações de edição mantêm STOP.

## Utilização

1. Selecionar os elementos com Shift/Ctrl + clique ou com «Multi».
2. Premir «Agrupar» ou Ctrl+G.
3. Clicar e arrastar um membro para deslocar o conjunto.
4. Premir «Desagrupar» ou Ctrl+Shift+G para voltar à seleção individual.

## Ficheiros

- `dc-simu/src/components/SelectionBar.tsx`: ações visíveis e estados disponíveis.
- `dc-simu/src/components/Sidebar.tsx`: inspeção individual e bloqueio em simulação.
- `dc-simu/src/store/useSimStore.ts`: seleção dos grupos atuais e desagrupamento legado.
- `dc-simu/src/three/panelGroupMove.ts`: translação rígida e percursos dos cabos.
- `dc-simu/src/three/Panel3D.tsx`: arrasto em conjunto, validação e histórico único.
- `dc-simu/src/styles/clean-mode.css`: apresentação compacta com alvos de 40 × 40 px.
- `dc-simu/scripts/panel-groups-smoke.ts` e `dc-simu/scripts/panel-groups-ui-smoke.mjs`:
  testes do modelo e do percurso real com rato/teclado.
- `dc-simu/scripts/selection-groups-smoke.ts`: regressão do desagrupamento legado.
- `dc-simu/package.json`: comandos `test:panel-groups` e `test:panel-groups-ui`.

## Verificações e evidências

| Verificação | Resultado |
| --- | --- |
| `npm run test:panel-groups` | 12 verificações aprovadas: seleção conjunta, «Só este», movimento X/Y/Z, cabos, histórico e persistência |
| `npm run test:selection-groups` | 21 verificações aprovadas, incluindo a remoção do grupo legado |
| `npm run test:panel-groups-ui` | 21 verificações aprovadas com rato e teclado no Painel 3D real |
| Regressões de régua de bornes e movimento de quadros | `test:terminal-strip` e `test:enclosure-move` aprovados |
| TypeScript e ESLint | `npm run typecheck` e `npm run test:hooks` aprovados |
| Cofre: `npm test` | 45 testes aprovados |
| Aplicação: `npm test` | Interrompido no verificador de ícones por `⚙` em `src/three/mechatronicsGeometry.ts:580`; presente em HEAD e sem alterações nesta tarefa |
| Cofre: `npm run check` | Mantém erros de documentação preexistentes fora desta alteração |

Capturas sintéticas antes/depois a 1440 e 390 px em
`dc-simu/runtime/panel-groups/`: `desktop-before.png`, `desktop-after.png`,
`phone-before.png` e `phone-after.png`.
As capturas de desktop e telefone foram inspecionadas; a barra não fica cortada.
O teste mede o alvo Agrupar a 40 × 40 px no telefone e confirma que o comando
Desagrupar continua acessível. Os modelos desenhados mantêm as posições relativas
após o arrasto, e Ctrl+Z/Ctrl+Y repõem o conjunto.

## Limites e estado da entrega

- Implementado e testado localmente. Versionado em `dc-simu@1e85f9e` e enviado
  para `origin/main` a pedido do utilizador em 2026-11-22. Sem publicação ou deploy.
- Sem revisão independente de QA. As falhas gerais acima impedem declarar todos
  os verificadores do repositório aprovados.
- A função acrescentada é agrupamento persistente com translação conjunta; os
  comandos de rotação existentes mantêm a sua semântica anterior por componente.
