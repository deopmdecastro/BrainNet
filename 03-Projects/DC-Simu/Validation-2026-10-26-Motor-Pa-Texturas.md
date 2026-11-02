---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, qa, motor, 3d, editor-elementos, texturas, bornes]
---
# Motor: pá de três pás, caixa de bornes e biblioteca de texturas — 2026-10-26

## Pedido

1. Melhorar o motor:
   - incluir uma pá de três pás que roda quando o motor está a funcionar;
   - poder mostrar ou ocultar a pá com o olho 👁️.
2. Melhorar a textura: criar uma biblioteca de texturas reais no editor de elementos.
3. Corrigir a placa de ligação e os bornes do motor, que não estavam corretos.

## Problemas encontrados

| # | Problema | Causa |
| --- | --- | --- |
| 1 | Os bornes e a placa estavam fora da caixa | No CAD (`DRN80MK4-B3.glb`), a caixa está em x = 46…156 (centro 101 mm). O código usava o centro do motor (x = 132): 31 mm de erro. |
| 2 | Placa escura solta, etiquetas apertadas, sem porcas, PE ou bucim | Cortava-se o topo e desenhava-se uma placa de 70 × 65 mm no centro |
| 3 | A ventoinha do projeto ficava para lá do veio | O deslocamento estava fixo (0,78 un.) e não se baseava no CAD |
| 4 | Os materiais do editor só tinham cor e mapas soltos | Não havia biblioteca, padrão em mm, UV físico nem forma de substituir os materiais do GLB |

## Implementação

**DC-Simu, commits `52ddf3c` e `9448ed0` (carimbo #58).** Detalhes em [MOTOR-PA-BORNES-TEXTURAS.md](./dc-simu/docs/MOTOR-PA-BORNES-TEXTURAS.md).

### Caixa de bornes (DC-ADR-033)

- **Fonte única:** `motorTerminalLayout.ts`, em dados puros, com:
  - a placa isolante de 62 × 46 × 8 mm (centro x 101, z −7);
  - seis pernos M4 com anilha e porca, em passo de 18 mm;
  - fila W2 · U2 · V2 atrás e U1 · V1 · W1 à frente;
  - o PE com símbolo e o bucim M20.
- **Geometria:** `motorTerminalBox.ts` gera as paredes, o fundo, a junta, a placa com etiquetas, os pernos, o PE e o bucim. O CAD é cortado em y = 104.
- **Bornes:** os bornes elétricos (`REAL_TERMINALS.motor3ph`), as pontes Y/Δ (`MotorTerminalBoard3D`) e o rascunho do editor derivam todos da mesma disposição.

### Pá do veio (DC-ADR-034)

- **Geometria:** três pás elípticas, Ø110 mm, com 28° de passo, sobre o veio (cubo em x = 256).
- **Rotação:** acompanha `rpmVisual` e o sentido.
- **Projeto:** o grupo novo «Peças visíveis» nas propriedades tem um olho:
  - motor integrado: `state.showFan`;
  - componentes do catálogo: `state.hiddenParts`, para as peças marcadas «Peça opcional».
- **Editor de elementos:**
  - secção «Rotação contínua» por peça (eixo, voltas/s, fonte `$rpm`/`$run`/variável, inverter, «Testar rotação»);
  - opções «Peça opcional (olho)» e «Só no editor» (a peça não vai para o GLB publicado).
- **Migração dos rascunhos do motor:**
  - os bornes antigos passam para os pernos;
  - as pontes antigas são substituídas;
  - a pá é acrescentada uma única vez e não volta se o utilizador a eliminar;
  - a migração é idempotente.

### Biblioteca de texturas reais (DC-ADR-035)

- **Conteúdo:** 15 materiais PBR do ambientCG (CC0), cada um com cor, relevo, rugosidade e, nos metais, metal:
  - Tintas: 2 tingíveis;
  - Metais: 8;
  - Plásticos e borracha: 3;
  - Construção: 2.
- **Ficheiros:** ficam em `public/textures/lib/`, com cerca de 1,2 MB, e são carregados a pedido.
- **Uso no editor:**
  - aplicar ao material atual, ou ⊕ para criar um material novo;
  - «Padrão (mm)» com UV por projeção em caixa;
  - «Relevo»;
  - «Substituir os materiais do CAD» nas peças GLB.
- **Publicação:** as texturas são assadas no GLB.

## Evidência

| Verificação | Resultado |
| --- | --- |
| `npx tsc -b` | Sem erros |
| `npm run test:ci` (com `Monta-Carga.ct`) | Passa (EXIT 0), incluindo o novo `test:motor` com 13 verificações |
| `npm run test:server` | 166 passam, 0 falham |
| `vite build` (heap de 3 GiB) | Concluído; 15 texturas em `dist/textures/lib` |
| `test:terminal-geometry` | 20 modelos e 142 ligações, com o motor em 7 |
| `test:motor-ui` (Playwright) | 12 verificações: pá e «Testar rotação», 15 miniaturas, aplicar e ⊕, olho mostrar/ocultar; sem exceções |
| Percursos UI existentes | `editor3d-ux-ui`, `terminal-geometry-ui`, `editor3d-autodetect-ui` e `editors-sweep-ui` (19): todos passam |
| Capturas revistas (`runtime/motor/`) | Editor com a pá e a biblioteca; projeto em perspetiva (caixa, pernos e porcas, bucim, pá) e vista superior (placa W2 U2 V2 / U1 V1 W1, pontes Y, PE) |

## Estado

| Item | Estado |
| --- | --- |
| Caixa de bornes real no motor integrado | implementado e testado |
| Pá de três pás com rotação e olho | implementado e testado |
| Rotação contínua e peças opcionais no editor | implementado e testado |
| Biblioteca de texturas reais | implementado e testado |
| Motor já publicado no catálogo | preparado: é preciso abrir o rascunho (migrado automaticamente) e publicar de novo para assar a nova caixa e a pá |
| Aprovação pelo responsável | pendente |
| Deploy Vercel | não verificado |

Pendências:
- republicar o motor do catálogo; as versões antigas mantêm o bloco antigo;
- migração Supabase e gateway de pagamento (pedido anterior);
- revogar o token GitHub usado nesta sessão.
