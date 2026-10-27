---
project_id: BN-DCSIMU-001
type: product-design
status: ACTIVE
created: 2026-10-25
updated: 2026-10-27
tags: [brainnet, dc-simu, design, ux]
---
# Princípios de interface do DC-Simu

Esta nota reúne contexto para alterações de interface e interação. É uma síntese das decisões e do feedback de trabalho no projeto, não uma especificação imutável. Confirmar o código e o comportamento atual antes de propor uma alteração.

## Utilizadores e tarefa

O DC-Simu destina-se a aprendizagem, experimentação e diagnóstico de circuitos e sequências de automação. O mesmo projeto liga esquema elétrico, vista 3D, GRAFCET, Ladder e monitorização. A interface deve ajudar a perceber o estado do circuito e a relação entre as vistas.

## Direção visual

- Manter uma área de trabalho técnica, compacta e previsível, com ferramentas junto ao canvas e propriedades/contexto em painéis laterais.
- Usar azul para seleção e ações principais, tons neutros para superfícies e separadores, e verde para estados ativos em execução. A cor deve acompanhar rótulo ou forma, não ser a única indicação.
- Preservar os componentes, espaçamentos, tipografia e estados existentes. Tornar ações importantes reconhecíveis sem aumentar desnecessariamente a densidade da barra.
- Usar uma hierarquia clara entre modo atual, ferramenta ativa, objeto selecionado e estado da simulação. Manter endereços e valores técnicos legíveis e alinhados.
- Barras de ferramentas: usar os elementos de `src/ui/toolbarKit.tsx` (histórico, malha/ímã/zoom, botão com atalho, separador, atalhos) em todos os editores; só as ações próprias de cada editor ficam fora do kit.
- O que não cabe na largura disponível vai para um menu (`ToolMenu`), nunca para fora do ecrã nem para um deslize sem sinal. Cada item do menu diz o que faz, o atalho e, quando está desativado, o que falta para o ativar. Ações principais continuam em botão visível.
- Zoom mostra sempre a mesma referência: 100 % = conteúdo enquadrado; o valor é clicável e volta ao enquadramento.
- Adaptar painéis e controlos a ecrãs pequenos sem esconder a ação principal ou perder o contexto do objeto selecionado. Em ecrãs estreitos, dicas longas passam a pedido (um «?»), em vez de ocuparem o canvas.
- O nome do projeto/título tem prioridade sobre ações secundárias no cabeçalho: as ações secundárias passam a ícone com nome acessível.
- Nos editores com muito canvas (Esquema, Ladder, GRAFCET), painéis auxiliares abrem por cima do diagrama como folha e não empurram nem esmagam o conteúdo, salvo quando o utilizador os abre.

## Interação e segurança do trabalho

- A edição direta no diagrama deve dar resposta imediata e manter alternativas de teclado, foco visível e histórico de desfazer/refazer.
- Distinguir seleção, arrasto, ligação e deslocamento da vista; manter as ferramentas e atalhos coerentes entre GRAFCET e esquema.
- Usar verbos que descrevam o efeito real. «Exportar» descarrega um ficheiro; «Importar» escolhe um ficheiro; «Guardar» persiste o projeto. Indicar formatos aceites na ajuda da ação.
- Avisar antes de substituir um diagrama ou outro trabalho; erros de leitura devem deixar o conteúdo atual intacto.
- Mostrar validação, diagnósticos e estado da simulação perto do contexto que os originou. Explicar quando uma referência importada depende de outro GRAFCET.

## GRAFCET e Ladder

- O editor GRAFCET deve tornar claras as relações entre etapas, transições, ações e ramos; selecionar um elemento deve mostrar as suas propriedades e estado.
- A importação `.ct` suportada é do **FluidSIM 4**. Também se aceitam `.json` e `.grafcet`; não sugerir compatibilidade com outras versões de `.ct`.
- A geração de Ladder tem de preservar networks manuais e identificar os estados sem Ladder, sincronizado, desatualizado e bloqueado por erros. A sincronização automática é uma preferência visível e reversível.
- Na vista Ladder, mostrar o estado da parte gerada pelo GRAFCET e permitir abrir essa vista para corrigir ou atualizar a sequência.
- Endereços partilhados devem manter a ligação às variáveis do projeto; não criar um modelo independente para uma vista sem necessidade.

## Contexto para agentes

O Obsidian/BraiNet guarda estas orientações, requisitos e decisões em Markdown. O repositório da aplicação guarda o código. O Maestri tem o workspace **BraiNet OS** ligado a esta pasta segundo a verificação documentada, mas esta ligação não injeta automaticamente o histórico da conversa em cada tarefa. Em tarefas de UI no DC-Simu, incluir esta nota, o briefing e os ficheiros de código relevantes no pacote de contexto. Papéis em `04-Agents/` são instruções reutilizáveis e não significam que um agente esteja ativo.

[[Project-Brief|Briefing]] · [[Backlog|Backlog]] · [[Decision-Log|Decisões]]
