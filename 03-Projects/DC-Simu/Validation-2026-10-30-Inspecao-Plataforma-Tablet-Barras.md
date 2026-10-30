---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-30
updated: 2026-10-30
tags: [dc-simu, inspecao, tablet, toolbar, admin, motor, cabos, offline, ui, ux]
---
# Inspeção da plataforma — paridade tablet/PC, barras, editor offline e cabos do motor

## Pedido

Inspecionar toda a plataforma (landing, entrada, criar conta, carregamento, administração,
editor de componentes, 3D, Ladder, GRAFCET), melhorar UI/UX, confirmar que tudo funciona,
padronizar o layout, melhorar as ligações do esquema nativo e garantir que o tablet abre
exatamente como no PC. Trabalhar a partir do cofre e publicar nos dois repositórios.

## Método

Build de produção (`vite preview`) inspecionada com Playwright/Chromium em PC (1440 × 900,
1280 × 800) e tablet tátil (1180 × 820, 820 × 1180, 744 × 1133): capturas, erros JS,
transbordo horizontal e largura de layout. Novo utilitário: `npm run inspect:platform`.

## Resultado

| Área | Encontrado | Estado |
| --- | --- | --- |
| Cabos 3D do motor (esquema nativo) | 7 falhas em `test:native-wires-3d` desde `1775647` (furo do bucim): cabos pela carcaça, quatro cabos colados no furo, olhal fora do eixo | Corrigido |
| Editor sem CDN | Rótulos 3D pediam fontes à jsdelivr; sem ela o editor ficava preso em «A carregar o editor…» | Corrigido — fonte local Inter (OFL) |
| Tablet = PC | `pointer: coarse` aplicava layout de telemóvel a qualquer tablet; retrato caía em quebras 760–1199 px | Corrigido — layout de 1280 px escalado |
| Barras do editor | Separadores e zoom cortados a 1280 px; 2.ª linha escondia 154/197 px a 1440 px; «Caixa-preta» fora do ecrã acima de 1800 px | Corrigido — compactação medida |
| Editor de componentes 3D | Fita principal transbordava 51 px; botão «Canvas» do telemóvel no PC | Corrigido |
| Administração | Indicadores com ícone, rótulo e seta sobrepostos; tons anulados | Corrigido |
| Capa dos projetos | Cabos em «Z» sobrepostos e por cima dos aparelhos | Melhorado — calhas e faixas |
| Landing, entrada, carregamento, painel | Sem erros nem transbordo; secções reveladas ao fazer scroll funcionam | Sem alterações |
| Criar conta | Registo desativado por desenho (só contas Admin e User) | Mantido; mensagem clara no ecrã |

## Decisões

- **Tablet**: ecrã tátil com o lado curto ≥ 600 px. Abaixo de 1280 px de largura, a meta viewport
  passa a `width=1280` e o navegador escala a página. Assim o tablet tem exatamente o layout do PC.
  Em retrato o texto fica a ~64 % — preço da paridade pedida; rever em aparelho real.
- **Telemóvel** passa a ser `(pointer: coarse) and (max-width: 743px)` ou `(pointer: coarse) and
  (max-height: 520px)` (`PHONE_TOUCH_QUERY` em `src/ui/device.ts`). `(pointer: coarse)` sozinho só
  para revelar botões que no PC aparecem ao passar o rato.
- **Barras**: compactam quando o conteúdo não cabe (medido, confirmado após 400 ms, memorizado por
  vista) em vez de por ponto de quebra fixo — `useOverflowCompact` em `toolbarKit.tsx`.

## Ficheiros

- Cabos: `src/three/wireGeometry3D.ts`.
- Fonte 3D: `src/three/SceneText.tsx`, `public/fonts/`, `src/three/Panel3D.tsx`, `src/three/WireDraw3D.tsx`, `vite.config.ts`.
- Tablet: `index.html`, `src/ui/device.ts`, 17 folhas CSS, `simUi.ts`, `cleanMode.ts`, `LadderEditor.tsx`, `App.tsx`.
- Barras: `src/ui/toolbarKit.tsx`, `src/components/Toolbar.tsx`, `src/admin/editor3d/ComponentEditor3D.tsx`, `src/styles/header-refine.css`, `src/styles/catalog-editor.css`.
- Administração: `src/styles/admin-refine.css`. Capa: `src/dashboard/projectPreview.ts`, `ProjectCover.tsx`.
- [Documentação técnica](./dc-simu/docs/PARIDADE-TABLET-BARRAS-CABOS-MOTOR.md).

## Verificações e evidências

- `npx tsc -b` + `npm run test:ci`: **1147 PASS, 0 FAIL** (antes: 7 falhas nos cabos do motor).
- `npm run test:tablet-parity-ui` (novo): **36 PASS** — três tablets com layout de 1280 px, painéis
  fixos, nenhum botão cortado em Esquema/Ladder/GRAFCET (também PC 1440/1280), sem erros JS,
  indicadores sem sobreposição.
- `npm run test:toolbar-ui`: 95 PASS (igual à base; viewport a 1920 px, ver documentação técnica).
- `test:admin-ui`, `test:landing-ui`, `test:barras-padrao`, `test:admin-saas-ui`: já falhavam no
  commit de partida `9075c72` com as mesmas mensagens — comparação feita num worktree da base.
- Editor carregado em ~6–17 s em headless sem acesso à CDN (antes: preso indefinidamente).
- Capturas: tablet em retrato e paisagem idênticos ao PC a 1280 px; cabos entram pelo bucim sem
  atravessar a carcaça.

## Estado e pendências

- IMPLEMENTED_TESTED localmente. Commit `dc-simu` `458ac7b` (carimbo #107).
- **Publicação pendente**: o push foi recusado pela política da sessão (repositórios fora do conjunto
  autorizado; é preciso ligar a conta GitHub). Commits prontos nos dois repositórios.
- Testar em iPad e tablet Android reais (Safari/Chrome), em retrato e paisagem.
- Rever as quatro suítes de UI que já falhavam antes deste incremento.

[[README|DC-Simu]] · [[Backlog]] · [[Design-Principles]]
