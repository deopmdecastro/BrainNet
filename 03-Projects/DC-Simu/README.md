---
project_id: BN-DCSIMU-001
type: project-index
status: ACTIVE
created: 2026-10-25
updated: 2026-10-29
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
| Integração das branches, Docker e build Vercel | [[Validation-2026-10-28-Integracao-Docker-Vercel]] |
| Refinamento do menu da conta | [[Validation-2026-10-28-Menu-Conta]] |
| Integração dos bundles, interface local e validação final | [[Validation-2026-10-29-Integracao-Bundles]] |
| Correção dos bornes do multímetro na visualização 3D | [[Validation-2026-10-29-Multimetro-Bornes]] |
| Cabos fora dos sólidos, ponteiras e medição no motor nativo | [[Validation-2026-10-29-Cabos-Solidos-Multimetro-Ponteiras]] |
| Curvas das sondas e ponteiras duplas na entrada do motor | [[Validation-2026-10-29-Ponteiras-Duplas-Curvas]] |
| Comentário/Texto nas barras e correção da consulta Supabase | [[Validation-2026-10-29-Anotacoes-Barra-Comentarios]] |
| Auditoria editor vs efeitos | [[Audit-2026-10-26-Editor-Efeitos]] |
| UI do editor de componentes e LCD/teclas do PLC | [[Validation-2026-10-26-Editor-PLC-UI]] |
| Evidência de validação mais recente | [[Task-2026-10-29-Tablet-Parity-Cover-Panels-Key-Multimeter-ViewLock]] · [[Task-2026-10-29-Comentarios-Texto-Neon]] · [[Validation-2026-10-29-Texturas-Capas-Vistas]] · [[Task-2026-10-29-Texturas-Capas-Vistas]] · [[Validation-2026-10-29-UI-Paineis-Simulacao-GRAFCET]] · [[Task-2026-10-29-UI-Paineis-Simulacao-GRAFCET]] · [[Validation-2026-10-29-Realismo-PBR-Emergencia-Cabos-Toolbar-Demo]] · [[Task-2026-10-29-Realismo-PBR-Emergencia-Cabos-Toolbar-Demo]] · [[Validation-2026-10-29-Landing-Sim-Cabos-Motor-Glow]] · [[Task-2026-10-29-Landing-Sim-Polish]] · [[Validation-2026-10-28-Cabos-Calhas-Landing-Lazy]] · [[Validation-2026-10-28-UI-Screens-Mobile-Desktop]] · [[Task-2026-10-28-UI-Sim-Views-Mobile-Desktop-Perf]] · [[Validation-2026-10-28-Conta-Barras]] · [[Validation-2026-10-28-Barras-Espacamento-Scroll]] · [[Validation-2026-10-28-Gavetas-Padronizadas]] · [[Validation-2026-10-28-Grafcet-Regua-Componentes]] · [[Validation-2026-10-28-Admin-Avatares-Capas]] · [[Validation-2026-10-28-Admin-Registos-Planos-Componentes]] · [[Validation-2026-10-27-Mobile-Refine-Ladder-Inspetor]] · [[Validation-2026-10-27-Admin-Resumo-Responsivo]] · [[Validation-2026-10-27-Admin-Ecras-Pequenos]] · [[Validation-2026-10-27-Admin-Telas-Responsivas]] · [[Validation-2026-10-27-Admin-UI]] · [[Validation-2026-10-26-Ladder-Barra-Network-Auto]] · [[Validation-2026-10-26-Painel-Estado-UI]] · [[Validation-2026-10-26-Toolbar-Atalhos-Simulacao]] · [[Validation-2026-10-26-PLC-Sinais-Sync]] · [[Validation-2026-10-26-Motor-Pa-Texturas]] · [[Validation-2026-10-26-Admin-SaaS]] · [[Validation-2026-10-26-FluidSIM-Ladder]] · [[Validation-2026-10-26-Varredura-Editores]] · [[Validation-2026-10-26-Deteccao-Bornes-Mola]] · [[Validation-2026-10-26-GRAFCET-Acoes-Cortes]] · [[Validation-2026-10-26-Brilho-3D]] · [[Validation-2026-10-26-GRAFCET-Portos]] · [[Validation-2026-10-26-Zoom-Pinca]] · [[Validation-2026-10-26-Plataforma]] · [[Validation-2026-10-26-GRAFCET-Retorno]] · [[Validation-2026-10-26]] |
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

## Conta do criador

Página `/account` com perfil, avatar, palavra-passe e plano (ver [[Validation-2026-10-28-Conta-Barras]]). Comentários: painel de conversa do projeto (`ProjectComments`, por plano) e pins de anotação no canvas.

## Canvas comments

The dc-simu canvas now supports persistent free-text annotations in GRAFCET and the 2D/3D schematic views. Notes appear as numbered comment pins; double-click edits and right-click removes them.
