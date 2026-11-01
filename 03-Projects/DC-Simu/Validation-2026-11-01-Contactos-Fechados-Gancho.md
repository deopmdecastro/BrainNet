---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED
created: 2026-11-01
updated: 2026-11-01
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, simbolos, iec-60617, contactos, nf, na, comandos]
---

# Validação 2026-11-01 — Contactos fechados desenhados com o gancho do contacto fixo

## Pedido

O utilizador enviou o desenho de referência (três símbolos: «Normalmente Aberto» 3-4, «Normalmente
Fechado» 1-2 e «Comutador» 1-2-4) com o pedido «os meus contactos fechados devem ter este design», e
uma captura do editor onde os contactos apareciam como uma linha direita com uma travessa.

## O que estava errado

| # | Defeito | Efeito no ecrã |
|---|---|---|
| 1 | O contacto a conduzir era uma **linha vertical contínua** entre os dois bornes | Um contacto fechado lia-se como um simples troço de cabo; nem parece um contacto |
| 2 | O NF distinguia-se por uma travessa de 12 px cruzada na linha | O desenho do NF era uma cruz sobre um fio, não o símbolo IEC 60617 |
| 3 | Não havia gancho (contacto fixo) em nenhum dos estados | O desenho do NF não seguia a norma, ao contrário do resto da folha |

## Implementação (`src/commands/symbols.tsx`)

- **Contacto fixo com gancho**: a linha desce do borne superior até `y=18` e vira para o lado (`±10`).
  No NF o gancho está sempre desenhado (é o contacto fixo); no NA aparece quando conduz.
- **Lâmina**: apoiada no borne inferior (`0,42`), assenta na ponta do gancho a conduzir
  (`0,42 → ±10,18`) e afasta-se dele quando abre — no NF para `(12,27)`, no NA para `(-11,20)`
  (o traço do desenho de referência).
- O NF fica com o gancho à direita e o NA à esquerda, para os dois estados fechados se distinguirem
  sem depender da cor; a lâmina continua verde e mais espessa quando conduz e a simulação corre.
- `contact3` (contactos de potência do contactor) segue o mesmo desenho nos três polos; disjuntores,
  seccionadores e o comutador ficam como estavam (ali a lâmina é o manípulo ou a posição, não um
  contacto).
- A travessa transversal do NF, que existia como muleta, foi removida.

## Verificação

- `npm run test:commands-symbols` — 10 verificações: a geometria continua a ligar os bornes quando o
  contacto conduz e a não ligar quando está aberto (a verificação é por percurso nos segmentos
  desenhados, não por comparação de texto).
- `npm run test:commands-symbols-ui` — 9 verificações no navegador (resistência IEC/ANSI, três terras,
  zero erros JavaScript).
- `npm test` — todos os testes passam.
- Comparação visual lado a lado com o desenho de referência: «NF fechado» reproduz o símbolo do meio
  (linha → gancho → lâmina inclinada → borne 22) e «NA aberto» reproduz o da esquerda.

## Limites

- O comutador (1-2-4) mantém a geometria anterior: no 3RU/contactor a posição de repouso está
  **por baixo** do comum, e uma lâmina inclinada obrigaria a mover o borne `14`. Fica como melhoria
  se o utilizador quiser essa variante.
- A cor de condução continua a ser a única indicação de estado nos contactos de potência de 3 polos.

## Evidência

- `dc-simu` — `src/commands/symbols.tsx`; testes acima.
- Registo de decisão: [[Decision-Log|DC-ADR-080]].
