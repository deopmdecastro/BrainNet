---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_TESTED
created: 2026-11-03
updated: 2026-11-03
commit: 636c0d5
repos: [dc-simu, BrainNet]
tags: [dc-simu, tablet, toolbar, som, ios, capa]
---
# Tablet sem sobreposição, som no telemóvel e capa fiel

## Pedido
O cartão de simulação ficava por cima do botão «Dois canvas» no tablet; a capa do nativo não era fiel; sem som na simulação no telemóvel.

## Contexto reutilizado
[[Task-2026-11-03-Cabos-Nativo-Capa-Tablet]] (transporte sticky e recaptura da capa), [[Task-2026-11-03-Efeitos-Som-Disjuntores-Botoes-Motor]] e [[Task-2026-11-03-Som-Motor-Audivel]] (módulo `src/audio/sfx.ts`).

## Causas e correções
- **Sobreposição:** o transporte `position: sticky` da 1.ª linha tapava o botão «Dois canvas». Passa a irmão normal; as vistas deslizam dentro do seu espaço (`toolbar-spacing.css`).
- **Som:** no iOS só `touchend`/`click` autorizam áudio; o Web Audio fica mudo com o interruptor de silêncio; o contexto pode ficar `interrupted`. Agora: listeners `touchend`/`click`, `navigator.audioSession.type='playback'`, `<audio>` mudo em ciclo, `resume()` fora de `running`. O zumbido do motor passou de 48–95 Hz para 110–180 Hz com filtro mais aberto, porque os altifalantes de telemóvel cortam abaixo de ~150 Hz.
- **Capa:** `Panel3D` excluía da captura os aparelhos fora da chapa (motor, multímetro) mas mantinha os cabos, que ficavam pendurados. O enquadramento passa a ser a união da chapa, de todos os aparelhos e dos cabos; cabos a 1,2× (antes 1,55×). `wire-curves-v7` retira a capa guardada para ser recapturada.

## Verificação
`tsc -b`, `npm test`, `test:wire-curves-refresh`, `test:native-wires-3d`, `test:style`: OK.

## Pendências (não verificado)
Sem dispositivo real nem WebGL aqui: confirmar no tablet que nada tapa «Dois canvas», no iPhone que há som (com e sem interruptor de silêncio) e, depois de abrir o nativo no editor 3D e sair, que a capa mostra motor e multímetro.
