---
project_id: BN-DCSIMU-001
type: engineering-report
status: IN_PROGRESS
created: 2026-10-25
updated: 2026-10-26
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

**Implementado/testado:** leitor CT nativo, construção de ligações e ramos, modais compactas e confirmação antes de substituir; os testes de UI sintética passaram. O exemplo de 5 etapas/7 transições usado na exploração anterior não foi incluído neste checkout; a nova amostra é uma validação separada.

## Atualização — nova amostra CT (2026-10-25)

Foi analisado um ficheiro FluidSIM 4 enviado nesta tarefa, sem o guardar no repositório. O leitor recuperou **4 etapas, 4 transições e 2 ações**, com ligações `5→1`, `10→5`, `15→10` e `1→15` (**correção 2026-10-26:** estas relações estavam invertidas por causa do bit `FLIPPED`; as relações corretas são `1→5`, `5→10`, `10→15` e `15→1`, ver a atualização abaixo); as ações ficaram associadas às etapas 5 e 15, as condições coincidiram com a referência visual e não houve avisos. A análise encontrou espaços duplicados em torno do operador OR. O leitor passou a normalizá-los e o smoke sintético ganhou cobertura para esse caso.

**Verificações após o pull:** `npm test` passou; `npm run test:fluidsim` passou com 17 verificações, incluindo a normalização de espaços; `npm run test:grafcet-construction-ui` passou com 19 verificações, incluindo a importação do CT enviado através do seletor real; `npm run build` e `npm run check` passaram. O build mantém o aviso de chunks acima de 500 kB. A nota técnica [FLUIDSIM-IMPORT.md](./dc-simu/docs/FLUIDSIM-IMPORT.md) descreve o âmbito e o resultado sem incluir o ficheiro de referência.

**Aprovado:** nenhum aprovador registado para publicação. **Pendências:** não foi comprovado qualquer deploy de produção. O CT da exploração anterior permanece fora deste checkout; a nova amostra enviada nesta tarefa foi verificada ponta-a-ponta.

[[README|Índice]] · [[Testing-Plan|Validação]] · [[Backlog]]

## Atualização — FLIPPED, ficheiros mistos e normalização (2026-10-26)

O ficheiro `Monta-Carga.ct` enviado (mantido fora dos repositórios) revelou seis problemas, corrigidos em `dc-simu` `684bf17`:
- direção das portas com `FLIPPED`, que antes invertia o fluxo;
- ficheiros com circuito elétrico misturado;
- cabeçalho `PREVIEW <n>`;
- normalização `NOT` → `/`, ` + `, ` * `;
- variáveis de ações em formato válido;
- traçado nativo do retorno e comentário «Q1».

Resultado: `1→5`, `5→10`, `10→15`, `15→1`, com as condições `(SappelN1 + SenvoiN1) * SfdcPF` / `FdcN2` / `(SappelN1 + SenvoiN1) * SfdcPF` / `FdcN1`. Evidência e estado em [[Validation-2026-10-26-FluidSIM-Ladder]]; decisões DC-ADR-024 e DC-ADR-025 em [[Decision-Log]].
