---
project_id: BN-DCSIMU-001
type: validation
status: TESTED
created: 2026-11-23
updated: 2026-11-23
tags: [dc-simu, qa, regressoes, simulacao, step, bloqueio, maquete, rampas, fichas, cee, build]
---

# Garantia dos últimos commits do DC-Simu (23 Nov 2026)

## Pedido
Garantir e melhorar os últimos commits do DC-Simu (lote de 23 Nov: fichas CEE, cablagem filaçada, tubos de ar, efeitos de fluido, pré-carga GLB, perf de routing, cache Vercel).

## Método
1. Clone limpo de `dc-simu@7e792e5a`, `npm ci`, `tsc -b`, `npm run build`.
2. `npm test` + varrimento das 108 suites `tsx` autónomas (`test:*` sem browser).
3. Comparação com o HEAD sem alterações e `git bisect` nas falhas novas.
4. Contexto: [[Design-Principles]], [[Protocolo-Comunicacao-BrainNet-DCSimu]], [[Decision-Log]] (DC-ADR-086, DC-ADR-102), [[Task-2026-11-23-Componentes-Maquete-Bloqueados]], [[Task-2026-11-23-Reposicionamento-Componentes-Maquete]].

## Estado encontrado (7e792e5a)
- `tsc -b` e `npm run build`: verdes (graças a `7c213a2e`).
- `npm test`: **vermelho** (TypeError em `ductJunctionOpenings`).
- Suites autónomas: 96/108.

## Regressões corrigidas

| Sintoma | Causa | Correção (commit dc-simu) |
|---|---|---|
| `npm test` aborta; calha em T não ramifica | `321a4e55` pôs `locked: true` na fábrica → **todos** os aparelhos novos nasciam bloqueados e `addDuctAdjacent` recusava | Fábrica volta a `locked: false`; `insertReadyMaquette` bloqueia só as peças que monta (`90ce46f9`) |
| `test:wire-locks`, `simulation-transport-smoke` | `step()` em STOP deixava `stopped`, contra DC-ADR-102 | `step()` = Passo do utilizador (STOP → PAUSA). Novo `refreshCircuit()` para recálculos internos sem acordar a simulação e sem pausar em RUN (`11e3a0fb`) |
| `test:mechatronics` (peça não cai na rampa METÁLICA) | `f5ab2c0f` deslocou as rampas ±20 mm em x/z, fora da vertical da ventosa | Removido o deslocamento; espaçamento uniforme já é 30° no arco (240/270/300). Motor, FC 1/FC 2 e Cilindro 3 mantêm o reposicionamento (`62afd559`) |
| `test:sockets` | `ceePlug16A` entrou em `SOCKET_DEVICES` mas é ficha (sem tampa de serviço); bornes 3D 2 mm fora de `socketWiringPoint` | Modelo usa `socketWiringPoint`; smoke trata a ficha à parte (`e5637f4c`) |
| `test:maquetes` | `7e792e5a` atualizou só a verificação 3 (168 → 170) | Inserção e desfazer/refazer com 170 (`b9cd5c2d`) |

## Evidência após correção (b9cd5c2d)
- `tsc -b`: 0 erros · `npm run build`: OK (1973 módulos, 28,9 s) · ESLint nos ficheiros alterados: limpo.
- `npm test`: **900 PASS**, «TODOS OS TESTES PASSARAM».
- Suites autónomas: **101/108**. Repostas: `test:maquetes` (9), `test:wire-locks` (30), `test:mechatronics` (14), `test:sockets` (16), transporte (19). Sem novas falhas.
- Estampagem: `test:estampagem-guiao` (76) e `test:estampagem-ladder` (13) verdes.

## Pendências (já falhavam a 19 Nov, fora do lote de hoje)
`test:terminal-seat` e `test:terminal-geometry` (MICO 4.6 L+), `test:editors-sweep` (bornes 2D do HOME+/B6 do braço), `test:lighting` (grupo Iluminação), `test:qgd` e `test:native-policy` (exemplos locais em conta limpa), `test:landing-demo` (fallback offline).

## Para confirmar pelo utilizador
- Âmbito do bloqueio: o pedido dizia «componentes da maquete»; aparelhos avulsos voltam a nascer livres. Se quiser bloqueio para tudo, é preciso adaptar `addDuctAdjacent` e os testes.
- Rampas: se as fotografias pedem outro afastamento, deve ser feito mudando os ângulos (`BENCH_RAMP_ANGLES`), não deslocando as rampas para fora do arco.
- Suites com browser (`*-ui-smoke.mjs`) não foram corridas neste ambiente.

## Estado
Implementado e testado localmente; publicado em `main` (dc-simu `b9cd5c2d`). Aprovação visual pendente.
