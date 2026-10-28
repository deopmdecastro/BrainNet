---
project_id: BN-DCSIMU-001
type: product-design
status: ACTIVE
created: 2026-10-25
updated: 2026-10-28
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
- As opções da ferramenta ativa (por exemplo cor, secção, condutor rígido/flexível e terminal dos cabos) vivem no painel lateral, no sítio do que se está a criar — nunca num cartão sobre o canvas. O mesmo bloco serve o simulador e o editor de componentes: o ícone da ponteira e o ícone do condutor são a informação, não um enfeite, e a escolha aplica-se logo aos cabos seguintes.

## Administração

- Estrutura: cabeçalho com o título, o ambiente (servidor ou modo local) e as ações principais; navegação lateral agrupada à esquerda (barra horizontal abaixo de 960 px e na Biblioteca 3D, que precisa da largura toda).
- Pendências primeiro: o Resumo abre com o que espera decisão (contribuições, pedidos de plano, componentes bloqueados) e cada linha tem a sua ação. Os números do Resumo são atalhos para a lista respetiva.
- Resumo componentizado (`OverviewTile`, `OverviewCard`, `OverviewEmpty` em `AdminPanel.tsx`): cada indicador é um cartão-botão com ícone do sistema único (`src/ui/icons.tsx`), valor, detalhe e seta; o tom do ícone segue o significado (aprovadas verde, rejeitadas vermelho, em revisão âmbar) e nunca é a única pista.
- Cada cartão tem **uma única ação**, no cabeçalho, em botão-pílula com seta — nada de duas ligações sublinhadas para o mesmo destino. Estados vazios levam ícone, frase e explicação curta.
- Listas compactas do Resumo (atividade, contribuições, cobertura): ícone + título/meta numa linha e data/estado/contagens à direita, também no telemóvel. A linha de contexto nunca repete a mesma identificação (ator = alvo nas sessões) e o alvo tem prioridade sobre repetir o e-mail.
- A navegação usa os ícones das secções nas três formas (lateral, faixa do tablet, seletor do telemóvel); no tablet os separadores ficam compactos para continuarem em duas linhas com ícone.
- Listas: tabela com cabeçalho para dados comparáveis (projetos, registos); cartões compactos para contas e componentes. Nada de cinzentos «desativados» em fila: o que não está disponível vai para o menu «Mais ações» e diz porquê (por exemplo, «Requer o servidor»).
- Ações destrutivas ficam separadas, em vermelho e com confirmação; ações de gestão frequentes (plano, detalhes, bloquear componente) ficam visíveis.
- Avisos de resultado são fixos no ecrã e não empurram o conteúdo; erros mantêm-se no topo da secção.
- Estilos em `src/styles/admin-refine.css` (carrega depois de `dx-contrib.css` e `dx-saas.css`); só tokens `--dx-*`. Sem barras laterais de destaque (`npm run test:style`).

- Identidade nas listas: pessoas têm avatar (`Avatar`: foto ou iniciais com tom estável, ponto de estado só quando importa) e coisas têm capa (`ProjectThumb`, `ComponentCover`). A capa nunca é a única pista: o nome vem sempre ao lado. Conteúdo pesado (capturas 3D) só monta perto do ecrã.
- Cabeçalho da administração: uma ação principal com ícone e subtítulo (`adm-cta`) e uma ação de regresso com seta (`adm-back`), lado a lado a 48 px no telemóvel. Se a mesma ação existe no cabeçalho e na lista, no telemóvel fica só a do cabeçalho. Estilos em `src/styles/admin-polish.css` — [[Validation-2026-10-28-Admin-Avatares-Capas]].

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

- Em ecrãs estreitos, uma lista de navegação longa não se resolve com deslocamento horizontal: mostrar a secção atual e abrir a lista completa num só botão (folha inferior), com os grupos visíveis.
- Uma barra fixa de ações (gravar, aplicar) nunca tapa conteúdo: a área de trabalho reserva espaço para a sua altura e as ações secundárias passam para um menu.
- O que é devolvido ao ecrã conta: fechar explicações extensas, subir o conteúdo e reduzir a altura das linhas valem tanto como uma funcionalidade nova — medir antes e depois em px, a 390, 768, 1024 e 1440.
- Campos nativos com formato ambíguo (datas) levam sempre rótulo visível; nunca se depende do placeholder do sistema.

- Uma família de barras de ferramentas usa sempre os mesmos tokens (altura da faixa, altura do controlo, raio, fundo). Uma barra não inventa medidas próprias nem quebra em linhas: o que não cabe desliza ou passa para um menu, e textos auxiliares vivem em faixas próprias.

- Alvos de toque a 40 px e texto ≥ 11 px em ecrãs estreitos (inspetor de bornes, compilação, botões de cabo). O rodapé de estado nunca transborda: versão e contador de ciclos saem, «Instalar» passa a ícone e o nome do projeto só aparece acima de 420 px. Os ajustes vivem em `src/styles/mobile-refine.css` (último import) — [[Validation-2026-10-27-Mobile-Refine-Ladder-Inspetor]].
- Painéis inferiores (estado do PLC, compilação) ocupam no máximo 38 % da altura visível; réguas recolhidas medem 30 px no telemóvel.

## Contexto para agentes

O Obsidian/BraiNet guarda estas orientações, requisitos e decisões em Markdown. O repositório da aplicação guarda o código. O Maestri tem o workspace **BraiNet OS** ligado a esta pasta segundo a verificação documentada, mas esta ligação não injeta automaticamente o histórico da conversa em cada tarefa. Em tarefas de UI no DC-Simu, incluir esta nota, o briefing e os ficheiros de código relevantes no pacote de contexto. Papéis em `04-Agents/` são instruções reutilizáveis e não significam que um agente esteja ativo.

[[Project-Brief|Briefing]] · [[Backlog|Backlog]] · [[Decision-Log|Decisões]]
