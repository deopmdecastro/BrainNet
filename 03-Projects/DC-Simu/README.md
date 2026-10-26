---
project_id: BN-DCSIMU-001
type: project-index
status: ACTIVE
created: 2026-10-25
updated: 2026-10-26
tags: [brainet, dc-simu, index]
---
# DC-Simu

Simulador de comandos elétricos industriais para aprendizagem, experimentação e diagnóstico. A aplicação sincroniza o editor de esquemas 2D, a visualização 3D e o editor Ladder através do mesmo modelo de circuito.

## Navegação

| Conteúdo | Abrir |
| --- | --- |
| Briefing e estado do projeto | [[Project-Brief]] |
| Princípios de UI, UX e contexto para agentes | [[Design-Principles]] |
| Requisitos e prioridades | [[Requirements]] |
| Backlog e próxima ação | [[Backlog]] |
| Decisões | [[Decision-Log]] |
| Plano de validação | [[Testing-Plan]] |
| Auditoria editor vs efeitos | [[Audit-2026-10-26-Editor-Efeitos]] |
| Evidência de validação mais recente | [[Validation-2026-10-26-Motor-Pa-Texturas]] · [[Validation-2026-10-26-Admin-SaaS]] · [[Validation-2026-10-26-FluidSIM-Ladder]] · [[Validation-2026-10-26-Varredura-Editores]] · [[Validation-2026-10-26-Deteccao-Bornes-Mola]] · [[Validation-2026-10-26-GRAFCET-Acoes-Cortes]] · [[Validation-2026-10-26-Brilho-3D]] · [[Validation-2026-10-26-GRAFCET-Portos]] · [[Validation-2026-10-26-Zoom-Pinca]] · [[Validation-2026-10-26-Plataforma]] · [[Validation-2026-10-26-GRAFCET-Retorno]] · [[Validation-2026-10-26]] |
| Avaliação de ferramentas e custos | [[AI-Tooling-Assessment]] |
| Código-fonte da aplicação | [Pasta `dc-simu/`](./dc-simu/) |
| Documentação técnica da aplicação | [README da aplicação](./dc-simu/README.md) |
| Scripts e comandos disponíveis | [package.json](./dc-simu/package.json) |
| Infraestrutura n8n | [Guia de infraestrutura](./dc-simu/infra/n8n/README.md) |

## Estrutura

- As notas Markdown nesta pasta são a documentação de gestão e acompanhamento do projeto.
- `dc-simu/` contém o código, a configuração e a documentação técnica da aplicação.
- `dc-simu/docs/`, `dc-simu/infra/`, `dc-simu/src/`, `dc-simu/server/` e `dc-simu/scripts/` organizam a documentação, infraestrutura, interface, API e verificações.

## Executar localmente

Requer Node.js e dependências instaladas. Na pasta `dc-simu/`, os comandos disponíveis incluem:

```powershell
npm ci
npm run dev
npm run build
npm test
npm run typecheck
```

O servidor local também pode ser iniciado com `npm start`; consulte o [README técnico](./dc-simu/README.md) para os modos de execução e configuração.

## Repositório e sincronização

A aplicação está ligada como submódulo Git de `deopmdecastro/dc-simu`, em `03-Projects/DC-Simu/dc-simu/`. O BrainNet guarda o commit exato da aplicação; cada repositório mantém o seu histórico e o seu remoto.

Para obter o cofre com a aplicação, usar `git clone --recurse-submodules https://github.com/deopmdecastro/BrainNet.git`. Num checkout existente, usar `git submodule update --init --recursive`.

No Windows, o remoto da aplicação contém um arquivo com `:` no nome. Consultar [[FluidSIM-Import|o procedimento de checkout compatível]] antes de inicializar a aplicação.

A cópia anterior sem histórico foi preservada em `runtime/dc-simu-before-fluidsim/`, local e ignorada pelo Git. O checkout exterior em `Projetos/dc-simu/dc-simu` permanece preservado. Estes diretórios não são sincronizados automaticamente; o submódulo é a referência de trabalho desta sessão.

## Importação FluidSIM

[[FluidSIM-Import|Análise do formato FluidSIM 4, evidências e estado da importação]].

[[Project-Brief|Briefing]] · [[Backlog|Backlog]] · [[Testing-Plan|Validação]]
