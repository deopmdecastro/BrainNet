---
project_id: BN-DCSIMU-001
type: validation
status: COMMITTED_PUSHED
created: 2026-11-22
updated: 2026-11-22
tags: [brainnet, dc-simu, tomadas, famatel, efapel, roadeu, fidelidade]
---
# Fidelidade das três tomadas às fotografias

## Resultado

Os três modelos anteriores eram aproximações demasiado simples. Foram reconstruídos como geometria procedural, usando as fotografias fornecidas pelo utilizador para a aparência e documentação primária para identificar referências e cotas disponíveis. Implementado e testado sobre `fd5071a`; reunido no commit [`d8fa230`](https://github.com/deopmdecastro/dc-simu/commit/d8fa230201be8aedbe654df284a2e5848a3a9f14) e enviado para `origin/main` após o pedido «commit e push». As alterações locais da revisão anterior foram preservadas. Ver o [registo de entrega](./Delivery-2026-11-22-Correcoes-Maquetes-Tomadas.md).

Não se afirma correspondência metrológica a um CAD do fabricante: as dimensões exteriores e os detalhes interiores das duas caixas industriais não estavam cotados nas referências disponíveis. A caixa e os mecanismos são uma reconstrução visual. A montagem interna de cablagem é funcional e estimada, não uma reprodução certificada de cablagem de fábrica.

## Referências e cotas

| Referência | Informação confirmada | Aplicação no modelo |
| --- | --- | --- |
| [EFAPEL — ficha técnica Estanque 48](https://www.efapel.com/media/Aparelhagem-Estanque-624d711457614.pdf) e [catálogo de produtos](https://www.efapel.com/media/Geral-67ab81d3b1706.pdf) | Corpo simples 64 × 74 mm, profundidade 51,7 mm; Schuko 48132 C, 16 A / 250 V; gama IP65 | Corrigidas as dimensões anteriores de 76 × 76 × 52 mm; tampa, junta circular, quatro parafusos, moldura, alvéolos e clips PE seguem a fotografia |
| [RoadEu — produto 70929](https://roadeu.com/sklep/en/produkt/switched-16amp-socket-3p-230v-monophase-cee-socket-with-padlockable-power-isolator-ip44/?v=d41d8cd98f00) | Tomada CEE 2P+E, 16 A / 230 V, seccionador de 20 A, IP44, entrada PG16 | Identidade corrigida para RoadEu; base azul com três alvéolos, pega vermelha, aro elevado, placa amarela, bloqueio e aviso lateral. Caixa estimada: 185 × 115 mm; profundidade nominal com aparelhos: 112 mm |
| [FAMATEL — ficha das bases inclinadas](https://famatel.com/wp-content/uploads/23230.pdf) e [catálogo histórico 2022](https://famatel.com/wp-content/uploads/TARIFA-PROFESIONAL-2022.pdf) | 23331 identifica a base CEE 3P+N+T 16 A, 380–415 V, flange 75 × 85 mm e inclinação 10°; ligação por parafuso | Base vermelha de cinco alvéolos, flange inclinada, Schuko azul, fechos de quarto de volta, orelhas de fixação e entradas laterais. Caixa estimada: 200 × 150 mm; profundidade nominal com aparelhos: 128 mm |

O PDF FAMATEL atual descreve IP54; o catálogo histórico e a fotografia fornecida mostram a variante IP44. O modelo conserva a variante fotografada, sem alterar a inscrição para uma versão de produto diferente. A referência 23331 não é apresentada como referência da caixa completa.

As larguras/alturas nominais das caixas não incluem orelhas de fixação nem bucim. O tamanho dos pormenores não cotados, incluindo molas, pega e cavidades internas, foi estimado pelas fotografias. As imagens não permitem medir os interiores ocultos.

## Alterações implementadas

- Caixa de paredes ocas com cantos arredondados, tampa separada, junta de montagem, entradas pré-marcadas e fixações.
- Schuko com poço, dois alvéolos vazados a 19 mm e clips de terra superior/inferior. Não se usam círculos escuros pintados sobre uma superfície sólida para representar furos.
- CEE azul RoadEu com três alvéolos e CEE vermelha FAMATEL com cinco, contactos metálicos, gola, chave e charneira.
- Tampas FAMATEL com movimentos independentes; EFAPEL com junta circular e nervuras na face interior da tampa. Levantar uma tampa de uso mostra a tomada, não uma régua de bornes.
- Acesso distinto à cablagem através do inspetor: retira a frente de serviço e expõe os bornes internos. O bucim surge quando existe cablagem, preservando a apresentação sem bucim das fotografias.
- Identidade RoadEu corrigida no catálogo e em projetos legados. O identificador interno `socketFamatelSwitch` foi mantido para compatibilidade.
- Alvéolos expostos como pontos de ligação de saída, com continuidade até aos bornes de entrada. O seccionador RoadEu corta L e N; PE mantém continuidade. O tipo não é fonte de energia.
- O seccionador respeita a regra global de manobra: bloqueado em STOP, utilizável em RUN/PAUSA. As tampas de montagem podem abrir em STOP.
- Migração conserva os IDs dos bornes existentes, as ligações e ajustes manuais de posição; acrescenta as saídas novas sem duplicar. A saída da base vermelha segue a sua inclinação de 10°.
- Biblioteca, turntable e vista frontal passam a capturar a mesma geometria procedural da vista 3D. Foram geradas três capas e três vistas frontais WebP.

## Verificações e evidências

| Verificação | Resultado |
| --- | --- |
| `npm run build` | TypeScript, Vite e PWA concluídos; permanecem avisos anteriores de tamanho dos bundles/imports |
| `npm run typecheck` após a calibração final dos bornes | Passou |
| `npm test` | Passou |
| `npm run test:sockets` | 15 verificações passaram: cavidades por raycast contra as malhas, continuidade, isolamento L/N/PE, alinhamento, migração, tampas independentes, seccionador e persistência |
| `npm run test:sockets-ui`, servidor local em `127.0.0.1:5178` | 11 verificações passaram com cliques reais no `Panel3D`, incluindo tampas, seccionador em STOP/PAUSA, acesso à cablagem e ausência de exceções React/WebGL |
| `test:maquetes`, `test:component-validate`, `test:sim-edit-lock`, `test:cad-surface`, `test:inspector-contracts` | Passaram |
| `test:manobra-gate` | Passou; o teste de texto foi corrigido para aceitar CRLF e LF sem alterar a regra |
| Capas das três tomadas | Os seis WebP existem e estão no manifest. O gerador global termina com erro por falta da capa anterior de `mecHz20VacuumCylinder`, fora deste pedido |
| BrainNet `npm test` | 45 testes passaram |
| BrainNet `npm run check` | Mantém falhas documentais anteriores; não é um resultado verde global do cofre |
| `git diff --check` | Sem erros de whitespace |

As capturas finais estão em [Evidências visuais](./Evidence-2026-11-22-Tomadas-Fidelidade/README.md). As nove capturas de teste (fechado, aberto e serviço por tipo), a ficha EFAPEL e a conferência visual do PDF estão também em `dc-simu/runtime/socket-fidelity/`, local e ignorado por Git.

## Ficheiros desta alteração

- `src/electrical/socketDevices.ts`: referências, cotas nominais e posições dos contactos.
- `src/three/socketDeviceModel.ts` e `src/three/SocketDevices3D.tsx`: geometria e interação.
- `src/electrical/factory.ts`, `src/electrical/engine.ts`, `src/three/modelPaths.ts`: catálogo, migração, continuidade e tamanho físico.
- `src/components/DeviceControls.tsx` e `src/three/Panel3D.tsx`: acesso às tampas/cablagem e cliques.
- `src/three/proceduralKinds.ts`, `proceduralCaptureObject.tsx` e `proceduralSurface.ts`: captura e acabamento partilhados.
- `scripts/socket-devices-smoke.ts`, `scripts/socket-devices-ui-smoke.mjs` e `package.json`: testes reutilizáveis, integrados nas suites CI normal e rápida.
- `scripts/manobra-gate-smoke.ts`: compatibilidade CRLF/LF; `scripts/ready-maquettes-smoke.ts`: dimensão EFAPEL atualizada.
- `public/component-covers/manifest.json` e os seis novos WebP das tomadas.

## Estado de aceitação

Reconstrução visual implementada, inspecionada em render, testada e enviada ao remoto. Não representa certificação CAD. Cotas e interiores não documentados das caixas industriais continuam explicitamente estimados. A falha de geometria MICO, as junções de esteiras 3D e as falhas documentais registadas na revisão anterior pertencem a outros âmbitos e não foram declaradas resolvidas por esta tarefa.
