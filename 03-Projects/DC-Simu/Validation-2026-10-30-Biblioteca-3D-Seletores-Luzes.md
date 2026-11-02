---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-30
updated: 2026-10-30
tags: [dc-simu, biblioteca, editor3d, interface, validation]
---
# Biblioteca 3D, seletores e cabeçalhos de luzes

## Pedido e resultado

O utilizador pediu melhorar três recortes da interface: barra da Biblioteca de
componentes 3D, seletor «Por vista / Por grupo» e cabeçalho «LEDs e luzes» com
palavras partidas junto aos botões de criação.

- Biblioteca: título e contagem alinhados, explicação curta com ajuda expansível,
  pesquisa com largura útil e nome acessível completo, estados legíveis e grupos
  de ações em linhas próprias. A distribuição adapta-se à largura disponível.
- Hierarquia: seletores com texto de 12 px, botões de pelo menos 32 px, foco
  visível e proteção contra compressão vertical.
- Secções do editor: título preservado numa linha quando cabe; ações podem passar
  inteiras para a linha seguinte. Foi corrigida também a regra original de
  `span:first-of-type`, cuja especificidade ainda encolhia o título após a
  primeira implementação.

Foram preservados os filtros, pesquisa, backups, sincronização, criação de
componentes, agrupamento de bornes e ações de LEDs/luzes.

## Ficheiros de implementação

- `dc-simu/src/admin/editor3d/CatalogTab.tsx`
- `dc-simu/src/admin/editor3d/ui.tsx`
- `dc-simu/src/styles/catalog-editor.css`
- `dc-simu/src/styles/panel-system.css`

## Verificações

| Verificação | Resultado |
| --- | --- |
| Aplicação: `npm test` | Passou |
| Aplicação: `npm run typecheck` | Passou |
| Aplicação: `npm run test:style` | Passou |
| Aplicação: `npm run build` | Passou; avisos existentes de tamanho/importação de chunks |
| BrainNet: `npm test` | 45 testes passaram |
| BrainNet: `npm run check` | Passou |
| `git diff --check` | Passou |
| Biblioteca a 1440, 1366, 1024, 820 e 390 px | Sem cortes, sobreposições ou overflow horizontal da página |
| Pesquisa por referência | Filtrou o componente esperado |
| Editor completo, inspetor a 360, 320 e 300 px | Título LEDs numa linha; ações dentro da secção; sem overflow |
| Agrupamento e ações | Por grupo/Por vista, colocar/cancelar LED e criar Zona de luz funcionaram |
| JavaScript no percurso verificado | Sem erros |

A largura da pesquisa foi de 585 px no desktop, 330 px a 820 e 366 px no
telemóvel de 390 px. Os segmentos foram medidos com botões de 32 px e fonte de
12 px. O redimensionamento do inspetor foi exercitado pelo separador nativo.

Foi aplicada a skill `frontend-design`: implementação delegada e avaliação
independente, com veredicto **PASS**. A avaliação abriu a biblioteca nas quatro
larguras principais e os componentes reais dos painéis em fixtures de 240 e
320 px. Só estavam disponíveis modelos OpenAI; a avaliação independente usou o
mesmo fornecedor, sem chamadas a APIs pagas externas.

Os percursos usaram navegadores isolados, dados sintéticos e pedidos à API
bloqueados. Não foram modificados dados da conta nem projetos reais. As fixtures
foram usadas apenas para inspeção e não fazem parte da aplicação publicada.

## Evidências e estado

Capturas e métricas em `runtime/library-polish/`, na raiz do cofre:
`library-1440.png`, `library-390.png`, `editor-panels-300.png` e `report.json`.
Logs e script transitório de verificação em `dc-simu/runtime/library-polish-*`.
Todos estes artefactos de inspeção são locais e ignorados por Git.

Implementado e testado localmente. O pedido seguinte autorizou commit e push,
incluindo estas melhorias pendentes, na entrega de
[[Validation-2026-10-30-Grafcet-Zoom-Ligacao-Acoes]]. Sem publicação ou reinício
da instância em uso. A autorização de atualização Docker pedida na tarefa
anterior continuou pendente.

Aplicação: commit `15f530f`, enviado para `origin/main` com a correção GRAFCET.

[[README|DC-Simu]] · [[Design-Principles]]
