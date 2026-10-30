---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-30
updated: 2026-10-30
tags: [dc-simu, performance, cabos, validation]
---
# Bloqueio da página — cálculo dos cabos

## Resultado e diagnóstico

O pedido foi verificar as dificuldades de execução e o aviso «Página sem resposta»
mostrado nas imagens. Foi identificado e corrigido localmente um bloqueio no
encaminhamento coordenado dos cabos, mesmo com a simulação em STOP.

`Wires3D` executava `buildAllWirePaths3D` dentro de `useMemo`, na thread principal.
O algoritmo compara os segmentos dos cabos e faz até 32 passagens de separação.
A primeira captura de diagnóstico registou uma tarefa de 4515 ms e cerca de
6 s de amostras de CPU nessa função. Isto impede o navegador de responder aos
controlos enquanto calcula e é compatível com o sintoma comunicado.

A captura posterior deixou de mostrar esse cálculo na thread principal e não
registou erros JavaScript. A maior tarefa passou a 1863 ms, na preparação inicial
dos shaders WebGL por software. As capturas foram feitas em Chromium isolado,
com SwiftShader, dados de teste e serviços externos bloqueados. A primeira inclui
um erro transitório de recarregamento Vite durante a preparação do diagnóstico;
estes números são evidência de localização do bloqueio, não um benchmark
controlado nem uma medição do computador/navegador da imagem do utilizador.

A instância em `http://localhost:3000` identificou-se como
`458ac7b76a4e27dd657b16459f708d884b579c04.r107.mvuabpp1`, anterior ao checkout
`0865d6d`, que já contém outras otimizações de renderização. Uma amostra de
`docker stats` mostrou 4,56 % de CPU e 85,36 MiB de memória do contentor da
aplicação; esta amostra não demonstra saturação do servidor nem exclui picos.

## Implementação e ficheiros

- `dc-simu/src/three/wireRoutingJob.ts`: dados serializáveis, orientação efetiva
  de cada componente e dimensões/colocação dos modelos dinâmicos do catálogo.
- `dc-simu/src/three/wireRouting.worker.ts`: mesmo algoritmo de encaminhamento,
  executado fora da thread da interface; sem alteração das regras físicas.
- `dc-simu/src/three/useWireRouting.ts`: inicia o worker por alteração geométrica,
  termina cálculos antigos e ignora respostas obsoletas; falhas explícitas e
  possibilidade de repetir, sem fallback síncrono pesado.
- `dc-simu/src/three/Panel3D.tsx`: integração assíncrona, indicação de cálculo,
  desenho apenas dos resultados atuais e chaves de geometria completas para
  bornes, dimensões, pontos livres 3D e waypoints. Ticks elétricos não iniciam
  novos cálculos. Os cabos ficam temporariamente ocultos durante o recálculo.
- `dc-simu/scripts/wire-routing-ui-smoke.mjs` e `dc-simu/package.json`:
  `npm run test:wire-routing-ui`, com teste opcional do bundle através de
  `WIRE_ROUTING_TEST_BUILD=1`.
- Metadados Obsidian acrescentados à nota existente
  [[Validation-2026-10-30-Olhal-Motor-Porca]], cuja falta fazia falhar o check da
  fundação; conteúdo histórico preservado.

## Verificações e evidências

| Verificação | Resultado |
| --- | --- |
| BrainNet: `npm test` | 45 testes passaram |
| BrainNet: `npm run check` | Passou após completar os metadados da nota existente |
| Aplicação: `npm test` | Passou |
| Aplicação: `npm run typecheck` | Passou |
| Aplicação: `test:native-sim` | Passou |
| Aplicação: `test:native-wires-3d` | Passou; sem penetrações nos sólidos ou entre os 37 cabos |
| Aplicação: `test:solid-cables-meter` | Passou |
| Aplicação: `npm run build` | Passou; worker de produção emitido, avisos de chunks/importações existentes |
| `test:wire-routing-ui`, incluindo bundle de produção | 8 verificações passaram |
| Captura do editor completo após a correção | Cabos, aparelhos, motor e multímetro presentes; sem erros JavaScript |
| `git diff --check` | Passou |

O teste de regressão comprova resposta da interface durante o cálculo, igualdade
exata com o algoritmo original (incluindo catálogo e orientação pessoal), ausência
de recálculo por simples renderização, cancelamento ao mudar de projeto, falha
explícita, recuperação e funcionamento do worker emitido pelo build.

Evidências locais, ignoradas pelo Git, em `dc-simu/runtime/`:
`performance-before.json`, `performance-after.json`, perfis `.cpuprofile`,
capturas `.png`, `wire-routing-ui/report.json`,
`test-performance-smoke.log` e `test-native-sim-performance.log`.

## Estado e pendências

Preparado, implementado e testado localmente. Sem commit, push, reinício do
contentor ativo ou publicação nesta tarefa. A instância em uso ainda precisa
de receber a alteração no âmbito de uma atualização autorizada. A aprovação
de publicação deve identificar pessoa, commit, ambiente, data e âmbito.

Permanece a preparação gráfica inicial, especialmente em WebGL por software.
Falta validar no navegador/GPU usados pelo utilizador e confirmar o comportamento
da instância atualizada; não foi inspecionada a sessão autenticada da imagem.

[[README|DC-Simu]]
