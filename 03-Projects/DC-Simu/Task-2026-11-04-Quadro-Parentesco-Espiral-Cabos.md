---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-04
updated: 2026-11-04
tags: [dc-simu, 3d, quadro, calha, cabos, espiral, isolamento, marcadores, filaçar]
---
# Quadro: parentesco de aparelhos, espiral de proteção, isolamento e marcadores de cabos

## Pedido (utilizador)
1. **Mover o quadro não arrasta os aparelhos que estão dentro** — criar opção/função rápida para marcar se um elemento ou componente está dentro do quadro e qual quadro. (Pendente da [[Task-2026-11-04-Quadro-Calhas-Perfis]]: «Mover o quadro não leva os aparelhos consigo».)
2. **Criar na pasta de quadros e calhas a espiral** (spiral wrap / proteção em espiral preta) para proteger o cabo em locais com dobras, p.ex. cabos de botões e luzes nas portas.
3. **Cabos isolados**: marcar onde começa e onde termina o isolamento do cabo e escolher a cor do isolamento.
4. **Tags/marcadores para cabos**: textos e números e cores dos marcadores (tipo anéis coloridos numerados).
5. **Filaçar cabos ou fios selecionados** (agrupar/atar visualmente cabos selecionados).

Imagens de referência fornecidas: espiral preta de proteção de cabos; marcadores numéricos coloridos (0–9) para fios.

## Princípios a respeitar
- Ler [[Design-Principles]] e o contexto de UI (barras, painéis, tema, botões, luzes, LCDs, texturas).
- Reaproveitar padrões existentes: `railId` / `mountedOn` para parentesco; grupo «Quadros e calhas»; geradores paramétricos em `enclosureParts.ts`; inspetor e toolbarKit.
- Trabalhar preferencialmente no cofre (BrainNet) e depois commit/push em ambos os repositórios.
- Não inventar UI do zero; estender o que já existe (inspetor de componente, painel de cabo, seleção múltipla).

## Plano de implementação (dc-simu)

### 1. Parentesco quadro ↔ aparelhos
- Acrescentar `enclosureId?: string` em `ElectricalComponentBase` (análogo a `railId`).
- Em `moveComponent` (e equivalente 3D se existir): quando se move um `panelEnclosure`, incluir todos os componentes com `enclosureId === id` no grupo de movimento (como já se faz para `railId` e `mountedOn`).
- Função rápida / inspetor:
  - Com quadro selecionado: lista dos aparelhos «dentro» e botão «Marcar seleção como dentro deste quadro» / «Remover do quadro».
  - Com aparelho selecionado: seletor do quadro pai (ou «nenhum»).
  - Opcional: detecção geométrica (ponto do aparelho dentro da caixa do quadro) como sugestão, sem forçar.
- Ao apagar o quadro, limpar `enclosureId` dos filhos (como se faz com `railId`).
- 3D: ao mover o quadro no painel 3D, deslocar também `panel3DPosition` dos filhos (se definido) ou a posição derivada.

### 2. Espiral de proteção (`spiralWrap` / `cableSpiral`)
- Novo tipo em `ComponentType` e factory no grupo «Quadros e calhas».
- Peça paramétrica: diâmetro interior, comprimento, passo da hélice, cor (preto por omissão).
- Geometria: tubo/hélice simples (THREE) ou aproximação com anéis; textura PVC preto brilhante.
- Uso típico: envolver troços de cabo junto a dobras (porta, botões). Pode ser acessório de painel (sem bornes) ou “anexo” a um cabo.
- Miniatura / capa 2D simplificada.

### 3. Isolamento de secções do cabo
- Estender `Wire`:
  ```ts
  isolation?: Array<{ start: number; end: number; color: string }>  // start/end 0..1 ao longo do comprimento, ou mm
  ```
- UI no painel do cabo (quando selecionado): adicionar/remover secções, cor, início/fim (slider ou % / mm).
- Render 2D e 3D: desenhar capa mais grossa e colorida entre start e end (por cima do condutor).

### 4. Marcadores / tags de cabo
- Estender `Wire`:
  ```ts
  markers?: Array<{ t: number; text: string; color: string; bg?: string }>  // t 0..1
  ```
- UI: adicionar marcador na posição do clique ou em %; texto (número ou etiqueta); cor do anel / fundo.
- Render: pequenos anéis ou bandeirolas numeradas no cabo (2D e 3D), inspirados nos marcadores coloridos 0–9.

### 5. Filaçar cabos selecionados
- Com vários cabos selecionados: ação «Filaçar» / «Atar chicote».
- Cria um «bundle» (novo tipo de objeto ou propriedade nos fios: `bundleId`) e opcionalmente um caminho comum / pontos de atadura (cable ties).
- Visual: cabos do mesmo bundle correm paralelos ou partilham waypoints; pequenos laços/ties nos pontos.
- Desfazer: «Desfilaçar».

