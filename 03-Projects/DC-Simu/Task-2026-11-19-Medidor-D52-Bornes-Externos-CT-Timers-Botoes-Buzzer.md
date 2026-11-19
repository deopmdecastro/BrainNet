---
project_id: BN-DCSIMU-001
type: task
status: IN_PROGRESS
created: 2026-11-19
updated: 2026-11-19
# commits: 9074dd0 medidor | a5c0133 timers | 69f68b1 pente | b9d40ed buzzer+botões+unlock
tags: [dc-simu, cad, realismo, medidores, bornes, timer, botao, buzzer, pente, capacitor]
---

# Melhorias de realismo: medidor D52-2066 (CT externo), bornes de temporizadores, botões, buzzer, capacitor e pente universal

## Pedido e baseline

Utilizador forneceu fotografias e capturas de ecrã (IMG_5843–IMG_5861) do medidor D52-2066 em instalação com CT externo, temporizadores GEYA GRT8-M1/M2, blocos de contacto NO/NC KEOLEA KL-XB2, botões de pressão coloridos, sinalizador sonoro Metaltex TBY-301, capacitor e pente de ligação.

Prioridade: fidelidade ao componente real, bornes corretos, remoção de furo atravessante no medidor (variante CT externo), serigrafia, texturas, operação e encaixe do pente em todos os dispositivos compatíveis.

## Alterações realizadas (2026-11-19)

### Medidor D52-2066 (meterD522066) — commit dc-simu 9074dd0
- Removido o furo/túnel de passagem do condutor primário no corpo (variante CT externo).
- Bornes 1/2 (tensão L/N) mantidos com entrada inferior + poços de parafuso frontais e parafusos captivos.
- Bornes 3/4 promovidos a terminais reais de CT secundário (S1/S2): entrada superior + parafusos captivos frontais.
- Atualizados factory terminals, realInterfaces, legacy positions, engine (sem bridge primário) e panelMeterModel (leitura de corrente via CT ligado ou escala 100 A / 50 mA no secundário).
- Comentários de origem e intenção preservados; não se afirma CAD oficial do fabricante.

### Temporizadores GEYA GRT8-M1 / B1 — commit dc-simu a5c0133
- Adicionados parafusos captivos com ranhura em cruz na face frontal (+Z), alinhados com as filas superior (A1/S/A2) e inferior (15/16/18).
- Bornes superiores e inferiores já existiam no geometry.json como sockets; os parafusos frontais completam o hardware visível na vista frontal.
- Reutiliza `buildCaptiveTerminalScrew` (mesmo hardware do medidor).

### Capacitor (capacitorRun60uF)
- Já possui 6 terminais (1, 1B, 2, 2B, 2C, 2D) com `terminalType: 'faston'` no factory e contact pin no realInterfaces.
- A seleção automática de ponta de cabo (`defaultWireEndTypeForTerminal`) já reage ao `terminalType` faston.
- Verificação visual do GLB e da disposição dos 6 pinos fica para aceitação; não inventar geometria extra sem cotas.

### Pente (comb busbar) — commit dc-simu 69f68b1
- BREAKER_TYPES alargado a Schneider iC60H, residuais Hager/Schneider (iID/iDPN), motor (PKZM/GV2) e residual genérico.
- Mapas de bornes de entrada (topo) cobrem 1P / 1P+N / 3P / 4P para snap e bridges em todos os dispositivos compatíveis.

### Buzzer + Botões + cadeados — commit dc-simu b9d40ed
- Buzzer TBY-301: tom piezo mais agudo (≈2.85 kHz, LFO leve, bandpass) — ainda didático, não SPL.
- PushButton3D: anel metálico, base estilo zinc alloy, cabeça colorida (respeita state.color), poços de borne frontais; proporções mais próximas de Ø29 / furação 22 mm.
- hasComponent3DVisual: buttonNO/NC, emergency, dual, selectors, capacitor, buzzer e timers GEYA passam a contar como representação 3D existente → deixam de mostrar cadeado no editor/painel quando já há visual procedural ou industrial.

### Próximos passos
1. Refinar ainda mais botões (blocos NO/NC KEOLEA separados, serigrafia completa, cover, símbolo IEC se em falta).
2. Otimizar suites de teste longas (execução em série / timeouts / smoke prioritários).
3. Aceitação visual dos pontos já publicados (medidor, timers, pente, botões, buzzer).

## Referências de imagem
- IMG_5843–IMG_5845: medidor D52-2066 e diagrama CT externo.
- IMG_5846–IMG_5852: temporizadores GEYA GRT8 e capacitor.
- IMG_5853–IMG_5859: botões, blocos NO/NC, buzzer Metaltex TBY-301.
- IMG_5860–IMG_5861: capturas 3D atuais da aplicação.

## Critérios de aceitação (visuais + funcionais)
- Medidor sem furo atravessante; bornes 1–4 utilizáveis e cotados.
- Temporizadores com parafusos visíveis na frente e bornes superiores fiéis.
- Botões e buzzer reconhecíveis face às fotos de produto.
- Pente encaixa e faz contacto em qualquer disjuntor/diferencial/aparelho com borne compatível.
- Sem regressões em medidores existentes, LCD, reset 5 s e projetos QGD.
