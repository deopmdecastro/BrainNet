---
project_id: BN-DCSIMU-001
type: validation
status: LOCAL_VALIDATED_RELEASE_PREPARED
created: 2026-11-17
updated: 2026-11-17
tags: [dc-simu, recuperacao, industrial, medidores, grafcet, iec, preservacao, release]
---
# Recuperação — aparelhos industriais, medidores e editores

**Aplicação com commit e build locais aprovados. Push, CI remoto e deploy não
estão confirmados por este registo de preparação.** O utilizador autorizou
commit/push/publicação de ambos os repositórios. Uma chave enviada no chat não
é guardada em código, notas, URLs, Git config, logs ou comandos de publicação.
A sessão de push deve ser transitória e permanecer apenas em memória.

| Identidade | Valor confirmado |
| --- | --- |
| Baseline da aplicação | `d474ab3e99383e1e8ede6cc75a2b8ae1277b3323` |
| Novo commit local da aplicação | `20150c06d4d05e0ef38d2ba9bb59978e86a660c0` |
| Carimbo do hook pre-commit | **r212.mwmjddq3** |
| Build estático local | **exit 0**, `VERCEL=1 npm run build` sobre esse commit |
| `dist/version.json` local | `20150c06d4d05e0ef38d2ba9bb59978e86a660c0.r212.mwmjddq3` |
| Baseline BrainNet | `dac3a94e6e3964b56018a935ef4c51193f4b903e` |
| Gitlink preparado na worktree de release | **20150c06d4d05e0ef38d2ba9bb59978e86a660c0**, não o HEAD pessoal |

Este registo substitui os estados de validação antigos de
[[Validation-2026-11-17-Medidores-Schneider-CAD]]. Os números/hashes históricos
não aprovam a recuperação nem constituem prova de publicação do novo commit.

## Feito e limites

- Sete industriais com ativos locais, fichas, levantamento de ligações e
  runtime: ATV320, Finder 90.23/55.34, Geya M1/B1, Avel 411 e Metaltex TBY-301.
- D52/KWS/TC e cinco Schneider partilham a geometria Admin/simulador/catálogo.
  Corrigidos o referencial nominal e a conversão uniforme metro → mm;
  passagens abertas do TC conservam os pontos medidos na exportação.
- iIL 3P de 18 mm, marcas vetoriais locais, interfaces MSR127, calhas DIN
  individuais, sobretampa sem fundo no contorno e obturadores apenas nas vagas.
- IEC/GRAFCET: geometria/rotas/barras/clipboard de destino e undo/redo;
  cancelamento síncrono de gestos individuais/mistos por transporte real ou
  desmontagem. STEP deixa PAUSA viva; só STOP repõe a edição.
- Identidade nativa por UUID exato, sem resementeira nem classificação
  destrutiva de projetos pessoais pelo nome/prefixo. QGD 47 componentes/76 cabos.
- **Limite de aceitação:** D52/KWS/TC são reconstruções procedurais, ainda sem
  aceitação visual do utilizador, não CAD oficial. Contactos e complementos
  reconstruídos estão declarados. Sem certificação PL/SIL, metrologia ou firmware.

## Verificações confirmadas

