---
project_id: BN-DCSIMU-001
type: technical-audit
status: PROPOSED
created: 2026-10-25
updated: 2026-10-25
tags: [brainet, dc-simu, architecture, audit]
---
# Auditoria da expansão do simulador integrado

> Este documento regista uma auditoria local e uma proposta de fases. O prompt anexado foi tratado como briefing, não como autoridade para executar instruções operacionais, contactar terceiros ou publicar alterações.

## Âmbito e estado

O briefing propõe esquemas elétricos e eletrónicos, microcontroladores, firmware e integração com GRAFCET, Ladder e 3D. A Fase 1 deve primeiro consolidar arquitetura, reutilização, riscos e baseline. Esta nota cobre a inspeção local do código e dos documentos disponíveis; ainda não é uma especificação aprovada nem inicia a implementação das novas áreas.

## Arquitetura encontrada

| Área | Implementação existente | Consequência para a expansão |
| --- | --- | --- |
| Aplicação | React 18, TypeScript, Vite 7; estado central em Zustand | Criar novas vistas dentro da aplicação e reutilizar o store e os contratos atuais. |
| Modelo elétrico | `src/types/index.ts`: componentes, terminais identificados, classificação elétrica e cabos com IDs, terminais ou pontas livres, rede entre folhas e metadados de roteamento | Estender os tipos por capacidade/domínio, preservando IDs e a leitura dos projetos existentes. |
| Esquema 2D | `src/schematic/`; editor com símbolos, ligações, folhas, seleção e edição | Reutilizar ferramentas de canvas, símbolos, snapping, layout e operações existentes. |
| Simulação elétrica | `src/electrical/engine.ts` e módulos relacionados: fontes, continuidade e terminais energizados; varrimento no store | O motor atual é orientado a continuidade/estados industriais discretos. Não foi identificado um solver analógico SPICE. Não apresentar simulação analógica como suportada sem um motor real. |
| PLC/Ladder | `src/ladder/`; varrimento por PLC, tabelas de endereço, temporizadores, contadores, blocos e entradas/saídas | Preservar o ciclo atual e definir uma fronteira explícita para novos dispositivos e sinais. |
| GRAFCET | `src/grafcet/`; programa e runtime próprios, leitura da tabela do simulador | Integrar novos sinais através de um contrato comum testável, sem acoplar a UI dos editores. |
| 3D | `src/three/Panel3D.tsx` e metadados espaciais no componente | Manter a mesma identidade do componente e tratar apresentação 3D como vista do modelo. |
| Ciclo de execução | `src/store/useSimStore.ts`, `runOneTick`: entradas, scan PLC/Ladder, GRAFCET, continuidade subsequente, atuadores, medições e diagnósticos | Novos domínios precisam de ordem de scan determinística e regras sobre atraso entre domínios. Alterar esta ordem requer testes de integração. |
| Histórico e projetos | Snapshots do store incluem componentes, cabos, Ladder, GRAFCET e programas; `src/utils/persistence.ts` guarda projetos/autosave em `localStorage`; existe exportação/importação JSON e migrações | Atualizar snapshot, serialização, migrações e compatibilidade em conjunto com cada novo tipo persistente. A persistência local não sincroniza dispositivos. |
| Testes | Scripts de smoke focados em núcleo, UI e integrações; `npm test`, `npm run typecheck` e testes direcionados | Acrescentar casos aos contratos partilhados e verificar projetos antigos e ciclos multidomínio. |

## Conclusões

1. O produto já inclui um editor de esquemas elétricos industriais; esta parte do briefing é sobretudo uma lista de lacunas e incrementos, não um módulo a construir do zero.
2. Existe um modelo partilhado entre as vistas elétricas, Ladder, GRAFCET e 3D. A expansão deve conservar essa identidade e evitar duplicar estado ou ligações.
3. A simulação atual resolve continuidade e estados discretos do domínio industrial. Circuitos analógicos, eletrónica e firmware executável exigem modelos e limites de suporte próprios; não se deve inferir comportamento físico a partir de símbolos visuais.
4. O principal risco transversal é a compatibilidade de projetos gravados, seguida da sincronização e da ordem do ciclo de scan.
5. A inspeção local não verificou licenças, formatos ou adequação dos cinco repositórios externos de símbolos indicados no briefing. Não importar recursos antes dessa revisão.

## Plano proposto

### Fase A — especificar e proteger os contratos atuais

- Inventariar os formatos JSON reais, migrações, interfaces de edição e ações de undo/redo.
- Definir um contrato de sinal independente da representação visual: identidade, tipo (booleano/numérico), unidade/domínio quando aplicável, direção, valor, validade e instante do ciclo.
- Mapear como sinais de componentes físicos chegam ao PLC, como PLC/GRAFCET comandam atuadores e como o 3D representa estados.
- Acrescentar testes de compatibilidade de projeto e de scan antes de introduzir novos domínios.

### Fase B — primeiro incremento integrado e limitado

- Escolher um percurso demonstrável e sem firmware arbitrário: um sinal lógico de um dispositivo/sensor existente, consumido em Ladder ou GRAFCET e refletido num atuador/indicador e no 3D.
- Tornar a validade e a origem do sinal visíveis no diagnóstico e no monitor.
- Cobrir arranque, paragem, reset, persistência, undo/redo e projetos anteriores.

