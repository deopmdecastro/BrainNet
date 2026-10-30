---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-30
updated: 2026-10-30
tags: [dc-simu, 3d, desempenho, luzes, editor-componentes, grafcet, exemplos, testes]
---
# Renderização mais leve, cores de luzes (vidro + brilho) e exemplos GRAFCET funcionais

## Pedido

1. Trabalhar a renderização para não pesar tanto.
2. Verificar se a criação de cores nos componentes de luzes do editor de componentes funciona, e se a biblioteca de cores das luzes funciona na criação do 3D (cor do vidro e cor do brilho).
3. Resolver os 3 testes de interface GRAFCET que falhavam.
4. Criar três exemplos GRAFCET funcionais (básico, normal, avançado), com textos e comentários.

## 1. Renderização

Medido com o projeto «Partida direta com emergência (nativo)», vista 3D, Playwright no servidor de dev:

| Métrica | Antes | Depois |
|---|---|---|
| Chamadas de desenho por frame | 1430 | 533 (−63 %) |
| Multímetro DM20 (malhas / materiais) | 299 / 299 | 18 / 15 |
| LOGO! (malhas / materiais) | 172 / 172 | 15 / 15 |
| Imagem final | — | igual (15 píxeis diferentes em 551 216) |

O que mudou:

- **Junção estática de malhas** (`src/three/staticMerge.ts`).
  - Os CAD chegam partidos em centenas de malhas pequenas; as malhas com o mesmo material e o mesmo pai passam a ser uma só.
  - A junção só atravessa nós do GLB que nunca se mexem: os que estão marcados por `markCadNodes` e não têm anotações.
  - Ficam de fora:
    - os pivôs criados pelo código (cabeça do cogumelo, manípulos, teclas);
    - as malhas animadas uma a uma (tampas da botoneira, botões do DM20, armadura do contactor);
    - as lentes com material próprio, as transparentes e o que vem do JSX.
  - Corre depois do primeiro frame e não se aplica a componentes do catálogo (esses procuram nós pelo nome).
- **Materiais partilhados por clone** (`cloneModelScene` + `finishCadMaterial`).
  - Dentro de cada clone, materiais visualmente iguais passam a ser um só, e o acabamento PBR é reaproveitado.
  - Cada instância continua com os seus materiais, por isso a cor da lente e a tinta do corpo continuam independentes por instância.
- **`applyRenderMode`**: deixou de repor a cor e de marcar `needsUpdate` em todos os materiais a cada render.
  - Antes recompilava estados a cada render e apagava a cor do vidro dos sinaleiros.
  - Agora muda só o que mudou e verifica cerca de 3 vezes por segundo, não em todos os frames.
- **Orçamento de frames em RUN** (`RunFrameBudget`).
  - Antes a vista corria sempre ao ritmo do ecrã (`frameloop="always"`, 60–144 frames/s) durante a simulação.
  - Agora pede frames só quando fazem falta:
    - ritmo total durante 1,2 s depois de uma mudança de estado, de um gesto ou do arranque;
    - cerca de 30 frames/s no resto do RUN.
- **Resolução adaptativa**: com frames lentos a resolução desce para 1× e volta a 1,5× quando há folga (`PerformanceMonitor`).
- **Sem luzes de ponto «energizado»** no contactor, nos CAD de calha e no motor.
  - Montar e desmontar essas luzes recompilava os shaders de toda a cena a cada comutação.
  - O estado continua visível no rótulo, nos LEDs e na pose do aparelho.

As animações foram verificadas depois da junção, e todas continuam a mexer-se:

- cabeça do cogumelo;
- tampas START/STOP;
- manípulos do disjuntor e do PKZM;
- armadura do contactor;
- seletor do DM20.

## 2. Cores de luzes: vidro e brilho

### Antes

- Cada zona tinha uma só cor, usada para o brilho e, só com paleta, também para pintar a lente.
- Não havia biblioteca de cores.

### Agora

- **Vidro e brilho separados.** No editor há «Cor do brilho» (luz emitida, halo e luz projetada) e «Cor do vidro» (a lente, vista apagada e acesa). Os campos novos são `glassColor` e `glassColors`.
- **Biblioteca de cores de luzes** (`src/catalog/lightColorLibrary.ts`):
  - 9 pares de fábrica (vermelho, âmbar, amarelo, verde, azul, ciano, branco, incolor e violeta) e cores criadas pelo Admin («+ Criar cor»), guardadas neste navegador;
  - cada cor aparece como um círculo: o anel é o vidro e o centro é o brilho;
  - clicar aplica o par à zona; a paleta do utilizador usa os mesmos pares;
  - o componente guarda o par, por isso a simulação não depende da biblioteca.
