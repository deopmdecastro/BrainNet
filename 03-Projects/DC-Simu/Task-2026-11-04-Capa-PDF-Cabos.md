---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-04
updated: 2026-11-04
tags: [dc-simu, capa, pdf, 3d, cabos]
---
# Capa do projeto e PDF sem cabos; erro ao guardar o PDF

## Problema
A capa do projeto nativo no dashboard e a vista 3D do PDF apareciam sem cabos, e a gravação do PDF dava erro.

## Causas
- A capa era considerada pronta mesmo com o cálculo dos cabos em erro, ou com um traçado de outra configuração. Ficava gravada como «versão atual» e não voltava a ser capturada.
- Os cabos soltos (torre, sensores) estavam excluídos da captura.
- O PDF usava a última capa guardada quando a cena 3D não estava pronta, mesmo que essa capa fosse antiga.
- A transferência revogava o URL do ficheiro logo a seguir ao clique. Em alguns navegadores isso dá «ficheiro em falta / erro de rede».

## Correção (dc-simu `fa5eb54`)
- A capa só se captura quando os modelos estão carregados e o traçado é o da configuração atual.
- Os cabos soltos passam a entrar na capa.
- `COVER_VERSION` passou a 3. O dashboard (frontend e servidor Node) ignora capas 3D mais antigas e desenha o esquema com cabos até haver nova captura. O PDF nunca usa uma capa antiga.
- A imagem 3D do PDF mantém a proporção.
- `src/utils/downloadBlob.ts` é usado em todas as transferências (PDF, JSON, SVG, CSV): o link fica no documento e o URL só é revogado mais tarde.

## Verificação
- Executado localmente no modo sem servidor: a captura da capa e a imagem 3D extraída do PDF mostram os cabos, incluindo os do motor. PDF de 11 páginas transferido.
- `tsc`, `test:ci` (verde), `test:pdf-export`, `vite build` e `node --check server/index.mjs`.
- Testes desatualizados do upstream corrigidos: painel GRAFCET, 11 faixas de cabos e barra lateral na modal de textos.

## Iteração 2 (dc-simu `d9e2292`)
- O utilizador pediu que a capa fosse sempre o 3D real. O dashboard volta a mostrar a capa 3D guardada e já não troca pelo esquema desenhado.
- Recaptura automática: no editor, com a cena 3D e os cabos prontos e sem alterações por guardar, a capa em falta ou antiga é capturada e gravada sozinha.
- Defeito encontrado: a captura escalava as malhas dos cabos em 1,2. Como a geometria está em coordenadas do mundo, os cabos saíam deslocados dos bornes e os do multímetro ficavam cortados. A escala foi removida e `COVER_VERSION` passou a 4.
- Verificado no browser: depois de abrir o projeto na vista 3D, o dashboard mostra a capa 3D com os cabos alinhados, sem guardar à mão. `test:ci`, `test:cover-version`, `test:flow-cover`, `test:pdf-export` e o build passam. Cache local do Vite limpa.

## Pendências
- Validar em produção com sessão Supabase. A capa antiga é substituída sozinha quando se abre o projeto na Visualização 3D. Projetos nunca abertos mantêm a capa antiga, ou o esquema desenhado se nunca tiveram foto.
- Cache do navegador: a nova versão limpa as caches antigas ao atualizar; em alternativa, Administração → Sistema → atualização forçada.
- Se o erro ao guardar o PDF persistir, falta o texto exato do erro: notificação do navegador ou mensagem da modal.
