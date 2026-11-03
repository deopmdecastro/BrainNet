---
project_id: BN-DCSIMU-001
type: task
status: IN_PROGRESS
created: 2026-11-03
updated: 2026-11-03
tags: [dc-simu, rele-termico, 3ru1116, test, luz, h3, cover, 3d]
---
# Tarefa 2026-11-03 — TEST do relé térmico: luz vermelha no 3D + cover

## Pedido do utilizador

- O botão TEST do relé térmico de segurança para o motor não funciona: no IEC, quando aberto para o motor, acende a luz vermelha; no 3D não.
- Resolver também o problema do cover.

Preferência: trabalhar no cofre (BrainNet) e depois commit + push em ambos os repositórios.

## Contexto lido

- [[Validation-2026-11-02-Test-Reset-Rele-Termico]] e [[Task-2026-11-02-Test-Reset-Rele-Termico]]: lógica de TEST (disparo retido, H1 OFF, H3 ON, KM1/M1 parados) implementada e testada; 12 verificações físicas UI e 21 de lógica PASS.
- [[Task-2026-11-03-Repor-Reset-Rotativo-Rele-Termico]]: RESET rotativo reposto em `b8d3538`; TEST mantido.
- Design-Principles e princípios de interação 3D (cursor normal, atuação nos comandos do equipamento).
- Zonas de hit em `src/three/importedFinish.ts` (`THERMAL_RELAY_CONTROLS`) e `importedActuationPatch` / `thermalSync`.
- Luz H3 (pilotLightAd22) em 3D: `c.state.on` via `isLoadPowered` no motor elétrico; no IEC via RT do commands + condição PLC `!I0.0+I0.3`.

## Diagnóstico preliminar

- Testes unitários/smoke de thermal-controls e native-sim continuam a passar (disparo, retenção, projeção IEC, H3 no motor de commands).
- Possível causa do “não funciona no 3D”:
  1. Zona de clique do TEST demasiado estreita no GLB (y 52–63 mm) → toque/clique falha em mobile/tablet ou com câmera afastada.
  2. Discrepância visual entre o estado elétrico (terminais 97-98 → I0.3 → Q0.3 → H3) e a re-renderização do PilotLightAd22 (emissive/GlowHalo) se o componente não invalidar o frame.
  3. Cover: fallback nativo (`withNativeCover` + `nativeFallbackPreview`) ou captura de capa de projeto/componente pode estar a falhar em alguns fluxos (preview vazio ou imagem estática desatualizada).

## Alteração proposta (código)

1. Alargar as zonas de hit do 3RU1116 (STOP / RESET / TEST) em `importedFinish.ts` para melhorar a taxa de acerto em toque e clique, sem sobrepor as peças.
2. Manter a lógica elétrica e de sync intacta (já validada).
3. Cover: confirmar que `withNativeCover` e `ProjectCover` aplicam o fallback do projeto nativo e que a geração de preview não deixa capas vazias; se necessário, reforçar o fallback visual.

## Critérios de aceite

- [ ] Premir TEST no 3D (zona do cursor de ensaio) dispara, apaga H1, acende H3 vermelho e para o motor, igual ao IEC.
- [ ] Largar TEST mantém o disparo; RESET (arrasto) rearma.
- [ ] Cover do projeto nativo (e outros) aparece de forma consistente na lista «Meus projetos».
- [ ] `test:thermal-controls`, `test:native-sim` e typecheck continuam PASS.

## Notas

- Não alterar o contrato didático DC-TEST-RESET-01 nem o modo M/A.
- Após merge, atualizar o pointer do submodule no BrainNet e publicar.
