---
project_id: BN-DCSIMU-001
type: task
status: DONE
created: 2026-11-19
updated: 2026-11-19
tags: [dc-simu, protecao, murrelektronik, mico, mico-4-6, disjuntor-eletronico, 24v-dc, bornes-mola, serigrafia, industrial]
---
# Proteção eletrónica Murrelektronik MICO Classic 4.6

## Pedido direto

Deogracia de Castro, 2026-11-19:

> «Criar este componente: Disyuntor electrónico Murrelektronik MICO
> [9000-41034-0100600], 6A MICO 24V, 4 canales Carril DIN. 3D real cad,
> Serigrafia, Botões, Bornes, Funcionalidades, Textura, Fiel ao produto, PDF.»

Referências fotográficas: IMG_5874 (frente) e IMG_5873 (¾ superior).

## Entregue

**Tipo**: `breakerMurrelektronikMico46` (commit dc-simu `8d2b98c`).

### 3D real / fiel ao produto

- Corpo DIN TH35 70(L) × 81,75(A) × 61,6(P) mm (nominal 90×70×80 mm do manual;
  a altura visual exclui o patim de calha).
- Blocos de bornes de mola verdes (fiel ao MICO real): 2× +24V no topo
  (L+/L+2), ON/13/14 no topo-centro, 4× OUT 1-4 no fundo, 2× GND nos cantos.
- Grelhas de ventilação horizontais no topo e verticais na frente.
- Reentrância DIN inferior com clipe.
- Serigrafia frontal: logótipo MURR ELEKTRONIK / 71570 Oppenweiler GERMANY,
  legenda LED-Display (5 estados), aviso "Output not intended to be
  interconnected … Class 2".
- Reconstrução cotada do manual de instalação V2.5 (não STEP oficial).

### Bornes

11 bornes de mola com contacto `surface` na face do corpo (padrão dos PE do
ATV): L+, L+2, ON, 13, 14, OUT1-4, GND, GND2. Seções por manual: entrada
16 mm², saída 4 mm², sinal 2,5 mm².

### Botões e seletores (interações reais)

- **Botão de canal** (`industrial_mico_button_N`): liga/desliga o canal N
  (control `chN`). Desligar limpa disparo/defeito e zera a corrente.
- **Seletor de corrente** (`industrial_mico_select_N`): roda 1 → 2 → 4 → 6 A
  (control `selN`). Mudar o setpoint **desliga o canal** — regra explícita do
  manual ("setting of the current range during operation leads to the
  disconnection of the channel; it may only be switched on manually").

### Funcionalidades (motor elétrico)

- Alimentação +24 V DC (18–30 V) entre L+ e GND; fora da faixa = `supplyMismatch`.
- Arranque em cascata 75 ms por canal ao ligar a rede.
- Disparo por sobrecorrente: canal ON com `currentA > setpointA` → `tripped`.
- **Sammelmeldung 13-14**: contacto NA livre de potencial que **abre** quando
  qualquer canal ligado dispara ou tem defeito interno.
- **ON remoto** (≥20 ms, 10–30 V DC): rearma canais ligados disparados (não
  os desligados manualmente).
- Memória de estado: corte de rede limpa estados transitórios; ao voltar, os
  canais ligados são repostos (cascata).
- LED por canal: verde = on; verde flash = >90% I; vermelho = off;
  vermelho 1 Hz = disparado; vermelho 5 Hz = defeito interno.
- Paralelo de canais para aumento de potência não permitido (documentado no
  scope).

### Capas e PDF

- `public/component-covers/breakerMurrelektronikMico46.webp` + `front/`
  (painter's algorithm sobre o GLB, sem browser).
- `public/datasheets/industrial/murrelektronik-mico46.pdf` — manual de
  instalação oficial (media.automation24.com/manual/101523.pdf).
- Manifest de capas atualizado; tipo entra na `expected`.

### IEC

- `iecAssociation`: primário `breaker3` (60617-7), refLetter **F**, nota de
  proteção eletrónica multicanal.
- Símbolo 2D dedicado em `symbols.tsx`: corpo com 4 LEDs de estado, setpoint
  por canal e indicação de disparo.

## Testes

- `test:industrial`: **159/159** (inclui 8 novas asserções MICO: alimentação,
  entrega OFF, botão liga, 0 A não dispara, sobrecorrente dispara + alarme,
  seletor desliga, ON remoto rearma, corte de rede limpa).
- `tsc --noEmit`: limpo.
- `test:terminal-geometry` / `test:terminal-seat`: sem regressões.
- `test:ci`: 96/104 — as 8 falhas são as pré-existentes (test, editor3d-
  functional, qgd, pinch, landing-demo, supabase-comments, supabase-contrib,
  native-policy), não relacionadas.

## Decisões de implementação

- `contact:'surface'` nos bornes: o drill em blocos que sobrepõem o corpo não
  corta ambos os meshes de forma fiável; o padrão dos PE do ATV (cavidade no
  corpo + contacto na superfície) passa no smoke e mantém o borne visual.
- Cascata de 75 ms registada por canal mas não simulada em tempo real (o scan
  é por evento, não por relógio contínuo).
- A corrente por canal é estado manual (`currentA`), não resolvida pelo solver
  — o simulador é topológico, não analógico.
