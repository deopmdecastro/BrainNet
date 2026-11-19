---
project_id: BN-DCSIMU-001
type: task
status: DONE
created: 2026-11-19
updated: 2026-11-19
tags: [dc-simu, medidor, d52-2066, condensador, faston, buzzer, metaltex, botoeiras, xb2, pente, bornes, realismo]
---
# Medidor D52, condensador 6 pinos, buzzer TBY-301, botões XB2 e pente universal

## Pedido direto

Deogracia de Castro, 2026-11-19 (continuação da sessão anterior, «continua onde
paraste»), com fotografias de referência IMG_5843–IMG_5864:

1. **Medidor D52-2066**: melhorar, verificar a montagem pela fotografia de
   instalação (TC externo nos bornes 3/4 no topo; L/N nos bornes 1/2 em baixo),
   garantir bornes corretos. Remover o furo que atravessava o componente e ser
   fiel ao aparelho real.
2. **Temporizadores GEYA GRT8**: melhorar os bornes — parafusos na vista
   frontal e bornes de condutores em cima (e em baixo).
3. **Condensador `capacitorRun60uF`**: o utilizador vê 6 pinos; criar os pinos
   físicos correspondentes com o tipo de terminal faston e ligação automática
   do cabo ao encostar ao condensador.
4. **Sinalização sonora (Metaltex TBY-301)**: modelo não está fiel às
   fotografias (frente com anel cromado serrilhado e tampa preta; traseira
   quadrada com 4 parafusos e etiqueta «BUZZER AC110V tend»).
5. **Botões de pressão Ø22 (referência KEOLEA KL-XB2 / XB2-BA)**: criar os
   botões com 3D real tipo CAD, serigrafia (KEOLEA, KL-XB2, Ui 660 V, Ith 10 A,
   Uimp 6 kV, AC-15, DC-13, GB/T14048.5, CE, CCC, diagrama de contactos),
   textura real, capa de biblioteca, funcionamento real (NA fecha ao premir /
   NF abre ao premir, mola de retorno), ação de clique, bornes de ligação e
   associação ao símbolo IEC já existente (pushNO/pushNC).
6. **Pente (`busbarComb`/`combBusbarConnector`)**: o encaixe perfeito existe num
   disjuntor; fazer funcionar em todos os disjuntores, diferenciais e outros
   aparelhos compatíveis (DPS), replicando o borne calibrado e garantindo o
   encaixe.
7. **Otimizar testes e validações longos** para não demorarem tanto.
8. Commit, push e publicação autorizados nos dois repositórios.

## Estado inicial (análise do código)

- `9074dd0` (em main, não publicado) já removeu o túnel primário do D52;
  produção r212/`20150c0` ainda o mostra. **Confirmado por raios**: os poços
  superiores de aparafusar do D52 (bornes 3/4) ficam selados a 1 mm da face
  (furo cego a z=43,01 com face a z=44) — corrigir profundidade/parafuso.
- `a5c0133` acrescentou parafusos GEYA em runtime, mas em z≈+31,4 mm (face do
  painel frontal), enquanto as plataformas de bornes estão recuadas (face a
  z=38 mm): os parafusos runtime flutuam no ar. O GLB já traz parafusos
  captivos certos nos poços (`terminal_screw_head_geya_*`) — remover o patch
  runtime e afiar o GLB.
- `69f68b1` alargou `BREAKER_TYPES`; faltam `TOP_CLAMP_LANES` para a maioria,
  `REAL_TERMINALS` para `breaker4p`/`residualBreaker`/`motorBreaker` genéricos
  e os DPS (`surgeProtectorWegSpw02/Spw12`).
- Condensador: GLB `capacitor-run-generic.glb` é um corpo único sem pinos; os
  6 bornes lógicos (1/1B, 2/2B/2C/2D) flutuam. Falha de baseline conhecida:
  sobreposição 2D 1/1B, 2/2B, 2C/2D no `editors-sweep`.
- Buzzer `buzzerMetaltexTby301.glb`: geometria genérica (caixa+cilindro), sem
  parafusos traseiros, etiqueta no sítio errado, aro sem serrilhado.
- Botões: existe `PushButton3D` procedural aproximado (`b9d40ed`); não há CAD
  cotado, blocos de contacto NO/NC, serigrafia nem capa.

## Critérios de aceitação

1. D52-2066 sem túnel; poços frontais 1/2 e 3/4 abertos com parafusos captivos
   visíveis à profundidade certa; bornes 1/2 em baixo e 3/4 em topo conforme o
   esquema de instalação; `test:terminal-geometry` e `test:meters-schneider`
   verdes.
2. GRT8-M1/B1: parafusos captivos nas plataformas frontais recuadas (não
   flutuantes), entradas de condutor topo/base; zero parafusos duplicados.
3. Condensador com 6 lâminas faston 6,3 mm físicas alinhadas aos 6 bornes;
   cabo encaixa automaticamente no pino; sobreposições 2D resolvidas.
4. Buzzer fiel: caixa traseira 47×47 com 4 parafusos de canto, etiqueta
   «BUZZER / AC110V / tend» na traseira, 2 bornes de parafuso; pescoço Ø30,
   aro cromado serrilhado Ø35, tampa preta com ranhuras radiais.
5. `pushButtonXb2No`/`pushButtonXb2Nc`: GLB cotado (cabeça metálica Ø29/
   furação Ø22, placa zamac, bloco de contacto com serigrafia), capa webp,
   funcionamento NA/NF momentâneo com retorno, clique press-and-hold com
   gating de simulação, símbolo IEC associado, datasheet local.
6. Pente encaixa (snap + bridges elétricas) em todos os BREAKER_TYPES com
   pistas calibradas, incluindo genéricos 4P/DR/QM e DPS WEG.
7. `test:ci:fast` (ou equivalente) executa o núcleo sem as suites de browser.
8. Sem regressões: typecheck, `npm test`, `test:industrial`,
   `test:terminal-geometry`, `test:meters-schneider`, `test:comb-*` focados.

## Ficheiros previstos

- `src/three/digitalMeterModel.ts` (poços 3/4)
- `scripts/build-industrial-devices.mjs` (buzzer fiel; GEYA ajuste)
- `scripts/build-capacitor-faston.mjs` (novo) + `public/models/motores/capacitor-run-generic.glb`
- `src/three/industrialFinish.ts` (remover patch flutuante; estado XB2)
- `src/electrical/industrialDevices.ts` (novos tipos XB2, bridges, grupo Comando)
- `src/electrical/engine.ts` / `iecAssociation.ts` / `src/audio/sfx.ts`
- `src/three/combMount.ts` + `src/electrical/realInterfaces.ts` + `src/three/modelPaths.ts`
- `package.json` (`test:ci:fast`) · `public/component-covers/*xb2*.webp`
- `public/datasheets/industrial/keolea-xb2.pdf` (ficha local reconstruída)

## Fora de âmbito / limites

- Sem STEP oficial KEOLEA/Metaltex: reconstruções cotadas declaradas, nunca
  apresentadas como CAD do fabricante.
- GRT8-M2 (2 inversores) fica registado no Backlog; M1/B1 cobrem o pedido.
- Publicação em produção só após validação local focada; CI global tem falhas
  de baseline históricas já registadas (não introduzir novas).
