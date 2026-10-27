---
project_id: BN-DCSIMU-001
type: validation
status: ACTIVE
created: 2026-10-27
updated: 2026-10-27
tags: [brainet, dc-simu, editor3d, catalog, componentes, emergencia, animacao]
---
# Validação 2026-10-27 — Botão de emergência (Metaltex P20AKR / P20ACR)

Trabalho pedido por Deogracia de Castro: o botão de emergência tinha de ficar **na posição e no eixo
corretos** (cabeça e bloco de contactos), premir e encravar de forma **plausível** ao clicar, e **não
mostrar a luz verde + preta** na frente do equipamento («acho que ficava muito bem sem aquela luz»).
Executado no submódulo `03-Projects/DC-Simu/dc-simu` sobre o commit `c44c419`.

## Como foi observado

- Vistas **FRENTE** e **ISO** no editor de componentes (`/admin/editor/<id>`) e no Esquema 3D, em
  Chromium headless (Playwright) a 1440 × 1000 e 390 × 844, com `/api/*` bloqueado.
- Leitura numérica da cena: `window.__ceRig` (só em `vite dev`) → `rig.def.controls`, `rig.vars` e
  `dcsimu_head.matrixWorld.elements[14]` (z da cabeça).
- Clique real do rato (`page.mouse.click`) no cogumelo, para além da verificação por valores.

## Problemas encontrados (antes)

| # | Onde | Observação |
| --- | --- | --- |
| 1 | `modelPaths.ts` | O P20AKR estava com `flipDepth`: a profundidade era espelhada e a «pose base» mostrava o **bloco de bornes à frente** e o cogumelo virado para trás. |
| 2 | `realInterfaces.ts` | Os bornes 21/22 estavam declarados na face **frontal** (z ≈ 0,998), no lado da cabeça. |
| 3 | Frente do equipamento | Havia uma **luz verde + preta** no modelo, sem função elétrica, lida como indicador de estado. |
| 4 | Animação | O controlo `nodes` apontava para a carcaça do GLB: ao premir, a **caixa inteira** descia (aro e bloco de contactos incluídos). |
| 5 | Escala no painel | O curso em milímetros era aplicado em unidades de cena, mas no Esquema 3D o modelo é escalado por `PANEL_UNITS_PER_MM` — o curso saía 100× maior. |

## Alterações implementadas

### `dc-simu`

- `src/three/modelPaths.ts` — P20AKR sem `flipDepth` (o CAD já vem na pose de painel: cogumelo em +Z,
  bloco de contactos atrás, do lado da chapa).
- `src/electrical/realInterfaces.ts` — bornes 21/22 passam a `face: 'back'` com z ≈ 0,0013 (as
  dimensões do encaixe mantêm-se). Mesma correção no P20ACR (chave).
- `src/three/actuatorHead.ts` (**novo**) — separa a **cabeça móvel** do resto do modelo:
  - `extractActuatorHead(root, root)` mede um perfil de raio em **48 fatias** ao longo do eixo Z, escolhe
    o anel de **raio máximo** (o cogumelo) e corta em `min.z + (ringBin + 1) · slice + 0,25 · slice`;
  - as peças acima do corte passam para um nó próprio `dcsimu_head` (idempotente: repetir devolve
    `null`);
  - `ACTUATOR_HEAD_TYPES` lista os dois botões de emergência;
  - `prepareActuatorHead(model, definition, unitsPerMm)` converte `travelMm` para as unidades do
    contentor e devolve `{ definition, head }`.
- `src/catalog/definition.ts` — ao construir o cache do GLB de um tipo em `ACTUATOR_HEAD_TYPES`,
  `extractActuatorHead` deixa a cabeça como nó próprio (sem alterar o GLB publicado).
- `src/three/CatalogComponent3D.tsx` — o componente prepara a definição (`EMPTY_DEFINITION` +
  `prepared`) e passa a `effective` ao `StateAnimator`/`ComponentRig`, para o curso ficar correto à
  escala do painel.
- `src/admin/editor3d/builtinComponents.ts` — semente do botão de emergência:

  | Campo | Valor |
  | --- | --- |
  | Variável | `pressed` (`bool`, inicial `false`) |
  | Controlo | `Botão de emergência` (`kind: 'button'`, `nodes: ['dcsimu_head']`) |
  | Eixo / curso | `axis: [0,0,1]`, `travelMm: 4` (calculado: `clamp(headDepth · 0,09, 2, 5)`) |
  | Movimento | `slide` · `snap` · 220 ms |
  | Retenção | `returnMode: 'latch'`, `bindVar: 'pressed'`, ação `toggleVar` |
  | Semente | `builtinSeeds: ['emergency-actuator-v1']` |

- `scripts/smoke.ts` — a asserção do P20AKR passa a exigir `!cad.flipDepth` (era `cad.flipDepth`).

### Resultado medido

| Medida | Valor |
| --- | --- |
| Caixa do P20AKR | `[−19,4 · 0 · −38] … [19,4 · 44,2 · 38]` mm (38,9 × 44,2 × 76,0 mm) |
| Cabeça em repouso (local) | z = −5,94 |
| Cabeça premida (local) | z = −9,94 → **afunda 4,0 mm** |
| Curso no painel 3D | 0,040 unidades (`travelMm × PANEL_UNITS_PER_MM`) |
| Peças que se movem | só `dcsimu_head` (aro de fixação e bloco de contactos ficam parados) |

## Testes

| Comando | Resultado |
| --- | --- |
| `npm run -s test:emergency-actuator` (**novo**) | **42 PASS** (perfil de 48 fatias, corte do anel, curso, escala do painel, idempotência) |
| `npm run -s test:emergency-button-ui` (**novo**) | **13 PASS** (controlo ligado a `dcsimu_head`, `returnMode: 'latch'`, variável `pressed`, bornes atrás, clique preme, cabeça afunda 4,0 mm, segundo clique rearma, sem overflow a 390 px, sem exceções) |
| `npm test` | ✅ (a asserção `flipDepth` foi invertida de propósito) |
| `npm run -s test:builtin-sync` | 355 verificações OK (72 integrados, 21 com GLB) |
| `npx tsc -b` | sem erros |

Capturas: `emergency-editor.png`, `emergency-premido.png` e `emergency-telemovel.png` (produzidas pelo
próprio smoke em `EDITOR3D_TEST_OUTPUT`).

## Publicação

- Commit `dc-simu` **`c2bac45`** enviado para `origin/main` (submódulo do BrainNet em **`346352b`**), sem
  `--force`. Deploy da Vercel do commit seguinte (`a10ccd6`) concluído com estado **success**
  (`buildId` `a10ccd6…r80.mvqj5fln`), que inclui este incremento.

## Estado

- **Implementado e testado**; incluído no build de produção `a10ccd6…r80`.
- **Pendente / herdado:** `terminal-geometry-smoke` e `terminal-seat-smoke` falham no borne `21` do
  `emergencyButtonKeyP20ACR` — falha **anterior** a este incremento, não é regressão.
- **Pendente de confirmação em dispositivo físico** depois do deploy (UI-VISUAL-01).
- Rascunhos guardados antes desta alteração continuam com o controlo antigo: reimportar o componente
  integrado para obter a cabeça móvel.

[[Backlog|Backlog]] · [[Decision-Log|Decisões]] · [[Validation-2026-10-27-Cabos-Painel-Lateral|Cabos no painel lateral]]