## Ordem de trabalho
1. Tipos + moveComponent + limpeza ao apagar (parentesco) — impacto imediato no pendente do quadro.
2. Inspetor / função rápida de associação.
3. Espiral no catálogo e geometria básica.
4. Isolamento e marcadores no modelo Wire + UI mínima + render 2D.
5. Filaçar (bundle) com seleção múltipla.
6. Validação local (tsc, testes relevantes) e documentação no BrainNet.
7. Commit e push em dc-simu e BrainNet (submódulo se aplicável).

## Critérios de aceitação
- Mover um quadro com aparelhos marcados como «dentro» desloca os aparelhos no esquema (e no 3D se tiverem posição relativa).
- É possível marcar/desmarcar aparelhos de um quadro pelo inspetor ou ação rápida.
- Existe o componente espiral no grupo «Quadros e calhas».
- Cabos permitem secções de isolamento com cor e marcadores com texto/cor.
- É possível filaçar um conjunto de cabos selecionados.
- Sem regressões nos testes existentes de painel/quadro e cabos.

## Notas
- Preferir reutilizar `isPanelAccessoryType`, texturas canvas e o padrão de `railId`.
- Não alterar o comportamento de calhas DIN nem de `mountedOn`.
- Autorização explícita do utilizador para git commit e push com a chave fornecida.

## Resultado (implementação parcial)

### Feito
1. **Parentesco quadro ↔ aparelhos**
   - Campo `enclosureId?: string` em `ElectricalComponentBase`.
   - `moveComponent` inclui filhos com `enclosureId` no grupo de movimento (como `railId` / `mountedOn`).
   - `assignToEnclosure` / `detachFromEnclosure` no store; limpeza ao apagar o quadro.
   - Inspetor do quadro: «Marcar seleção como dentro» e «Soltar todos»; lista dos aparelhos associados.
   - Inspetor de qualquer componente (não-quadro): seletor «Dentro do quadro».

2. **Espiral de proteção (`spiralWrap`)**
   - Tipo, factory no grupo «Quadros e calhas», `isPanelAccessoryType`, tamanhos e IEC.
   - Controlo de inspetor (comprimento, Ø interior, passo, cor).
   - Representação 2D (`SpiralWrap2D`) e 3D (`SpiralWrap3D` helicoidal).

3. **Modelo de cabo**
   - `isolation?: Array<{ start, end, color }>` (0..1).
   - `markers?: Array<{ t, text, color, bg? }>`.
   - `bundleId?: string` (preparado para filaçar).
   - UI no inspetor do cabo: adicionar/editar/remover secções de isolamento e marcadores.

### Pendente / validação
- Render 2D/3D das secções de isolamento e dos marcadores no traçado do cabo (dados já no modelo e no inspetor).
- Ação «Filaçar» com seleção múltipla de cabos (hoje só há `selectedWireId` singular).
- Testes automatizados (`test:panel-accessories` e novos).
- Validação visual no browser e commit/push.


## Continuação (dc-simu `56ed529`)

### Desenho isolamento e marcadores
- **2D** (`SchematicView` + `wireGeometry`): capas coloridas mais grossas entre `start`/`end`; anéis/etiquetas com texto e cores no ponto `t`.
- **3D** (`Panel3D`): tubo de isolamento sobre a curva; anéis (torus) + placa de texto nos marcadores.

### Filaçar
- `selectedWireIds[]` + `selectWire(id, additive)` (Shift/Ctrl/Meta).
- `laceWires` / `unlaceWires` → `bundleId` partilhado.
- UI: inspetor do cabo e barra de seleção («Filaçar» / «Desfilaçar»).

### Testes
- `scripts/wire-isolation-markers-lace-smoke.ts` (geometria, modelo, espiral, enclosureId).
- `panel-accessories-smoke` atualizado para incluir `spiralWrap`.
- Validação visual no browser e `npm run test:panel-accessories` / smoke novo: pendentes no ambiente de instalação (registry npm instável neste runner).


## Corpos sólidos (dc-simu `bbff15a`)

Pedido: «calha e quadros são corpos sólidos, não atravessam elementos».

- **Quadro 3D**: obstáculos *hard* nas paredes (fundo, laterais, topo, base; porta se fechada). Interior livre para aparelhos e cabos.
- **Calha técnica / espiral**: deixam de ser tratadas como `rail`; passam a `hard` — o encaminhamento contorna o PVC.
- **Calha DIN**: continua `rail` (perfil aberto, cabos por cima).
- Colisão 2D do Esquema: footprint do quadro continua a permitir aparelhos «dentro» do desenho; a solidez física aplica-se no 3D.


## Calha DIN perfurada (dc-simu `aa1d6fb`)

Pedido: calha DIN no grupo Quadros e calhas, 3D com textura real, todos os tamanhos de encaixe.

- Catálogo em **«Quadros e calhas»**: «Calha DIN perfurada TS35 / G-rail (EN 60715) · textura real».
- Perfis: **15×5,5** (G-rail), **35×7,5** (omissão, modular), **35×15** (pesados).
- 3D: perfil em chapéu, furos oblongos, abas de encaixe, textura zincada PBR (flor de zinco).
- Inspetor: escolha de perfil, acabamento (galvanizado / bicromatado / alumínio), perfurada sim/não.