- **«Ver acesa»** no editor acende a zona para ver vidro e brilho sem mudar a lógica. Antes, uma luz sem condição nunca acendia no teste, apesar de a dica dizer o contrário.
- **Simulador.** O inspetor mostra os pares com nome, e os sinaleiros nativos (AD22 e LEDs) passam a escolher a cor pela biblioteca, com vidro e brilho à medida.
- **Erros corrigidos:**
  - a lente do AD22 não mudava de cor no 3D, porque `applyRenderMode` repunha a cor original;
  - os halos acumulavam-se ao editar luzes: o animador era recriado sem libertar os anteriores (agora existe `StateAnimator.dispose`);
  - a cor do vidro não voltava à original ao retirá-la.

### Verificação

- Browser, editor de componentes com o sinaleiro AD22:
  - «Vermelho» aplicado → vidro `#c72424`, brilho `#ff2a1a`;
  - cor criada «Rosa teste» → guardada na biblioteca e aplicada;
  - «Ver acesa» → emissão e halo com a cor do brilho;
  - paleta «Ver» verde → vidro `#1c9a46`, brilho `#2bff6a`;
  - «Cor do modelo» → volta a `#383838`;
  - um só halo, sem acumulação.
- Simulador: no AD22 nativo, escolher «Verde» e depois mudar para azul altera a lente do GLB e a emissão.
- `test:glow`: 47 verificações, incluindo 16 novas sobre vidro e brilho, paleta, «Ver acesa», `dispose` e biblioteca.

## 3. Testes de interface GRAFCET

### Causa dos falhanços

Com o Vite em HMR, os módulos alterados são servidos com `?t=…`. Um `import('/src/store/useSimStore.ts')` feito no teste criava **outra instância da store**, e os dados de teste iam para uma store que a página não usa.

### Correção

- Os testes importam o módulo pelo URL que a aplicação realmente carregou (`__dcAppImport`) e alargam o buffer de recursos.
- Foram atualizados três seletores desatualizados:
  - menu compacto da importação;
  - botão «Recolher ferramentas»;
  - «Ajustar à largura».
- As portas por omissão passaram a 5173, como os outros testes.

### Resultados

| Teste | Verificações |
|---|---|
| `test:grafcet-ui` | 104 |
| `test:grafcet-construction-ui` | 18 |
| `test:grafcet-modals-ui` | 23 |

## 4. Exemplos GRAFCET funcionais

Estão em `src/project/grafcetExamples.ts`. São semeados como projetos só GRAFCET no painel e também aparecem em «Modelos GRAFCET → Exemplos completos». Cada exemplo tem:

- tabela de sinais com nomes;
- textos no desenho: título, entradas/saídas e explicações;
- comentários (notas com conversa) a explicar como testar;
- entradas com o tipo certo (botão, NF ou interruptor);
- zero avisos no Diagnóstico.

Os três exemplos:

1. **Básico — Prensa pneumática.** Sequência linear de 4 etapas com válvula biestável e temporização `2s/X2`.
2. **Normal — Portão automático.** Flanco `^I0.0`, espera de 5 s e seleção OU (fecha ou reabre pela fotocélula). O pirilampo é uma ação condicionada a 1 Hz.
3. **Avançado — Enchimento e tampagem.**
   - Divergência e convergência E (garrafa ∥ tampa) e tampagem de 1,5 s.
   - Ciclo contínuo memorizado em M0.0 (S condicionado, R) e seleção OU no fim.
   - Um segundo GRAFCET de segurança (etapas 10/11) corta todas as saídas na emergência; a produção retoma depois do rearme.

Outras alterações:

- O botão «Abrir exemplo de 3 etapas» (canvas vazio) continua a abrir o esboço mínimo de três etapas; os exemplos completos abrem-se em «Modelos» ou no painel de projetos.
- `test:landing-demo` passou a aceitar os três projetos de exemplo semeados ao lado do projeto nativo (e verifica que existem).
- O Diagnóstico deixou de avisar sobre várias etapas iniciais quando pertencem a GRAFCET parciais independentes.
- O semeador local deixou de repor sempre os projetos sem componentes, o que apagaria as edições feitas nos exemplos.

Verificação:

- `test:grafcet-examples` (novo, já em `test:ci`): 52 verificações. Os três exemplos correm de ponta a ponta no motor do simulador: etapas, saídas, piscas, temporizações, flancos, OU, E, S/R e emergência.
- Browser: os três exemplos aparecem no painel e abrem com etapas, textos e notas.
- Prensa com o simulador ligado: 0 → START → 1 (Y1) → b1 → 2 → passados 2 s → 3 (Y2).

## Pendente

- Medir as frames por segundo numa GPU real: o navegador de teste usa renderização por software (SwiftShader), por isso só se mediram as chamadas de desenho.
- A biblioteca de cores criadas fica por navegador; partilhá-la pela conta ou pela organização seria o próximo passo.
