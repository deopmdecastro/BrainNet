---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-11-04
updated: 2026-11-04
tags: [brainet, dc-simu, qa, grafcet, ladder, word]
---

# Correção convergência E — WORD_IDLE 0 (c499d4e) — 2026-11-04

## Pedido

> Falha que ficou por corrigir: o `test:grafcet-ladder-word` falha em «convergência E (MOVE −1)». Vem do commit c499d4e e não tem a ver com esta alteração. Se quiseres, corrijo a asserção (o MOVE passou a 0), que é uma alteração pequena.

Autorização explícita para `git commit` e `git push` nos dois repositórios com a chave fornecida.

- Repositório aplicação: https://github.com/deopmdecastro/dc-simu
- Cofre: https://github.com/deopmdecastro/BrainNet

Princípio: trabalhar preferencialmente no cofre e depois commit/push em ambos (comunicação entre cofre ↔ aplicação, reaproveitar quando já existe).

## Contexto lido antes da alteração

- `Design-Principles` — regras de UI/UX, painéis, tema, barras, luzes, LCDs, texturas, PBR, grelha única, gestos, etc.
- `Project-Brief` / `Requirements` / `Backlog` — estado DEVELOPMENT, sincronização 2D/3D/Ladder, geração Ladder WORD vs bits.
- `src/grafcet/toLadderWord.ts` (c499d4e): `WORD_IDLE` passou de `'-1'` para `'0'`; `wordMoveSource()` garante fonte ≥0; comentários atualizados para «MOVE 0 → Gx».
- `scripts/grafcet-ladder-word-smoke.ts` ainda verificava `move.source === '-1'` e `regs() === '0,-1'`.

## Diagnóstico

Após `c499d4e`:

1. **Falha visível**: `grafcet-ladder-word-smoke.ts:91` — `a convergência E para a sequência G1 (MOVE −1)` — `move.source === '-1'` já não existe, agora é `'0'`.
2. **Falha escondida**: o mesmo teste, nos exemplos «básico/normal/avançado», compara `GRAFCET X...` com `Ladder G0…`. O agregado `lActive = words.map(v).filter(v>=0)` incluía o `0` de idle como etapa `0`. Antes, idle `-1` era filtrado por `>=0`; agora, com idle `0`, um `G2=0` (parado) aparecia como `0` extra: `GRAFCET X6,10` vs `Ladder 0,6,10` (564 divergências no «avançado»).

A colisão `0 = idle` vs `0 = etapa 0` só afeta lanes secundárias (`G1` com etapas `4,5` e `G2` com `10,11`): o `0` de idle nunca é etapa dessas lanes, mas o agregado global tratava-o como etapa `0` do `G0`.

Reaproveitamento: em vez de reescrever, ajustou-se a asserção existente e o filtro, mantendo `WORD_IDLE='0'` (decisão de c499d4e).

## Correção (dc-simu)

**Ficheiro**: `scripts/grafcet-ladder-word-smoke.ts`

- Linha 91: `move.source === '-1'` → `'0'`; mensagem `MOVE −1` → `MOVE 0`.
- Linhas 98–103: `regs() === '0,-1'` → `'0,0'` (arranque e Stop); mensagens com `(-1)` → `(0)`.
- Validação dos exemplos: filtro global `v>=0` → **filtro por lane**:
  ```ts
  const lanesInfo = stepLanes(program)
  const laneSteps = new Map<number, Set<number>>()
  for (const s of program.steps) { /* lane → números das suas etapas */ }
  const lActive = ladder.words
    .map((w, idx) => Number(lDb[w]?.value))
    .filter((v, idx) => laneSteps.get(idx)?.has(v) ?? v >= 0)
  ```
  Visited e mismatches passam a usar o mesmo filtro; cobre o caso `0` como idle em lanes sem etapa `0`.

Nenhuma alteração em `src/grafcet/toLadderWord.ts` — mantém `WORD_IDLE='0'` e `wordMoveSource`.

## Verificação

Ambiente: Node 20.20.2 (aviso de engine para jsdom 30), `npm ci`, sem credenciais nos testes.

```
npm run test:grafcet-ladder-word
PASS — sequência simples usa o método do registo de etapa
...
PASS — a convergência E para a sequência G1 (MOVE 0)
PASS — arranque: G0 = 0 e G1 parado (0)
PASS — Stop: a convergência volta à etapa 0 e para G1
...
PASS — avançado: Ladder MOVE evolui como o GRAFCET em 1200 patamares (0 divergências)
PASS — avançado: a sequência passou por todas as 10 etapas (0, 1, 2, 3, 4, 5, 6, 7, 10, 11)
PASS — G0 <> Xn, G0 <=> Xn e G0Xn cabem no registo de etapa (MOVE)
...
OK
```

Antes da correção: `AssertionError: a convergência E para a sequência G1 (MOVE −1)`.
Depois da 1ª correção parcial: 564 divergências no «avançado».
Depois do filtro por lane: `OK`.

Outros smokes relevantes mantêm-se verdes (ver `test:grafcet-ladder-sync`, `test:grafcet-examples` no CI).

## Notas de UI/plataforma

Esta tarefa é de correção de teste do motor GRAFCET→Ladder (método WORD, MOVE). Não altera UI, painéis, tema, botões, luzes, LCDs, texturas, capas, calhas, isolamento, marcadores ou filaçar (ver `Task-2026-11-04-Quadro-Parentesco-Espiral-Cabos.md`). Respeita `Design-Principles` e o padrão de reaproveitar em vez de escrever do zero.

## Commits

- `dc-simu`: `fix(tests): convergência E MOVE 0 e filtro por lane para WORD_IDLE=0 (c499d4e)` — `scripts/grafcet-ladder-word-smoke.ts`
- `BrainNet`: esta validação + bump do submódulo `03-Projects/DC-Simu/dc-simu` para o commit da correção.

## Pendências

- Validar `npm run test:ci` completo no runner de produção (Node 22+) — este runner usa Node 20 com warnings de engine.
- Se o utilizador preferir rever a semântica `idle=0` vs `etapa 0` no Ladder (ambiguidade para auditoria), abrir ADR específico; por agora mantém-se a decisão de c499d4e.

[[README|Índice]] · [[Backlog]] · [[Task-2026-11-04-Quadro-Parentesco-Espiral-Cabos|Quadro e calhas]]
