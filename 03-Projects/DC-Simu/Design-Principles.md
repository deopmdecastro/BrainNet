---
project_id: BN-DCSIMU-001
type: product-design
status: ACTIVE
created: 2026-10-25
updated: 2026-11-02
tags: [brainnet, dc-simu, design, ux, toolbar]
---
# Princípios de interface do DC-Simu

Esta nota reúne contexto para alterações de interface e interação. É uma síntese das decisões e do feedback de trabalho no projeto, não uma especificação imutável. Confirmar o código e o comportamento atual antes de propor uma alteração.

**Atualização 2026-11-02** — reorganização das barras de ferramentas: ver [[2026-11-02-Reorganizacao-Barras-Ferramentas]].

## Utilizadores e tarefa

O DC-Simu destina-se a aprendizagem, experimentação e diagnóstico de circuitos e sequências de automação. O mesmo projeto liga esquema elétrico, vista 3D, GRAFCET, Ladder e monitorização. A interface deve ajudar a perceber o estado do circuito e a relação entre as vistas.

## Direção visual

- Manter uma área de trabalho técnica, compacta e previsível, com ferramentas junto ao canvas e propriedades/contexto em painéis laterais.
- Usar azul para seleção e ações principais, tons neutros para superfícies e separadores, e verde para estados ativos em execução. A cor deve acompanhar rótulo ou forma, não ser a única indicação.
- Preservar os componentes, espaçamentos, tipografia e estados existentes. Tornar ações importantes reconhecíveis sem aumentar desnecessariamente a densidade da barra.
- Ícone oficial do GRAFCET: três nós ligados (`faDiagramProject`), escolhido pelo utilizador. Usar sempre `IconGrafcet` de `src/ui/icons.tsx` nas barras, menus, painéis, estados e no editor vazio.
- Usar uma hierarquia clara entre modo atual, ferramenta ativa, objeto selecionado e estado da simulação. Manter endereços e valores técnicos legíveis e alinhados.
- Barras de ferramentas: usar os elementos de `src/ui/toolbarKit.tsx` (histórico, malha/ímã/zoom, botão com atalho, separador, atalhos) em todos os editores; só as ações próprias de cada editor ficam fora do kit.
- O que não cabe na largura disponível vai para um menu (`ToolMenu`), nunca para fora do ecrã nem para um deslize sem sinal. Cada item do menu diz o que faz, o atalho e, quando está desativado, o que falta para o ativar. Ações principais continuam em botão visível.
- **Agrupamento semântico (2026-11-02)**: Projeto (Novo/Abrir/Guardar/BOM/PDF) · Histórico · Painéis/Simulação · Ferramentas de edição · Anotações · Extras da vista. As ações secundárias (Exemplos, Importar, Limpar, Tabela, Variáveis…) passam a `ToolMenu «Mais»` quando a barra está em `is-tight`; em desktop largo ficam como botões. Anotações e transporte de simulação permanecem no grupo primário.
- **Estados de densidade**: `is-tight` oculta texto nos grupos secundários; `is-dense` também nos principais (`.tb-primary`). Em ≤ 1100 px + tight/dense os labels de texto desaparecem (tooltip e `aria-label` mantêm-se). Overflow é content-based (`useOverflowCompact`), não por breakpoint rígido.
- **Tablet**: parity de layout com desktop (`TABLET_LAYOUT_WIDTH`); alvos de toque ≥ 34 px e altura de barra 44 px em `pointer: coarse` ou ≤ 900 px. Telemóvel usa `compactBar` + menus.
- **Princípio orientador**: não mais botões → melhor organização; não perder funcionalidades → torná-las mais acessíveis via menus e hierarquia. Ver [[2026-11-02-Reorganizacao-Barras-Ferramentas]].
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
- Painéis recolhidos: sempre a régua comum (`CollapsedPanelRail`, 48 px, ícone + nome vertical + seta), nunca um botão flutuante próprio; setas laterais para painéis laterais e cima/baixo (`SidePanelHeader side="bottom"`) para gavetas no fundo, como o inspetor do GRAFCET até 800 px — [[Validation-2026-10-28-Grafcet-Regua-Componentes]]. Abertos no telemóvel, os painéis laterais são gaveta com cortina e o cabeçalho com a seta de recolher visível, nunca ecrã inteiro por baixo da barra do projeto.
- Gavetas: todos os painéis laterais abrem com a mesma especificação (`src/styles/panel-drawer.css`: largura `min(340px, 88vw)`, cantos retos, sombra e cortina comuns, cabeçalho `SidePanelHeader`), esquerda para Biblioteca/Projeto/Componentes e direita para Elementos/GRAFCET e objetos. Painel novo entra nessa lista — [[Validation-2026-10-28-Gavetas-Padronizadas]].
- Botões primários azuis: planos, sem brilho nem sombra colorida (o «Novo componente 3D» da administração também). Se um dia houver brilho, aplica-se a todos via `.dx-btn-primary`, não a um só botão.
- Barras de ferramentas: 6 px entre botões de um grupo, 12 px entre grupos (`--toolbar-seg-gap`, `--toolbar-gap` em `toolbar-spacing.css`); ao trocar de vista a barra volta ao início (scroll 0) — [[Validation-2026-10-28-Barras-Espacamento-Scroll]].

