---
type: validation
status: IMPLEMENTED_LOCAL
created: 2026-11-22
updated: 2026-11-22
tags: [dc-simu, mecatronica, maquete, validacao]
---
# Maquete de estampagem — adaptação às fotografias

Implementada localmente em `dc-simu`. A biblioteca, em **Maquetes prontas → Maquete ATEC · estampagem e transferência**, insere 42 componentes num único passo de histórico. A montagem também é entregue como ficheiro nativo `dc-simu/runtime/stamping-photo/maquete-estampagem.dc`.

## Resultado

- Torre CAD `towerLightSb23011` da biblioteca em substituição da torre genérica nesta montagem.
- Atuador com ventosa azul `PneumaticVacuumCup3D` reutilizado no braço, invertido e reduzido de Ø66 para Ø25. O corpo fica fixo; a haste e a ventosa fazem o curso vertical de 18 mm. O braço metálico mantém-se rígido.
- Pedestal circular com quatro espaçadores e encoder central; engrenagens em nylon branco e motor com acabamento metálico amarelo, de acordo com o aspeto das fotografias.
- HMI existente virada para o exterior (+X), com moldura, LCD, teclas e etiqueta traseira. Mantém-se disponível na biblioteca de Eletricidade, juntamente com os sensores da maquete.
- Caixa com duas filas de três operadores individuais da biblioteca: emergência, dois seletores, rearme azul, paragem vermelha e arranque verde. O inspetor da caixa remete para esses componentes independentes.
- Sensores ótico e indutivo com apoios, identificação e orientação na zona de recolha; FC1 e FC2 independentes. Gaveta com alojamento quadrado e prensa com camisa cilíndrica.
- Quadro vazio 400 × 500 × 180 mm sob a mesa, encostado a duas travessas da estrutura; calha vertical e ramal horizontal preparados até à entrada lateral com bucim M25, sem atravessar a porta. Porta fechada, editável.
- Orientações construtivas preservadas ao gravar e reabrir o projeto. Os componentes sem a marca da montagem conservam a política anterior de abertura.

## Cotas e limites

As fotografias são a referência visual; não fornecem medições suficientes para garantir uma réplica dimensional. A base desta variante passou a 700 × 700 mm, com pernas de 750 mm, para libertar os comandos e o bastidor. Estas cotas, as do pedestal, os apoios dos sensores e o quadro são estimativas editáveis. A prensa tem pórtico de 312 mm e curso de 94 mm para libertar o atuador reutilizado e chegar ao topo da peça.

Não foi confirmada a referência exata da HMI fotografada; reutiliza-se o modelo KTP700 já existente. A montagem é preparação mecânica: cablagem elétrica, tubagem completa e programa de controlo não foram acrescentados. Não houve publicação, deploy ou aprovação de produção.

## Ficheiros e evidências

Os principais ficheiros são `src/electrical/stampingBench.ts`, `readyMaquettes.ts`, `src/three/MechatronicsDevices3D.tsx`, `PneumaticsDevices3D.tsx`, `mechatronicsModel.ts`, `Panel3D.tsx`, `panelBounds.ts`, `src/store/useSimStore.ts` e `src/components/MechatronicsControls.tsx`. As capas em `public/maquetes/` foram regeneradas pelo renderizador da aplicação.

O teste `scripts/stamping-photo-ui.mjs` guarda vistas geral, de estações e do operador, medições da geometria real e o `.dc` em `runtime/stamping-photo/`. Verifica a normal do LCD, o quadro sob a mesa, os seis operadores fora da tampa, o curso vertical da ventosa e a rigidez do braço. `scripts/mechatronics-ui-smoke.mjs` verifica também o contacto com os tarugos e a folga para a prensa.

## Verificação

- Aplicação: `npm test`, TypeScript e ESLint aprovados.
- Mecatrónica: 13 verificações de lógica e 30 verificações no navegador aprovadas; contacto na recolha e na gaveta com desvio horizontal de 0,0 mm e curso vertical de 18,0 mm. Folga medida de 12,3 mm entre o prato recolhido e o atuador.
- Maquetes: 6 verificações de montagem/persistência e 22 verificações da biblioteca no navegador aprovadas; desfazer e refazer num único passo.
- Regressão do quadro: `test:enclosure-move` aprovado.
- Cofre: `npm test` aprovado, 45/45. `npm run check` continua reprovado por metadados/ligações já existentes noutras notas; esta entrega não os corrige.

Estado: **implementado e testado localmente**. Pendências: medições reais para validação dimensional, ligações e controlo se forem pedidos, e revisão visual pelo utilizador.

## Versionamento

Commit da aplicação: `b4c94d2e77260fd64c10b811a56fa3054b5bc0c5`, enviado para `origin/main` de `deopmdecastro/dc-simu` em 2026-11-22, após o pedido explícito «commit e push». Inclui código, testes, capas e carimbo de release #298. O BrainNet regista este commit no submódulo e conserva este relatório. Este envio Git não representa um deploy nem aprovação de produção.
