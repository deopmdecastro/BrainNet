---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_TESTED
created: 2026-10-29
updated: 2026-10-30
tags: [dc-simu, motor, bucim, cabos, 3d]
repos: [dc-simu, BrainNet]
---

# Motor — furo do bucim e curvas dos cabos

## Objectivo
Criar o **furo real do bucim M20** na caixa de bornes do motor SEW e melhorar as **curvas dos cabos** no interior do compartimento.

## Evidência (utilizador)
- Cabos a entrar na caixa sem passagem limpa pelo bucim
- Curvas irregulares / sobrepostas dentro da caixa
- Ponteiras demasiado grandes nos estojos (corrigido em paralelo: olhais nos bornes do motor)

## Plano
1. **Parede frontal** construída à parte (plano XY extrudido em Z) com **furo circular** Ø20 mm centrado em `MOTOR_GLAND`
2. Restantes paredes em U (sem faixa frontal)
3. Bucim oco: tubo + furo interior + aro interior + porca + cúpula, alinhados ao furo
4. Roteamento 3D: eixo do bucim → interior → fan-out suave → borne
5. Cabos de força/PE no motor: `toEndType = 'ring'` (olhal sob a porca)
6. `native-partida-direta-v5` para reseed

## Ficheiros
- `src/three/motorTerminalBox.ts`
- `src/three/wireGeometry3D.ts`
- `src/project/nativeProjects.ts`
- `src/project/nativeMotorMeter.ts`
- `src/auth/localBackend.ts`

## Critério de aceite
- [ ] Furo visível na parede frontal (passa a parede de 5 mm)
- [ ] Cabos atravessam o bucim sem “furar” a chapa solidamente
- [ ] Curvas interiores suaves, sem ziguezague
- [ ] Olhais nos bornes U1/V1/W1/PE do motor

## Seguimento 2026-10-30

Os commits `1775647`/`9075c72` deixaram 7 falhas em `test:native-wires-3d` (cabos pela carcaça, cabos colados no furo, olhal fora do eixo). Corrigido mantendo o furo real — ver [[Validation-2026-10-30-Inspecao-Plataforma-Tablet-Barras]].
