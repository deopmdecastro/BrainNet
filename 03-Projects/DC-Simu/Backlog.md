---
project_id: BN-DCSIMU-001
type: backlog
status: ACTIVE
created: 2026-10-18
updated: 2026-10-25
tags: [brainet, dc-simu, backlog, ai]
---
# Backlog do DC-Simu

Responsável de decisão: Deogracia de Castro. Papéis indicados abaixo são propostas de atribuição, sem afirmar que receberam tarefas. Não há prazos acordados. DONE significa apenas o incremento descrito com a evidência indicada.

## Integração e operação existentes

| ID | Prioridade | Estado | Trabalho e aceitação | Papel proposto |
| --- | --- | --- | --- | --- |
| DC-01 / DC-02 | Alta | TODO | Reconfirmar chave exposta e proxy n8n; retirar segredos do cliente e rejeitar destinos não autorizados; confirmar correções por testes | Desenvolvimento / automação |
| DC-03 / DC-04 | Alta | TODO | Alinhar webhook GRAFCET e resposta real de sucesso/falha; evidência de execução | Automação / QA |
| ENV-01 | Alta | IN_PROGRESS | Dependências restauradas e validação Node 22 aprovada (tipo, núcleo, servidor, n8n e quatro percursos UI). O `vite build` passou a concluir com heap de 3 GiB (33,6 s, 2026-10-25); falta registar o build no runner de produção e repetir os percursos UI | Evidência: [[Validation-2026-10-25]] |
| OPS-01 | Alta | TODO | Confirmar URL, fornecedor, commit e modo de persistência de produção; distinguir Vercel/Docker do assistente de programação | Coordenação |
| GRAFCET-IMPORT-01 | Alta | IMPLEMENTED_TESTED | Leitor FluidSIM 4 CT com 5 etapas, 7 transições e 7 ações recuperadas do exemplo; limites, rejeição de variantes não suportadas e aviso de referências externas | Evidência: [[FluidSIM-Import]]; 17 verificações locais |
| GRAFCET-UX-01 | Alta | IMPLEMENTED_TESTED | Construção por arrasto, pontos de ligação, transições e derivações; modais compactas; gestos, teclado, histórico e responsividade verificados | Evidência: [[FluidSIM-Import]]; 17 verificações de construção e importação, 23 verificações de modais |
| LADDER-DIAG-01 | Média | IMPLEMENTED_TESTED | Lint Ladder avisa NO e NC do mesmo endereço em série no mesmo ramo, e temporizador/contador com preset 0 | Evidência: `scripts/diagnostics-smoke.ts`, commit `84494d6` |
| GRAFCET-DIAG-01 | Média | IMPLEMENTED_TESTED | Validação GRAFCET avisa etapas presas num ciclo fechado sem saída para a etapa inicial ou final; os 11 modelos não geram avisos | Evidência: `scripts/diagnostics-smoke.ts`, commit `84494d6` |
| GRAFCET-UI-02 | Média | IMPLEMENTED_TESTED | Estado vazio e diálogo «Importar GRAFCET» redesenhados: CTA «Criar etapa inicial» e exemplo ocupam a largura total; modelos/importação ficam lado a lado; todos os alvos móveis têm 46 px. Os SVGs dos CTAs anulam a margem automática do canvas, mantendo o ícone junto do respetivo texto nas ações largas. | Evidência: `51df45b`, `f67bf47` e `9ff11f0`; Node 22 `tsc -b` e smoke UI GRAFCET passam, incluindo verificação Playwright a 390 px para o espaçamento ícone–texto. |
| EDITOR-UI-ICON-01 | Média | IMPLEMENTED_TESTED | Todas as ações textuais das barras relevantes de Esquema/3D, GRAFCET e Ladder receberam ícones Font Awesome coerentes. Inclui ficheiros, modelos, sincronização GRAFCET→Ladder, disposição, zoom, seleção múltipla, páginas, abas de Ladder, estado PLC e edição de cabos 3D. | Evidência: commit `9483ba7`; Node 22 `tsc -b`, smoke GRAFCET e smoke de blocos Ladder passam; browser Playwright confirma os ícones nas ações de cada editor. |
| EDITOR-GRID-01 | Média | IMPLEMENTED_TESTED | Uniformizar o fundo, peso de ponto/linha e passo visual padrão (20 px) de Esquema, Painel 3D, GRAFCET, Ladder e catálogo. O seletor comum alterna pontos/linhas; GRAFCET conserva pan/zoom/snap próprios e Ladder conserva a geometria estrutural de 20 px das networks. | Evidência: commit `146972f`; Node 22 `tsc -b`, smokes UI GRAFCET e blocos Ladder, e novo `test:grid-ui` Playwright (Esquema 2D, GRAFCET, Ladder e 3D) passam. |
| UI-VISUAL-01 | Média | TODO | Rever as telas num browser (Ladder, GRAFCET, painéis, ecrãs pequenos) e propor melhorias com capturas; exige ambiente com Chromium | Runner com Playwright / responsável |
| LADDER-IDEAS-01 | Baixa | TODO | Avaliar CTUD, TONR já existente na UI, comentários por elemento e exportação de listagem de endereços cruzados (referências cruzadas) | Decisão do responsável |

