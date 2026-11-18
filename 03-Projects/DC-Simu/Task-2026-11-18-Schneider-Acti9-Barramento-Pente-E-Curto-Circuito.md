---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_TESTED
created: 2026-11-18
updated: 2026-11-18
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, schneider, acti9, barramento-pente, a9xpc712, curto-circuito, sobreaquecimento, fumo, arcoluz, som-audio, web-audio, protecao-eletrica]
---

# Task 2026-11-18 — Barramento Pente Schneider Acti9 (A9XPC712), Curto-Circuito, Sobreaquecimento, Fumo e Efeitos Sonoros Fotorrealistas

## 1. Pedido e Objetivos

1. **Barramento Pente Schneider Acti9 (Fiel à Imagem de Referência `image-42.png`)**:
   - Modelar e integrar o barramento tipo pente de distribuição trifásica equilibrada para aparelhos 1P+N (referência `A9XPC712` para 12 módulos e `A9XPC724` para 24 módulos).
   - Sequência de condutores e pinos: alternância simétrica equilibrada `N · L1 · N · L2 · N · L3 · N · L1...` distribuída pelas 4 barras de cobre internas (Neutro, L1, L2, L3).
   - Tampas de extremidade em amarelo vivo normativo Schneider (`A9XPE...`).
   - Protetores de dentes destacáveis snap-on amarelos (`A9XPT920`) para isolamento dos dentes de reserva ou não utilizados.
   - Serigrafia de alta resolução: logótipo Schneider Electric, marcação Acti9, código de barras real EAN-13, símbolos CE e WEEE (contentor barrado), tensão 400V, corrente estipulada 80A, secção 16mm², normas IEC 60439-1 / IEC 60947-7-1 e badges circulares normativos pretos com "N" e fases legíveis.
   - Controlo total no Inspetor e no painel 2D/3D (seleção de modo `1P+N-3P`, capas amarelas, dentes tapados).

2. **Simulação Fotorrealista de Curto-Circuito, Fumo, Sobreaquecimento e Queima**:
   - **Deteção Elétrica de Curto-Circuito**:
     - Curto fase-fase (L1-L2, L2-L3, L3-L1).
     - Curto fase-neutro ou fase-terra sem carga intermediária.
     - Curto DC em fontes de alimentação (+24V com 0V).
     - Injeção forçada de falha de curto-circuito no painel de diagnóstico (`faults.shortCircuit`).
   - **Atuação de Proteção Magnética**:
     - Disparo instantâneo automático dos disjuntores no laço de curto (`tripped = true, tripReason = 'shortCircuit'`).
     - Emissão de evento de erro com a causa detalhada do curto.
   - **Efeito de Sobreaquecimento & Fritura (sem disjuntor de corte ou com disjuntores bloqueados)**:
     - Acumulação térmica progressiva (`heatLevel` de 0.0 a 1.0) em condutores e aparelhos sob sobrecorrente extrema.
     - Emissão incandescente visual nos condutores (`meshPhysicalMaterial.emissive` passando de preto para vermelho-alaranjado vivo `#ff3b00`).
     - Quando `heatLevel >= 0.72`: isolamento queima e carboniza, tornando o cabo preto fosco (`#18181b`) e permanentemente avariado (`damaged: true, burnt: true`).
     - Componentes sob sobrecarga térmica ficam queimados com manchas de fuligem (`burnt: true`).
   - **Efeitos Tridimensionais no Canvas 3D (`FaultEffects3D.tsx`)**:
     - Arco elétrico com cintilação violenta (flicker estroboscópico 20-50 Hz) de cor branca/azul/laranja.
     - Feixe de faíscas incandescentes saindo do ponto focal do curto com física balística e gravidade.
     - Fumo denso em ascensão com convecção vertical, rotação e desvanecimento suave.
     - Manchas escuras de fuligem carbonizada projetadas na carcaça dos componentes avariados.
   - **Efeitos Sonoros com Web Audio API (`src/audio/sfx.ts`)**:
     - `playShortCircuitBoom()`: detonação do arco voltaico, expansão rápida de ar e micro-estalos de metal fundido.
     - `startOverheatSizzle(intensity)` / `stopOverheatSizzle()`: fritura contínua de isolamento PVC com zumbido magnético de falta a 100 Hz.
     - `playWireBurnPop()`: estalo seco de rutura e quebra de isolamento plástico.
   - **Gestão e Reposição**:
     - Botão "Reparar Tudo / Repor Danos" no painel de diagnóstico para recuperar condutores e equipamentos queimados.

## 2. Ficheiros Criados e Alterados

- `src/three/combBusbarParts.ts`:
  - Modo `'1P+N-3P'` com 4 condutores independentes e sequência cíclica equilibrada.
  - Resolução de catálogo Schneider `A9XPC712` (12P) e `A9XPC724` (24P).
  - Tampas amarelas Schneider `A9XPE` e protetores de dente snap-on `A9XPT920`.
- `src/three/combBusbarMarkings.ts`:
  - Serigrafia Schneider Acti9 com CE, WEEE, código de barras e badges circulares N.
- `src/three/Busbar3D.tsx`:
  - Material PBR amarelo vivo para topos e protetores de dente.
- `src/schematic/Busbar2D.tsx`:
  - Representação gráfica esquemática 2D das capas amarelas e protetores de dentes.
- `src/components/BusbarControls.tsx`:
  - Seletor de modo `Acti9 1P+N (3P Bal)` e botões para alternar protetores de dentes.
- `src/audio/sfx.ts`:
  - Síntese de áudio procedural do arco voltaico, fritura contínua e rutura térmica.
- `src/electrical/shortCircuitEngine.ts`:
  - Motor de cálculo de curto-circuitos, identificação do laço de falta e disparo magnético.
- `src/three/FaultEffects3D.tsx`:
  - Componente R3F de arco voltaico, faíscas em cascata, fumo convectivo e fuligem.
- `src/three/Panel3D.tsx`:
  - Integração da camada `FaultEffectsLayer`, incandescência e carbonização de condutores.
- `src/schematic/SchematicView.tsx`:
  - Renderização 2D de condutores incandescentes e carbonizados por sobreaquecimento.
- `src/store/useSimStore.ts`:
  - Integração no ciclo `runOneTick`, gestão térmica e ação `repairBurntEquipment`.
- `src/components/MonitorPanel.tsx`:
  - Cartão de alerta de curto-circuito ativo e ação de reparação geral.
- `scripts/acti9-short-circuit-smoke.ts`:
  - Teste de integração automatizado cobrindo todos os fluxos.

## 3. Verificação e Testes

- `npx tsx scripts/acti9-short-circuit-smoke.ts`: PASS (100%).
- `npm test` (`scripts/smoke.ts`): TODOS OS TESTES PASSARAM (100%).
- `npx tsc --noEmit`: 0 erros de compilação TypeScript em todo o projeto.
