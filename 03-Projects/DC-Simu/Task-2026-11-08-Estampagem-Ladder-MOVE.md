---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-08
updated: 2026-11-08
tags: [dc-simu, estampagem, ladder, move, grafcet, atec]
---
# Estampagem (ATEC): Ladder com MOVE

## Pedido
Editar o projeto de estampagem para permitir criar Ladder com MOVE (guião «Estampagem_Guião_1185 v2»).

## Resultado (dc-simu `71956a3`)
- O projeto «Estampagem Industrial — ATEC» continua do tipo GRAFCET, mas abre também o Ladder (Main [OB 1]) e o Monitor (`unlockedViews: ['ladder']`).
- O OB1 traz 5 networks com MOVE, a partir da tabela de tempos do guião:
  - Tipo_Preta (I0.2) → 5 → MW100;
  - Tipo_Branca (I0.3) → 6 → MW100;
  - Tipo_Metal (I0.4) → 8 → MW100;
  - Pos_Deposito (I0.6) → MW100 → MW102;
  - B_Reset (I1.3) → 0 → MW100.
- Tags MW100 «Tempo_Estampagem_s» e MW102 «Ultimo_Tempo_s», do tipo Int. Ficam longe dos registos de etapa MW0–MW16 do «Gerar Ladder» por palavras.
- O «Gerar Ladder» só substitui as networks «GRAFCET ·» e «Complete restart ·»; as networks MOVE mantêm-se.
- A semente passou de v23 para v24: a cópia guardada é substituída pela versão nova ao abrir o painel. O JSON de exemplo (`examples/`) também foi atualizado.

## Verificação
- `test:estampagem-ladder` (13 verificações): o Ladder fica disponível, os MOVE dão 5/6/8 → MW100, a cópia para MW102 e o reset a 0 funcionam, e o GRAFCET corre em paralelo.
- `test:ci` verde e `vite build`.

## Atualização do projeto guardado (Supabase, 2026-11-08, a pedido do utilizador)
- Projeto `68e94beb…` «Estampagem Industrial — ATEC» (v23, revisão 40): atualização cirúrgica, sem substituir o conteúdo pela semente.
  - Foram acrescentadas as 5 networks MOVE e as tags MW100/MW102.
  - O Ladder ficou desbloqueado e o `nativeId` passou a v24, para a semente não o voltar a substituir.
  - Ficou na revisão 41.
- Verificado por SQL: o GRAFCET (53 etapas) e o restante conteúdo ficaram iguais aos da cópia.
- Cópia de segurança no painel: «Estampagem Industrial — ATEC (cópia v23, 2026-11-08)» (`3c53c61d…`), sem marca nativa. Pode apagar-se depois de validar.
- Não foram tocados: a cópia antiga v8 (`5196fda1…`) e os projetos manuais «Estampagem» e «Grafcet Estampagem».

## Organização do GRAFCET (dc-simu `c4decbc`, semente v25)
- **Ações compactas:** o «Organizar» empilha as ações simples a 42 px; só as condicionadas reservam espaço para a condição. A G3 e a G2 ficaram mais curtas.
- **Emergência ao lado:** as etapas só alcançadas por referência (ex.: X5 na G0) ficam no topo, à direita do fluxo, e já não muito abaixo.
- **Ilhas:** um Grafcet grande com poucas ilhas pequenas fica na mesma fila.
- **Legendas dos abortos:** G2 «A1–A11 → X20» e G3 «A1–A4 → X40».
- **Notas:** as notas de página empilham-se e ficam abaixo das transições de referência.
- **Projeto guardado (Supabase):**
  - O GRAFCET era igual ao da semente v24 (impressão digital de etapas e transições), por isso foi atualizado no próprio projeto: 3 posições de etapa, 16 `dy` de ações, comentários e curvas de ligação.
  - `nativeId` passou a v25, na revisão 42.
  - Verificado por impressões digitais (etapas, ações e transições iguais às da v25). O Ladder com MOVE manteve-se.

## «Gerar Ladder» por registo de etapa (MOVE) (dc-simu `34b2977`)
- **Limite:** 16 → 32 sequências. A estampagem tem 17 sequências, uma por página G0–G16; o MOVE estava indisponível.
- **Nomes dos registos:** as sequências seguem a ordem das páginas, e o registo Gn guarda a página Gn (antes, «G4» era a página G16).
- **Erro corrigido:** o método por MOVE ignorava a guarda «Só se» (a T1 da G2 disparava sem G0 em automático). Agora usa a receptividade completa, como o motor e o método por bits.
- **Verificação:** ensaio GRAFCET × Ladder MOVE na estampagem, 1200 patamares, 0 divergências; os piscas Q1.2 (1 Hz) e Q1.0 (2 Hz) estão corretos. `test:ci` e build verdes.

## Gerar Ladder com todas as páginas (dc-simu `66ff321`)
- **Erro:** o editor passava só as transições da página aberta ao «Gerar Ladder». No projeto real o diálogo dizia «mais de 32 sequências» (53 etapas soltas) e o Ladder gerado ficava incompleto: por bits, 84 em vez de 224 networks.
- **Correção:** pré-visualização, diferença, aplicação e exportação JSON passam a usar todas as transições.
- **Verificado no browser com a página G4 aberta:** MOVE «Recomendado», FC Grafcet 196, FC Outputs 13, OB100 17, registos G0–G16 em MW0–MW16; as networks MOVE dos tempos mantêm-se.
- Por bits, o GRAFCET inteiro esgota a memória M (limite 99); usar MOVE.

## Pendências
- Recarregar o editor se o projeto estava aberto (revisões antigas são recusadas ao guardar).
- Validar no browser/produção.
