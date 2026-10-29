---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, 3d, wires, multimeter, probes, native-project]
---
# Cabos fora dos sólidos e medição na entrada do motor

## Pedido e resultado

Reforçar o encaminhamento para os cabos não atravessarem o multímetro nem os
outros aparelhos; criar ponteiras de teste e acrescentar o multímetro ao nativo
a medir a tensão na entrada do motor.

- O traçado verifica interseções exatas segmento/volume, incluindo corpos
  finos, calha e espessura física do cabo. A proteção também se aplica aos
  pontos manuais e ao resultado da separação entre cabos.
- A exceção junto aos bornes limita-se à saída axial do encaixe. O aparelho
  onde o cabo começa/termina continua a bloquear o restante percurso.
- Um grafo de visibilidade calcula os desvios quando necessário. A curva
  desenhada segue os pontos validados, evitando que uma segunda interpolação
  volte a entrar nos corpos. O cache inclui o traçado completo, orientação,
  escala e posições dos bornes.
- Aparelhos em apresentação sólida têm superfícies físicas opacas e teste
  de profundidade. As sobreposições de interação não são transformadas em
  superfícies opacas. Os modos de diagnóstico explícitos continuam disponíveis.
- Percursos impossíveis devido a pontas dentro de aparelhos ou corpos
  sobrepostos são assinalados no registo; não se desenha uma travessia como
  alternativa.
- Novas terminações selecionáveis: ficha banana de 4 mm e ponteira de teste
  com contacto metálico, guarda de dedos, punho isolado e alívio de tração;
  representações 2D/3D e utilização no editor de elementos.
- O nativo inclui `MM1` em V~, ficha vermelha em VΩ e preta em COM; as ponteiras
  tocam U1 e V1 do motor. A leitura é calculada pelo circuito: **0 V → 400 V →
  0 V** ao arrancar e parar. A medição não fecha uma ponte entre as fases.

## Cópias do nativo já guardadas

`upgradeNativeMotorMeter` acrescenta apenas o multímetro e os dois cabos à
cópia antiga quando esta é aberta. Conserva todos os componentes, cabos,
programas, nomes e ajustes existentes. A referência do multímetro é escolhida
sem colidir com as referências existentes.

A marca `nativeFeatures` impede duplicação e permite eliminar posteriormente
o multímetro sem ele ser reposto. A atualização fica assinalada como alteração
por guardar e apresenta uma mensagem para guardar o projeto. A cópia remota
só muda quando o utilizador guarda pela aplicação autenticada.

A ligação Supabase disponível nesta sessão não lista o projeto DC-Simu. Não
foi alterada diretamente nenhuma base de dados remota, nem usadas credenciais
de ficheiros de ambiente. A integração funciona ao carregar a cópia existente
na aplicação atualizada, tanto com backend local como remoto.

## Verificações

- BrainNet: `npm test`, 45 testes; `npm run check` passou.
- Aplicação: `npm run test:ci`, `npm run build` e TypeScript passaram. O build
  inclui a geração PWA e mantém o aviso de chunks grandes.
- `test:native-wires-3d`: os **37 cabos** têm traçado visível, zero colisões
  cabo/cabo, sem atravessar outros aparelhos/calha ou a chapa; o motor mantém
  os seus percursos e orientação previstos.
- `test:solid-cables-meter`: medição 0/400/0 V, preservação do circuito,
  atualização aditiva/idempotente, persistência, referências já usadas,
  três traçados, três orientações, pontos manuais e obstáculo fino.
- `test:multimeter-ui`, Chrome local: quatro tomadas conservam as ligações;
  duas fichas banana e duas ponteiras são renderizadas no nativo; leitura
  de 400 V em RUN; sem erros JavaScript. Capturas frontal/isométrica e lateral.
- Testes com dados sintéticos e API bloqueada, sem alterar projetos reais.

## Ficheiros

- Encaminhamento: `src/three/solidWireRouting.ts`, `wireGeometry3D.ts`, `Panel3D.tsx`.
- Ponteiras: `WireEnd3D.tsx`, `types/index.ts`, `schematic/wireEnds.tsx`,
  `schematic/SchematicView.tsx`, `admin/editor3d/wireStyle.ts` e `wirePath.ts`.
- Nativo: `project/nativeMotorMeter.ts`, `project/nativeProjects.ts`,
  `store/useSimStore.ts`; sobreposições em `three/MultimeterDm20Panel.tsx`.
- Regressão: `scripts/solid-cables-meter-smoke.ts`,
  `native-wires-3d-smoke.ts`, `multimeter-terminals-ui-smoke.mjs`, `package.json`.

## Evidências e pendências

Logs `runtime/meter-probes-{ci,build,types,wires,regression,ui,brainnet}.log`;
capturas em `runtime/meter-probes-ui/`, incluindo `native-motor-meter-run.png`
e `native-motor-meter-side.png`.

Implementado e testado localmente; commit/push abrangidos pelo pedido anterior.
Aplicação integrada no commit `cb6a41b`.
Para conservar a alteração numa cópia já guardada: abrir o nativo na aplicação
atualizada e premir **Guardar**. Publicação em produção não verificada.
