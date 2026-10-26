---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, qa, editor-3d, bornes, deteccao]
---
# Editor de componentes — deteção automática, encaixe dos bornes e mola — 2026-10-26

## Pedido

Confirmar que o DC-Simu está operacional; rever o editor de componentes e o esquema 3D; confirmar que os bornes estão mesmo dentro das cavidades dos furos; criar a deteção de bornes, botões, ecrãs e ações/mola em botoneiras e disjuntores.

## Estado operacional (antes das alterações)

| Verificação | Resultado |
| --- | --- |
| BrainNet `npm test` / `npm run check` | 18 passam (27 PowerShell ignorados no Linux) / 0 erros, 230 ligações |
| DC-Simu `tsc -b` | passa |
| `test:ci` em Node 20 e 22.12 | **falha**: `undici` 8 (via `jsdom` 30) exige Node ≥ 22.19 e `jsdom` exige `^22.22.2 \|\| ^24.15 \|\| >=26`. O campo `engines` dizia `>=22.12.0` |
| `test:ci` em Node 22.23.4 | passa (858 verificações) |
| `test:server` | 111 passam (depois de recompilar `better-sqlite3` para a versão do Node) |
| `vite build` | passa (heap 3 GiB) |
| Playwright `test:grafcet-ui` | **falha**: o teste procurava o botão «Desfazer [Ctrl+Z]», mas a barra comum (`toolbarKit`) usa `aria-label="Desfazer"` |
| Playwright `test:grafcet-construction-ui` | **falha**: coordenada fixa (`67 76`) desatualizada desde o enquadramento das quebras (`30906f8`); o comportamento está correto |
| Restantes UI (`editor3d-ui`, `terminal-geometry-ui`, `grid-ui`, `grafcet-modals-ui`, `blocks-ui`) | passam |

## Problemas encontrados no editor

1. **Bornes criados a partir de furos ficavam fora da cavidade no 3D.** `addTerminalInHole` guardava o borne à boca do furo e sem `socketDepthMm`/`socketInsetMm`. Sem esses campos, `definitionToRuntime` projeta o borne na face exterior da caixa do componente, por isso no esquema 3D o ponto de ligação ficava à frente do equipamento.
2. **Botões «momentâneos» ficavam retidos.** O atalho «Botão de pressão» e o tipo «Botão (momentâneo)» prometiam atuar só enquanto premidos, mas a ação era `toggleVar`: um clique ligava e ficava ligado, como um interruptor.
3. **A deteção automática só lia nomes**, e só botões/manípulos/seletores/LEDs. Os GLB exportados de CAD têm nomes genéricos (`occurrence_of_Plane002_…`, `Mesh`) e não havia deteção de ecrãs nem de bornes.

Os 142 bornes dos 20 modelos integrados estavam corretamente dentro das cavidades (confirmado por raios, ver abaixo).

## Implementação (DC-Simu)

- `src/catalog/terminalSeat.ts` (novo): mede a cavidade por raios ao longo da normal do borne (centro = fundo; anel de 12 raios = boca), classifica `seated` / `mouth` / `outside` / `buried` / `surface` / `floating`, e corrige: furo livre mais próximo na mesma face ou recuo para dentro da cavidade existente. `socketForHole` confirma no modelo (bornes de aperto com cabeça de parafuso ao centro ficam à boca, nunca enterrados).
- Editor › Bornes › **Encaixe dos bornes**: «Verificar encaixe», lista por borne, «Encaixar» e «Encaixar todos». Os bornes criados a partir de furos passam a guardar profundidade e recuo.
- `ControlDef.returnMode: 'spring' | 'latch'` com `springHold` (puro, em `behavior.ts`): **mola** = variável ativa só enquanto premido, reposta ao largar; clique no inspetor gera impulso de 250 ms. Ligado no simulador (`CatalogComponent3D`, `runtimeControls`) e no editor (`Viewport`, `controlOps`). Campo «Retorno» no inspetor do controlo; atalhos corrigidos.
- Deteção automática (`interactables.ts`) alargada: ecrãs e bornes por nome; **geometria** para nomes genéricos (placa fina à face → ecrã; cilindro pequeno a sobressair → botão; disco Ø ≥ 22 mm → seletor; peça pequena emissiva → LED), excluindo serigrafia, parafusos e corpo; **retorno inferido** por nome e tipo de equipamento (botoneira → mola; emergência/encravamento → retenção; manípulo de disjuntor → retenção a bascular com «clique com mola»; TEST/rearme de disjuntor → mola). Sugestões só pela forma vêm desmarcadas.
- Painel «Deteção automática no modelo» agrupado (Bornes, Botões, Manípulos/disjuntores, Seletores, Ecrãs, Indicadores), também na aba Bornes. Bornes detetados são encaixados no furo ao criar; os que já existem perto vêm desmarcados.
- `validate.ts`: aviso para bornes com encaixe sem profundidade medida e para botão com mola sem variável.
- `engines.node` alinhado com as dependências de teste: `^22.22.2 || ^24.15.0 || >=26.0.0`.

## Evidência

| Verificação | Resultado |
| --- | --- |
| `test:terminal-seat` (novo) | 142 bornes integrados dentro das cavidades; 20 correções «boca → cavidade»; 50 bornes criados a partir de furos detetados ficam na cavidade; casos face plana / enterrado / sem superfície |
| `test:auto-detect-models` (novo, GLB reais) | DM20: LCD + 4 botões com mola + seletor, sem serigrafia; PKZM: 6 bornes, 2 manípulos com retenção, TEST com mola, parafusos ignorados; Easy9 e Steck: manípulos com retenção |
| `test:interactables` | +26 verificações (ecrãs, bornes, geometria, retorno, mola) |
| `test:editor3d-autodetect-ui` (novo, Playwright) | 12 verificações no editor completo: encaixe, «Encaixar todos», deteção agrupada, criação com mola/retenção, mola premir/largar e impulso; sem exceções |
| `test:ci` | passa (≈ 999 verificações, Node 22.23.4) |
| `test:server` / `vite build` / `tsc -b` | 111 passam / passa / passa |
| UI: `editor3d-ui` 32, `terminal-geometry-ui` 21, `grid-ui` 8, `grafcet-ui` 103, `grafcet-modals-ui` 23, `grafcet-construction-ui` 18, `blocks-ui` 100 | passam |

## Melhorias propostas (não implementadas)

- **3D-DETECT-02**: GLB fundidos numa só malha (LOGO!, NPB22, AD22, contactor WEG) não têm objetos separáveis; a deteção por geometria só funciona por nó. Opção: segmentar a malha por componentes conexos ou por material.
- **3D-DETECT-03**: ligar o ecrã detetado à variável do botão/seletor (hoje mostra `{state}`).
- **3D-DATA-01** mantém-se: bornes sobrepostos de `safetyRelay` e `motor3ph`.
- Os testes Playwright usam portas por omissão diferentes (5173/5175/5181); um único `PLAYWRIGHT_BASE_URL` simplificaria o runner.

## Estado

Implementado e testado localmente. Commits DC-Simu `d70baf8` (funcionalidade) e `9295d4a` (gancho `pre-commit` executável — o carimbo de release não era atualizado em Linux/macOS; carimbo #52) enviados para `origin/main` a pedido do utilizador (2026-10-26); BrainNet atualiza o submódulo e as notas. Deploy não executado por mim: a publicação na Vercel depende da ligação do projeto ao `main`; confirmar no painel.