As pendências n8n provêm da revisão anterior e precisam de reconfirmação. ENV-01 conserva apenas a validação do build de produção num ambiente com memória suficiente; os checks recentes estão descritos em [[Validation-2026-10-25]].

## Adoção de IA com controlo de custo

| ID | Prioridade | Estado | Entrega e critério verificável | Dependência / papel proposto |
| --- | --- | --- | --- | --- |
| AI-01 | Alta | DONE | Matriz atual de ferramentas, custos e limitações, ligada ao briefing e backlog; fontes oficiais datadas | Evidência: [[AI-Tooling-Assessment]] |
| AI-02 | Alta | DONE | Instruções Copilot, recomendações VS Code e guia de utilização adicionados ao repositório; ficheiros presentes e JSON válido | Evidência: .github/copilot-instructions.md, .vscode/extensions.json e docs/AI-ASSISTANCE.md |
| AI-03 | Alta | TODO | Abrir o repositório no VS Code, autenticar GitHub e confirmar plano/quota; obter uma sugestão curta e confirmar que as instruções foram carregadas | Conta real / responsável |
| AI-04 | Média | TODO | Verificar elegibilidade do benefício Copilot Pro e decidir a licença do projeto; não presumir que um repositório público dá direito ao benefício | Responsável; informação oficial da conta |
| AI-05 | Média | TODO | Confirmar o plano OpenAI já usado e registar limites e custos existentes, sem contratar outro plano equivalente | Responsável |
| AI-06 | Média | TODO | Rever alternativa Google após descontinuação do acesso pessoal Code Assist; escolher app web ou integração atual com custo e acesso comprovados | Coordenação / conta Google |
| AI-07 | Média | TODO | Executar piloto de três tarefas com a mesma aceitação; registar tempo, correções e quotas; recomendar uma combinação | ENV-01, AI-03 / coordenação e QA |
| AI-08 | Baixa | DEFERRED | Avaliar Llama/Mistral apenas se o piloto mostrar uma lacuna; selecionar modelo/licença e medir recursos antes de descarregar | AI-07 / coordenação |
| AI-09 | Média | TODO | Ativar Sonda no Maestri e verificar resposta a um excerto sintético; manter o perfil de análise sem ferramentas | [[../../04-Agents/Agent-Environment|Inicializador existente]] / responsável |
| AI-10 | Média | TODO | Registar mensalmente novas subscrições, API, energia e horas de manutenção; distinguir custo adicional de custo já existente | Responsável; tabela de custos na avaliação |
| AI-11 | Média | TODO | Aplicar a substituição do terminal Mistral por Gemma Local com --replace e confirmar resposta no canvas; inferência local já passou e o script está preparado | [[../../04-Agents/AI-Terminals|Procedimento e teste Gemma]]; Shell Maestri com Maestro ativo |
| AI-12 | Média | DONE | Explorar o ECC 2.2.3 num commit fixado, registar o catálogo Codex e confirmar ecc@ecc disponível nos dois projetos, sem instalar o plugin | [[../../04-Agents/ECC-Exploration|Exploração e seleção ECC]]; consulta CLI local |
| AI-13 | Média | TODO | Decidir a ativação do plugin ECC e executar o piloto selecionado: revisão n8n, verificação de alteração pequena e auditoria documental BrainNet; medir resultados | AI-12, ENV-01; [[../../04-Agents/ECC-Exploration|Critérios e compatibilidade]] |

## Critérios de decisão do piloto

- Os checks do produto têm baseline executável ou falhas explicitamente registadas.
- Uma sugestão de código só é aceite após os testes e revisão aplicáveis.
- A ferramenta selecionada demonstra utilidade numa tarefa real, com consumo observado e custo documentado.
- Novas APIs ou planos pagos só avançam após decisão explícita sobre fornecedor, conta e orçamento.

[[Project-Brief|Briefing]] · [[Requirements|Requisitos]] · [[AI-Tooling-Assessment|Avaliação]].
