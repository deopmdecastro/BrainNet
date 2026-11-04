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

## Pendências
- Validar em produção com sessão Supabase. A capa antiga é substituída quando se abre o projeto na Visualização 3D e se guarda ou sai.
- Se o erro ao guardar o PDF persistir, falta o texto exato do erro: notificação do navegador ou mensagem da modal.
