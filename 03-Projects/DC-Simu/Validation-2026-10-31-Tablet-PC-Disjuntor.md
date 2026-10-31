---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, tablet, layout, simulacao, disjuntor, eletrico]
---
# Tablet igual ao PC e disjuntor tripolar que não cortava a corrente

## Pedido
1. As barras laterais no tablet devem abrir como no PC — tudo no tablet igual ao PC.
2. Verificar porque o disjuntor tripolar, mesmo desligado, deixa passar corrente.

## 2. Disjuntor tripolar (causa e correção)

**Causa:** em `sourceTerminalIds` (motor elétrico), as **entradas de todos os disjuntores** eram tratadas como «a rede a entrar no quadro». No projeto nativo XG → **QG** → QM1 → KM1 e QG → Q0 → PS1:
- com o QG desligado, as entradas do **QM1** (disjuntor-motor) e do **Q0** (comando) continuavam a ser fonte;
- a fonte 24 V, o PLC e o circuito de potência continuavam alimentados;
- a corrente chegava até à saída do próprio QG pelos cabos, em sentido contrário.

**Correção** (`src/electrical/engine.ts`, `fedBreakerInputs`):
- A entrada de um disjuntor só conta como rede quando é um disjuntor **de cabeça**, isto é, quando na mesma rede elétrica (cabos e bornes passivos) não há a saída de outro aparelho nem uma fonte.
- Uma fonte desligada também conta como montante, por isso «XG desligada» corta o QG.
- Todos os que calculam fontes passaram a receber os cabos: simulação, multímetro, LOGO! e Proauto.

**Verificação:**
- `test:breaker-cut` (novo, em `test:ci`), 9 verificações:
  - QG ligado/desligado/disparado;
  - XG desligada;
  - disjuntor de cabeça isolado;
  - corte a jusante;
  - modo antigo sem cabos.
- Browser, com a simulação a correr e o QG desligado: a PS1 e o PLC1 ficam sem alimentação (antes ficavam alimentados).

## 1. Tablet = PC

Emulei tablets no Playwright com os mesmos painéis por vista do PC a 1280 px: iPad 7 em retrato e deitado, Galaxy Tab S4, tablet de 8″ e Fire HD 8. Encontrei três situações em que um tablet podia cair no layout de telemóvel (gavetas por cima do desenho):
- **Tablets de 7–8″** (por exemplo, Fire HD 8: lado curto de 533 px CSS) ficavam abaixo do limite de 600 px e eram tratados como telemóvel. O limite passou a **480 px** em `index.html` e em `device.ts`: os telemóveis ficam abaixo de ~440 px.
- **Tablet deitado com o teclado aberto**: a altura desce abaixo de 520 px e as regras de «telemóvel deitado» (`(pointer: coarse) and (max-height: 520px)`) aplicavam-se. Essas regras passaram a exigir também `(max-width: 1100px)` (46 consultas no CSS/JS, mais `PHONE_TOUCH_QUERY`). O tablet tem sempre ≥ 1280 px de largura de layout, por isso nunca as apanha; um telemóvel deitado (≤ ~932 px) continua a apanhá-las.
- **2.ª linha da barra** (ferramentas) a 1280–1440 px, no 3D Realista e no GRAFCET: não cabia e algumas ferramentas ficavam fora do ecrã.
  - Agora, quando não cabe, os botões ficam **só com o ícone**; o nome continua no título e no nome acessível.
  - Fica tudo à vista, igual no PC e no tablet, sem menus de telemóvel.

**Verificação:**
- `test:tablet-parity-ui`: 51 verificações, com `vite preview`, sobre PC 1440 e 1280 e os tablets 1180×820, 820×1180 e 744×1133. Antes falhava porque as ferramentas não cabiam.
- Emulação com Playwright: o Fire HD 8 deitado e em retrato e o tablet com o teclado aberto têm os mesmos painéis do PC em 3D Realista, Ladder, GRAFCET e Esquema IEC. O iPhone 13 continua com o layout de telemóvel.

## Pendente
- Confirmar num tablet real do utilizador (modelo e navegador) — a emulação cobre os casos acima, mas não um dispositivo físico.
