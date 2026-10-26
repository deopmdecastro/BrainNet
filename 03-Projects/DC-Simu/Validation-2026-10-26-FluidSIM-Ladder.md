---
project_id: BN-DCSIMU-001
type: validation-record
status: IMPLEMENTED_TESTED
created: 2026-10-26
updated: 2026-10-26
tags: [brainet, dc-simu, qa, grafcet, fluidsim, ladder, depuracao]
---
# FluidSIM .ct e blocos/depuração Ladder — 2026-10-26

## Pedido

1. Verificar a importação dos GRAFCETs feitos no FluidSIM (formato `.ct`):
   - as linhas devem vir bem feitas e o mais parecidas possível com o GRAFCET real;
   - as variáveis das ações devem ficar no formato aceite pelo simulador;
   - `NOT` passa a `/` e há espaço à volta de `+` e `*`.
2. Ladder: blocos LIMIT/SCALE, JMP/LBL e XOR, e modo passo a passo com pontos de paragem.

## Problemas encontrados (FluidSIM)

O ficheiro enviado (`Monta-Carga.ct`) ficou fora dos repositórios. O seu SHA-256 é `d6f643d6…d0be4b5`.

| # | Problema | Causa |
| --- | --- | --- |
| 1 | Fluxo invertido: o retorno era lido como `5→1`, `10→5`, `15→10` e `1→15` | Etapas e transições com `FLIPPED I 2` trocam as portas 1/2, e o leitor usava sempre a porta 1 como entrada. A nota de 2026-10-25 registou estas relações como corretas, o que estava errado (ver [[FluidSIM-Import]]). |
| 2 | Ficheiros com circuito elétrico misturado eram rejeitados ou desalinhavam os índices | DDEInput/DDEOutput EasyPort, `E_K001`, `E_S011`, `E_Y001`, polos, `EConnection`, `CON ELine`, `text` e um `BEGINSYM…ENDSYM` com conteúdo |
| 3 | Ficheiros com cabeçalho `PREVIEW <n>` + WMF binário não eram lidos | Só se conhecia o marcador `END_FSPREVIEW` |
| 4 | Condições com `NOT`/`AND`/`OR` e espaços irregulares | Não havia normalização para a sintaxe do DC-Simu |
| 5 | O retorno 15→1 era desenhado por um caminho automático, diferente do original | Os segmentos nativos `L` eram ignorados |
| 6 | O título «Q1» perdia-se | Os registos `text` não eram importados e o editor não desenhava comentários |

## Implementação

**DC-Simu, commit `684bf17` (carimbo #54).**

**FluidSIM** (`src/grafcet/fluidSim4.ts`, `GrafcetEditor.tsx`)
- Direção das portas por geometria: a entrada é a porta de cima. Se a geometria não for conclusiva, usa-se o bit 2 de `FLIPPED` (DC-ADR-024).
- Registos não GRAFCET ficam na tabela de objetos, mas são ignorados, com um aviso «O ficheiro também tem N elemento(s) que não são GRAFCET».
- O bloco `PREVIEW` é saltado pelo tamanho.
- `normalizeFluidSimCondition`: `NOT`/`!` → `/`, `AND` → `*`, `OR` → `+`, com ` + ` e ` * ` espaçados (DC-ADR-025).
- `normalizeFluidSimVariable`: remove acentos e caracteres inválidos, acrescenta o prefixo `V` a nomes que comecem por um dígito e mantém o `+`/`-` final, com aviso.
- Retornos com `linkBends` vindos do traçado nativo e seta ▲ no troço ascendente.
- Comentários `text` importados e desenhados.

**Ladder**
- XOR (contacto com dois operandos), LIMIT, SCALE (NORM_X + SCALE_X), JMP/JMPN e LBL: motor, lint, paleta, desenho TIA, diálogos e `collectUsedAddresses`.
- Os saltos são só para a frente; as networks saltadas não correm (DC-ADR-026).
- Separador «Depuração»:
  - pontos de paragem por network (botão ● ou F9) com três condições;
  - pausa automática no fim do scan, destaque da network e evento PT-PT;
  - «Passo (1 ciclo)» (F10);
  - rasto do último ciclo, percorrível network a network (DC-ADR-027).
- Detalhes: [LADDER-BLOCOS-DEPURACAO.md](./dc-simu/docs/LADDER-BLOCOS-DEPURACAO.md).

## Evidência

| Verificação | Resultado |
| --- | --- |
| `Monta-Carga.ct` importado | 4 etapas, 4 transições, 2 ações. Relações `1→5`, `5→10`, `10→15`, `15→1`. Condições `(SappelN1 + SenvoiN1) * SfdcPF`, `FdcN2`, `(SappelN1 + SenvoiN1) * SfdcPF`, `FdcN1`. Ações `Q_Monter` (etapa 5) e `Q_Descendre` (etapa 15). O retorno segue o traçado nativo e o comentário é «Q1». GRAFCET→Ladder: 15 networks, sem avisos. |
| Comparação visual com a pré-visualização FluidSIM | Disposição equivalente: retorno pela esquerda, título Q1, ações à direita |
| `npm run test:fluidsim` (com `FLUIDSIM_MONTA_CARGA`) | 24 verificações passaram |
| `npm run test:ladder-blocks` (novo) | 57 verificações passaram |
| `npm run test:ladder-blocks-ui` (novo, navegador) | 25 verificações passaram. Incluem: pausa no ponto de paragem com o ciclo completo, passo de exatamente 1 ciclo, network saltada com saída retida, F9 e ausência de erros de página. |
| `npm run test:ci` | Passou (inclui `test:ladder-blocks`) |
| Provas de interface de regressão | `editors-sweep-ui` 19, `grafcet-construction-ui` 20 (com o CT enviado: 4/4), `grafcet-modals-ui` 23, `grafcet-ui` e `editor3d-ui` passaram |
| `tsc -b` e `vite build` | Passaram |

## Estado

- **Preparado:** análise do ficheiro enviado, desenho dos blocos e da depuração.
- **Implementado:** tudo o que está acima, publicado em `dc-simu` (`684bf17`) e neste cofre.
- **Testado:** localmente, conforme a tabela de evidência.
- **Aprovado:** ainda não há aprovação registada.
- **Pendências:**
  - Validar no navegador do utilizador com outros `.ct` (macroetapas, sincronizações AND).
  - O passo a passo percorre o rasto de um ciclo já executado e não executa uma network a meio do scan (limite intencional, DC-ADR-027).
  - O SCALE não lê diretamente palavras de entrada analógica (`IW`); use `MW` ou DB.
  - O deploy em produção não foi verificado.
