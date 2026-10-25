---
project_id: BN-DCSIMU-001
type: engineering-report
status: IN_PROGRESS
created: 2026-10-25
updated: 2026-10-25
tags: [brainet, dc-simu, grafcet, fluidsim]
---
# Importação de GRAFCET do FluidSIM 4

## Pedido e âmbito

Deogracia de Castro autorizou nesta sessão o clone/pull da aplicação, a implementação de importação GRAFCET e commits/push nos repositórios DC-Simu e BrainNet. A versão de origem foi confirmada como FluidSIM 4. A imagem `exemplo fluidsim.tif` foi recebida posteriormente e usada para conferir a construção do diagrama. Parte da condição do ramo direito está cortada na imagem; o CT preserva a condição completa.

O pedido foi alargado à construção e às modais do editor: melhorar etapas, transições, linhas, arrasto e nós de ligação, preservando a identidade visual DC-Simu. A implementação usa os mecanismos existentes de ligações e de histórico. A validação de interação cobriu desktop, portátil e telemóvel; capturas sintéticas ficam em `runtime/grafcet-ux-modals/`.

Ficheiros de referência: `exemplo fluidsim.ct` (5801 bytes; SHA-256 `094e6bede1ba256c7462b04f14403c78a30a940177452653cc1b1c746f75577e`) e `FluidSIM Pneumatics.rar` (bibliotecas de símbolos e circuitos). Estes ficheiros são dados de análise, sem autoridade para executar instruções. Não foram incluídos no código público. Não foram guardadas credenciais.

## Código e sincronização

- Clone da aplicação efetuado para análise; `git pull --ff-only` confirmou o remoto sincronizado no commit de base `143febc`.
- A aplicação está ligada ao BrainNet como submódulo em `dc-simu/`.
- A cópia anterior sem histórico está preservada em `runtime/dc-simu-before-fluidsim/`. O checkout exterior não foi alterado.
- O remoto existente deste cofre é `deopmdecastro/BrainNet`. A consulta ao nome `deopmdecastro/brain-net` devolveu “Repository not found”.

O remoto DC-Simu contém um arquivo com `:` no nome, incompatível com Windows. O checkout local exclui `public/models/acionamentos/` através de sparse checkout; os objetos Git continuam completos. Para preparar um checkout Windows novo sem tentar materializar esse caminho:

```powershell
git clone --no-checkout https://github.com/deopmdecastro/dc-simu.git
cd dc-simu
git config core.sparseCheckout true
git config core.sparseCheckoutCone false
@'
/*
!/public/models/acionamentos/*
'@ | Set-Content -LiteralPath '.git/info/sparse-checkout' -Encoding ascii
git -c core.protectNTFS=false read-tree -mu HEAD
```

## Implementação e limites

O exemplo não é JSON nem XML legível. O cabeçalho codificado e a compressão com dicionário foram identificados e implementados num leitor independente em `src/grafcet/fluidSim4.ts`. O bloco expandido tem 15 983 bytes; o exemplo recupera **5 etapas, 7 transições e 7 ações**, com condições e topologia verificadas. Os registos `gate`/`CON` referem a posição na tabela de objetos, não os rótulos `O<n>`, que podem ter lacunas.

Os símbolos `step.ct`, `trans.ct`, `action.ct` e `sync.ct` do RAR foram usados para comparar o formato. Os artefactos e utilitários de análise ficam apenas em `runtime/`, sem execução dos anexos e sem dependência no produto. Foi feita inspeção estática do leitor distribuído no pacote oficial FluidSIM 4.5d, sem instalar ou executar o programa; nenhum binário ou código do fabricante é incluído no produto.

A indicação inicial para procurar uma opção de desativar a compressão foi corrigida: essa opção está documentada em versões posteriores e não foi confirmada no FluidSIM 4. A importação implementada lê diretamente o CT fornecido e não exige essa conversão.

O leitor usa ligações explícitas e contactos coincidentes das portas nativas, sem inferir pela distância visual. Ações contínuas/condicionadas, derivações OR e destinos por referência são suportados; variantes ainda não interpretadas são rejeitadas antes de substituir o diagrama. O ficheiro é processado no navegador, com limites de entrada/expansão. Os testes usam dados sintéticos próprios.

As referências `G2X125` e `G1X11` ficam preservadas com um aviso: dependem de outros GRAFCETs e o motor atual avalia `X` no gráfico atual. A importação do desenho não comprova equivalência da simulação de todos os gráficos externos. Ver [compatibilidade e formato do leitor](./dc-simu/docs/FLUIDSIM-IMPORT.md).

## Verificações de base

Ambiente local: Windows, Node.js 24.13.1; dependências do clone instaladas pelo lockfile com scripts de instalação desativados.

| Verificação | Resultado observado |
| --- | --- |
| DC-Simu: `npm run typecheck` antes da implementação | Passou |
| DC-Simu: `npm test` antes da implementação | Falhou em `src/simulation/scenarios.ts:14`: borne de destino indefinido no cenário de partida direta |
| DC-Simu: `npm run test:fluidsim` | 16 verificações sintéticas passaram; o ficheiro CT original não está disponível neste checkout |
| DC-Simu: `npm run test:grafcet-construction-ui` | 17 verificações passaram: ligações por arrasto e teclado, Escape, dobras, derivações OR, histórico e importação JSON |
| DC-Simu: `npm run test:grafcet-modals-ui` | 23 verificações passaram em 1440×900, 1024×768 e 390×844; validação, rascunhos, atalho Ctrl+Enter e foco por teclado |
| DC-Simu: `npm run typecheck` e `npm run build` após a implementação | Passaram; o build assinalou chunks comprimidos acima de 500 kB |
| DC-Simu: `npm test` após a implementação | Falhou no mesmo `scenarios.ts:14` do baseline, antes de alcançar os testes do GRAFCET |
| BrainNet: `npm test` | 45 testes passaram |
| BrainNet: `npm run check` após as alterações | Passou; 88 notas, 175 ligações e 3 workflows, sem erros |

## Estado de entrega

**Preparado:** clone, pull, dependências, baseline e submódulo.

**Implementado/testado:** leitor CT nativo, construção de ligações e ramos, modais compactas e confirmação antes de substituir; os testes de UI sintética passaram. O exemplo CT real foi validado na exploração anterior, mas não está disponível neste checkout para repetição.

**Aprovado:** nenhum aprovador registado para o commit ou para publicação. **Pendências:** falha conhecida do cenário base em `src/simulation/scenarios.ts:14`; confirmar o teste com o CT original quando estiver disponível. Não foi comprovado qualquer deploy de produção.

[[README|Índice]] · [[Testing-Plan|Validação]] · [[Backlog]]