### Fase C — eletrónica lógica discreta

- Modelar pinos/redes digitais, HIGH/LOW/alta impedância/conflito e componentes apenas quando exista regra de simulação explícita.
- Separar componentes gráficos de componentes simuláveis e mostrar limites no catálogo e diagnóstico.
- Só depois de estabilizar o contrato avaliar modelos analógicos simplificados.

### Fase D — microcontroladores

- Comparar runtimes suportados, isolamento, licenças e execução em navegador/servidor antes de escolher plataforma.
- Começar por um adaptador de pinos com um subconjunto verificável; não prometer firmware compilado ou execução arbitrária enquanto não houver runtime validado.

### Fase E — biblioteca de símbolos e importação

- Rever os cinco repositórios pedidos: estrutura e formatos reais, licença, atribuição, pontos de ligação e processo de atualização.
- Criar adaptador normalizado e registo de origem/licença antes de redistribuir qualquer ativo.

## Ficheiros a reutilizar ou avaliar

- Reutilização provável: `src/types/index.ts`, `src/store/useSimStore.ts`, `src/electrical/`, `src/schematic/`, `src/ladder/`, `src/grafcet/`, `src/three/`, `src/utils/persistence.ts` e `src/store/migrations.ts`.
- A inspecionar antes de escolher implementação: `src/App.tsx` (composição das vistas), componentes de edição e canvas do esquema, importação/exportação JSON, histórico/undo-redo e regras de validação de terminais.
- Novos módulos, se aprovados: contrato/domínio de sinais, adaptadores de dispositivos e modelos eletrónicos discretos, mais testes de integração. Os caminhos finais devem seguir a organização existente após revisão dos pontos acima.

## Dependências e riscos

- Não foi encontrada dependência dedicada a solver analógico nem runtime de firmware na configuração inspecionada.
- Não adicionar dependências antes de comparar licença, execução no browser, manutenção e impacto no bundle.
- Riscos: regressão em esquemas guardados, efeitos de alteração na ordem de scan, sinais com semântica incompatível, consumo de memória do build e licenças de símbolos.
- Mitigação: migrações idempotentes, testes de compatibilidade, contratos tipados, casos determinísticos de integração e revisão de licença antes de importar ativos.

## Baseline e limitações desta auditoria

- O registo `[[Validation-2026-10-25]]` documenta checks anteriores da aplicação: smoke do núcleo, percursos UI, servidor e limite de memória no build de produção.
- O checkout da aplicação já tinha alterações locais pendentes na importação FluidSIM (`docs/FLUIDSIM-IMPORT.md`, `scripts/fluidsim-import-smoke.ts`, `src/grafcet/GrafcetEditor.tsx`, `src/grafcet/fluidSim4.ts`); foram preservadas. O smoke completo, o typecheck e o teste de integração Ladder foram executados depois do incremento abaixo.
- A auditoria externa dos repositórios de símbolos e a validação completa de undo/redo, ferramentas de canvas e formatos JSON continuam pendentes.
- O Maestri CLI está instalado, mas a sessão atual não fornece `MAESTRI_PIPE`; a listagem/debug devolveu “only available inside Maestri terminals”. Não foi possível confirmar agentes ativos nem enviar-lhes tarefas. Não foram enviadas mensagens externas.

## Fase B — incremento implementado

O percurso de sinal físico → entrada do PLC → Ladder → saída → atuador já era executado pelo simulador. O incremento acrescentou observabilidade ao monitor de E/S do Ladder para não confundir uma entrada fisicamente desligada com um sinal ligado a zero.

- O monitor agora mostra destino, estado lógico (`1 · ativa` / `0 · ligada`) e distingue bornes sem ligação e pontas livres.
- Quando o PLC declara `powered: false`, o monitor assinala `PLC sem alimentação` e não pinta o bit como ativo.
- O motor de scan, os formatos de projeto e os dados persistidos não foram alterados.
- Alterações: `dc-simu/src/ladder/plcIo.ts`, `dc-simu/src/ladder/LadderEditor.tsx`, `dc-simu/src/styles/virtual-io.css` e `dc-simu/scripts/smoke.ts`.
- Verificações: `npm.cmd run typecheck`, `npm.cmd test` e `npm.cmd run test:ladder-integration` passaram; integração Ladder reportou 13 verificações.
- A inspeção visual num browser e o build de produção continuam pendentes. A aplicação permanece com as quatro alterações locais FluidSIM listadas acima.

## Decisões por tomar

- Aprovar o percurso da Fase B e selecionar o comportamento funcional a demonstrar.
- Definir se a eletrónica começa apenas com lógica discreta ou inclui modelos analógicos simplificados.
- Escolher prioridade e runtime para microcontroladores/firmware.
- Confirmar se a revisão dos repositórios de símbolos deve incluir auditoria de licenças para eventual redistribuição.

[[Project-Brief|Briefing]] · [[Requirements|Requisitos]] · [[Backlog|Backlog]] · [[Decision-Log|Decisões]] · [[Testing-Plan|Validação]]
