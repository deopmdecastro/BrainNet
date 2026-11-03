---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_TESTED
created: 2026-11-03
updated: 2026-11-03
commit: e11f075
repos: [dc-simu, BrainNet]
tags: [dc-simu, cabos, nativo, capa, cache, tablet, toolbar]
---
# Cabos do nativo organizados, capa recapturada e barra do tablet

## Pedido
Organizar os cabos do projeto «Partida direta com emergência (nativo)», fazer cache refresh, atualizar a capa e organizar melhor a barra de ferramentas no tablet.

## Contexto reutilizado
- [[Task-2026-11-03-Cabos-Selecao-Renderizacao]] e [[Task-2026-10-31-Refresh-Nativo-Curvas-Motor]]: roteamento nativo e migração `wire-curves`.
- [[Design-Principles]] e [[2026-11-02-Reorganizacao-Barras-Ferramentas]]: tablet = layout do PC, ações à vista, alvos de toque.
- Mecanismos existentes: `release-stamp.json` (hook pre-commit → buildId novo → limpeza de caches no cliente) e `captureCover` (capa 3D guardada ao guardar/sair do editor).

## Diagnóstico
`test:native-wires-3d` falhava em 2 verificações. Bissecção por commits:
- `0ed6826` (ortogonalização + manhattan forçado) criou viragens > 90° nos cabos 14, 17 e 39 e diagonais de 2,2–2,5 unidades;
- `99a18a9` (raios de curva 10/13,5) fez o cabo F1 A2 → Q0:4 perder o recuo à calha (8 mm em vez de ≥ 35 mm). Com 9,0/12,0 e 9,6/12,8 continua a falhar; 8,2/10,5 passa.

## Alterações (dc-simu e11f075)
- `wireGeometry3D.ts`: removida a passagem `orthogonalizeSegments` do caminho normal (mantém-se o U de segurança `ensureDetoured` quando o traçado colapsa a 2 pontos); raio de curva volta a 8,2 rígido / 10,5 flexível.
- `wire-curves-v6`: o refresh do nativo retira o campo `cover` guardado, para a capa ser recapturada pelo editor (guardar/sair) em vez de ficar com os cabos antigos. Cabos alterados ou criados pelo utilizador não são tocados; corre uma só vez. Teste atualizado.
- Cache refresh: carimbo de release #152 (`mw19fj4b`) no mesmo commit; os navegadores limpam caches na próxima visita.
- Tablet (`toolbar-spacing.css`): deslize só horizontal sem arrastar a página, esbatido à direita na 2.ª linha, transporte de simulação fixo à direita na 1.ª linha, alvos de toque de 38 px (linha mantém 44 px).

## Verificação
- `tsc -b`, `test:native-wires-3d` (0 falhas), `test:wire-curves-refresh`, `test:solid-cables-meter`, `test:native-sim`, `test:native-diagnostics`, `test:lead-pigtails`, `test:style` e `npm test`: OK.
- Diagonais longas nos cabos nativos: 15 → 10; as restantes são o troço protegido do motor e os cabos de ensaio do multímetro (Bézier por desenho).

## Pendências (não verificado)
- **Capa nova:** só existe depois de abrir o projeto nativo no editor 3D e voltar aos projetos (ou guardar). A capa depende de WebGL; este ambiente não tem, por isso não foi gerada nem vista.
- Sem confirmação visual dos cabos nem da barra no tablet real; `vite build` não corre neste ambiente (memória).
- Confirmar em produção (Vercel) que o buildId 152 foi publicado.