- Conta do criador: página `/account` (Avatar, Perfil, Segurança, Plano), aberta por «Gerir conta» no menu do avatar. E-mail só muda com a palavra-passe atual; sem servidor/Supabase as contas locais são fixas e a página diz porquê. Estilos em `account-page.css` — [[Validation-2026-10-28-Conta-Barras]].
- Um símbolo, uma função: nenhum ícone se repete em botões diferentes da mesma barra (GRAFCET ≠ Passo, Novo ≠ PDF, reiniciar sequência ≠ reiniciar simulação). Controlos de simulação (Run/Pausa/Stop/Passo/Reiniciar) presentes em todas as vistas. Cabeçalho do projeto: 48 px (52 px no telemóvel), controlos 34/38 px, área segura do iPhone, nome do projeto com prioridade (`header-refine.css`).

- Painel de simulação no fundo dos editores de sequência (Ladder e GRAFCET): separadores à esquerda numa zona de rolagem própria, estado (rótulo + forma + cor) e ações à direita, nunca sobrepostos. No GRAFCET o botão «Simulação» abre/fecha o corpo e a barra fica sempre visível; no telemóvel o transporte fica só na barra de ferramentas — [[Validation-2026-10-29-UI-Paineis-Simulacao-GRAFCET]].
- Separadores de painel com poucos itens: mosaicos iguais com ícone + contagem e nome por baixo, para caberem a 360 px sem rolagem escondida. Símbolos de texto (◎ □ ↑ ↓, emoji) dão lugar a ícones do kit ou ao desenho da norma (caixa de etapa com o número). **Vale para todos os painéis, não só para o inspetor GRAFCET**: o painel direito do 3D e do IEC usa o mesmo desenho (`RightDockTabs`) — um painel não inventa separadores próprios só porque pertence a outra vista — [[Validation-2026-11-01-Painel-Direito-3D-IEC-GRAFCET]].
- Régua de painel recolhido: mostra sempre o **nome completo do painel** (o mesmo do cabeçalho aberto, «diagnóstico» incluído) e o botão de reabrir, dentro dos limites do painel. Num contentor em coluna a régua ocupa a largura e estica em altura; nunca se aplica-lhe o `flex: 0 0 <largura>` do fluxo em linha, que a esmaga e o `overflow: hidden` corta o que resta.
- Chips de estado e de tipo pertencem ao cartão que descrevem (rodapé da célula), nunca em posição absoluta por cima dos vizinhos.
- Símbolo desenha o estado, não o tipo: num esquema de comando o que se vê tem de ser o que conduz. A lâmina de um contacto apoia-se nos bornes quando fecha (sem folgas) e `st.closed` é o estado de **condução** — um contacto NF a conduzir desenha-se fechado. Sem estado (miniaturas da paleta) desenha-se o repouso: NF fechado, NA aberto. NF e NA distinguem-se sempre, mesmo fechados, pela barra do contacto fixo — [[Validation-2026-11-01-Simbolos-Comando-IEC]].
- Diagnóstico de um exemplo de fábrica: **zero**. Antes de publicar um exemplo, correr o diagnóstico com o circuito em repouso — um exemplo oficial com erros ensina o erro. Corrige-se o circuito, não se desliga a regra; e uma regra nova só entra se o exemplo continuar limpo e os testes de simulação (sentido de rotação, retenção, emergência) continuarem a passar — [[Validation-2026-11-01-Diagnostico-Nativo-Partida-Direta]].
- O desenho por omissão é o da norma europeia: retângulo na resistência (IEC 60617), três terras com o mesmo borne PE, transformador com núcleo. Variantes de desenho de outra origem (zigzag ANSI, coleção QElectroTech) são escolha explícita no inspetor, nunca a omissão.

