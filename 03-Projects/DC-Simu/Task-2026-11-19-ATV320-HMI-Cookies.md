# Task — 2026-11-19 — ATV320 HMI fiel + Modal de cookies

**Estado:** DONE
**Commit dc-simu:** `1077ac7` (release #218)
**Validação:** [Validation-2026-11-19-ATV320-HMI-Cookies](Validation-2026-11-19-ATV320-HMI-Cookies.md)

## Pedido (utilizador, com 3 fotos)

1. **ATV320 não está fiel** — foto real eibabo do ATV320U04M2C: faltam LCD com
   serigrafia, botões e textos ("não esta fiel ainda, nem LCD, nem botões e nem
   serigrafia").
2. **Verificar bornes do ATV320** alinhados com o ATV320U04M2C.
3. **Modal de cookies** — caixa escura simples com espaço vazio; pedido: tema
   dc-simu + ícone de cookie.

## Âmbito executado

### 1. HMI do ATV320 fiel à unidade real

Layout medido da fotografia eibabo do ATV320U04M2C:

- Janela LCD no topo (35×10,5 mm) com **apenas** os 4 dígitos 7 segmentos no
  canvas runtime — as legendas deixaram de ser desenhadas dentro do visor.
- **Serigrafia física** (planos texturados na tampa, z≈132 mm):
  `CAN Run` / `CAN Err` por cima do visor, coluna `Ref`/`Mon`/`Conf` à esquerda,
  coluna `Value`/`Unit` à direita, rótulo `ESC` por baixo do botão.
- **LEDs reais**: CAN Run (verde) e CAN Err (vermelho) por cima do visor
  (substituem a fila de 3 LEDs inventada; `industrial_led_can` removido do GLB).
- **Botão ESC** físico (quadrado escuro 6,5 mm) à esquerda do jog dial.
- **Autocolante QR** de fábrica à direita do jog dial (QR codifica apenas a
  referência comercial pública; sem URL nem número de série inventados).
- **Etiqueta de características** movida da tampa para a face lateral direita,
  como na unidade real.
- Tampa/flap em quase-negro `#2e2f2c` (foto), corpo `#3a3b36`.
- Jog dial: corrigido bug em `prepareIndustrialModel` — `industrial_encoder` é
  o pivot Group (não Mesh), logo o material/knurl nunca eram aplicados; serrilhado
  do aro agora em toro no plano frontal (XY), verde `#3eae27`.
- Canvas do LCD ajustado à proporção da janela: 420×126 (era 512×128).

Ficheiros: `scripts/build-industrial-devices.mjs` (função `atv()`),
`src/three/deviceLcd.ts`, `src/three/industrialFinish.ts`,
`scripts/build-atv320-hmi-labels.py` (novo, gerador das 8 legendas + QR),
8 PNG de legendas + `atv320-qr-sticker.png`, GLB + geometry JSON + sources.json.

### 2. Bornes verificados contra NVE41289 (ATV320••••M2•)

Os **35 bornes** existentes já correspondiam ao manual de instalação:

- Potência na base: R/L1-S/L2 (monofásico M2), PB, PO (variante compacta •C),
  PA/+, PC/-, U/T1, V/T2, W/T3 + PE-IN/PE-OUT.
- Controlo sob a tampa: 10V, AI1, COM1, AI2, AI3, COM2, AQ1, R1A/B/C, R2A/C,
  +24, DI1–DI6, STO, P24, DQ-, DQ+, PE-CTRL.

Sem alteração elétrica — apenas verificação documental. Coordenadas normalizadas
mudaram ±0,002 no JSON porque a etiqueta lateral alargou o envelope 0,15 mm.

### 3. Modal de cookies no tema dc-simu

- `CookieBanner.tsx`: novo ícone SVG de cookie (bolacha branca com pepitas em
  azul da marca) dentro de tile azul `--dx-brand`.
- `dx-legal.css`: cartão compacto 44 rem (era 56 rem com espaço vazio),
  gradiente `#101c3f → #0f172a`, contorno `--dx-brand-line`, anel de foco da
  marca, botão primário em `--dx-brand` com hover `--dx-brand-700` e micro
  elevação; em mobile o ícone alinha à esquerda.

## Fora de âmbito / não inventado

- Sem firmware real: o visor mantém a navegação didática Ref/Mon/Conf.
- QR não é um código Schneider genuíno (codifica só a referência pública).
- Falhas pré-existentes mantidas: "estados de posicionamento e arraste não
  contornam o bloqueio" (npm test) e `surgeProtectorWegSpw02.L` no
  test:terminal-geometry — ambas reproduzem no baseline `1adcca1`.
