---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED
created: 2026-11-01
updated: 2026-11-01
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, rele-termico, 3ru1116, siemens, bornes, comandos-3d, retorno-visual]
---

# Validação 2026-11-01 — Relé térmico Siemens 3RU1116: bornes, A2 e botões

## Pedido

Quatro capturas do utilizador na vista 3D do relé térmico Siemens 3RU1116-1AB0, com duas queixas:

1. «Os bornes do relé térmico estão errados, os bornes são na base e no topo e falta o borne do A2.»
2. «E os botões não funcionam.»

A captura é autoritativa sobre o defeito; a geometria foi verificada no CAD (GLB de 32 malhas,
175 145 triângulos) e na ficha Siemens antes de mexer.

## O que estava errado

| # | Defeito | Efeito no ecrã |
|---|---|---|
| 1 | `2T1/4T2/6T3` estavam na **face da frente**, a meio do corpo (y 0,836) | As saídas do relé apareciam na frente, ao lado dos auxiliares |
| 2 | `1L1/3L2/5L3` no topo, mas a z = 9 mm (atrás dos pinos, z ≈ 53 mm) | Os bornes de entrada caíam no vazio atrás dos pinos |
| 3 | `A2` não existia — 10 bornes em vez de 11 | O borne da passagem da bobina do contactor não se podia ligar |
| 4 | Os botões STOP/RESET/TEST não reagiam | O relé só disparava pelo corpo; no aparelho real os três botões são manobráveis |

O defeito 4 tinha duas causas somadas: os CAD importados não tinham zonas de clique, e o grupo do
comando (`ImportedCadDevice`) vivia na origem da cena — o ponto do clique era convertido em
**coordenadas do mundo**, pelo que nenhuma caixa em mm podia ser reconhecida.

## Implementação

### Bornes (`scripts/place-imported-terminals.py` → `src/data/imported-component-terminals.json`)

| Borne | Face | x (mm) | y (mm) | z (mm) | Observação |
|---|---|---|---|---|---|
| 1L1 / 3L2 / 5L3 | topo | −15,3 / −6,6 / 2,0 | 74,9 (ponta do pino) | 53,0 | três pinos esquerdos |
| 2T1 / 4T2 / 6T3 | base | −16,4 / −4,3 / 7,7 | 0,9 | 33,0 | cavidades por baixo do bloco de terminais |
| 95 / 96 / 97 / 98 | frente | −17,5 / −8,7 / −0,05 / 8,7 | 25,7 | 67,0 | fila de parafusos |
| **A2** | frente | **+17,35** | 25,7 | 67,0 | à direita do 98, como na etiqueta |

`A2` entra como `coil-minus` (passagem da bobina do contactor: não tem contacto próprio, o manual
3RU2/3RB3 di-lo explicitamente). `LEGACY_REAL_TERMINALS` ganhou as posições antigas do relé, para que
projetos gravados se mudem para os sítios novos sem tocar em bornes fixados à mão.

### Comandos (`THERMAL_RELAY_CONTROLS`, `src/three/importedFinish.ts`)

Zonas em mm do GLB, medidas nas peças `cad_8_` (vermelho, STOP) e `cad_9_` (azul, RESET) e no cursor de
ensaio gravado na frente:

| Comando | x | y | z |
|---|---|---|---|
| STOP | −22 … −14,2 | 31 … 45 | 62 … 73,5 |
| RESET | −13,5 … −1 | 31 … 45 | 62 … 73,5 |
| TEST | 5 … 15 | 52 … 63 | 62 … 70 |

- `ImportedCadDevice` passa a pôr o grupo do comando **na posição do aparelho**
  (`position={position ?? [x, RAIL_Y, 0]}`) e o modelo dentro dele em `[0,0,0]`, com `anchor`
  explícito para o apoio na base continuar igual.
- `importedActuationPatch(c, pressed, control)`: STOP e TEST são **momentâneos**
  (`stopPressed`/`testPressed`), RESET só rearma (`tripped: false`, e só se disparado), o corpo fora
  das zonas inverte o disparo.
- Os três botões são **mecânicos**: funcionam com a simulação parada, como no aparelho. O corpo
  continua a exigir RUN/PAUSA.
- `importedBridges`: disparado, STOP ou ensaio abrem 95–96; disparado ou ensaio fecham 97–98. As três
  fases nunca são interrompidas.
- `animateImportedRig` empurra o botão premido 2,8 mm para dentro e deixa o RESET saliente com o relé
  disparado.

## Verificação

- `npm run test:imported-components` — 169 verificações (eram 137), incluindo: 11 bornes com as faces
  certas, A2 na fila dos auxiliares, STOP/ensaio momentâneos, RESET só a rearmar, corpo a inverter o
  disparo, pontes 95–96/97–98 e a migração de projetos antigos.
- `npm run test:terminal-geometry` — 34 modelos; o relé passa com **11 ligações no interior dos
  encaixes**, cada uma confirmada por raio contra a malha real (topo: pinos; base: cavidades; frente:
  parafusos).
- `npm test` — todos os testes passam.
- Nota: `test:terminal-geometry` verifica o relé e depois aborta em `towerLight: GLB em falta`. Isso já
  acontece em `c3df70f` (confirmado com uma árvore de trabalho limpa desse commit), pelo que não vem
  desta alteração; o relé é dos últimos modelos verificados antes da paragem.
- Ensaio no navegador (Playwright, projeto novo, vista «Visualização 3D», aproximação de 26 passos):

  | Gesto | Resultado lido na store |
  |---|---|
  | STOP premido / solto | `stopPressed: true` → `false` (com a simulação parada) |
  | TEST premido / solto | `testPressed: true` → `false` |
  | corpo com a simulação parada | nada (correto) |
  | corpo em RUN | `tripped: true` |
  | RESET com o relé disparado | `tripped: false` ao premir |
  | TEST em RUN | `testPressed: true` |

  As capturas mostram o STOP a mover-se (≈ 120 px de diferença no botão) e o RESET saliente com o
  relé disparado (≈ 450 px), sem erros JavaScript.

## Limites

- O CAD não tem peça própria para o TEST: a zona de clique segue o cursor de ensaio gravado na frente.
- O modelo é de pinos (versão de montagem direta no contactor); a versão de parafusos tem o mesmo
  número e ordem de bornes, mas outra geometria — precisaria de CAD próprio.
- Os bornes inferiores `14/22` que a etiqueta mostra não são bornes do relé (são a passagem do
  contactor, como o A2): não foram expostos.

## Evidência

- `dc-simu` — testes acima e capturas em `/home/user/inspect-3ru/` (ensaio local, fora do repositório).
- Registo de decisão: [[Decision-Log|DC-ADR-079]].
