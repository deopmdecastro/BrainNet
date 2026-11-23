---
project_id: BN-DCSIMU-001
type: task
status: IN_PROGRESS
created: 2026-11-23
updated: 2026-11-23
tags: [dc-simu, maquete, estampagem, calhas, esteiras, tubos, ar, agua, efeitos, cabos, tomadas, bucins, performance, realismo]
priority: high
---

# Tarefa: Melhorar acabamentos das calhas e esteiras elétricas + efeitos de fluido + organização de cabos

## Pedido do utilizador (23 Nov 2026)

1. **Melhorar acabamentos das calhas e esteiras elétricas** (referência visual: fotos de calhas metálicas perfuradas com junções aparafusadas, cantoneiras, tampas terminais — estilo industrial realista).
2. **Criar efeito de ar a passar nos tubos** (animação sutil de fluxo de ar comprimido).
3. **Efeitos de água a passar no tubo** — semelhante ao efeito de eletricidade (partículas/fluxo) mas visualmente distinto (cor azul-água, bolhas ou ondulação diferente).
4. **Cabos da esteira para tomadas**: devem ser **cabos revestidos** (sheath/capa externa), entram pelos **bucins** e os fios internos ligam nos bornes das tomadas.
5. **Tomadas fixas aparafusadas** no final das esteiras (parafusos visíveis de fixação).
6. **Tubo de ar nas esteiras estão partidas** — corrigir continuidade geométrica e junções.
7. **Melhorar a organização dos cabos**, usar **marcadores de cabos** (cable markers / ferrules labels).
8. **Verificar porque a maquete demora muito para carregar** (já houve otimização em Validation-2026-11-23-Otimizacao-3D-Esteiras-Build; investigar regressão ou hotspots restantes).

## Análise do código atual (23 Nov 2026 — leitura pré-implementação)

### Tubos de ar “partidos”
- Em `StructuresDevices3D.tsx` a função `TrayCableBundle` (linhas ~624–720) desenha os tubos/cabos decorativos **apenas nas esteiras retas** (`CableTrayStraight3D`).
- `CableTrayVerticalBend3D`, `CableTrayRiser903D` e cotovelos **não chamam** `TrayCableBundle` → os tubos de ar (`kind: 'tube'`, cor azul) ficam interrompidos nas descidas/verticais. Isto corresponde às capturas do utilizador.
- Os tubos pneumáticos reais da maquete (compressor → FRL → CPV10) são definidos em `stampingBenchWiring.ts` com `kind: 'pneumatic'`, `medium: 'pneumatic'` e usam o sistema de `Wire` + routing 3D (não o bundle decorativo).

### Cabos revestidos + bucins + tomadas
- Já implementado na validação de 23 Nov: 3G2,5 H07RN-F, sheath, ponteiras, entrada pelo bucim superior das tomadas RoadEu (`socketFamatelSwitch`), percurso pela esteira.
- Marcadores de cabos já existem em `WireMarkers3D.tsx` (anilhas clip-on industriais IEC 60062, geometria C/D, texturas de glifo). Reutilizar / garantir que os cabos das tomadas os usam.

### Efeitos de fluxo
- Não existe ainda efeito de fluxo de ar ou água nos tubos. `FaultEffects3D` tem partículas de faíscas/fumo — padrão a reutilizar.
- `PneumaticsDevices3D` tem `useFrame` para ventoinha e movimento mecânico; tubos são estáticos (`RigidTube` / `PuTubeStub`).

### Performance
- Otimização de 23 Nov (`a86bd964`) já cobre lazy-loading, pooling, LRU, perfis adaptativos. O “A carregar a vista…” provavelmente ainda sofre com o número de TubeGeometry dos ~100+ cabos + GLBs da maquete Estampagem no first load. Investigar `modelsLoading` e pre-warm.

## Contexto existente a reutilizar (não reescrever do zero)

- **Esteiras / calhas**: `src/schematic/ductJunctions.ts`, `src/three/StructuresDevices3D.tsx` (`TrayCableBundle`, cantoneiras, tampas), `WireMeshTrayDevices3D`, Validation-2026-11-22-Esteiras-Juncoes-3D.md, Validation-2026-11-23-Otimizacao-3D-Esteiras-Build.md.
- **Tomadas + bucins + cabos 3G2,5**: Validation-2026-11-22/23 sobre tomadas e cabos; `stampingBenchWiring.ts`, `wallPanelRouting.ts`. Já entram por bucim; confirmar sheath visual e aparafusamento.
- **Marcadores**: `src/three/WireMarkers3D.tsx` + `src/electrical/wireMarkers.ts` — já prontos, expandir uso.
- **Efeitos elétricos / partículas**: `FaultEffects3D` — reutilizar infraestrutura de partículas/shaders para ar e água.
- **Performance / loading**: `src/three/renderOptimization.ts`.
- **Design Principles**: azul de marca, PBR realista, feedback multimodal, gating de simulação.

## Critérios de aceitação

### Acabamentos calhas/esteiras
- [ ] Superfície metálica galvanizada com micro-relevo/perfurado coerente nas junções T e cantos.
- [ ] Cantoneiras aparafusadas (parafusos M6/M8 visíveis) em todas as junções horizontais e verticais.
- [ ] Tampas terminais nas pontas abertas; sem "corte abrupto" de perfil.
- [ ] Tubos de ar contínuos (sem gaps/partidos) ao longo das esteiras e descidas; uniões Push-In ou acopladores visíveis onde há mudança de direção.

