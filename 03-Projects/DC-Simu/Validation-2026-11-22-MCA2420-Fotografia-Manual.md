---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED_PENDING_VISUAL_APPROVAL
created: 2026-11-22
updated: 2026-11-22
tags: [dc-simu, compressor, maxxim, mca2420, manual, fidelidade]
---

# MCA2420 — reconstrução pela fotografia e manual original

## Resultado implementado

O compressor procedural foi revisto a partir da fotografia fornecida pelo utilizador. O depósito passou a ser um sólido de revolução com fundos elípticos completos, eliminando as tampas cortadas longitudinalmente e as superfícies sobrepostas. A carenagem passou a seguir o perfil lateral no plano XY, com espessura em Z, abaulamento e nervuras; a faixa de especificações acompanha essa superfície.

Foram revistos o percurso da mangueira trançada, o cotovelo de latão, o tubo de cobre, os corpos independentes do regulador e do pressostato, os manómetros, a chapa azul, o puxador, as rodas com raios visíveis e o apoio dianteiro. O depósito recebeu o logótipo original extraído da capa do manual. As capas da biblioteca e a vista frontal foram regeneradas com o mesmo modelo.

## Manual integrado

O ficheiro fornecido em `Downloads/MCA2420_Manual.pdf` substituiu o PDF resumido existente no endereço já usado pelo componente: `public/datasheets/pneumatics/maxxim-air-compressor-24l-manual.pdf`. A ligação de consulta/download continua a usar o registo `PNEUMATIC_DATASHEETS.airCompressor`, agora identificado como MCA2420.

- Documento original com 36 páginas, em português, espanhol e francês.
- Capa: fotografia dos modelos de 24 L e 50 L e logótipo MAXXIM.
- Páginas 5–8 do PDF: figuras auxiliares de montagem, transporte, motor e manutenção. São figuras genéricas; a página 5 avisa que podem diferir do equipamento.
- Página 35 do PDF: declaração que identifica o MCA2420 como 24 L e 2,0 HP. A carenagem mantém «1.8 HP», tal como na fotografia pedida; esta diferença está descrita nos metadados do PDF.
- Tamanho: 1 990 866 bytes. SHA-256 da origem e da cópia: `2464AAD7FBE434E7CD191A2324122A3B168B6F0AB4D38018EE7654F8898A7995`.

As indicações de operação do manual foram tratadas como conteúdo documental de referência.

## Ficheiros

- `dc-simu/src/three/PneumaticsDevices3D.tsx`: modelo, texturas, manómetros e libertação independente dos recursos ao mudar a pressão.
- `dc-simu/src/three/compressorGeometry.ts`: depósito, perfil da carenagem e decalque conformado; subdivisão uniforme para evitar fendas entre triângulos deformados.
- `dc-simu/src/three/pneumaticsModel.ts`: identificação do PDF e volume conservador de enquadramento do modelo.
- `dc-simu/public/component-textures/maxxim-logo.png`: logótipo extraído da capa do manual fornecido.
- `dc-simu/public/datasheets/pneumatics/maxxim-air-compressor-24l-manual.pdf`: manual original.
- `dc-simu/public/component-covers/airCompressor.webp`, `front/airCompressor.webp` e índice de capas: capturas atualizadas.
- `dc-simu/scripts/pneumatics-fidelity-ui-smoke.mjs`: verificações geométricas, atualização da pressão, abertura da carenagem, acesso ao PDF e capturas em várias vistas.

## Verificações e evidências

- `npm test` da aplicação: passou.
- TypeScript `tsc -b --noEmit`: passou.
- Regressão visual do compressor: passou, 142 malhas e sem exceções React/WebGL. Verifica proporções e secção circular do depósito, as duas metades das tampas, preservação dos decalques ao mudar a pressão e rotação da carenagem ao abrir.
- Manual servido localmente: HTTP 200, `application/pdf`, 1 990 866 bytes; logótipo carregado no navegador.
- `npm test` do cofre: 45 testes passaram.
- `npm run check` do cofre: falhou com 33 erros documentais na execução final, todos fora desta alteração (frontmatter e ligações de notas/skills existentes); nenhuma ocorrência associada a esta nota.
- Gerador de capas: criou as duas imagens do compressor; o comando termina com código 1 por quatro capas de outros tipos em falta: `buttonNO`, `buttonNC`, `selector2`, `selector3`.

[Vista frontal](dc-simu/docs/validation/maxxim-mca2420-reference/airCompressor-front.png) · [Vista isométrica](dc-simu/docs/validation/maxxim-mca2420-reference/airCompressor-iso.png) · [Extremidade](dc-simu/docs/validation/maxxim-mca2420-reference/airCompressor-end.png) · [Traseira](dc-simu/docs/validation/maxxim-mca2420-reference/airCompressor-rear.png) · [Carenagem aberta](dc-simu/docs/validation/maxxim-mca2420-reference/airCompressor-cover-open.png) · [Resultados](dc-simu/docs/validation/maxxim-mca2420-reference/results.json)

## Pendências e limites

Implementado e testado localmente; aprovação visual e publicação da aplicação pendentes. A pedido do utilizador, o código, o manual e as evidências foram registados no commit [191c670](https://github.com/deopmdecastro/dc-simu/commit/191c670fa2cf08f81d0ff8557cbd6b88f95d4dab) e enviados para `origin/main` em 2026-11-22. O hook acrescentou o carimbo de versão #279. O push regista o código no repositório; esta tarefa não executou deploy nem validação de produção.

A fotografia permite comparar o lado visível. O manual não fornece um desenho cotado completo nem vistas ortogonais específicas de todos os lados do MCA2420. A escala de enquadramento do simulador é uma aproximação conservadora, não uma dimensão de fabrico certificada. As partes ocultas e os pequenos detalhes ainda exigem fotografias adicionais ou CAD do fabricante para confirmar fidelidade integral; não se declara correspondência de 100%.