| Ensaio | Resultado | Observação |
| --- | --- | --- |
| TypeScript + `test:ci`, sétima execução | **0 / 0**, 102 comandos encadeados | Inclui hooks; CI local, não resultado do GitHub Actions |
| Oito medidores/Schneider no Admin e catálogo fresco | **110 PASS**, zero exceções | Gravar/reabrir/publicar/bake, refresh total, duas instâncias, cablagem, tipos/IDs/endpoints e save/load; LCD publicado ligado versus segundo desligado |
| Sete industriais no Admin e catálogo fresco | **78 PASS**, zero exceções | PDFs originais, controlos e publicação; instâncias ligadas independentes e projeto recarregado |
| Medidores/Schneider Panel3D | **41 PASS**, zero exceções | Rato físico, T, rocker, RESET e comparação SVG local |
| Ciclo de vida IEC/GRAFCET ampliado | **62 PASS**, zero exceções | RUN/STEP reais, grupos com texto movido antes de cancelar, rollback exato, histórico, clipboard/destino e teclado |
| Contrato medidores/Schneider | **53 PASS** | Geometria nominal e exportação/endpoints |
| Geometria CAD | **48 modelos, 303 cavidades + 39 contactos = 342 ligações** | Cinco tipos procedurais explicitamente excluídos, não contados como CAD aprovado |
| Encaixe dos bornes | **303 encaixes, 43 correções, 80 colocações** | Tampa ATV realmente aberta, sem ignorar obstáculos |
| Industrial / Editor3D funcional | **95 / 57 PASS** | Ativos/interfaces/elétrica e migrações |
| Sincronização integrados | **883 verificações**, 117 integrados/66 GLB | Inclui partilha/isolamento de materiais PBR |
| Fixtures browser | **10 PASS** | Prontidão síncrona, não substitui UI |
| MSR127 / industriais Panel3D | **12 / 38 PASS**, execuções anteriores conservadas | UI real; não reclassificadas como repetições novas |
| Sondas/cabos e bloqueios | **68 + 30 PASS** | Quatro poses físicas; alimentadores M20 distintos de sondas; PAUSA bloqueia edição |
| Servidor E2E | **188 PASS / 0 FAIL** | SQLite/contas/reinício, não Supabase/RLS |
| Dependências de produção | **0 vulnerabilidades** | Auditoria local `npm audit --omit=dev` |
| Capas | **18 tipos regenerados; 69 capas + 69 frontais presentes** | Gerador rejeita captura falhada mesmo com capa antiga |
| Build estático do commit 20150c0 | **exit 0**, PWA gerada | Avisos de chunks >900 kB conservados, não ocultados |
| Guard no build minificado | **10 PASS** | `--static-guard`: `buildId` exato e recusa de sessões locais fabricadas User/Admin; **não** é projeto cloud autenticado |
| Testes BrainNet na worktree de release | **18 PASS, 27 SKIP**, exit 0 | Não são 45 testes executados |
| Fundação da worktree de release exata | **exit 0; 386 Markdown, 953 links, 3 workflows; zero erros** | Documentação atual + arquivo do commit 20150c0; não é o checkout pessoal |
| Fundação do checkout pessoal protegido | **2 links partidos preservados** | Falha pessoal distinta; sem alterar ficheiros nem regras |

### Bloqueios de browser resolvidos antes do commit

- O iDPN era rejeitado por ultrapassar 6 milhões de caracteres base64. A
  partilha de materiais passou a sobreviver ao acabamento e clonagem dentro
  da peça, mantendo peças/cache independentes. GLB real de **4 531 324 →
  4 405 348 bytes**, 27 → 24 materiais e 35 → 32 imagens, sem baixar resolução,
  aumentar o limite ou contornar publicação. A suite final de 110 PASS inclui
  publicar o iDPN e recuperar a versão num catálogo fresco.
- O enquadramento da fixture Panel3D termina a animação de auto-fit antes de
  projetar/clicar no botão T. Mantém-se pointerdown real e verificação da mola.
- Gestos de grupos IEC subscrevem sincronicamente ambos os transportes.
  Seleções são limpas e a fixture usa o atalho de enquadramento antes do
  arrasto, evitando que o auto-fit inicial mude o alvo. A suite final ampliada
  exige movimento real antes do cancelamento e zero passos falsos de Undo.

O teste antigo de cabos foi repetido no HEAD de origem e reproduziu onze
falhas contraditórias com o bypass de sondas já implementado. Foi corrigido
para separar alimentadores/sondas, testando cabo/haste/corpo/caixa aberta.
A fixture de bloqueio foi corrigida com STOP após STEP sem permitir edição em
PAUSA. O comando agregado e o CI completo passaram depois.

