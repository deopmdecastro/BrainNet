---
project_id: BN-DCSIMU-001
type: validation
status: PARTIALLY_VALIDATED
created: 2026-11-22
updated: 2026-11-22
tags: [brainnet, dc-simu, git, build, objetos, estampagem, qa]
---
# Revisão do pull: objetos, tomadas e estampagem

## Resultado

Pull concluído por fast-forward nos dois repositórios, preservando alterações e ficheiros locais:

- BrainNet: `e77eef9` → `c7d29c7`.
- DC-Simu: `db05be3` → `fd5071a`.

A implementação recebida **não estava integralmente funcional**, apesar de o último commit compilar. O estado Vercel de `fd5071a` foi consultado no conector GitHub e é `success`: [deploy associado](https://vercel.com/deopmdecastros-projects/dc-simu/3ptCvZZsFwuzCyduKDdGTMsbLaDh). Não foram obtidos os logs históricos dos deploys com erro; não se atribui uma causa única a todos eles.

As correções abaixo foram implementadas e testadas localmente sobre `fd5071a`. Atualização posterior: foram reunidas no commit [`d8fa230`](https://github.com/deopmdecastro/dc-simu/commit/d8fa230201be8aedbe654df284a2e5848a3a9f14) e enviadas para `origin/main` após o pedido «commit e push». Ver o [registo de entrega](./Delivery-2026-11-22-Correcoes-Maquetes-Tomadas.md).

## Defeitos encontrados e corrigidos

| Defeito recebido | Correção local | Evidência |
| --- | --- | --- |
| A criação do QGD invocava `wire` e `term` antes de inicializar as duas constantes; abrir/contar a maquete lançava `ReferenceError` | Inicialização antecipada dos auxiliares | `test:maquetes` reproduziu a falha antes da edição e passou depois |
| A sinalização introduzia três porta-fusíveis genéricos sem representação 3D, em vez de uma proteção trifásica | Um Schneider DF103NV existente no catálogo, com três fusíveis de 2 A e neutro seccionável, alimenta três iIL 1P | Testes de continuidade por fase, isolamento entre fases e corte de fases/neutro; modelo disponível |
| `IPE100` não era um perfil reconhecido; o normalizador devolvia `HEB200` | Reconhecimento de `IPE100` no modelo e no inspetor | Teste de normalização e teste 3D da maquete |
| As paredes das esteiras recebiam metade do comprimento esperado por `closedSpans` | Passagem do comprimento integral | Revisão da assinatura e renderização da maquete |
| As tomadas novas não entravam na lista de representações 3D e ficavam bloqueadas na Biblioteca | Registo das três representações e respetivas dimensões físicas | Testes de inserção e três raízes de componentes na cena real |
| Os bornes elétricos das tomadas estavam afastados dos parafusos desenhados | Alinhamento das coordenadas dos bornes com a régua física e declaração da face frontal | Medição na cena: 11 bornes, desvio máximo inferior a 0,01 mm |
| Ocultar um domínio/subgrupo criava um passo de histórico por componente | Um passo de histórico para toda a operação | Clique real em «Ocultar domínio»: três componentes ocultos, zero raízes na cena, um passo de histórico; desfazer repôs os três |
| O esquema frontal continuava a desenhar componentes ocultos; etiquetas 3D também podiam permanecer | Filtro na apresentação e seleção retangular do esquema e nas etiquetas 3D; o quadro oculto mantém a âncora geométrica do ambiente | Revisão de código e build; não houve varrimento de todos os gestos do esquema |
| Texturas das tomadas não eram libertadas ao desmontar | Limpeza das duas texturas no ciclo de vida React | Revisão do ciclo de vida e build |

O DF103NV é um aparelho **3P+N** reutilizado do catálogo existente. As quatro peças novas substituem o iIL 3P: o QGD passa de 47 para 50 componentes e a maquete completa de 140 para 143, com 53 tipos. Os testes foram atualizados com verificações elétricas, além das contagens.

## Verificações

| Verificação | Resultado |
| --- | --- |
| DC-Simu `npm run build` | Passou no commit recebido e com as correções; TypeScript, Vite e geração PWA concluídos |
| DC-Simu `npm test` | Passou |
| DC-Simu `test:maquetes` | 8 verificações passaram, incluindo continuidade da sinalização, inserir/desfazer/refazer e guardar/reabrir |
| `test:mechanical`, `test:duct-resize`, `test:estampagem-guiao`, `test:estampagem-ladder`, `test:component-validate`, `test:selection-groups`, `test:sim-edit-lock` | Passaram |
| `test:stamping-factory-ui`, com servidor local isolado em `127.0.0.1:5178` | 9 verificações passaram: QGD, mesa, chão, pilar, esteiras, filaçamento, QE1 e ausência de exceções React/WebGL |
| Interação com ProjectObjects e Panel3D reais através de `agent-browser` | Árvore «Eletricidade → Tomadas», ocultar domínio e desfazer confirmados |
| `test:terminal-geometry` | Falhou em `breakerMurrelektronikMico46.L+`: «cabo sai pela face errada» |
| Mesmo teste de geometria numa extração intacta de `fd5071a` | A mesma falha MICO foi reproduzida; não foi introduzida por estas correções |
| BrainNet `npm test` | 45 testes passaram |
| BrainNet `npm run check` | Falhou: 53 erros documentais já presentes antes das edições (metadados ausentes e ligações inválidas) |
| `git diff --check` | Sem erros de whitespace; avisos locais de conversão LF/CRLF |

O DC-Simu não define um script `check`; a verificação estrutural da aplicação é o build TypeScript. Os avisos de bundles grandes e imports simultaneamente estáticos/dinâmicos permanecem, sem impedir o build.

Evidências locais, ignoradas por Git:

- `dc-simu/runtime/stamping-factory/overview.png`, `cabinet.png`, `trays.png` e `qgd.png`.
- `runtime/pull-review-sockets.png`, na raiz BrainNet: captura da árvore de objetos e tomadas em 3D.
- `dc-simu/runtime/pull-review/`: fixture isolada, auxiliares de inspeção e extração de referência para confirmar a falha MICO. Não contém credenciais.

Uma tentativa posterior de repetir a inspeção com `agent-browser` foi impedida por incompatibilidade entre CLI e daemon (`Daemon version mismatch` / `CDP response channel closed`). As medições e interações acima tinham sido observadas antes dessa falha; os ficheiros `*-evidence.json` dessa repetição não constituem evidência válida.

## Pendências e limites da aceitação

Atualização após o pedido de fidelidade dos produtos: a [reconstrução das tomadas](./Validation-2026-11-22-Tomadas-Fidelidade.md) resolve localmente o seccionador e as limitações visuais das tomadas descritas nos pontos 2 e 3 abaixo, com novas capturas e testes. As entradas seguintes conservam o estado observado no fim desta revisão inicial; não devem ser lidas como estado atual das tomadas.

1. **Aberturas automáticas das esteiras — implementação parcial.** `Panel3D` continua a usar `ductJunctionOpenings(c, components)`, que calcula cruzamentos por `schematicX/Y`, `w/h` e rotação no plano do esquema. Não considera separação em profundidade, `panel3DPosition` nem rotação em Y, usada no ramal da bancada. Assim, a lógica DIN 2D não garante uniões físicas T/L/+ corretas no espaço 3D. O fundo da esteira também não aplica o recorte de extremidades usado nas calhas técnicas. É necessária adaptação geométrica própria e testes de junções em 3D.
2. **Tomada com seccionador — simulação incompleta.** `switchOn` roda o manípulo, mas não tem integração específica no motor elétrico; o tipo apresenta apenas bornes L/N/PE de entrada. Não se validou alimentação de uma carga através desta tomada nem corte elétrico por esse manípulo.
3. **Serigrafia e fidelidade das tomadas.** A textura FAMATEL indica `200/346 V`, enquanto o catálogo anuncia `400 V`. As inscrições são fixas e não seguem os campos de estado. Não foi feita aceitação por fotografia/ficha técnica nem foram geradas capas próprias para estes três componentes.
4. **Geometria MICO.** Resolver a falha confirmada em `test:terminal-geometry` antes de declarar a suite completa verde; distinguir a normal de saída pretendida de um eventual pressuposto desatualizado no teste.
5. **Documentação BrainNet.** Corrigir os 53 erros do `check`: dois links da skill GSAP, um wikilink e metadados em notas/README de evidências. Não foram alterados nesta revisão focada na aplicação.

Estado desta revisão: **parcialmente validado**, com as pendências acima. Estado posterior do código: commit `d8fa230` enviado para `origin/main`; a atualização da referência do submódulo e os relatórios acompanham o registo de entrega no BrainNet.

## Ficheiros alterados

Na aplicação: `src/electrical/stampingWallPanel.ts`, `src/electrical/factory.ts`, `src/three/modelPaths.ts`, `src/three/SocketDevices3D.tsx`, `src/three/structuresModel.ts`, `src/three/StructuresDevices3D.tsx`, `src/three/Panel3D.tsx`, `src/components/DeviceControls.tsx`, `src/components/ProjectObjects.tsx`, `src/schematic/SchematicView.tsx` e `scripts/ready-maquettes-smoke.ts`.

No cofre: esta nota de validação. Configurações pessoais e ficheiros locais anteriores foram preservados.
