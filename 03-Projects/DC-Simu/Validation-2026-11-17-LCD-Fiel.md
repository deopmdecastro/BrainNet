---
project_id: BN-DCSIMU-001
type: validation
status: LOCAL_LCD_VALIDATED_RELEASE_PENDING
created: 2026-11-17
updated: 2026-11-17
tags: [dc-simu, lcd, medidores, atv320, admin, catalogo, preservacao, release]
---
# LCD fiel — D52-2066, KWS-306 e ATV320

## Pedido e entrega delimitada

> Os novos componentes apresentam LCD fiel ao dispositivo real, quando aplicável.

**Implementação concluída e validada localmente; publicação remota desta revisão
não confirmada neste registo de preparação.** Não reabrir a reconstrução de todos
os corpos/CAD, o firmware do fabricante ou o teste GRAFCET legado fora deste âmbito.

- Commit canónico da aplicação: **`7990560a8873e58561042a7025888a09286bc8a9`**.
- Carimbo do hook: **r213.mwmlqehr**; baseline publicada **20150c0 / r212**.
- [Contrato técnico e reprodução](./dc-simu/docs/LCD-FIDELIDADE.md).
- Evidência desta revisão: [resultados LCD](./Evidence-2026-11-17-LCD-Fiel/results.json).
- O gitlink de release aponta exclusivamente para esse commit canónico, nunca
  para o HEAD pessoal aninhado. É preparado numa worktree independente.

## Comportamento entregue

1. **D52:** seis campos simultâneos na posição e cor das fotografias: W/amarelo,
   kWh/laranja, V/ciano, Hz/branco, A/vermelho, PF/azul; cinco posições de energia
   com precisão adaptativa e tratamento de limites/arredondamentos.
2. **KWS:** LCD horizontal 52 × 35,1 mm; três linhas V/A/kW em azul-violeta,
   vermelho e amarelo, energia/ciano, Hz e temperatura/branco. Energia medida
   pelo runtime é agregada e está identificada SUM, não fase A. As três vistas
   existentes conservam a grelha física, sem inventar páginas cheias de texto,
   configurações, proteções, Wi-Fi ou contadores de energia por fase.
3. **ATV320:** quatro posições vermelhas de sete segmentos, `rEF-`, `COnF`,
   valores de referência/monitorização/rampa e códigos explícitos conhecidos;
   avaria sem diagnóstico usa `----`, não cinco letras FAULT.
4. Algarismos/pontos/letras ATV são segmentos geométricos, não uma fotografia
   ou fonte do browser. Sem alimentação os visores ficam em branco. KWS
   alimentado com saída aberta conserva medições e indica OFF.
5. Mesma implementação em nativo, Admin e catálogo publicado. Texturas por
   instância, atualização de valores vivos e reutilização quando não mudam.
6. Admin: opção física/personalizada explícita; linhas, coordenadas, IDs,
   controlos e bornes escritos pelo autor mantêm-se no save/reopen/publish.
   A adaptação do antigo overlay fábrica é restrita ao ATV, exata e apenas em
   memória, sem reescrever definições persistidas.
7. Não se acrescentaram LCDs ao Finder/base, Geya, Avel, Metaltex, MSR127, TC
   ou aparelhos Schneider de proteção/sinalização que não tenham mostrador.

### Duas falhas reais encontradas pelo ensaio integrado

- `editorStore.open()` deixava valores efémeros de pré-visualização de outro
  aparelho: um rascunho novo herdava ON/energia. Agora limpa só esse estado de
  sessão, conservando as variáveis iniciais e a definição persistida.
- A preparação do catálogo cortava todos os aparelhos como se tivessem uma
  cabeça de emergência, ocultando o LCD dinâmico atrás da cópia `__head`.
  A extração passa a depender de um controlo explicitamente ligado a
  `dcsimu_head`. Regressão dos botões de emergência: **42 PASS**.

## Resultados executados nesta revisão

