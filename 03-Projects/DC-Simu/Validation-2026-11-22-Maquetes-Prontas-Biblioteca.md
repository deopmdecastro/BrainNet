---
type: validation
status: IMPLEMENTED_TESTED_PUSHED
created: 2026-11-22
updated: 2026-11-22
tags: [dc-simu, biblioteca, maquetes, atec, mecatronica, ux, validacao]
---
# «Maquetes prontas»: a bancada ATEC montada num só clique

## Resultado

Novo domínio na Biblioteca de Componentes — **«Maquetes prontas»** — à parte dos quatro
domínios de componentes (Eletricidade, Hidráulica, Pneumática, Serralharia &
Infraestrutura). Um clique num cartão monta a bancada inteira: base ranhurada,
estrutura e todos os componentes nos seus devidos lugares, **num único passo de
histórico** (Ctrl+Z desmonta tudo).

Publicado no `dc-simu` (`f73500c2`), com testes próprios em `test:ci` e `test:ci:fast`.

## O que o domínio contém

| Maquete | Conteúdo | Componentes |
| --- | --- | --- |
| Maquete ATEC · estampagem e transferência | Base ranhurada 700 × 500 × 20 + as 27 peças do relatório ATEC / Guião 1185 (21 tipos do catálogo) | **28** |
| Bancada ATEC · base e estrutura | Base ranhurada + 4 calhas perimetrais + poste de perfil 40 × 40 | **6** |

A maquete completa coloca, nas cotas do relatório: magazine de gravidade e Cilindro 1
(com FC 1, S. INDUTIVO e S. OTICO), manipulador rotativo BR1 com motorredutor M1,
mesa e prensa com gaveta (FC 2, Cilindro 4 e Cilindro 3), 3 rampas de descarga
(METALICA/PRETA/BRANCA) sobre pilares, 2 ilhas de eletroválvulas C1A/C2A, gerador de
vácuo C4A, coluna luminosa, consola KTP700, pupitre de 6 operadores, 4 calhas técnicas
e o poste de perfil.

## Decisão de arquitetura: maquete ≠ componente

Uma maquete **não** é um `ComponentType` nem entra em `TEMPLATES`. É um *macro* que cria
outros 28 componentes:

- o catálogo exige, por tipo, GLB/bornes/capa WebP/rascunho — invariantes verificados por
  `test:builtin-sync` (1332 verificações) e `test:library-covers-ui`, que não fazem sentido
  para uma montagem composta;
- o domínio `maquetes` tem subgrupos com `maquetes: ReadyMaquette[]` e `items: []`, pelo
  que **não altera a contagem de componentes** (204) nem a hierarquia existente.

Ficheiros novos: `src/electrical/readyMaquettes.ts` (registo + cotas partilhadas
`benchBaseUnits`/`benchPartUnits`), `scripts/ready-maquettes-covers.mjs` (capas),
`scripts/ready-maquettes-smoke.ts`, `scripts/ready-maquettes-ui-smoke.mjs`,
`public/maquetes/*.webp`.

## Fluxo de inserção

`useSimStore.insertReadyMaquette(id, at?)`:

1. um só `commitHistory()` e um só evento («*Maquete ATEC … montada: 28 componentes …*»);
2. cria a base `mecSlotPlate` e assenta-a no chão do Painel 3D
   (`panel3DPosition = benchBaseUnits(px, py)`, 1 px do esquema = 2 mm);
3. cria cada peça de `stampingBenchLayout()` com `state` da maquete (etiquetas B1/B8,
   ilhas C1A/C2A, gaveta `facing: 'z-'`, comprimentos de calha/pilar) e
   `panel3DPosition = base + cota mm × 0,01`;
4. seleciona os 28 componentes (movem-se/ajustam-se em bloco), enquadra a vista 3D na
   bancada acabada de montar e devolve os IDs criados.

