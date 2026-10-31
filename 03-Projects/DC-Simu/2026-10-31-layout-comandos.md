# DC-Simu — layout do editor de comandos

## Objetivo
Alinhar o editor de esquema de comandos ao layout do editor 3D e ao fluxo GRAFCET.

## Alterações
- Canvas SVG único preservado para colocação, ligação, pan e zoom.
- Lado esquerdo com abas **Biblioteca** e **Inspector**.
- Lado direito com abas **GRAFCET**, **Entradas** e **Objetos**.
- Barra de ferramentas mantida no topo com ações de exemplos, rotação, apagar, limpar, ajustar e simular.
- Estados de simulação continuam ligados ao mesmo modelo de comandos e às mesmas referências IEC.

## Comunicação
O DC-Simu é a fonte executável. Este registo no BrainNet serve como contexto de produto e ponto de ligação com workflows/Maestri para futuras automações de sincronização, testes e publicação.

## Validação
`pnpm build` passou em 2026-10-31.
