---
type: evaluation
status: READY_FOR_REVIEW
created: 2026-11-21
updated: 2026-11-21
tags: [brainet, dc-simu, ai, seo, avaliacao]
---
# Avaliação de quatro vídeos sobre Claude, plugins e SEO

Quatro reels públicos em português do Brasil, vistos localmente em 2026-11-21 (frames e descrição do post; sem legendas disponíveis). São peças de marketing com apelo "comenta X e recebo na DM": as alegações não contam como evidência. Cada ideia foi cruzada com o estado atual do cofre e do repositório `dc-simu`.

| # | Vídeo | Proposta |
| --- | --- | --- |
| 1 | 5 conectores do Claude | Perplexity, Firecrawl (incluindo extrair "design e marca"), PostHog, Playwright, Composio (1000+ apps num plugin) |
| 2 | 4 plugins do Claude Code | Playwright, Agent Skills (/plan, /build), Graphify (mapa do projeto), Ponytail (escrever só o código necessário) |
| 3 | Humanizar texto | Pedir ao Claude a lista da Wikipedia de sinais de texto gerado por IA, proibi-los e guardar o resultado como skill pessoal |
| 4 | 20 itens antes de lançar um site | Básico técnico (404, robots, títulos, meta, links internos, breadcrumbs, alt, privacidade, analytics), conversão (CTA, obrigado, prazo, imagem de partilha) e citação por IA (FAQ, casos, avaliações, mapa, schema local, foto da equipa) |

## Ferramentas: decisão

Existência verificada no GitHub em 2026-11-21. Popularidade não comprova qualidade nem segurança.

| Ferramenta | Verificação | BrainNet / DC-Simu | Decisão |
| --- | --- | --- | --- |
| **Playwright MCP** | Microsoft, oficial | Já configurado: [[../04-Agents/MCP-Evaluation|piloto]]. O DC-Simu já usa a biblioteca `playwright` nos smoke tests `*-ui-smoke.mjs` | Manter. Próximo passo é o primeiro uso real por Farol |
| **Ponytail** | `DietrichGebert/ponytail`, ~196k estrelas; existe `ponytail-lite` como um único AGENTS.md | Alinhado com regras já existentes (sem segundo schema, sem dependências desnecessárias). O DC-Simu é grande e propenso a sobre-engenharia | **Recomendado em versão leve**: transcrever 5 a 8 regras YAGNI para o AGENTS.md do DC-Simu em vez de instalar o plugin. Sem hooks nem código de terceiros |
| **Graphify** | `Graphify-Labs/graphify`, ~151k estrelas; Python, AST local, sem base vetorial, skill para Claude Code e Codex | O DC-Simu tem centenas de módulos e smoke tests; os agentes releem muito contexto. Encaixa no cofre Obsidian | **Piloto candidato**: gerar o grafo do DC-Simu para `runtime/`, só leitura, e medir se reduz as releituras numa tarefa real. Rever licença, dependências e rede antes de instalar |
| **Agent Skills (/plan, /build)** | Coleções genéricas (por exemplo `coleam00/skills`); o vídeo não identifica o pacote | Já existem o modo de planeamento do Claude Code, os papéis em `04-Agents/` e o fluxo Maestri | Não adotar. Valor marginal baixo e risco de instruções concorrentes |
| **Perplexity / Firecrawl** | Oficiais | Já avaliados em [[../04-Agents/MCP-Evaluation|MCP-Evaluation]] | Sem alteração. Usar o Firecrawl só para referência: **não copiar design, marca ou conteúdo de concorrentes**, como o vídeo sugere |
| **PostHog MCP** | O repositório `PostHog/mcp` está arquivado; o serviço passou a servidor alojado com chave pessoal | O DC-Simu não tem analytics. Só faz sentido depois de instrumentar o produto e de rever cookies e privacidade | Pendente da decisão sobre analytics (ver abaixo) |
| **Composio** | Plataforma OAuth que liga mais de 1000 apps | Centraliza credenciais de muitas contas num terceiro, o que contraria "credenciais pertencem ao gestor da ferramenta" | **Não adotar** sem caso de uso concreto e revisão de segurança |

## Humanização de texto

