---
type: validation
status: IMPLEMENTED_LOCAL
created: 2026-11-07
updated: 2026-11-07
tags: [dc-simu, cabos, organizacao, bloqueio, validacao]
---
# Organização e bloqueio dos cabos

Implementado e verificado localmente a pedido do utilizador. Commit `5c2dec1` enviado para `dc-simu/main` em 7 de novembro de 2026, após o pedido explícito «commit e push». Inclui a correção anterior das sondas do multímetro e os respetivos testes.

## Comportamento

- «Organizar cabos», no menu «Organizar», recalcula percursos no Esquema e no 3D. O planeador 2D contorna os equipamentos e distribui os percursos por corredores. Os pontos manuais do 3D são retirados para voltar ao cálculo automático. Ligações, pontas livres, secções, cores e terminações mantêm-se. Ctrl+Z repõe o traçado anterior.
- O Inspetor permite organizar, bloquear e desbloquear um cabo. A barra contextual permite organizar ou bloquear os cabos selecionados. O menu permite bloquear ou desbloquear todos os cabos atuais.
- Um cabo bloqueado continua selecionável para consulta e desbloqueio. Não tem manipuladores de edição nem aceita pontos novos por duplo clique. Os campos do Inspetor ficam desativados; a proteção no store impede alterações diretas e eliminação, incluindo pelo teclado.
- Organização, filaçamento e numeração respeitam o bloqueio. A renumeração dos restantes cabos reserva os números dos cabos bloqueados.
- O bloqueio fica guardado em `Wire.locked`, com Desfazer/Refazer e exportação/importação JSON. Projetos anteriores continuam com cabos desbloqueados. Cabos novos não herdam automaticamente o bloqueio dos existentes.
- O bloqueio protege a edição direta do cabo. As pontas acompanham os equipamentos e a simulação continua a calcular tensão e continuidade. Não constitui bloqueio dos equipamentos ou dos seus bornes.
- Organização e alteração do bloqueio não são permitidas em demonstração, RUN ou PAUSA. Operações sem alvos editáveis não acrescentam histórico vazio.

## Ficheiros

Na aplicação `dc-simu/`: `src/types/index.ts`, `src/store/useSimStore.ts`, `src/components/Sidebar.tsx`, `src/components/SelectionBar.tsx`, `src/components/Toolbar.tsx`, `src/schematic/SchematicView.tsx`, `src/three/Panel3D.tsx`, `scripts/wire-lock-organization-smoke.ts` e `package.json`.

`test:wire-locks` integra-se na execução de `test:native-wires-3d`, já usada pela suíte de CI. Os ficheiros da correção anterior das sondas permanecem no mesmo estado de trabalho.

## Verificações e evidência

- `test:wire-locks`: 28 verificações de bloqueio individual e coletivo, edição/eliminação, organização 2D/3D, continuidade das ligações, numeração sem duplicados, pontas livres, histórico, persistência e restrições de execução.
- `test:sim-edit-lock`: passou, incluindo os comandos durante RUN e a reposição da seleção em STOP.
- `test:native-wires-3d`: passou, incluindo colisões, passagem no bucim, motor deslocado/rodado/espelhado/redimensionado e percursos manuais. Registo: [testes dos cabos](../../runtime/wire-locks-native-tests.log).
- `npm test` da aplicação e `npm run build` passaram. A compilação final inclui TypeScript, Vite e PWA; registo em `runtime/wire-locks-build.log`.
- `npm test` da raiz: 45 testes passaram. `npm run check` mantém os nove problemas documentais anteriores, relativos a propriedades em falta e imagens de notas antigas; esta nota não acrescenta erros.
- Navegador isolado com os componentes reais: bloquear um cabo desativou 95 campos do Inspetor; o desbloqueio manteve-se acessível. O menu bloqueou os 43 cabos do exemplo; Ctrl+Z repôs o bloqueio individual anterior.
- Organização pelo botão do Inspetor retirou uma rota 3D manual; Ctrl+Z repôs exatamente os cabos anteriores. Desbloquear voltou a permitir a edição. Sessão final sem erros JavaScript.
- Layout revisto a 1440 × 1000 e 1024 × 900: [PC](../../runtime/wire-lock-desktop.png) e [tablet](../../runtime/wire-lock-tablet.png). A montagem temporária foi retirada.

## Pendências

Código e testes enviados para o repositório; registo acompanhado pela atualização do submódulo no BrainNet. Os projetos já abertos precisam de carregar a versão atualizada para obter os novos controlos. Não foram alterados dados guardados na conta do utilizador nem executado um deploy nesta entrega.

[[Design-Principles]] · [[Validation-2026-11-07-Cabos-Sondas-Motor]]
