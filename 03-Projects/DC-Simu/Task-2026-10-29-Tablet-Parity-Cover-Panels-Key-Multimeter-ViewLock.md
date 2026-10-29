---
project_id: BN-DCSIMU-001
type: task
status: IN_PROGRESS
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, tablet, cover, admin, panels, key-switch, multimeter, view-lock, ui]
---
# Tarefa 2026-10-29 — Paridade tablet/desktop + cover nativo + admin promote + painéis + chave + pinças + bloqueio de vista

## Pedido do utilizador
1. **Tablet = Desktop**: Na tela do tablet o simulador/plataforma deve ser completamente igual ao desktop (layout, painéis, densidade, comportamentos).
2. **Cover do projeto nativo**: O projeto nativo não está a mostrar ainda o cover dele nos meus projetos.
3. **Admin promove para landing**: Admin pode promover qualquer projeto para aparecer na landing page.
4. **Painéis laterais — cabeçalho solto no scroll**: Ao dar scroll o cabeçalho do painel fica a mexer (parece solto). Verificar em todos os painéis laterais.
5. **Rotação da chave 🔑**: A chave parte-se ao rodar; o mecanismo (corpo/rotor) deve rodar junto com a chave.
6. **Pinças do multímetro**: Permitir arrastar as pinças do multímetro.
7. **Bloquear / desbloquear vista**: Adicionar função de bloquear vista e desbloquear (câmera/orbit).

Preferência: trabalhar primeiro no cofre (BrainNet), depois commit + push em ambos os repositórios.

## Análise e caminho recomendado

### 1. Paridade tablet ↔ desktop
- Rever breakpoints em `src/ui/device.ts`, CSS de admin/UI (`admin-polish.css`, `admin-refine.css`, estilos de painéis) e componentes de layout (`App.tsx`, `Sidebar.tsx`, `CollapsedPanelRail.tsx`, `SimulationDock.tsx`, topbar).
- Objetivo: tablet (≈768–1024 px) usar o mesmo layout de desktop (painéis laterais fixos, sem recolher agressivo, mesmas densidades de toque/spacing).
- Evitar media queries que mudem estrutura (ex.: esconder painéis, mudar para bottom-sheet) no range de tablet.
- Validar com `test:admin-ui` / smoke de UI nos viewports 768 e 1024.

### 2. Cover do projeto nativo
- Ficheiros relevantes: `src/dashboard/ProjectCover.tsx`, `projectPreview.ts`, `flowCover.ts`, `src/project/nativeProjects.ts`, `src/admin/AdminCovers.tsx`, `src/admin/editor3d/coverGen.ts`.
- O projeto nativo (motor + multímetro / painel nativo) deve ter cover gerado ou estático e aparecer na lista «Meus projetos».
- Verificar se `nativeProjects` expõe `coverUrl` / snapshot e se o dashboard usa o mesmo path de preview que projetos guardados.

### 3. Admin promove qualquer projeto para landing
- Já existe fluxo de landing publish (`src/project/landingPublish.ts`, snapshot em Supabase `landing_simulator_snapshot`).
- Estender UI admin (provavelmente em `AdminCovers.tsx` ou secção de Projetos) para permitir «Promover para landing» em qualquer projeto (não só nativos/aprovados).
- Guardar referência no snapshot ou flag `featured_on_landing` / lista de IDs promovidos.

### 4. Cabeçalho dos painéis laterais solto no scroll
- Componente comum: `src/components/SidePanelHeader.tsx`.
- Causa típica: header dentro do content scrollável em vez de sticky/fixed no container do painel, ou `position`/`top` mal calculado, ou overflow no parent.
- Verificar todos os painéis que usam `SidePanelHeader` ou padrão similar: Monitor, Datasheet, PLC signals, Projects, Virtual I/O, Ladder panels, Catalog, etc.
- Fix: header sticky no topo do painel (`position: sticky; top: 0; z-index`) com fundo opaco, e o body do painel com `overflow-y: auto` separado.

### 5. Rotação da chave (key switch)
- Componente 3D / animação do key switch (provavelmente em `src/three/` ou builtin components / controlOps).
- Problema: só a chave (key) roda, o mecanismo (barrel/rotor) fica fixo → visual de «partir».
- Correção: agrupar chave + rotor no mesmo grupo de rotação; ou animar o eixo comum.

### 6. Arrastar pinças do multímetro
- Documentação existente: `docs/MULTIMETRO-CABOS-PONTEIRAS.md`, tasks de ponteiras.
- Permitir drag das pinças (probes) no 3D / schematic para reposicionar ou ligar.
- Reutilizar lógica de drag de bornes/wires se existir; garantir que o modelo de continuidade atualiza.

### 7. Bloquear / desbloquear vista
- Já existe conceito de `simLocked` / demoMode / lock em RUN (ver task Landing-Sim-Polish).
- Adicionar toggle explícito «Bloquear vista» (câmera orbit/pan/zoom) independente do lock de edição.
- UI: botão na toolbar / ViewCube / menu de vista; estado em `useSimStore` (ex.: `viewLocked`).
- Em Panel3D / controlos de câmara: ignorar input de orbit quando `viewLocked`.

## Ficheiros candidatos (a confirmar no código)
- UI layout / tablet: `src/ui/device.ts`, `src/App.tsx`, `src/components/Sidebar.tsx`, `SidePanelHeader.tsx`, `CollapsedPanelRail.tsx`, estilos CSS.
- Cover / projetos: `src/dashboard/*`, `src/project/nativeProjects.ts`, `src/admin/AdminCovers.tsx`.
- Landing promote: `src/project/landingPublish.ts`, admin projects/covers.
- Chave: componentes de controlos 3D / key switch em editor3d ou three.
- Multímetro pinças: `src/project/nativeMotorMeter.ts`, three/terminal, docs MULTIMETRO.
- View lock: `src/store/useSimStore.ts`, `src/three/Panel3D.tsx` (ou equivalente), toolbar.

## Critérios de aceite
- [ ] Tablet (768–1024) apresenta layout idêntico ao desktop (painéis, topbar, densidades).
- [ ] Projeto nativo mostra cover na lista «Meus projetos».
- [ ] Admin consegue promover qualquer projeto para a landing; o promovido aparece no hero/showcase.
- [ ] Em todos os painéis laterais, o cabeçalho permanece fixo no topo durante scroll do conteúdo.
- [ ] Ao rodar a chave, o mecanismo completo (chave + rotor) roda sem «partir».
- [ ] Pinças do multímetro são arrastáveis.
- [ ] Existe controlo de bloquear/desbloquear vista (câmera); estado persiste na sessão.

## Estado
IN_PROGRESS — documentação no cofre. Código a implementar em `dc-simu` após clone estável; depois commit + push em ambos.
