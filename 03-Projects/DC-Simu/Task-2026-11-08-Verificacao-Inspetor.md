---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-08
updated: 2026-11-08
tags: [dc-simu, inspetor, testes, ui]
---
# Verificação do inspetor (componentes, cabos, bornes, quadros)

## Pedido
Verificar o painel do inspetor de todos os componentes, cabos, quadros, etc., e confirmar que funciona bem.

## Método
Varredura automática no browser (`scripts/inspector-sweep-ui.mjs`, `npm run test:inspector-ui`), com o servidor de desenvolvimento sem Supabase.

Para cada um dos 48 tipos com 3D, um cabo e um borne:
- aciona cada controlo: TAG e descrição, estados (caixas, números, listas, texto), medidas de quadro, calha técnica e perfil DIN, botões, rodar, espelhar e bloquear;
- confirma na store que o valor mudou;
- regista erros da consola e transbordo horizontal do painel.

## Problemas encontrados e corrigidos (dc-simu `c88bea4`)
- **70 estados sem rótulo em português** apareciam em bruto (ex.: «section Mm2», «led SF», «pole Count»). Todos têm agora rótulo.
- **Aviso do React** «Cannot update a component while rendering a different component» ao inserir qualquer aparelho com GLB. Vinha do progresso de carregamento (`useProgress`). Corrigido com `useModelsLoading`, que atualiza o estado fora da renderização.
- **Etiquetas 3D do motor** com «↻/↺»: estes glifos não existem na fonte do texto 3D e eram pedidos à CDN, o que falha offline. Passaram a texto («horário» / «anti-horário»).
- **Campo «Número de pólos»** (bornes) sem rótulo acessível.

Falsos positivos analisados e descartados:
- campos que só gravam ao sair (Enter/foco) ou com «Aplicar»;
- escolhas locais de face e medida do furo;
- «Ajustar ao conteúdo» num quadro vazio (mostra o aviso correto).

## Testes desatualizados por alterações recentes de terceiros (atualizados)
- Paragem do motor com inércia (4d49858).
- Sementes nativas: estrela-triângulo e estampagem.
- Endereços Siemens byte.bit no Excel (562f677).

## Verificação
- Varredura: 50/50 sem problemas.
- `tsc`, `test:ci` (verde) e `vite build`.

## Pendências
- Ficaram por commitar alterações locais de outra pessoa (encaminhamento de cabos: `solidWireRouting.ts`, `wireGeometry3D.ts` e testes). Não lhes toquei.
- A varredura aciona os controlos e valida o efeito na store. Não avalia se o 3D fica visualmente correto em cada caso.
- Validar em produção.