### Efeitos de fluido
- [ ] Tubos pneumáticos (ar): animação sutil de fluxo (partículas ou shader de deslocamento) quando o circuito de ar está pressurizado / em simulação.
- [ ] Tubos de água (se existirem ou forem adicionados): efeito visual distinto do elétrico (azul-água, bolhas ou ondas) e do ar (mais "seco"/rápido).
- [ ] Performance: efeito desativado ou reduzido em perfil "low" / quando não em `running`.

### Cabos → tomadas
- [ ] Cabo externo revestido (sheath preta/cinza H07RN-F ou equivalente) desde a esteira até ao bucim.
- [ ] Entrada limpa pelo bucim; apenas os 3 condutores (L/N/PE) saem dentro da caixa da tomada e ligam aos bornes.
- [ ] Tomada aparafusada (parafusos de fixação visíveis na base/flange) no final da descida da esteira.

### Organização e marcadores
- [ ] Marcadores de cabos (ferrules / heat-shrink labels) nos pontos de ligação e em feixes longos (ex.: "3G2,5", "XS-MAQ", cores ou números).
- [ ] Filacagem e organização visual melhorada (sem "espaguete" nas descidas).

### Performance de carregamento
- [ ] Identificar e documentar o bottleneck principal do load da Maquete Estampagem (GLB count, TubeGeometry count, materiais, ou JS de wiring).
- [ ] Aplicar mitigação (lazy, pooling extra, pre-warm, ou redução de segmentos em first-load).
- [ ] Tempo de "A carregar a vista..." reduzido ou progress bar mais informativa.

## Caminhos previstos de código (dc-simu)

- `src/three/StructuresDevices3D.tsx` / `WireMeshTrayDevices3D` / `ductJunctions.ts` — acabamentos e continuidade de tubos.
- `src/three/Wires3D.tsx` / materiais de sheath — cabos revestidos + marcadores.
- `src/electrical/stampingBenchWiring.ts` + routing — confirmação de percurso e bucins.
- Novo ou extensão de `FaultEffects3D` / `PneumaticsDevices3D` / shader de fluxo para ar/água.
- `src/three/renderOptimization.ts` + pontos de entry de lazy load.
- Testes: `test:maquetes`, `structures-pneumatics-smoke`, novos smoke para efeitos e marcadores.

## Workflow

1. Leitura de contexto (este documento + Design-Principles + validações 22/23 Nov).
2. Inspeção do estado atual no código (após clone completo).
3. Implementação incremental com evidência visual (Playwright/capturas).
4. Testes + Validation document.
5. Commit/push em ambos (dc-simu + atualização de submódulo/BrainNet).

## Notas

- Priorizar reutilização de geometrias/materiais partilhados (já existentes no pooling).
- Não quebrar a otimização de FPS já implementada.
- Efeitos de fluido devem respeitar o gating de simulação (só em running/demo quando relevante).

## Plano de implementação gradual (passos)

### Passo 1 — Continuidade dos tubos de ar nas esteiras (prioridade alta, visual imediato)
- Em `CableTrayVerticalBend3D` e `CableTrayRiser903D`: adicionar segmentos de `TrayCableBundle`-like (ou cilindros alinhados) para os `state.cables` com `kind: 'tube'`, usando os mesmos materiais e cores.
- Ajustar `TrayCableBundle` para `fullRun` mais agressivo (inset menor) e para não cortar em demasia nas aberturas de piso quando o tubo deve continuar para a descida.
- Resultado esperado: tubos azuis contínuos nas capturas equivalentes a IMG_5950 / IMG_5951.

### Passo 2 — Acabamentos de junções e parafusos das tomadas
- Confirmar/reforçar cantoneiras e parafusos hex (já usam `SHARED_HEX_BOLT_GEO` + `BOLT_ZINC_MAT`).
- Nas tomadas RoadEu: garantir flange de fixação com 2–4 parafusos visíveis na base/costas (se o GLB/procedural não tiver, acrescentar em `socketDevices` ou no 3D da tomada).

### Passo 3 — Cabos revestidos + marcadores
- Garantir que os 3G2,5 das tomadas usam sheath material (`getSharedSheathMaterial`) e que `WireMarkers3D` é montado com labels tipo “3G2,5” / “XS-MAQ”.
- Já existe infraestrutura — apenas expandir a lista de wires que recebem marcadores.

### Passo 4 — Efeito de fluxo de ar (e água)
- Criar material partilhado ou shader simples (scroll de textura ou partículas leves ao longo do eixo do tubo) ativado quando `state.airSupplyOn` / pressão > 0 ou em modo running.
- Água: variante com cor `#0ea5e9` / bolhas, distinta do elétrico (amarelo/azul elétrico de FaultEffects).
- Desligar em perfil low e fora de simulação (gating).

### Passo 5 — Performance de carregamento
- Medir tempo até “vista pronta” na Maquete Estampagem.
- Se ainda alto: pre-warm dos materiais de sheath/tray, reduzir segmentos iniciais de TubeGeometry, ou progress bar mais granular com fases (modelos → cabos → efeitos).

## Estado atual do trabalho
- Task criada e análise de código concluída.
- Ficheiros-chave lidos via API (StructuresDevices3D, ductJunctions, stampingBenchWiring, renderOptimization, PneumaticsDevices3D, WireMarkers3D).
- Clone local completo do dc-simu ainda instável (repo grande); trabalho a prosseguir com patches incrementais + evidência no cofre.
- Próximo commit no BrainNet: esta atualização da task + eventual Validation parcial.
