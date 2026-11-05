---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-05
updated: 2026-11-05
tags: [dc-simu, ui, ux, tablet, inspetor, calha-tecnica]
---
# Inspetor da calha no tablet: conteúdo cortado e redimensionamento

## Pedido
O painel lateral (Inspetor) abre no tablet com o conteúdo cortado à direita e o cartão do componente por cima do texto; verificar problemas ao mudar o tamanho da calha. Contexto anterior: tentativas de 2026-11-05 (`92d37ac`, `01a0fc5`, `1d5c1e3`) só mexeram na largura do painel.

## Causa
- `.dc-acc` é uma grelha de 1 coluna `auto`: a coluna crescia até ao conteúdo mais largo e o painel cortava o resto. A linha do comprimento tinha larguras fixas (rótulo 80 + campo 80 + `range` + «mm») e o `range` tem largura mínima própria.
- Caso do ecrã estreito (gaveta de 340 px abaixo de 768 px): só o inspetor era afetado, por isso a correção da largura do painel não chegou.
- Campo numérico controlado: ao escrever «600», o «6» saltava logo para o mínimo (50) e o campo brigava com o teclado.
- Calha vertical dentro do quadro: o limite usava o AABB rodado mas o canto do footprint sem rodar, por isso a calha podia sair da moldura.

## Resultado (dc-simu `826665e`)
- `.dc-acc` com `minmax(0, 1fr)` e filhos com `min-width: 0`; inspetor sem rolagem horizontal; cartão do componente com máscara opaca no topo.
- Medidas da calha: cabeçalho «rótulo + valor» e `range` em linha própria; Largura e Altura com seletor + campo; alvos de toque maiores em `pointer: coarse`.
- `DraftNumber`: aplica ao sair do campo ou com Enter, Esc cancela.
- `resize()` limita o centro da calha (rodada) à moldura do quadro.

## Pendências
- Validar em tablet real (vertical e janela dividida) o Inspetor da calha e do quadro.
- `test:panel-accessories` já falhava antes («perfil guardado no estado»: o teste espera 5,5 mm para perfil desconhecido; a omissão passou a ser 35×7,5). Não tocado aqui.
