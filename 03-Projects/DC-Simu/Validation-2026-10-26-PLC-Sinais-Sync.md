---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, qa, plc, logo, ladder, editor-elementos, sincronizacao, bornes]
---
# Simulador de sinais do PLC, LOGO! (bornes e LCD) e sincronização editor ↔ simulador — 2026-10-26

## Pedido

1. Além da tabela de entradas/saídas, ter um simulador onde se injeta sinal nas entradas e se escolhe o tipo de contacto.
2. Os bornes do PLC LOGO! estão invertidos (a parte de baixo aparece em cima).
3. O ecrã LCD do LOGO! está mal colocado.
4. Varrer todos os componentes: alguns do editor não são os mesmos do simulador de esquema 3D.

## Problemas encontrados

| # | Problema | Causa |
| --- | --- | --- |
| 1 | Só havia E/S virtuais sem PLC; com PLC no esquema, a tabela era só leitura | Faltava injeção de sinal sobre os bornes reais do PLC |
| 2 | LOGO! com I0.x/L+/M em baixo e Q em cima | O integrado está correto (I0.x a y = 88 mm, Q a y = 2 mm); a inversão vem de rascunhos/versões antigas do catálogo do utilizador, espelhados em Y |
| 3 | LCD escuro deslocado para a esquerda, LED soltos | O plano do ecrã usava coordenadas fixas fora da janela do GLB |
| 4 | Componentes diferentes no editor e no simulador | Código: os 68 integrados batem certo (bornes, posições ≤ 2 mm, tamanho); 47 não têm GLB e aparecem no editor mas ficam bloqueados no simulador. Dados: rascunhos por publicar, versões publicadas antigas ou espelhadas |

## Implementação

**DC-Simu, commit `5bd709e` (carimbo #59).** Detalhes em [PLC-SINAIS-LOGO-SINCRONIZACAO.md](./dc-simu/docs/PLC-SINAIS-LOGO-SINCRONIZACAO.md).

### Simulador de sinais (DC-ADR-036)

- `PlcSignalPanel` nas propriedades do PLC («Simular sinais (entradas)») e no separador Entradas/Saídas do Ladder.
- Por entrada: botão de sinal, seletor INT/NO/NC e estado (`1 · cabo`); saídas Q com lâmpadas; «Limpar».
- O sinal soma-se (OU) ao dos cabos; saídas só com L+/M; NC repousa a 1.
- Estado em `plc.state.simInputs/simInputModes` (gravado com o projeto, fora do histórico).

### LOGO! (DC-ADR-037)

- LCD: janela calculada da malha verde do GLB (`logoScreen.ts`), ecrã 4 × 12 dentro dela, moldura escura, LED retirados, teclas com zonas de clique.
- Bornes: `fixFlippedTerminals` corrige bornes no espelho exato (Y ou Y+Z), idempotente, sem mexer em bornes editados à mão; `flippedRuntimeTerminals` deteta versões publicadas espelhadas.

### Sincronização (DC-ADR-038)

- Admin › Biblioteca 3D › «Sincronização»: por componente, editor vs simulador e as diferenças (só no editor, por publicar, bornes invertidos, publicado invertido, integrado atualizado, bornes em falta, arquivado/bloqueado, sem GLB).
- Ações: «Corrigir rascunho», «Corrigir e publicar», «Sincronizar tudo» (com confirmação).
- Cartões dos integrados sem GLB com «Bloqueado no simulador».

## Evidência

| Verificação | Resultado |
| --- | --- |
| `npx tsc -b` | Sem erros |
| `npm run test:ci` (com `Monta-Carga.ct`) | Passa (EXIT 0), com os novos `test:builtin-sync` (323) e `test:plc-signals` (18) |
| `npm run test:server` | 166 passam, 0 falham |
| `vite build` (heap de 3 GiB) | Concluído |
| `test:plc-signals-ui` (Playwright) | 16 verificações: Sincronização deteta e corrige o LOGO! invertido, 47 integrados sem GLB, painel de sinais (NC em STOP, injeção, premir NC → Q0.1), Ladder partilha o modo; sem exceções |
| Percursos UI existentes | `editor3d-ui` (32), `terminal-geometry-ui` (21), `editor3d-autodetect-ui` (12), `editors-sweep-ui` (19), `motor-ui` (12): todos passam |
| Capturas revistas (`runtime/plc/`) | Painel Sincronização; LOGO! de frente com LCD na janela e teclas à direita; propriedades com I0.0 = 1 e I0.1 NC premido; Ladder Entradas/Saídas |

## Estado

| Item | Estado |
| --- | --- |
| Simulador de sinais INT/NO/NC | implementado e testado |
| LCD do LOGO! | implementado e testado |
| Correção de bornes invertidos | implementado e testado |
| Painel de sincronização | implementado e testado |
| LOGO! e outros integrados já no catálogo do utilizador | preparado: abrir «Sincronização» e usar «Corrigir e publicar» / «Sincronizar tudo» (dados no Supabase/navegador do utilizador) |
| 47 integrados sem GLB | preparado: desbloqueiam-se ao publicar a cópia do editor; faltam modelos CAD reais |
| Aprovação pelo responsável | pendente |
| Deploy Vercel | não verificado |

Pendências:
- correr «Sincronizar tudo» no Admin com os dados reais;
- modelos CAD para os 47 integrados sem GLB;
- migração Supabase e gateway de pagamento (pedido anterior);
- revogar o token GitHub usado nesta sessão.