Aplicável à documentação do cofre (pt-PT) e a conteúdos de marketing. Uma skill local de estilo pode proibir padrões como travessões em excesso, frases de enchimento, regra de três sistemática, vocabulário típico de IA e tom robótico, usando a página da Wikipedia "Signs of AI writing" como fonte.

Limites: o objetivo é clareza e voz própria, não enganar detetores. Os detetores de IA não são fiáveis, por isso o "0%" do vídeo não prova nada. Conteúdo publicado continua sujeito a revisão humana e a factos confirmados.

**Recomendado:** criar a skill `escrita-pt-pt` no cofre com `skill-creator`, adaptada a português europeu e às regras do AGENTS.md. Esforço baixo e sem dependências.

## Checklist de lançamento: DC-Simu e website BraiNet

Estado do DC-Simu verificado no repositório (`index.html`, `public/`, `vercel.json`, `src/`). O website BraiNet está em DISCOVERY e ainda sem código.

| Item | DC-Simu (estado atual) | Website BraiNet |
| --- | --- | --- |
| 404 personalizada | Em falta. O `vercel.json` reescreve tudo para `index.html` e não foi encontrada rota NotFound; URLs inválidos devolvem 200 | Requisito |
| robots.txt | Em falta em `public/` | Requisito; staging sem indexação (já previsto) |
| Título e meta description | Só existe um global em `index.html`; as rotas SPA (`/privacidade`, `/termos`, etc.) não os mudam | Por página |
| Links internos e breadcrumbs | A avaliar na landing | Requisito no [[../03-Projects/BraiNet-Website/Sitemap|Sitemap]] |
| Alt text | A auditar nas imagens da landing | Requisito |
| Privacidade | Existem `/privacidade`, `/termos`, `/cookies` e `/licencas` | Já previsto |
| Analytics | Nenhum (sem gtag, PostHog ou Plausible) | Decisão pendente; exige consentimento conforme a ferramenta |
| CTA acima da dobra, CTA fixo no telemóvel | A auditar com Playwright | Requisito de design |
| Página de obrigado e prazo de resposta | N/A ao fluxo SaaS (o registo já tem confirmação) | Requisito do formulário de contacto |
| Imagem de partilha (Open Graph) | Em falta (sem `og:` nem `twitter:`) | Requisito |
| FAQ (5 perguntas) | A avaliar na landing | Requisito; só dúvidas reais |
| Casos, avaliações | Só com casos reais e autorizados | Só reais; o briefing já proíbe casos fictícios |
| Schema | Em falta. Adequado: `SoftwareApplication`/`Organization` | `Organization`/`LocalBusiness` só com morada e telefone confirmados |
| Mapa, foto da equipa | N/A (produto online) | Só se houver morada pública e consentimento das pessoas |

Sitemap XML também está em falta no DC-Simu, embora não conste do vídeo.

**Ganhos rápidos no DC-Simu**, sem custos nem serviços novos: `robots.txt`, `sitemap.xml`, metatags Open Graph/Twitter com uma imagem de partilha, JSON-LD `SoftwareApplication` com factos confirmados, uma rota 404 com `noindex` e títulos/descrições por rota. Cada item é verificável com um smoke test Playwright. A publicação em produção continua a exigir aprovação explícita (pessoa, commit, ambiente, data).

## Prioridades propostas

1. **DC-Simu, SEO técnico básico** (os ganhos rápidos acima), com testes. Mais valor por esforço e sem custo.
2. **Skill `escrita-pt-pt`** para documentação e marketing.
3. **Regras YAGNI ao estilo Ponytail** no AGENTS.md do DC-Simu.
4. **Piloto Graphify** no DC-Simu, depois de rever o pacote; medir antes de adotar.
5. **Decisão sobre analytics** do DC-Simu (ferramenta, consentimento, retenção); só depois o PostHog MCP.
6. Fora de âmbito por agora: Composio, pacotes de Agent Skills e cópia de marca de concorrentes.

Nada foi instalado nem alterado no produto por esta avaliação. Estado: **preparado para decisão**.

[[../04-Agents/MCP-Evaluation|Avaliação MCP]] · [[../03-Projects/BraiNet-Website/SEO-Strategy|SEO do website]] · [[../03-Projects/BraiNet-Website/Launch-Checklist|Lançamento do website]] · [[../03-Projects/DC-Simu/AI-Tooling-Assessment|Ferramentas de IA do DC-Simu]]
