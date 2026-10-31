# Referências dos símbolos no esquema de comandos

## Pedido
Melhorar a posição do nome/referência (F1, Q1…) dos símbolos, colocá-lo à esquerda e permitir arrastar, mudar tamanho, rotação e cor.

## Implementação
A referência dos símbolos fica à esquerda por omissão, sem mover o símbolo nem os bornes; as ligações entre páginas conservam a posição anterior para proteger a apresentação desses conectores. Na ferramenta Selecionar, arrastar o texto desloca só a referência; a posição é relativa ao símbolo e acompanha-o ao mover. No Inspetor estão disponíveis tamanho, rotação, cor e botão para repor os valores. Estas propriedades são guardadas no esquema, e o ajuste da vista inclui os limites aproximados do texto. Miniaturas do editor 3D foram ajustadas para não cortar a referência. A formatação não altera o identificador elétrico nem as ligações e está desativada durante a simulação.

## Testes
- `npm run typecheck`, `npm run test:commands` e `npx tsx scripts/qet-symbols-smoke.tsx`: passaram.
- `npx -y node@22 scripts/commands-tag-ui-smoke.mjs`: passou — posição, arrastar, símbolo e cabos intactos, tamanho, rotação, cor e reposição.
- `npx -y node@22 scripts/commands-ui-smoke.mjs`: 29 verificações passaram, incluindo criação, cablagem, simulação e desfazer.

## Publicação
Commit DC-Simu `8baea42`, dependente de `69a900a`, ambos locais. O push foi tentado, mas continua bloqueado porque o ambiente não tem credenciais Git configuradas. O ponteiro do submódulo BrainNet também deve ser publicado após o DC-Simu. Deploy não confirmado.