- Materiais 3D: a cor é a do fabricante; o realismo vem do estúdio (`studioEnvironment.ts`, tone mapping Neutral) e da superfície (`cadSurface.ts`: UV em mm e mapas PBR por família). Um renderizador novo usa o mesmo estúdio — capas, esquema e Painel 3D têm de parecer o mesmo objeto.
- Capa de elemento = fotografia de produto 3/4 do GLB real, frente e lado direito à vista; botoneiras e sinaleiros mais de frente; peças muito longas (calha) mostram um troço à escala, nunca esmagadas. Rever com `scripts/component-cover-audit.html` sempre que entra um GLB novo — [[Validation-2026-10-29-Texturas-Capas-Vistas]].

## Tablet e largura das barras

- Tablet = PC: um ecrã tátil com o lado curto ≥ 600 px recebe o layout de secretária a 1280 px (meta viewport escalada em `index.html`). Nada de gavetas, barras compactas ou alvos maiores só por ser tátil.
- «Telemóvel» é `PHONE_TOUCH_QUERY` (`src/ui/device.ts`). Não usar `(pointer: coarse)` sozinho para mudar layout; só para revelar o que no PC aparece ao passar o rato.
- Barras: compactar quando o conteúdo não cabe, medido com `useOverflowCompact` (`toolbarKit.tsx`), em vez de inventar um ponto de quebra — [[Validation-2026-10-30-Inspecao-Plataforma-Tablet-Barras]].
- Recursos do editor (fontes, modelos) são locais: o editor tem de abrir offline e em redes com firewall.

## Gestos no telemóvel

- Todo o canvas de diagrama (Esquema 3D, Esquema IEC, GRAFCET, Ladder) aceita **pinça com dois dedos** (`usePinchZoom` + `pinchPan`, 5× no máximo) e **um dedo no fundo vazio move a vista**, também em simulação. O retângulo de seleção é do rato e da caneta.
- Quem não pode usar dois dedos tem sempre botões: no Esquema IEC um controlo flutuante −/%/+ (a percentagem enquadra o esquema).
- Grelha dos canvas: **uma única regra** de passo visual, `editorGridPitch(scale, step)` em `src/ui/editorTheme.ts` — ponto de 1 px sempre em píxeis do ecrã (nunca dentro de um grupo escalado), passo ≥ 16 px, duplicando e nunca subdividindo para cada ponto coincidir com o íman. Esquema, Esquema IEC, GRAFCET, Ladder, 3D e editor de componentes usam o mesmo tema e a mesma regra; um canvas novo não calcula a grelha por conta própria — [[Validation-2026-11-01-Grelha-Unica-Painel-Inferior-Telemovel]].
- Painel em baixo no telemóvel: é **o painel lateral completo** da vista (Esquema IEC: `RightDockPanel`; GRAFCET: o inspetor), nunca uma versão reduzida nem dois painéis em simultâneo. Tablet/PC mantêm a coluna lateral — [[Validation-2026-11-01-Grelha-Unica-Painel-Inferior-Telemovel]]. O painel de estado do **Ladder** usa o mesmo cabeçalho (`SidePanelHeader` + casca `grafcet-properties`, side=`bottom`) que o GRAFCET e o IEC — [[Task-2026-11-02-Ladder-Painel-Inferior-Header]].
- Texto livre: o Esquema IEC, o GRAFCET e o 3D partilham a barra \`TextStyleBar\` e o mesmo comportamento — moldura tracejada azul ao selecionar, arrasto com ajuste à grelha (Alt = livre), duplo clique/toque edita no sítio, Enter/F2 editam e Ctrl+B/I/U formatam — [[Validation-2026-11-01-Texto-IEC-Igual-GRAFCET]].
- Num telemóvel não existe «Dois canvas». Linhas de nome/páginas deslizam numa única linha em vez de quebrar. A barra compacta fica acima das réguas recolhidas dos painéis — [[Validation-2026-11-01-Esquema-IEC-Telemovel-Pinca-Barras]].

## Interação e segurança do trabalho

- A edição direta no diagrama deve dar resposta imediata e manter alternativas de teclado, foco visível e histórico de desfazer/refazer.
- Distinguir seleção, arrasto, ligação e deslocamento da vista; manter as ferramentas e atalhos coerentes entre GRAFCET e esquema.
- A visualização 3D usa o cursor normal do sistema e os cursores dos alvos/ferramentas, também em RUN e pausa. Não montar uma mão ou dedo 3D como cursor de simulação: a atuação pertence aos comandos do equipamento, não a uma sobreposição que tapa a cena. Regressões: `test:sim-cursor` e `test:sim-select-3d-ui` — [[Validation-2026-11-01-Remover-Dedo-3D-Simulacao]].
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
