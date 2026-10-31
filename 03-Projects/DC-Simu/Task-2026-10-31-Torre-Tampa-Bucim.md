# Torre: tampa, bucim e identificação de fios

## Pedido
Fechar a abertura mostrada na base da torre com uma tampa e um bucim por onde saiam os fios; apresentar no sensor e na torre bolas com os nomes dos fios, como bornes.

## Implementação
- Na torre CAD SB2-3011, tampa retangular, parafusos e bucim central procedurais cobrindo a abertura; dimensões aproximadas para apresentação, não uma especificação do fabricante.
- Os quatro condutores R/Y/G/COM saem do bucim e abrem em leque até às pontas elétricas existentes. IDs, coordenadas das pontas, projetos guardados e ligações não são alterados.
- No modo de ligação ou sondagem do painel 3D, terminais de fio solto recebem esferas visíveis com os respetivos nomes (incluindo COM/NA/NF do sensor e R/Y/G/COM da torre). Os textos são orientados para a câmara. A lógica de ligação é a existente.

## Testes e limites
`npm run typecheck`, `npm run test:lead-pigtails` e `npm run test:native-wires-3d` passaram. Renderização isolada da torre CAD examinada visualmente: tampa cobre a abertura e quatro fios saem do bucim. O teste de geometria confirma saída pelo bucim e preservação das pontas e dos terminais após reabertura. Não foi testado o fluxo completo de ligação interativa com as etiquetas no painel 3D nem o deploy.

## Publicação
Commit local DC-Simu `fafb39f`. Push tentado, ainda sem credenciais Git no ambiente. Publicar primeiro todos os commits DC-Simu pendentes e depois os de BrainNet; o ponteiro do submódulo depende do primeiro.