`addComponent()` ganhou a opção `{ history, events, state }` (por omissão igual ao
anterior) para que as inserções em lote não criem 28 passos de histórico nem 28 eventos.

## Interface

- Aba «Maquetes» na barra de domínios + secção `data-library-domain="maquetes"`;
- cartões grandes (`data-maquette="…"`) com o render da própria aplicação (imagem 400²,
  gerada por `npm run build:maquettes-covers` a partir da ação real de montagem), nome,
  descrição, contagem de componentes e botão **MONTAR**;
- o subgrupo abre expandido (não está na lista de grupos recolhidos por omissão);
- a pesquisa filtra por nome/descrição da maquete;
- as 22 peças individuais da maquete continuam nos seus domínios actuais e o inspetor da
  base mantém o botão «Montar maquete completa sobre esta base».

## Verificações

| Verificação | Resultado observado |
| --- | --- |
| `npm run test:maquetes` | 5/5 — domínio próprio no fim da lista e sem itens de catálogo; peças/tipos/capas declarados (21 tipos, todos `MECHATRONICS_TYPES` com 3D); 27 peças + base = 28; inserção com **1** passo de histórico, posições iguais às cotas (±1e-6), estados aplicados, undo/redo; TAGs em série (BAS1/BAS2, CAL1…CAL8), uma só folha; modo demonstração e id inválido bloqueados |
| `npm run test:maquetes-ui` | 22/22 — cinco domínios com «maquetes» no fim; cartão visível com capa carregada (400 px); 1 clique → 28 componentes, todos com posição 3D, 1 passo de histórico, 28 selecionados, evento registado, inspetor «28 elementos selecionados», BAS1 presente; desfazer → 0, refazer → 28; 204 componentes continuam no catálogo e 0 itens no domínio das maquetes; sem exceções React/WebGL |
| `npm run test:mechatronics` | 13/13 (as 22 peças continuam nos domínios onde estavam) |
| `npm run test:mechatronics-ui` | 31/31 no Painel 3D |
| `npm run test:builtin-sync` | 1332 verificações OK (204 integrados, 84 com GLB) |
| `npm run test:library-covers-ui` | Aprovado (12 verificações) — a biblioteca continua a não pedir GLB e as maquetes não entram no índice de capas |
| `npm run test:style` | Aprovado |
| `npm run test:industrial` | 8/8 (verificação 5 passou a excluir o domínio `maquetes` da contagem de componentes) |
| `tsc` sobre o subgrafo alterado | 0 erros (inclui `readyMaquetes.ts`, `factory.ts`, `useSimStore.ts`, `Sidebar.tsx`; ver nota do ambiente de 2 GB) |

## Capturas

Em `Evidence-2026-11-22-Maquetes-Prontas/`:

- `biblioteca-maquetes-prontas.png`: o domínio na biblioteca, com os dois cartões.
- `maquete-montada-um-clique.png`: a bancada acabada de montar num clique (28 objetos,
  vista enquadrada automaticamente, BAS1 no inspetor).
- `capa-atec-estampagem.webp`, `capa-atec-bancada.webp`: as capas publicadas.

## Como experimentar

1. Abrir um projeto e ir a **Biblioteca → aba «Maquetes»**.
2. Clicar em **MONTAR** no cartão «Maquete ATEC · estampagem e transferência».
3. A bancada aparece montada no esquema e no Painel 3D, com os 28 objetos selecionados.
4. `Ctrl+Z` desmonta; `Ctrl+Y` volta a montar.

## Pendências

- A cablagem e a tubagem da bancada continuam a não ser criadas (a maquete monta a
  mecânica, os sensores e os bornes; os fios ficam por fazer, como no botão do inspetor).
- Novas maquetes (outras bancadas didáticas) entram no registo `READY_MAQUETTES` com as
  suas peças, capa e descrição — a biblioteca e o store não precisam de alterações.
- Não foi feito deploy; a publicação é feita no pacote normal de release.
