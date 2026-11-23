---
project_id: BN-DCSIMU-001
type: validation
status: TESTED
created: 2026-11-23
updated: 2026-11-23
tags: [dc-simu, maquete, estampagem, QE1, suporte, quadro, cabos]
---

# QE1 com as costas encostadas às pernas da mesa (suporte)

## Pedido (23 Nov, 21:41)
As costas do quadro da mesa devem estar encostadas às pernas da mesa; criar um suporte para isso.

## Alterações (dc-simu)
| Commit | Resumo |
|---|---|
| `50e1db2a` | Quadros rodados 90° em Y: paredes, bucins e porta (encaminhador de cabos) e caixa de arrasto acompanham a rotação |
| `0d06d0db` | QE1 rodado −90°: costas contra as pernas esquerdas, porta para fora a abrir para a frente; **suporte** de duas travessas de perfil 40 com esquadros aparafusadas às faces exteriores das duas pernas (por baixo do FRL); sai o plinto e as calhas de descida; chicote de campo direto da calha esquerda ao bucim M32 do topo; F-MAQ pelo M25 do topo; KS1/K1/K2 com ligação interior |

Implementação: o interior do QE1 continua desenhado no referencial do quadro (`qe1Local`) e é rodado como um todo (`qe1ToWorld`); a cablagem interior é calculada nesse referencial e convertida no fim — o desenho interior validado não mudou.

## Evidência
- `test:maquetes` (9) com verificações novas: QE1 rodado −90°, costas a ≤ 5 mm do suporte, 2 travessas na face exterior das pernas e a ligar perna da frente à de trás, travessas dentro da altura do quadro, bucins no topo, à frente do FRL, oposto à HMI, interior rodado; arrasto do QE1 leva o interior.
- `npm test` 900 PASS; 101/108 suites autónomas (as 7 falhas anteriores a 19 Nov); `npm run build` OK; ESLint limpo.
- Auditoria de percursos: nenhum cabo atravessa as paredes, o suporte ou o FRL.

![[evidence-qe1-suporte-pernas/qe1-door.png]]
![[evidence-qe1-suporte-pernas/qe1-mount.png]]
![[evidence-qe1-suporte-pernas/qe1-support.png]]

## Pendências
- Projetos já gravados mantêm o QE1 anterior: remontar a maquete.
- As travessas ficam escondidas atrás do quadro na maior parte das vistas (visíveis por trás e pelo topo).
- Pendências de percursos da validação anterior mantêm-se ([[Validation-2026-11-23-QE1-Lateral-Renderizacao-Cabos]]).
- Aprovação visual na app pendente.
