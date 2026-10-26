---
project_id: BN-DCSIMU-001
type: decisions
status: ACTIVE
created: 2026-10-18
updated: 2026-10-26
tags: [brainet, dc-simu, decisions]
---
# Decisões do DC-Simu

| ID | Data UTC | Decisão | Base e estado |
| --- | --- | --- | --- |
| DC-ADR-001 | 2026-10-18 | Incluir o DC-Simu no portefólio de projetos do BrainNet como BN-DCSIMU-001 | Pedido direto do utilizador; registo documental |
| DC-ADR-002 | 2026-10-18 | Manter o código na pasta existente e ligar o contexto a partir do cofre | Organização adotada para esta integração; evita duplicar o repositório |
| DC-ADR-003 | 2026-10-18 | Usar DEVELOPMENT como estado inicial | Produto já implementado, com pendências n8n documentadas; aceitação da versão por confirmar |
| DC-ADR-004 | 2026-10-18 | Colocar segurança e fiabilidade n8n no início do backlog | Prioridade técnica proposta com base na revisão local; requer reconfirmação antes de implementar |
| DC-ADR-005 | | Definir ambiente e critérios de lançamento | Pendente do responsável do projeto |
| DC-ADR-006 | 2026-10-18 | Preparar adoção de IA com objetivo de zero novas subscrições | Implementadas instruções de repositório e avaliação de custos; contratação não autorizada por esta proposta |
| DC-ADR-007 | 2026-10-18 | Manter DeepSeek/Sonda como analista de contexto | Baseado no teste local de ferramentas sem chamada válida; QA continua a exigir comandos e revisão |
| DC-ADR-008 | 2026-10-18 | Avaliar acesso e baseline antes de escolher outra subscrição | Copilot e conta Google por verificar; dependências locais do produto incompletas nos checks iniciais |
| DC-ADR-009 | 2026-10-18 | Substituir o terminal Mistral por Gemma 4 E4B local no Ollama | Pedido direto após setup cancelado; inferência sintética local passou, troca do terminal preparada e ainda por confirmar no Maestri |
| DC-ADR-010 | 2026-10-18 | Explorar o catálogo ECC comum ao Codex dos dois projetos antes de ativar o plugin completo | Pedido do utilizador; versão 2.2.3 e commit 76aaa77 fixados, catálogo verificado nos dois projetos; hooks/MCP e adaptador OpenCode não ativados |
| DC-ADR-011 | 2026-10-25 | Centralizar uma cópia do código em `03-Projects/DC-Simu/dc-simu/` dentro do cofre | Pedido direto do utilizador; checkout anterior preservado sem sincronização automática; cópia sem `.git`, `.env`, dependências instaladas e artefactos de build |
| DC-ADR-012 | 2026-10-25 | Ligar `dc-simu/` como submódulo do repositório da aplicação | Pedido de clone/pull no DC-Simu e commit/push nos dois repositórios; cópia anterior e checkout exterior preservados; BrainNet fixa o commit da aplicação |
| DC-ADR-013 | 2026-10-25 | Normalizar novas interfaces e cenários Siemens/LOGO! para endereços `I0.0`/`Q0.0` e manter compatibilidade de leitura/migração para aliases legados | Smoke de núcleo e percursos UI aprovados; a migração preserva IDs e cabos de projetos guardados; ver [[Validation-2026-10-25]] |
| DC-ADR-014 | 2026-10-25 | Não classificar o build de produção como aprovado apenas a partir do sandbox atual | Vite excede a memória disponível neste host; repetir num runner dimensionado antes de declarar release; ver [[Validation-2026-10-25]] |
| DC-ADR-015 | 2026-10-25 | Acrescentar diagnósticos estáticos ao Ladder e ao GRAFCET antes de novas funcionalidades de motor | Baixo risco: só geram avisos, sem alterar a simulação; cobertos por `test:diagnostics` e sem falsos positivos nos 11 modelos; ver [[Validation-2026-10-25]] |
| DC-ADR-016 | 2026-10-25 | Tornar `EDITOR_THEME` o contrato visual efetivo da grelha | Fundo, pontos e linhas são partilhados entre Esquema, 3D, GRAFCET, Ladder e catálogo. A normalização não altera snap, zoom ou coordenadas; Ladder conserva a sua malha geométrica de 20 px e a grelha de piso 3D continua apenas cenário. Ver [[Validation-2026-10-25]]. |
| DC-ADR-017 | 2026-10-26 | Arrastar troços GRAFCET como deslize ortogonal em vez de inserir pontos de quebra soltos | Elimina os saltos do percurso de retorno observados em iPhone; as ancoragens nas etapas ficam fixas; ver [[Validation-2026-10-26-GRAFCET-Retorno]] |
| DC-ADR-018 | 2026-10-25 | Centralizar elementos comuns das barras de ferramentas em `src/ui/toolbarKit.tsx` e reutilizá-los em Esquema/3D, GRAFCET, Ladder e editor de componentes 3D | Pedido direto do utilizador; commit `e28db97` (renumerada de um DC-ADR-013 duplicado em 2026-10-26); ações específicas de cada editor mantêm-se nas respetivas barras |
| DC-ADR-019 | 2026-10-26 | Retorno dos botões explícito (`returnMode: spring/latch`), omissão = retenção para compatibilidade | Botoneiras com mola passam a ficar ativas só enquanto premidas; componentes guardados não mudam de comportamento; ver [[Validation-2026-10-26-Deteccao-Bornes-Mola]] |
| DC-ADR-020 | 2026-10-26 | Bornes do editor guardam sempre a geometria do encaixe medida no modelo (profundidade e recuo) | Evita a projeção na face exterior no esquema 3D; o mesmo método por raios valida os modelos integrados e os criados no editor; ver [[Validation-2026-10-26-Deteccao-Bornes-Mola]] |
| DC-ADR-021 | 2026-10-26 | GRAFCET: SET e RESET simultâneos na mesma saída → prevalece o RESET e o conflito fica registado e visível no simulador | Comportamento seguro e determinístico, independente da ordem das etapas; ver [[Validation-2026-10-26-Varredura-Editores]] |
| DC-ADR-022 | 2026-10-26 | Ladder: contactos e ramos avaliados sem curto-circuito | Garante a memória de flanco dos contactos P/N em cada scan; ver [[Validation-2026-10-26-Varredura-Editores]] |
| DC-ADR-023 | 2026-10-26 | Ladder: SR = set dominante, RS = reset dominante | Segue a IEC 61131-3; ver [[Validation-2026-10-26-Varredura-Editores]] |
| DC-ADR-024 | 2026-10-26 | FluidSIM: a porta de entrada de etapas e transições é a que está em cima (geometria); só se a geometria não for conclusiva se usa o bit 2 de `FLIPPED` | O `FLIPPED I 2` troca as portas e invertia o fluxo; ver [[Validation-2026-10-26-FluidSIM-Ladder]] |
| DC-ADR-025 | 2026-10-26 | Condições importadas na sintaxe do DC-Simu: `NOT`/`!` → `/`, `AND` → `*`, `OR` → `+`, com ` + ` e ` * ` espaçados e um `+` pneumático final preservado | Pedido do utilizador; evita a ambiguidade com nomes pneumáticos terminados em `+` |
| DC-ADR-026 | 2026-10-26 | Ladder: JMP/JMPN só saltam para a frente; as networks saltadas não correm e mantêm as saídas; um salto para trás ou uma etiqueta inexistente são erro de lint e são ignorados em execução | Evita ciclos infinitos no scan; segue o comportamento do TIA Portal |
| DC-ADR-027 | 2026-10-26 | Os pontos de paragem do Ladder são avaliados no fim do scan e o passo a passo percorre o rasto de um ciclo completo, em vez de executar uma network a meio do scan | O tick junta o elétrico, o GRAFCET e vários PLCs; parar a meio deixaria a imagem de processo incoerente. Os pontos de paragem ficam só em memória, como o forçar |
| DC-ADR-028 | 2026-10-26 | As regras de planos (catálogo, limites, `canUse`, expiração, estados de componentes, permissões de comentários) vivem num único módulo `src/saas/platformCore.mjs`, partilhado pelo navegador e pelo servidor | Evita divergência entre o que a interface mostra e o que o servidor aplica; os testes `test:saas` cobrem o mesmo código |
| DC-ADR-029 | 2026-10-26 | Os planos pagos são ativados por aprovação manual do administrador (pedido de plano), sem gateway de pagamento; o checkout fica preparado | Permite operar o SaaS já, sem dados de pagamento no projeto; a integração (ex.: Stripe com webhooks) fica como pendência |
| DC-ADR-030 | 2026-10-26 | A aplicação dos limites tem três camadas: servidor Node devolve HTTP 402; Supabase usa RLS e triggers (`enforce_project_limit`, `protect_profile_role`); o modo local aplica só na interface | O modo local não tem servidor de confiança; a garantia real exige o servidor ou o Supabase |
| DC-ADR-031 | 2026-10-26 | Os componentes têm estados `active`/`blocked`/`archived`/`deleted` e um plano mínimo; eliminar é lógico e reversível por «Repor» | Mantém projetos antigos legíveis e permite auditoria; bloquear exige motivo |
| DC-ADR-032 | 2026-10-26 | A compilação Ladder trata etiquetas LBL/JMP como locais a cada bloco e faz referências cruzadas globais; o bloqueio de RUN com erros é opcional e guardado no navegador | Corresponde ao modelo TIA/STEP 7; o bloqueio opcional não interrompe fluxos de ensino existentes |

O código em `dc-simu/` tem histórico próprio e o BrainNet guarda o seu commit através de um submódulo. O dashboard é atualizado manualmente. Este registo não liga os workflows DC-Simu aos workflows da fundação BraiNet.

[[Project-Brief|Briefing]] · [[Requirements|Requisitos]] · [[../../00-Dashboard/Projects-Dashboard|Projetos]].
