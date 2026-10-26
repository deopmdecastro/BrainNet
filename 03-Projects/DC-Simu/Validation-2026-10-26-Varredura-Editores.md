---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, qa, ladder, grafcet, esquema-3d, varredura]
---
# Varredura dos editores — Esquema 3D, Ladder e GRAFCET — 2026-10-26

## Pedido

Rever os ambientes de edição e criação do esquema 3D, do Ladder e do GRAFCET, identificar o que pode ser melhorado e implementar as correções e melhorias.

## Problemas encontrados

| # | Editor | Problema | Causa |
| --- | --- | --- | --- |
| 1 | Ladder | O lint marcava todos os endereços Siemens (`I0.0`, `Q0.1`) como inválidos e a deteção «lido mas nunca escrito» nunca disparava | `VALID=/^[IQMTC]\d{1,2}$/` só aceitava o formato antigo (`I1`, `M9`); os aliases (`M9` ≡ `M1.0`) não eram normalizados |
| 2 | Ladder | O ícone de «Criar primeira network» não se via (azul sobre azul) | Regra CSS do estado vazio aplicava a cor a todos os `svg`, incluindo o do botão |
| 3 | Ladder | Contactos P/N (flanco) avaliados de forma incorreta quando um contacto anterior falhava | `evalBranch` fazia curto-circuito e não atualizava a memória de flanco |
| 4 | Ladder | Faltavam SR/RS, CTUD e NOT no motor (paleta marcava «bloco ainda não suportado») | Não implementado |
| 5 | GRAFCET | Duas etapas ativas a fazer S e R na mesma saída: resultado dependia da ordem | Sem regra de prioridade nem registo |
| 6 | GRAFCET | «Gerar Ladder» substituía o Ladder sem mostrar o que mudava | Sem diff |
| 7 | Esquema 2D | No `safetyRelay`, o borne S52 estava sobre o S12 | Posição implícita `x 0.3 / y 0` herdada |
| 8 | Esquema 3D | Banda de linhas ao olhar de frente | A grelha do chão, vista de perfil, colapsava numa faixa |
| 9 | Esquema/GRAFCET | Textos de estado vazio enganadores («O esquema 3D está vazio» no 2D; listas vazias com filtro inexistente) | Mensagens fixas |

## Implementação (DC-Simu, commit `b536b9e`, carimbo #53)

- **Lint Ladder** (`src/ladder/ladderLint.ts`): `canonicalAddress` / `isLadderBitAddress` exportados; endereços normalizados (`I1` → `I0.0`). As mensagens mostram o endereço como aparece no diagrama (`M9 (≡ M1.0)`). LADDER-LINT-02: com a Tabela de Tags, endereço usado e não declarado → info `undeclared:X`; saída declarada sem escritor → aviso `untraced:X`. Novos avisos: SR/RS sem reset, ramo só com NOT, CTUD sem CD.
- **Motor Ladder** (`src/ladder/ladderEngine.ts`): endereços com ponto aceites; ramos avaliados sem curto-circuito (memória de flanco correta); NOT inverte o RLO; bobinas SR (set dominante) e RS (reset dominante) com `resetAddress`; contador CTUD com `downAddress`, limite 32767.
- **Paleta, diagrama e diálogo** (`ladderDnd.ts`, `LadderEditor.tsx`, `NetworkDiagram.tsx`, `LadderElementDialog.tsx`): NOT, SR, RS e CTUD arrastáveis, desenhados (pinos CU/CD/R, «R: endereço») e editáveis.
- **Motor GRAFCET** (`src/grafcet/engine.ts`): histórico das últimas 30 transições (`history`, com tempo e marca de forçada); conflitos S/R simultâneos com prioridade ao RESET e registo em `conflicts`.
- **Simulador GRAFCET** (`GrafcetSimPanel.tsx`): alerta de conflito, botão «Forçar» nas transições à espera (não em STOP) e secção «Histórico».
- **Diff GRAFCET → Ladder** (`src/grafcet/ladderSync.ts`, `GrafcetEditor.tsx`): `diffGeneratedLadder` / `describeLadderDiff`; ao atualizar mostra as networks adicionadas/alteradas/removidas e pede confirmação; sem diferenças avisa «O Ladder já corresponde ao GRAFCET — nada a atualizar».
- **Esquema** (`src/electrical/factory.ts`): S52 do `safetyRelay` com posição explícita; projetos guardados migrados em `upgradeRealInterfacePositions`. No 3D a distância mínima entre bornes já era 9,06 mm (`safetyRelay`) e 12,31 mm (`motor3ph`): não havia sobreposição 3D.
- **UI** (`index.css`, `Panel3D.tsx`, `panel3DEditing.ts`, `GrafcetEditor.tsx`, `Toolbar.tsx`): ícone do botão visível; grelha do chão escondida abaixo de 10° de inclinação; mensagens de estado vazio corretas; títulos de «Gerar Ladder» clarificados.
- **Testes**: `scripts/editors-sweep-smoke.ts` (60 verificações, primeiro em `test:ci`) e `scripts/editors-sweep-ui-smoke.mjs` (`test:editors-sweep-ui`, 19 verificações Playwright).

## Evidência

| Verificação | Resultado |
| --- | --- |
| `tsc -b` | passa |
| `test:editors-sweep` | 60 verificações OK |
| `test:ci` (Node 22.23.4) | sai com 0 (885 linhas PASS) |
| `vite build` | passa |
| `test:editors-sweep-ui` | 19 verificações OK |
| `test:grafcet-ui`, `test:editor3d-ui` (após a última alteração) | passam |
| `grafcet-modals-ui`, `grafcet-construction-ui`, `blocks-ui`, `editor3d-autodetect-ui`, `terminal-geometry-ui`, `grid-ui` (antes do ajuste final das mensagens do lint) | passam |
| Capturas de ecrã dos editores | revistas manualmente, sem defeitos |

## Estado

- Implementado e testado: itens 1–9.
- Não aprovado: falta a validação por Deogracia de Castro no navegador.
- Pendente: LIMIT/SCALE, JMP/LBL e XOR (LADDER-SIM-03); passo a passo e pontos de paragem no Ladder (LADDER-SIM-02); implementação no Vercel não verificada.
