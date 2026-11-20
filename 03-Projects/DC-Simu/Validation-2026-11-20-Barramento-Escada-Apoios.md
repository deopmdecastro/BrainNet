---
type: validation
status: IMPLEMENTED_TESTED_LOCAL
created: 2026-11-20
updated: 2026-11-20
tags: [dc-simu, barramento, escada, montagem, glb, validacao]
---
# Barramento em escada — posição dos apoios de montagem

## Resultado

**No Painel 3D, os apoios já estavam na posição corrigida:** na face traseira, centrados verticalmente para a calha DIN TS35, com gancho superior e trinco inferior. O espaço entre os limites interiores é de 35 mm. Os antigos pés por baixo da base já tinham sido removidos pelo commit `b1a5422`.

**O GLB estava desatualizado.** O commit alterou o gerador e as capas, mas não o ficheiro `public/models/bornes-e-barras/barramento-fases-escada-4p.glb`. Este ainda apresentava os pés antigos, junto à base e distribuídos em profundidade.

Foi regenerado apenas esse GLB, usando `scripts/build-busbar-glb.ts --only barramento-fases-escada-4p`. Não houve alteração da geometria de origem, dos bornes ou da lógica elétrica.

Modelo e evidências guardados no commit `aba0a2c` da aplicação; inclui o carimbo de release local atualizado pelo hook de commit.

## Medições e evidências

No modelo 4P, com 7 bornes por barra:

| Elemento | GLB anterior | GLB atualizado / Painel |
| --- | --- | --- |
| Limites Y dos apoios | −35,5…−32,9 mm | −21,9…+20,5 mm |
| Limites Z dos apoios | −10,5…+10,5 mm | −25…−20,8 mm |
| Posição | Junto à base, frente/trás | Face traseira, a meia altura |
| Correspondência entre GLB e gerador | Não | Sim, vértices comparados com tolerância de 0,0001 mm |

A face traseira do modelo está em Z = −25 mm. O vão DIN vai de Y = −17,5 a +17,5 mm. Estes são ganchos de montagem em calha; a correção das orelhas M4 dos barramentos unipolares é um caso diferente.

- [Frente e traseira do GLB atualizado](dc-simu/docs/validation/stepped-mount/frente-traseira.png).
- [Vista frontal no Painel real](dc-simu/docs/validation/stepped-mount/painel-frente.png).
- [Auditoria antes](dc-simu/docs/validation/stepped-mount/geometria-antes.json) e [depois](dc-simu/docs/validation/stepped-mount/geometria-depois.json).
- [Resultados do Painel real](dc-simu/docs/validation/stepped-mount/painel-results.json).

## Verificação

- Geometria verificada nas variantes 2P/3P/4P, com 4/7/11/16 bornes por barra: **12/12 configurações aprovadas**.
- GLB atualizado comparado com a saída do gerador: aprovado.
- Painel React/R3F real: posição traseira e altura confirmadas; **3 verificações aprovadas**, zero exceções React/WebGL.
- `git diff --check`: aprovado.
- `npm test` da aplicação: executado; 22 falhas em PLC, Easy9 e Hager/porta-fusíveis, os mesmos grupos assinalados na validação anterior dos temporizadores/ATV. Os casos de barramento em escada passam.
- `npm test` do cofre: **45/45 aprovados**.
- `npm run check` do cofre: executado; falha por frontmatter ausente nos README de evidências anteriores, fora desta alteração.

Scripts e logs de auditoria em `dc-simu/runtime/check-stepped-mount*`, `dc-simu/runtime/stepped-mount-*` e `runtime/stepped-mount-root-*`, locais e ignorados por Git.

## Estado

**Preparado:** comparação geométrica e evidências. **Implementado:** sincronização do GLB com a geometria corrigida já usada pelo Painel. **Testado:** configurações e medições acima. **Aprovado/publicado:** sem nova aprovação ou publicação; a confirmação refere-se aos ficheiros locais.
