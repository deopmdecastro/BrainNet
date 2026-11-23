---
project_id: BN-DCSIMU-001
type: validation
status: TESTED
created: 2026-11-23
updated: 2026-11-23
tags: [dc-simu, maquete, estampagem, QE1, cabos, tubos, fichas, bucins, renderizacao, performance]
---

# QE1 na lateral da mesa + renderização e organização dos cabos

## Pedido (23 Nov, 20:27)
Garantir os melhoramentos de cabos, tubos, fichas, organização, calhas e marcações dos commits anteriores; o quadro da maquete deixa de ficar debaixo da mesa e passa para a lateral; melhorar a renderização dos cabos.

## O que se encontrou
1. **Cabos não apareciam.** O cálculo 3D dos 206 cabos da maquete demorava **168 s** (worker); o watchdog de 10 s (`55b54fd6`) matava-o e a cena ficava sem cabos («Não foi possível calcular os cabos»).
2. **Fichas CEE no chão.** `ceePlug16A` não estava na lista de aparelhos com pivô 3D livre (`panelBounds.ts`): era posta pelas coordenadas do esquema e os contactos XS↔F atravessavam a nave em diagonal.
3. **Entradas por bucins tratadas como colisão.** As paredes do quadro eram sólidas (só havia exceção para bucins de fundo de motores) → cabos para o QE1 e saídas do QGD eram substituídos por atalhos diagonais.
4. **Percursos desenhados através de sólidos:** 99 de 140 cabos (sobretudo através do tampo; calha `cabinet-duct-mid` inexistente; cabos a subir pela ilha S7-300; tubos de ar através do tampo e do FRL; pilar com caixa de colisão da placa de base a toda a altura).

## Alterações (dc-simu)
| Commit | Resumo |
|---|---|
| `82652678` | Relaxação com broad-phase em grelha; remoção de bicos com verificação por segmento em cache; traçado provisório + completo em paralelo (sem cena vazia); bucins declarados abertos nas paredes; pilar com obstáculo real |
| `136ebc3e` | Ficha CEE 16A com pivô 3D livre (encaixa na tomada) |
| `d9c35082` | QE1 de pé na **lateral esquerda** (plinto, à frente do suporte do FRL, porta a abrir para fora, bucins na face virada para a mesa); planeador 2D rente ao tampo para os cabos de campo; dentro do QE1 pela calha B\|C; 3G2,5 pelos bucins M25 do QGD; F-MAQ pelo bucim de topo do QE1; tubos de ar por fora do tampo |

Porque esquerda e não direita: à direita os cabos de campo passavam por baixo da HMI e o QE1 tapava o ecrã; a esquerda respeita também o pedido de 22 Nov («lado esquerdo, porta abre para fora»).

## Evidência
- Tempo do traçado (Node, 206 cabos): **168 s → 19 s** completo; **1,8 s** provisório. No browser os cabos aparecem e o erro deixou de surgir.
- Percursos desenhados com troços em colisão: **99 → 60** de 140 (restantes listados abaixo; o encaminhador repara-os).
- `npm test` **900 PASS**; 101/108 suites autónomas (as 7 falhas são anteriores a 19 Nov); `npm run build` OK; ESLint limpo.
- `test:maquetes` com verificações novas: QE1 fora do tampo, assente no plinto, dobradiça do lado de fora, bucins virados para a mesa, lado oposto à HMI, à frente do suporte do FRL; ficha CEE com pivô livre.
- Capturas (`scripts/stamping-qe1-side-ui.mjs`):

![[evidence-qe1-lateral/overview.png]]
![[evidence-qe1-lateral/qe1-side.png]]
![[evidence-qe1-lateral/qe1.png]]
![[evidence-qe1-lateral/cables-top.png]]

## Pendências
- Relaxação cabo-a-cabo já não é bit-a-bit igual à anterior nos feixes densos (aproximação de 2 mm); validado visualmente e pelos testes de geometria.
- Ainda com troços a corrigir pelo encaminhador: rotas internas do QGD (subida atravessa calhas DIN), 1.ª perna dos botões da caixa de comando, aproximação aos bornes dos módulos S7-300, tubos de vácuo do ejetor.
- 19 s continua a ser o tempo do traçado completo; num telemóvel lento o provisório fica mais tempo no ecrã.
- Projetos gravados antes desta versão mantêm o QE1 antigo; é preciso remontar a maquete.
- Testes com browser (`*-ui-smoke.mjs`) além das capturas não foram corridos; aprovação visual pendente.