O perfil Panel3D/R3F conservado estabilizou recursos em cinco ciclos
(44 geometrias/14 texturas/3 programas). Com 15 aparelhos, 1440×900/DPR1,
SwiftShader mediu **1,922 FPS**, CPU média 3,62 ms/p95 5,4 ms. **Não aprova
fluidez numa GPU física.**

## Release preparada e pendências

1. Publicar o commit canónico da aplicação e o commit de documentação/gitlink
   do BrainNet, usando uma sessão autenticada transitória. Não há confirmação
   de push neste registo de preparação.
2. Observar o CI/deploy remotos e conferir que o `buildId` público em
   `https://dc-simu.vercel.app/version.json` coincide exatamente com
   `20150c06d4d05e0ef38d2ba9bb59978e86a660c0.r212.mwmjddq3`.
   Build local ou `ls-remote` público não substituem essa confirmação.
3. Aceitação visual face às fotografias e ensaio com GPU/hardware reais.
4. Supabase/RLS/cloud, login de produção, projetos reais e colisões de rede
   não foram aprovados por fixtures com API externa/service workers bloqueados.
   A proteção estática não foi afrouxada para fazer passar um login sintético.

O verificador de publicação deixou de ter o SHA/carimbo antigos fixos:
recebe o commit exato, lê o carimbo desse commit e separa produção/CI/refs.
O smoke minificado deixou de presumir a existência do alias nativo antigo;
`--static-guard` declara explicitamente que não ensaia edição autenticada.

## Preservação e árvore de release

O checkout pessoal `dc-simu/` aninhado permanece HEAD `adf9fbf`, com 122 entradas.
Comparação com o arquivo correto: **1039 ficheiros regulares idênticos**, zero
diferenças. SHA-256 do porcelain:
`e6a8e6453b62c04058de6bddb883b3d210304e3293cd4e610855d75f1f64f751`.
O gitlink pessoal já preparado é `10e555b`, não o HEAD pessoal nem a release.
Não fazer checkout/reset/clean nem adicionar o HEAD pessoal ao índice.
Backup: `/home/user/work/qgd-release/brainnet-nested-source-before.tar.gz`.

A documentação e o gitlink novos são preparados numa **worktree independente**
(branch `release/recuperacao-industrial-2026-11-17`). O conteúdo da aplicação
usado no ensaio de fundação é extraído por `git archive` do commit **20150c0**,
sem apontar o verificador para o checkout pessoal nem modificar os seus ficheiros.

O check da cópia pessoal continua a encontrar dois links ausentes em
`dc-simu/docs/AI-ASSISTANCE.md`: `.github/copilot-instructions.md` e
`.vscode/extensions.json`. A aplicação canónica versiona ambos; não foram
criados ficheiros vazios nem afrouxadas regras para esconder a falha pessoal.
O check da árvore de release exata passou separadamente: **386 Markdown,
953 links, 3 workflows, zero erros**. O resultado e o teste BrainNet estão
conservados em `Evidence-2026-11-17-Recuperacao/`, junto da versão do build,
guard estático e comparação de preservação. Isto valida a árvore de release
preparada, não transforma a cópia pessoal nem confirma deploy remoto.

Evidência local: `/home/user/work/industrial-devices-audit/`.
Na aplicação estão versionados `docs/RECUPERACAO-2026-11-17.md` e
`docs/validation/recovery-2026-11-17/`, com resumo e logs dos ensaios locais.
Só espaços finais/linhas finais vazias foram normalizados nas cópias de logs
para higiene Git; os originais brutos permanecem no workspace.

Relacionado: [[Task-2026-11-17-Realismo-Medidores-CT-iIL-Calhas-Sobretampa]] ·
[[Task-2026-11-17-Medidores-Bibliotecas-Schneider-CAD]] · [[Backlog]].