| Ensaio | Resultado e alcance |
| --- | --- |
| TypeScript | **exit 0** |
| Contratos LCD | **76 PASS** — arranjo, capacidade, precisão, glifos, valores inválidos, compatibilidade não destrutiva, opt-out personalizado, isolamento de sessões e não corte do LCD |
| Navegador montado | **86 PASS / zero exceções React/WebGL** — nativo, Admin, save/reopen, texto personalizado real, bake/publicação local, reload total, instâncias independentes, carga/cablagem real, STEP, STOP e roundtrip com tipo/IDs/endpoints intactos |
| Máscaras óticas nativo/Admin | D52 **0**, KWS **0**, ATV **0,001266** de diferença RGB normalizada entre densidades diferentes |
| Máscaras publicado/Admin | **0** nos três aparelhos após reload completo |
| Medidores/Schneider | **53 PASS** |
| Industriais | **102 PASS**, incluindo inexistência de LCD inventado |
| Editor 3D funcional | **57 PASS** |
| Sincronização integrados | **883 verificações**, 117 integrados/66 GLB, exit 0 |
| CI local completo | **exit 0**, 103 comandos encadeados, incluindo o novo contrato LCD |
| Servidor E2E | **188 PASS / 0 FAIL** |
| Dependências de produção | **0 vulnerabilidades**, exit 0 |
| Build estático do commit exato | **exit 0**, `VERCEL=1`, heap Node 3 GB; identidade `7990560a8873e58561042a7025888a09286bc8a9.r213.mwmlqehr` |
| Guard no build minificado | **10 PASS** — identidade exata e recusa User/Admin locais fabricados; projeto cloud autenticado NÃO ensaiado |
| Testes BrainNet na worktree isolada | **18 PASS / 27 SKIP / 0 FAIL**, exit 0; não são 45 testes executados |
| Fundação da worktree isolada | **388 Markdown / 964 links / 3 workflows**, zero erros, exit 0; arquivo do commit canónico com 1265 blobs idênticos; não é o checkout pessoal |

Os valores das fotografias são entradas explícitas da comparação ótica, não
valores iniciais artificiais do componente. A corrente do cenário ligado vem
de uma carga real em série; a segunda instância sem fios fica apagada. A
publicação local do ensaio não constitui publicação cloud do catálogo oficial.

As execuções intermédias falhadas estão conservadas no workspace, separadas
dos resultados aprovados. Não se apagaram asserções para fazer o ensaio passar.
Uma tentativa adicional de guardar após análise ótica encontrou o botão já
inativo devido ao autosave legítimo; o ensaio final guarda antes da análise,
sem alterar o comportamento do produto.

## Build, publicação e limites

O build estático foi executado **depois do commit**, com sucesso e `buildId`
exato, seguido de 10 verificações do guard minificado. Até existir confirmação
de push/CI/deploy, **a versão pública confirmada continua a ser r212**, não
r213. A primeira tentativa de build local atingiu o heap padrão do Node
(~926 MB, exit 134); o log foi conservado. A repetição passou com heap explícito
de 3 GB, sem alterar código ou baixar guardas. Os avisos existentes de chunks
maiores que 900 kB continuam visíveis; não foram ocultados ou tratados como erro.

Não são aprovados por estes testes: firmware completo, CAD oficial das
reconstruções procedurais, toda a geometria externa, aceitação visual do
utilizador, hardware/GPU física ou fluxo autenticado Supabase/RLS/cloud.
O job remoto informativo legado GRAFCET permanece uma pendência independente;
CI local verde não equivale a todas as suites UI remotas aprovadas.

## Checkout pessoal protegido

Comparação com o arquivo correto: **1039 ficheiros idênticos, zero diferenças**;
HEAD aninhado pessoal `adf9fbf3f1505b11759fc63b8741d5b96ffef327`, 122 entradas.
Gitlink pessoal preparado `10e555bf47a68d8ab7cb7a0a5d1966f2fa13e666` preservado.
SHA-256 do índice pai:
`cb2d4913eb738df3b5994e7fd42f18edfa55997c6001129dd26e215f92cd1eae`.
Nenhum reset/clean/checkout/stage global foi efetuado no cofre pessoal.

Relacionado: [[Validation-2026-11-17-Recuperacao-Industrial-Editores]] ·
[[Task-2026-11-17-Realismo-Medidores-CT-iIL-Calhas-Sobretampa]] · [[Backlog]].
