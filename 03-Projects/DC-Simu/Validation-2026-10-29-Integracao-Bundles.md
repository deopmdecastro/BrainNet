---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, integration, bundles, ui, grafcet, 3d, annotations]
---
# Integração dos bundles e alterações locais

## Pedido e âmbito

O utilizador pediu implementar os bundles, o patch e as referências visuais,
seguido de commit e push. O conteúdo dos anexos foi tratado como código e
documentação a verificar; alegações anteriores de testes ou autorização não
substituem a evidência desta sessão. Não foi executado deploy manual.

## Implementado

- Aplicação: cadeia `701498c` → `ac098ad` → `fe1c521`, sobre `3221cd8`.
  O patch `701498c` corresponde ao primeiro bundle e não foi aplicado novamente.
- BrainNet: cadeia `03bf4ba` → `33a131c` → `c15063a`, sobre `d585ec0`.
- Painel inferior GRAFCET com E/S e sequência, inspetor com quatro secções,
  células de sinais com rodapé e navegação compacta no estado do PLC Ladder.
- Materiais e iluminação 3D, capas a três quartos e vistas ortográficas.
- Notas com conversa e cor, texto livre GRAFCET/3D e corrente em néon.
- Conciliação das alterações locais de barras/cabeçalho com os bundles;
  reutilização das E/S entre Esquema e GRAFCET. «Texto livre» também acessível
  no menu compacto. Testes ajustados à navegação real e a CRLF no Windows.

As alterações locais foram preservadas num stash antes da integração. Os
arquivos ZIP não versionados em `public/models/componentes novos/` e os dois
ficheiros soltos `m.setCleanMode(...)` na raiz ficaram fora dos commits.
Não foram lidos nem incluídos ficheiros de ambiente ou credenciais.

## Verificações desta sessão

| Verificação | Resultado |
| --- | --- |
| BrainNet `npm test` | 45 testes passaram |
| BrainNet `npm run check` | Passou |
| Aplicação `npm run typecheck` | Passou |
| Aplicação `npm run build` | Passou; inclui geração PWA, com aviso de chunks grandes |
| Aplicação `npm run test:ci` | Bateria completa passou |
| Persistência de notas/textos | 8 verificações; guardar/reabrir, remover e compatibilidade legada |
| `test:toolbar-ui` | Passou; barras e menus desktop/telemóvel |
| `test:workspace-panels-ui` | Passou; 375, 390, 768, 1024 e 1440 px, PLC real/virtual e texto GRAFCET |
| `test:grafcet-ui` | Passou; diálogos, sinais, persistência, histórico e percurso móvel |
| Auditoria de capas/vistas | 25 componentes carregados sem erros |
| Percurso 3D sintético | Nota, mensagem, cor, texto livre e RUN com néon; sem erros JS/shader |

Testes de browser com Chrome instalado, Vite local sem configuração Supabase
e chamadas API bloqueadas. Nenhum projeto real foi modificado. A consulta de
capas usou a skill `agent-browser`; os percursos de regressão usaram os scripts
Playwright do projeto.

## Evidências locais

- `runtime/dcsimu-bundle-ci.log`, `runtime/dcsimu-bundle-build.log`.
- `runtime/dcsimu-bundle-panels.log`, `runtime/dcsimu-bundle-toolbar.log`,
  `runtime/dcsimu-bundle-grafcet.log`, `runtime/dcsimu-bundle-3d.log`.
- `runtime/dcsimu-workspace-panels-ui/`: capturas das cinco larguras,
  `grafcet-free-text-375.png`, `bundle-3d-note.png`, `bundle-3d-neon-run.png`.
- `runtime/dcsimu-bundle-covers.png` e `runtime/dcsimu-bundle-grafcet/`.

## Entrega

Preparado, implementado e testado localmente. Commit/push autorizados pelo
pedido direto. Aplicação integrada no commit `1bec55857db1564ca75be4ad6e36b7cb58f990b8`,
enviado para `origin/main`; o BrainNet fixa esse commit no submódulo. Publicação e aprovação
de uma versão em produção não são comprovadas por estas verificações.
