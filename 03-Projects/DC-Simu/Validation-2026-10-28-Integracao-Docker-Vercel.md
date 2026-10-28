---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_LOCAL
created: 2026-10-28
updated: 2026-10-28
tags: [dc-simu, git, docker, vercel, validation]
---
# Integração das branches, Docker e correção do build Vercel

## Resultado e âmbito

A `main` local da aplicação integra os históricos de `origin/main` (`88f6ee6`),
`origin/fix/bornes-reais-editor-3d` (`53effa3`) e
`origin/feat/account-page-toolbar-refine` (`3c4a9df`). A inclusão dos três
históricos foi confirmada com `git merge-base --is-ancestor`.

Commit preparado para publicação: `2d4549cd2f717dd5a1f9cd3c8883f99871fe8496`.
A branch `backup/main-before-integration-20261028` preserva a antiga `main` local.
As branches remotas não foram alteradas.

Foram conciliados os conflitos na administração, nos estilos e no encaminhamento
das operações Supabase. Mantiveram-se a persistência do catálogo, as contribuições,
os perfis de bornes e a recusa de sessões Admin locais sem base de dados.

## Correção da falha Vercel

Os logs do deployment `8Btfs8v5ZaqACwsYyCApxrLy1fJB`, fornecidos pelo utilizador,
mostravam dois erros reproduzidos no typecheck local:

- `TS18048` em `LandingGrafcetDemo.tsx`: acesso direto a `transitions` opcional.
  A demonstração passou a usar `transitionsOf`, que também suporta programas antigos.
- `TS2353` em `nativeProjects.ts`: propriedade `id` inexistente em `GrafcetProgram`.
  Foi retirada a propriedade; o nome e a identidade do projeto foram preservados.

Foi acrescentado o rewrite `/account` na Vercel. A revisão visual também encontrou
uma janela 3D com 485 px num ecrã de 390 px e os controlos GRAFCET escondidos por
uma regra partilhada do Ladder. Os estilos passaram a limitar a janela à largura
disponível e a manter os controlos visíveis.

## Evidências e verificações

| Verificação | Resultado |
| --- | --- |
| BrainNet: `npm test` | 45 testes passaram |
| BrainNet: `npm run check` | Passou após corrigir frontmatter em dois relatórios recebidos no pull |
| Aplicação: `npm test`, `test:style`, `test:saas` | Passaram; SaaS com 58 verificações |
| Build completo da imagem final | Passou em `2d4549c` |
| Build com `VERCEL=1`, em contentor sem rede/volumes | Passou em `1bdace8`; a única diferença para o commit final é a remoção do bloqueio de rede do smoke, sem alteração do código da aplicação |
| Servidor: `node scripts/server-e2e.mjs`, em contentor sem rede/volumes | 177 verificações passaram |
| Restantes suites da cadeia CI | Passaram, exceto as duas verificações geométricas descritas abaixo |
| Imagem Docker final e smoke `test:landing-ui` | Dez verificações passaram sobre a imagem final, a 390 e 1440 px: controlos visíveis, RUN/START/STOP, largura e ausência de erros JavaScript |

Os contentores de teste não montaram o volume ativo. Na primeira recriação da
aplicação foi confirmado que `dc-simu_dcsimu_data` e todas as variáveis de
configuração existentes permaneceram iguais. `version.json` e o rótulo OCI da
imagem permitem relacionar o código com o build; um simples restart não reconstrói
a imagem. O procedimento foi acrescentado ao README da aplicação.

A imagem final em execução é
`sha256:cc828ea47c7d55540e72a29d4160d4f556ab6fe7eb22192ae4a0c6e960b810c2`,
com revisão OCI `2d4549cd2f717dd5a1f9cd3c8883f99871fe8496` e carimbo `r86`.
O volume e a configuração foram novamente comparados e preservados na recriação
final. A página `/account` respondeu HTTP 200 no servidor local.

O smoke da landing usa recursos públicos de fontes e a textura HDR da cena 3D;
não é uma validação de funcionamento offline. As capturas finais ficam em
`runtime/dcsimu-landing-ui/landing-grafcet-390.png` e
`runtime/dcsimu-landing-ui/landing-grafcet-1440.png`.

### Falhas preexistentes de geometria

`test:terminal-geometry` e `test:terminal-seat` falham no borne
`emergencyButtonKeyP20ACR.21`: o centro não coincide com uma cavidade. O teste de
geometria reproduziu a mesma falha na imagem anterior
`sha256:4f8618ca54837f60569779cf8452c79d38dd5835b280c7c69961e92854c0ee20`.
O modelo, os testes e as dependências de geometria não mudaram relativamente a
`53effa3`. A cadeia CI completa não está verde; não se alteraram tolerâncias para
esconder esta falha.

Logs e capturas sintéticos ficam em `runtime/dcsimu-*`, ignorados pelo Git.

## Publicação e aprovação

Preparado e implementado localmente. Publicação Vercel pendente; não foi feito
push da aplicação nem foram executadas migrações em bases de dados reais.
A persistência Supabase real e os seus dados não foram usados nos testes;
o teste de servidor usou SQLite descartável.

O AGENTS.md exige aprovação que identifique pessoa, commit, ambiente, data e
âmbito. Proposta para revisão de Deogracia de Castro: publicar o commit
`2d4549cd2f717dd5a1f9cd3c8883f99871fe8496` em produção
`https://dc-simu.vercel.app`, em 2026-10-28 (UTC), através de push da `main` de
`deopmdecastro/dc-simu`, incluindo a integração das três branches e as correções
descritas. Esta proposta não é um registo de aprovação. A falha geométrica acima
deve acompanhar a decisão.

Seguimento: [[Validation-2026-10-28-Menu-Conta]] acrescenta o refinamento do menu
pedido pelo utilizador. O candidato de publicação foi atualizado nesse registo;
a proposta acima permanece apenas como evidência histórica, sem aprovação.
