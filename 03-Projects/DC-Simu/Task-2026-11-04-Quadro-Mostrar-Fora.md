---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PARTIAL
created: 2026-11-04
updated: 2026-11-04
tags: [dc-simu, quadro, porta, painel, montagem, luzes, botoes]
---

# Quadro: elementos com parte visível fora (porta/laterais) — luzes, botões, seletores

## Pedido (utilizador, 2026-11-04)
> Criar função para definir elementos que ficam com uma parte dela a mostra fora do quadro, por exemplo nas portas, laterais, e etc, luzes, botões, interruptores ou seletores, que a parte de ligação fica dentro e a parte de fora fica a mista os vidros da luz, botões e etc

## Contexto lido
- `Design-Principles` — paineis, tema, botões/luzes/LCDs/texturas, barras `toolbarKit`, inspetor
- `enclosureParts.ts` — quadro com porta (dobradiça `left/right`, `doorOpen`), chapa de montagem a `ENCLOSURE_PLATE_FRONT_MM`, gerador `buildEnclosure`
- `ElectricalComponentBase.enclosureId` — aparelhos “dentro” movem com o quadro (`moveComponent` inclui filhos, `assignToEnclosure`)
- `PanelAccessoryControls` / `Sidebar.tsx:637` — seletor “Dentro do quadro”
- Componentes de frente de painel já existentes: `pilotLightAd22`, `buttonNO/NC`, `selector2/3`, `emergencyButton`, `dualPushButtonNpb22D11` (todos com bornes para ligação interna e lente/botão para fora)
- 2D: `PanelAccessories2D.tsx:Enclosure2D` desenha moldura + porta; 3D: `Panel3D.tsx:panelPivots` posiciona quadro e acessórios

## Problema
Hoje `enclosureId` só liga “dentro” (chapa). Não há distinção entre:
- **Dentro** — contactor, relé, fonte na chapa
- **Na face** — sinaleiro/botoeira na porta ou lateral, com **corpo/ligação dentro** e **lente/botão fora** (furo Ø22mm)

Sem isso, botões ficam escondidos atrás da chapa ou flutuando, e mover o quadro não reflete corte/furo da porta.

## Decisão de desenho (reaproveitar)
Reaproveitar `enclosureId` + novo `panelMount` (análogo a `railId`/`railOffsetMm`):

```ts
panelMount?: {
  enclosureId: string        // quadro de suporte — sempre panelEnclosure
  face: 'inside' | 'door' | 'doorOuter' | 'left' | 'right' | 'top'
  offsetXmm?: number         // posição no plano da face (mm a partir do centro)
  offsetYmm?: number
  cutoutMm?: number          // Ø do furo (22 por omissão para AD22/botoeiras)
}
```
- `inside` = comportamento atual (compatível, `enclosureId` sem `panelMount`)
- `door` = face externa da porta (lente fora, terminais para dentro através do furo)
- Outras faces para laterais/topo
- Movimento: `moveComponent` inclui `panelMount.enclosureId` no grupo (como já faz para `enclosureId`)
- Eliminação do quadro limpa `enclosureId` e `panelMount`
- Colisão 2D/3D: aparelhos em `door` não contam como “dentro”; parede é obstáculo exceto no ponto do furo

## UI/UX (estender o existente)
- `Sidebar.tsx` — cartão “Quadro” passa a ter:
  - `Dentro do quadro [select]` (mantido)
  - Separador “Na face” → `Face [Porta|Porta interior|Lateral Esq|Dir|Topo] + Ø furo + offsets`
  - Botões `Montar na porta` / `Soltar`
  - No inspetor do quadro: lista “Dentro (n)” + “Na porta (n)” com ação em lote
- 2D `Enclosure2D`: desenhar furos (círculos) nas faces selecionadas; aparelho em `door` aparece sobreposto à moldura da porta
- 3D `Panel3D`: `panelPivots` calcula pivô na face `D ± sheet/2`; porta tem rotação, então pivô roda com ela
- Barra de seleção múltipla: `Montar seleção na porta deste quadro`

## Critérios de aceitação
- É possível marcar luz H1 / botão S1 como “na porta do QE1” e vê-lo fora do quadro (2D sobre a porta, 3D na face externa) mantendo terminais ligáveis por dentro
- Mover QE1 arrasta chapa + aparelhos dentro + aparelhos na porta/lateral (offset preservado)
- Apagar QE1 limpa ambas as ligações
- Sem regressão em `enclosureId` interior, calha DIN e `mountedOn`

## Plano (dc-simu)
1. Tipos `panelMount` em `src/types/index.ts`
2. Store `mountOnPanelFace` / `unmountPanel` + `moveComponent` + limpeza ao apagar
3. `Sidebar.tsx` — UI do cartão + lista no `EnclosureControls`
4. `PanelAccessories2D.tsx` — furos + sobreposição
5. `Panel3D.tsx` — pivô na face (porta com rotação)
6. Smoke `panel-mount-smoke.ts` + `npm run test:panel-accessories`
7. Doc + commit/push em `dc-simu` e `BrainNet`

## Resultado (dc-simu 51fa918)
- `src/types/index.ts` — `EnclosureFace` + `PanelMount` + `panelMount?` em `ElectricalComponentBase`
- `src/store/useSimStore.ts` — `mountOnPanel(face)`, `updatePanelMount`, `unmountFromPanel`, `moveComponent` com grupo `panelMount`, limpeza ao apagar, mutual exclusion com `enclosureId`
- `src/components/Sidebar.tsx` — cartão “Na face do quadro (visível fora)” com quadro, face (`Porta/Lateral/Topo`), Ø furo e offsets X/Y
- `typecheck` OK, push para `origin/main`

## Resultado 2026-11-05 (a53cdf6) — 2D/3D + multicore
- **2D `PanelAccessories2D.tsx`:** `Enclosure2D` lê `components.filter(panelMount.enclosureId===c.id)` e desenha furo por aparelho: `cx=W/2+offX*px, cy=H/2-offY*px, r=cutout/2`, cor por face (`door #0ea5e9`, `inside tracejado`), etiqueta `ref·face`.
- **3D `Panel3D.tsx`:** `panelPivots` trata `panelMount` antes de `isMountingRail`: encontra `enclosure`, dims e baseZ. `door/doorOuter→ baseZ+D+22mm` (frente da porta), `left/right/top/bottom→ parede exterior -/+ half`, `inside→ PLATE_FRONT_Z`. Offsets X/Y em `mm*U`.
- **Multicore:** `Wire.conductorColors?: string[]` + `WireDefaults.conductorColors`, cópia em `addWire/addFreeWire/addWire3D`, UI Sidebar `Veias:` pickers quando Nº>1 + Repor.
- **Limitação conhecida:** 3D porta ainda não rotaciona botões com `doorOpen` (precisa parentear ao `door` Group de `Enclosure3D` — medir hinge).
- `typecheck` OK, push `a53cdf6`.

## Próximo passo (3D porta rotativa + smoke)
- Parentesco 3D: prender aparelhos `door` ao `door` mesh com `openSign`/`angle` (sincronizar `useFrame`)
- Smoke `panel-mount-smoke.ts` + `test:panel-accessories` para furos/offsets
- Cores por veia no render 3D (tubo raiado) e legendas de bornes multicore

[[Design-Principles]] · [[Task-2026-11-04-Quadro-Parentesco-Espiral-Cabos|Parentesco anterior]]

[[Design-Principles]] · [[Task-2026-11-04-Quadro-Parentesco-Espiral-Cabos|Parentesco anterior]]
