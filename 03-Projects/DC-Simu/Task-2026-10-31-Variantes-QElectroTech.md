---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_TESTED
created: 2026-10-31
updated: 2026-11-01
tags: [dc-simu, iec, qelectrotech, simbolos]
---
# Variantes IEC QElectroTech — 2026-10-31

## Objetivo e decisão
Verificar os catálogos Radica/Siemens e QElectroTech e integrar símbolos quando possível sem alterar a simulação ou as ligações existentes. O catálogo Radica é comercial e não foi identificada permissão de redistribuição: não foram copiados ficheiros. A coleção oficial QElectroTech disponibiliza os seus elementos sob CC BY 3.0 para redistribuição fora de esquemas; a licença da coleção também inclui uma restrição relativa ao uso como dados de exemplo para criar modelos de aprendizagem automática. O ficheiro de licença e a atribuição com origem, revisão, adaptações e ligações individuais estão em `dc-simu/docs/third-party/qelectrotech/`.

## Implementação inicial
Quatro variantes gráficas adaptadas da coleção IEC QElectroTech: fusível, resistência, condensador e díodo. No esquema de comandos, colocar o símbolo nativo, selecioná-lo e escolher «QElectroTech (IEC)» no Inspetor, em «Desenho do símbolo». A opção é guardada no componente do esquema, reversível e ausente por defeito em projetos existentes. Coordenadas adaptadas aos bornes existentes; motor, tipo, identificadores, cabos e polaridade não são alterados. A coleção completa não foi importada; outros elementos e associações ao editor 3D requerem mapeamento e validação próprios.

## Verificação
`npm run typecheck`, `npm run test:commands` e `npx tsx scripts/qet-symbols-smoke.tsx` passaram. O smoke verifica desenhos distintos, bornes com rotação, persistência JSON e normalização das quatro variantes, além de comparar simulação do exemplo de arranque direto com fusível nativo/QET. A interação completa no browser e o deploy não foram verificados.

## Publicação
Commit local DC-Simu `69a900a`. Push tentado mas bloqueado por ausência de credenciais GitHub nesta sessão; não publicar o ponteiro do submódulo BrainNet até o commit DC-Simu estar disponível no remoto. Depois autenticar de forma segura, publicar DC-Simu e em seguida BrainNet.
