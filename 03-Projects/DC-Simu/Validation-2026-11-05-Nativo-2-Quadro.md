---
type: validation
status: IMPLEMENTED_LOCAL
created: 2026-11-05
updated: 2026-11-05
tags: [dc-simu, nativo, quadro, validacao]
---
# Projeto nativo 2 — quadro estrela-triângulo

Implementado e testado localmente. Código enviado para `origin/main` do DC-Simu no commit `e70a1d1`. Sem publicação da aplicação ou aprovação de lançamento.

## Resultado

A semente antiga reproduziu exatamente o diagnóstico das imagens: **1 erro e 19 avisos**. A ligação W39 aplicava 24 V DC ao disjuntor AC QF2; os restantes avisos eram sobreposições e uma saída de QF2 sem ligação. A semente corrigida abre com **0 erros e 0 avisos no diagnóstico do esquema 3D**, mantendo a deteção da ligação DC/AC errada quando reintroduzida no teste.

- Quadro e calhas usam 1,5 px/mm no esquema e 0,01 unidades/mm no 3D. Equipamentos distribuídos por três calhas DIN; comandos da porta em posições distintas.
- Etiquetas desenhadas como superfícies da cena 3D, com tamanho físico, perspetiva e ocultação pela porta. Deixam de ser elementos HTML ampliados por cima do quadro e do carregamento.
- Aparelhos da porta, respetivas etiquetas e pontas dos cabos usam a mesma transformação ao abrir o quadro, com dobradiças à esquerda ou à direita.
- LOGO! alimentado em L+/M, quatro saídas físicas a relé, bobinas AC e retornos coerentes. H3 segue o auxiliar de KM3; H2 segue o disparo de F1. Removidas Q0.4/Q0.5 fictícias; tags alinhadas com a cablagem.
- Ligações de linha, estrela, triângulo e PE revistas; corrigidas as condições NF de STOP/emergência, a ação indevida de estrela em repouso e o identificador do PLC ativo.
- Migração automática limitada às duas assinaturas da semente v2 intacta (direta e guardada/reaberta). Preserva IDs existentes, anotações, estados de disparo/proteção e remapeia interbloqueios. Cópias com estrutura personalizada ou calibração manual não são substituídas.

## Ficheiros

Na aplicação `dc-simu/`: `src/project/nativeEstrelaTriangulo.ts`, `src/project/nativeEstrelaUpgrade.ts`, `src/store/useSimStore.ts`, `src/three/EquipmentDecal3D.tsx`, `src/three/doorMount.ts`, `src/three/Panel3D.tsx`, `src/three/PanelAccessories3D.tsx`, `scripts/native-estrela-smoke.ts` e `package.json`.

## Verificações

- `npm test` na aplicação: passou.
- `npm run test:native-diagnostics`: passou para os dois nativos; inclui a nova regressão do nativo 2.
- Teste específico com fixtures sintéticas locais da semente v2 original e guardada/reaberta: passou. Confirma migração idempotente, preservação de notas, IDs e disparo térmico, e recusa substituir uma cópia movida pelo utilizador.
- Simulação do nativo 2: alimentação do PLC, repouso, estrela, passagem a triângulo, motor e lâmpadas, STOP em estrela, emergência em triângulo, rearme sem rearranque e disparo térmico. KM2/KM3 nunca simultâneos durante os percursos testados. Para testar, fechar QM1, selecionar AUTO e premir START.
- `npm run typecheck`, `npm run build` e `git diff --check`: passaram. O build mantém avisos de dimensão de bundles e de imports estáticos/dinâmicos.
- `npm test` na raiz BrainNet: 45 testes passaram.
- Inspeção visual com `agent-browser` num perfil local de teste, sem publicação: [quadro fechado](../../runtime/native2-fechado.png) e [quadro aberto](../../runtime/native2-aberto.png). Evidências locais em `runtime/`, ignoradas pelo Git.

## Pendências fora desta correção

- `npm run test:native-sim`: falha em «STOP: motor pára» do nativo 1 (limiar da rotação visual). Reproduzida também com o `useSimStore.ts` original de HEAD, em cópia temporária entretanto removida.
- `npm run test:panel-accessories`: falha em «perfil guardado no estado», numa regra de perfis DIN não alterada nesta tarefa.
- `npm run check` na raiz: 9 erros documentais anteriores — duas propriedades em falta em `Task-2026-11-03-Grafcet-Sem-Painel-Baixo.md` e sete ligações para imagens em duas notas de 2 de novembro.
- O GRAFCET mantém dois avisos conservadores sobre Q0.0 comandada nas etapas mutuamente exclusivas 10 e 11; não são erros do esquema 3D. O Ladder vazio também mantém os seus avisos próprios.
- Publicação e aprovação de lançamento pendentes. Uma cópia personalizada da semente antiga precisa de revisão específica; a migração não a substitui automaticamente.
