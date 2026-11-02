---
project_id: BN-DCSIMU-001
type: audit
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, editor3d, luzes, ecras, botoes]
---
# Auditoria — efeitos dos elementos vs. editor 3D — 2026-10-26

Regra pedida: todo o efeito aplicado a um elemento tem de ser editável no editor.

## Luzes
| Efeito | Antes | Agora |
| --- | --- | --- |
| Cor base, intensidade, tipo LED/lâmpada, condição, pisca | editável | igual |
| Paleta de cores do utilizador | só 9 cores fixas | + qualquer cor («+ cor») |
| **Várias cores na mesma luz** | não existia | **regras «Cores por condição»** (1.ª verdadeira ganha, pisca por regra, reordenar) |
| Cor/intensidade por estado | no modelo de dados, sem interface | campos no separador Estados |
| Brilho (halo), tamanho, tempos de subida/descida | só no código | secção «Brilho» (ligar/desligar, tamanho, ms) |
| Validação | — | cor inválida = erro; variável inexistente = aviso |

Prioridade da cor: estado do componente > regras de cor > condição simples > apagada (`src/catalog/lightLook.ts`).

## Ecrãs
Já editáveis: área, face, resolução, fundo, texto, linhas com condição, ligado quando, retroiluminação (variável). **Novo:** cor e força da retroiluminação (antes fixas em verde-menta a 50 %).

## Botões
Já editáveis: tipo, peça/objetos, eixo, deslizar/bascular, ângulos ON/OFF, pivô, sensação (mola/suave/instantâneo), duração, ações ao clicar e ao manter premido, seletores. Sem alteração.

## Pendente / limites
- Os componentes procedurais do painel (lâmpada, torre, botoneira, contactor) têm brilho e mola definidos no código, não no editor: só os componentes de catálogo (editor 3D) usam estes campos.
- Os controlos de retroiluminação só aparecem para ecrãs de texto; o LCD de multímetro usa os valores predefinidos.
- Sem verificação visual (sem WebGL no sandbox).
- Testes: `npm run test:glow` (29 verificações: regras, prioridades, cores inválidas, brilho).
