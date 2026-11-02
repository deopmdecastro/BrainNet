---
type: plugin-assessment
status: CATALOG_REGISTERED
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, ecc, plugins, codex, agents]
---
# ECC no DC-Simu e no BrainNet

Exploração pedida pelo utilizador, com base no [repositório affaan-m/ECC](https://github.com/affaan-m/ECC/tree/76aaa77df6adc5b889e689007bf99b9a4f74af34). Versão analisada: **2.2.3**; commit **76aaa77df6adc5b889e689007bf99b9a4f74af34**; licença MIT. A seleção é uma avaliação de adequação aos projetos, sem ensaio comparativo de produtividade.

## O que está disponível

O marketplace Codex do ECC publica **um plugin, ecc@ecc**. O checkout analisado contém 311 ficheiros `skills/*/SKILL.md` e 71 agentes em Markdown. Os nomes da tabela abaixo são skills dentro do plugin, não plugins independentes nem extensões do Obsidian/VS Code. Alguns textos do manifest ainda referem 281 skills; os números aqui resultam da contagem dos ficheiros no commit fixado.

O catálogo foi registado uma vez no `CODEX_HOME` habitual. A consulta feita a partir das pastas dos dois projetos devolveu `ecc@ecc`, versão 2.2.3, **installed=false** e **enabled=false**. Só a configuração de marketplaces mudou; o modelo Codex existente foi preservado. Não foram instalados servidores MCP, confiados hooks, importadas regras ou alterados os papéis Maestri.

## Seleção para o DC-Simu

| Prioridade | Skill ECC | Aplicação proposta | Adaptação necessária |
| --- | --- | --- | --- |
| 1 | security-review | Farol/Nexo: rever o proxy e o envio de eventos n8n, validação de entradas e gestão de segredos | Reconfirmar DC-01 a DC-04 no código atual; relatar localizações e impacto sem copiar valores de segredos |
| 1 | verification-loop | Farol: evidenciar regressões dos motores e integração após alterações | Usar os scripts reais do package.json; não executar os exemplos Bash ou comandos de cobertura sem verificar suporte |
| 1 | react-patterns | Bobina: rever componentes, efeitos e sincronização com Zustand | O projeto usa React 18 e R3F; excluir exemplos exclusivos de React 19/RSC e preservar o estado partilhado 2D/3D/Ladder/GRAFCET |
| 2 | react-testing | Propor testes de comportamento das vistas e controlos | Existem smoke tests e Playwright; RTL, Vitest e MSW não ficam instalados por esta seleção |
| 2 | contract-first | Nexo: evitar divergência de payloads entre cliente, proxy e n8n | Identificar primeiro o contrato existente; não criar um segundo schema ou gerar consumidores nesta exploração |

Para validação, os comandos existentes incluem `npm.cmd test`, `npm.cmd run test:interactables`, `npm.cmd run test:motion`, `npm.cmd run typecheck` e `npm.cmd run test:server`. Selecionar só os adequados à alteração; os testes de servidor exigem os dados temporários previstos. `npm.cmd run build` gera artefactos e `typecheck` pode atualizar tsconfig.tsbuildinfo. Não confundir o baseline histórico com checks executados agora. Ver [[../03-Projects/DC-Simu/Testing-Plan]].

## Seleção para o BrainNet

| Prioridade | Skill ECC | Aplicação proposta | Adaptação necessária |
| --- | --- | --- | --- |
| 1 | docs-governance | Prumo: descobrir papéis documentais, ligações e evidências em falta | Reutilizar dashboards e notas existentes; `npm.cmd run check` continua a validar o cofre; sem novo sistema de documentação |
| 1 | automation-audit-ops | Nexo: inventariar n8n, Maestri, Ollama, hooks e conectores com evidências | Começar por leitura e distinguir configurado, autenticado e verificado; não reiniciar serviços ou retirar integrações |
| 1 | contract-first | Rever fronteiras entre intake, workflows e propostas | `automation/lib/contracts.mjs` mantém-se como fonte executável; não duplicar contratos em prose ou schemas paralelos |
| 2 | context-and-decisions | Prumo: clarificar termos e ligar decisões duráveis | Reutilizar [[../00-Dashboard/Architecture]] e Decision-Log dos projetos; não criar CONTEXT/ADR vazios por convenção |

Seleção transversal: `mcp-dependency-review` para inspeção estática de configurações MCP antes de uma integração; `search-first` como método de pesquisa. As chamadas a subagentes e os exemplos específicos de Claude destes materiais não são executados automaticamente por esta avaliação.

O ficheiro `ecc-selection.json`, nesta pasta, contém nomes, caminhos e SHA-256 das skills selecionadas. É um registo da exploração: **não é uma configuração carregada pelo Codex e não limita automaticamente o catálogo do plugin**.

## Compatibilidade observada

| Ambiente | Resultado |
| --- | --- |
| Codex 0.163.0 | Caminho nativo de marketplace disponível; ECC consultável nos dois projetos; uma instalação futura no mesmo CODEX_HOME seria partilhada, sem duplicar por projeto |
| Maestri | O ECC complementa os clientes Codex; não cria terminais, ligações ou papéis no canvas. Prumo, Bobina, Nexo e Farol mantêm as suas funções |
| OpenCode/DeepSeek | ECC tem adaptador próprio, mas a configuração de referência inclui agentes com bash/write/edit. Não aplicar ao perfil Sonda com ferramentas desativadas; a compatibilidade funcional com DeepSeek não foi testada |
| Gemma/Llama por Ollama run | Os terminais atuais são de conversa. Não passam a descobrir ou executar plugins/skills por o catálogo Codex estar registado |
| Copilot CLI | ECC declara adaptador de projeto em .github/skills e .github/agents; as instruções Copilot existentes não foram substituídas |
| Copilot Chat / Gemini CLI | O ECC declara níveis de suporte distintos e sem paridade de hooks; nenhum adaptador foi instalado nesta exploração |

O plugin nativo declara **Chrome DevTools MCP**, com `chrome-devtools-mcp@1.10.1`, e um hook **SessionStart** que encaminha o arranque para scripts de contexto/sessão. A configuração do MCP foi apenas lida. O hook tem efeitos de runtime e exige revisão/confiança no Codex; não foi executado nesta exploração. Já existem ferramentas de browser neste ambiente, pelo que a utilidade adicional desse MCP deve ser demonstrada antes de o ativar.

O skill `vite-patterns` analisado destina-se a Vite 8+, enquanto o DC-Simu declara Vite 5.4.9. Não aplicar as recomendações de bundler/minificação diretamente. `knowledge-ops` pressupõe camadas de memória Claude/MCP e operações GitHub/Linear: requer adaptação ao cofre e aos contratos do BrainNet. Loops autónomos, aprendizagem contínua e o GitHub App ECC ficam fora do piloto atual.

## Como explorar nos terminais atuais

No PowerShell, dentro de qualquer dos dois projetos:

```powershell
codex.cmd plugin list --marketplace ecc --available --json
```

Dentro da interface Codex, usar `/plugins` para consultar o marketplace ECC. O registo do catálogo não disponibiliza ainda as invocações das suas skills como se estivessem instaladas.

Se for decidida a ativação futura, o caminho nativo é `codex.cmd plugin add ecc@ecc`. Esse passo instala o conjunto do plugin, não apenas esta shortlist. Reiniciar uma sessão para verificar a descoberta; rever os hooks com `/hooks`. Não acumular o plugin nativo com o sync legado para ~/.codex, nem copiar a configuração OpenCode por cima do provider local.

## Piloto verificável

1. DC-Simu: uma revisão de leitura do proxy n8n com security-review; entregar ficheiros/linhas, comportamento observado e proposta de testes, sem alterações de serviço.
2. DC-Simu: aplicar verification-loop a uma alteração pequena, usando os scripts disponíveis e registando falhas de baseline separadamente.
3. BrainNet: uma revisão documental com docs-governance, reaproveitando as notas existentes e confirmando `npm.cmd run check`.

Aceitação: mesmo âmbito e contexto nas comparações, resultados verificáveis, ficheiros alterados identificados e tempo/consumo medidos. Não há resultados do piloto, quotas ou poupanças de tokens demonstrados nesta entrega. O código ECC é MIT, mas a execução pelos agentes continua sujeita ao plano/modelo e às integrações usadas; nenhuma subscrição foi contratada.

## Fontes

- [Manifest Codex ECC](https://github.com/affaan-m/ECC/blob/76aaa77df6adc5b889e689007bf99b9a4f74af34/.codex-plugin/plugin.json) e [integração nativa](https://github.com/affaan-m/ECC/blob/76aaa77df6adc5b889e689007bf99b9a4f74af34/.codex-plugin/README.md).
- [Matriz de suporte ECC](https://github.com/affaan-m/ECC/blob/76aaa77df6adc5b889e689007bf99b9a4f74af34/README.md#platform-support), [adaptador OpenCode](https://github.com/affaan-m/ECC/blob/76aaa77df6adc5b889e689007bf99b9a4f74af34/.opencode/opencode.json), [MCP](https://github.com/affaan-m/ECC/blob/76aaa77df6adc5b889e689007bf99b9a4f74af34/.mcp.json) e [hooks Codex](https://github.com/affaan-m/ECC/blob/76aaa77df6adc5b889e689007bf99b9a4f74af34/hooks/codex-hooks.json).
- OpenAI Docs: [comandos de plugins](https://learn.chatgpt.com/docs/cli/reference) e [confiança dos hooks](https://learn.chatgpt.com/docs/hooks).

[[Agent-Environment|Ambiente de agentes]] · [[../03-Projects/DC-Simu/Backlog|Backlog DC-Simu]].
