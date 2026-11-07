---
type: validation
status: IMPLEMENTED_LOCAL
created: 2026-11-07
updated: 2026-11-07
tags: [dc-simu, cabos, motor, multimetro, validacao]
---
# Sondas do multímetro — desvio pela margem do quadro

Correção implementada em resposta à imagem do projeto nativo de partida direta. Incluída no commit `5c2dec1`, enviado para `dc-simu/main` em 7 de novembro de 2026 após o pedido explícito «commit e push». Sem alterações à conta do utilizador.

## Causa e alteração

`buildMotorGlandBody3D` usava o percurso dos alimentadores para todas as terminações no motor. As sondas também desciam até ao corredor inferior e contornavam o quadro pela esquerda, mesmo com o multímetro à direita. O problema torna-se evidente quando se baixa o motor: o desvio fica livre de obstáculos e permanece no resultado.

As sondas sem pontos 3D manuais passam a usar uma curva Bézier entre a ficha do instrumento e a aproximação ao bucim. Mantêm tangentes alinhadas nas extremidades, a passagem existente pelo bucim M20, os canais separados dos condutores de potência e o percurso interior até ao borne. Os percursos manuais continuam no ramo anterior. Os alimentadores do quadro não usam a nova curva.

Ficheiros da aplicação: `src/three/wireGeometry3D.ts` e `scripts/native-wires-3d-smoke.ts`.

## Reprodução e evidência

Montagem sintética a partir de `buildNativePartidaDireta()`, com o motor deslocado 330 px para baixo no esquema e o multímetro na posição de origem. Comparação com o código anterior em `abd9eae`, usando as mesmas componentes, obstáculos e extremidades:

| Sonda | Comprimento anterior | Comprimento corrigido | Menor X anterior | Menor X corrigido |
| --- | ---: | ---: | ---: | ---: |
| Vermelha | 22,82 | 7,43 | -3,51 | 2,83 |
| Preta | 22,98 | 7,32 | -3,54 | 2,84 |

Valores em unidades da cena, medidos na polilinha individual; não são uma medição física do cabo instalado. A comparação confirma que desaparece a volta à esquerda do quadro. Log sintético local: [comparação geométrica](../../runtime/cables-moved-comparison.log).

O teste de regressão cobre as duas sondas, tanto no cálculo individual como no cálculo coordenado: não regressam ao quadro, o comprimento fica limitado à ligação instrumento–motor e a entrada pelo bucim permanece. A suíte existente verifica também colisões entre 43 cabos, aparelhos e chapa; separação no bucim; tangentes; rotação, espelhamento e escala do motor; curvas e pontos manuais.

## Verificações

- `npm run test:native-wires-3d`: passou, incluindo as 12 novas verificações do motor deslocado.
- `npm test`: terminou com «TODOS OS TESTES PASSARAM». `npm run build`: TypeScript, Vite e geração PWA concluídos; 126 entradas na precache. Os avisos existentes de dimensão dos bundles continuam.
- `git diff --check`: passou.
- `npm run check` da raiz: mantém os nove problemas documentais anteriores, relativos a propriedades em falta e imagens de notas antigas. Esta nota não acrescenta erros.
- Revisão no navegador local do traçado frontal, com a montagem nativa e com o motor deslocado. A montagem temporária, o módulo anterior usado na comparação e o script de diagnóstico foram retirados.

Registos em `runtime/`, ignorados pelo Git: `cables-tests-final.log`, `cables-core-tests.log` e `cables-build-final.log`.

## Âmbito e pendências

O cálculo é feito ao abrir a vista 3D; não exige nova versão do projeto nativo nem substitui ligações guardadas. Uma página já aberta precisa de carregar o código atualizado. Pontos manuais explícitos mantêm-se sob controlo do utilizador. O envio para GitHub foi autorizado no pedido posterior «commit e push»; não foi executado um deploy nesta entrega.

[[Design-Principles]]
