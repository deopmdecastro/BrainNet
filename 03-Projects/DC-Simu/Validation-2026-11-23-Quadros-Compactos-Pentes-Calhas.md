---
project_id: BN-DCSIMU-001
type: validation
status: TESTED
created: 2026-11-23
updated: 2026-11-23
tags: [dc-simu, maquete, QGD, QE1, pente, barramento, medidor, calhas, cabos, suporte]
---

# Quadros compactos, pentes encaixados, medidor no perfil e cablagem pelas calhas

## Pedido (23 Nov, 22:12 — com capturas da app)
Organizar as calhas do quadro principal; pentes de barramento estavam fora dos disjuntores — ao usar pente, usar o borne de alimentação do pente; medidor fora do perfil de fixação; quadro principal muito grande e com muito espaçamento; quadro da mesa também grande e com estruturas de suporte; cabos a passar à frente dos componentes nos dois quadros.

## Causas encontradas
- **Calhas verticais do QGD desviadas ~170 mm**: a posição 3D usa canto do esquema + meia largura sem considerar a rotação de 90°; a calha esquerda atravessava as 4 filas (com o chicote PE à frente dos aparelhos) e a direita ficava fora do quadro.
- **Pentes**: disjuntores a 47 mm uns dos outros (o pente tem passo de 18 mm) e alimentação por cabo direto a um dente; o pente 3P servia um só disjuntor.
- **Medidor KWS-306**: 21 mm acima do eixo da calha DIN no quadro nativo.
- **QE1**: sem calhas verticais — subidas/descidas pela frente da fonte e da S7-300; chicote de campo (~75 condutores) não cabia no bucim M32 e era desviado por fora da ilharga.

## Alterações (dc-simu)
| Commit | Resumo |
|---|---|
| `90e216c3` | Diagnóstico: bornes ligados por pente/borne de alimentação encaixado não geram «não conectado» |
| `222ff083` | QGD 800×1000 → **600×800**; calhas verticais nas ilhargas, 5 horizontais; aparelhos juntos por grupos e centrados no perfil (medidor incluído); **pente 1P encaixado em Q1–Q3 + borne de alimentação** (`combBusbarConnector`) alimentado pelo ID_GERAL; Q5 alimentado diretamente |
| `89ed34fe` | QE1 560×660 → **460×560**; calhas 40×40 + **2 calhas verticais**; **consolas** de perfil 40 por baixo (além das travessas nas pernas); **regra de quadro** para toda a cablagem interior; chicote de campo por M50 |

Alteração apenas no QGD da maquete (`stampingWallPanel.ts`); o projeto nativo «Quadro Geral de Distribuição» não muda.

## Evidência
- Continuidade: XB1 → pente → Q1/Q2/Q3 energizados; Q4, Q5, X1.3, X1.6, PM1 energizados; sem avisos «não conectado».
- Auditoria «cabo à frente de aparelho» (volume do aparelho projetado 40 mm para a frente): QGD **2** troços, QE1 **2** troços (antes: chicote de campo e F-MAQ a cruzar fonte e autómato); 0 cabos de campo por fora das ilhargas.
- `test:maquetes` (9) com verificações novas (consolas, tamanho, suporte); `npm test` 900 PASS; 101/108 suites (7 falhas anteriores a 19 Nov); build OK.

Antes / depois do QGD:
![[evidence-quadros-compactos/before-qgd-front.png]]
![[evidence-quadros-compactos/after-qgd-front.png]]
![[evidence-quadros-compactos/after-qgd-pente.png]]
![[evidence-quadros-compactos/after-qgd-medidor.png]]

QE1:
![[evidence-quadros-compactos/after-qe1-front.png]]
![[evidence-quadros-compactos/after-qe1-top.png]]

## Pendências
- As capturas enviadas (20:31–20:33) eram da versão publicada antes das correções de cálculo dos cabos («Não foi possível calcular os cabos»); confirmar na nova versão após o deploy.
- Projetos gravados: remontar a maquete para obter os quadros novos.
- O lado direito das filas do QGD fica livre (reserva); o quadro tem a largura da fila 1.
- 2 troços residuais por quadro (feeders 3G2,5 junto à calha vertical do QGD; alimentação do módulo DO à frente do DI).
