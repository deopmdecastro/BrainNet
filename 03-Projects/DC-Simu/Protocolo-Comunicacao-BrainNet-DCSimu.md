---
project_id: BN-DCSIMU-001
type: specification
status: ACTIVE
created: 2026-11-17
updated: 2026-11-17
tags: [brainet, dc-simu, comunicacao, workflows, contextos, automacao, arquitetura]
---

# Protocolo de Comunicação e Alinhamento: BrainNet ↔ DC-Simu

Este documento estabelece o protocolo de priorização da comunicação entre a aplicação **DC-Simu** e o cofre de conhecimento, automação e orquestração **BrainNet OS**.

---

## 1. Princípio Fundamental de Arquitetura

O cofre **BrainNet** é a **única fonte de verdade concetual, operacional e normativa** para o ecossistema. O repositório **DC-Simu** é o **motor de simulação e interface de engenharia industrial**.

Toda a alteração na aplicação DC-Simu deve respeitar rigorosamente os contextos, workflows, diretrizes de UI/UX e automações definidos no cofre:
1. **Contexto antes do código:** Nenhuma alteração funcional ou estética no DC-Simu deve ser realizada sem prévia consulta a [[Design-Principles]], às tarefas ativas ([[Task-2026-11-17-PLC-Bornes-Leds-Animacoes-DPS-Bucim-Acrilico]]) e aos registos de decisão.
2. **Evidência antes da aprovação:** Toda a modificação de código no DC-Simu exige evidência em suítes de teste reais e registo explícito de validação no cofre BrainNet (conforme [[Validation-2026-11-17-Resolucao-Pendentes-GLB-Bucim-DPS-Inspetor]]).
3. **Rastreabilidade atómica:** O submódulo Git em `03-Projects/DC-Simu/dc-simu/` rastreia o commit exato da aplicação, mantendo a integridade bidirecional.

---

## 2. Contextos Partilhados e Normas de Design

### 2.1 Princípios de UI/UX (`Design-Principles.md`)
- **Cor de marca e seleção:** O tom oficial da interface é o azul de tema (`bg-brand-600` / `#2563eb` / `var(--dx-brand)`). Elementos ativos, botões de ação e seleções no Inspetor 3D/2D nunca utilizam preto ou cinzentos desarmonizados.
- **Ergonomia e Alvos de Toque:** Dimensão mínima de 44 px para interações tácteis (tablet e telemóvel), alinhamento consistente de ferramentas e sem bordas de acento soltas (`no-accent-border`).
- **Feedback Multimodal:** O estado do circuito reflete-se em tempo real em todas as vistas sincronizadas: Esquema IEC, 3D Realista, Ladder e GRAFCET.
- **Gating de Simulação:** Comandos mecânicos manuais (botões de pressão I/O do disjuntor-motor, botões de teste do relé térmico, manobras de disjuntores) só operam eletricamente em modo de simulação ativa (`running`) ou `demoMode`; fora de simulação, o clique seleciona o componente no Inspetor sem alterar o circuito.

### 2.2 Instruções aos Agentes de IA (`.github/copilot-instructions.md` e `docs/AI-ASSISTANCE.md`)
- Agentes de desenvolvimento (VS Code, Copilot, Codex, Maestri) são instruídos a carregar prioritariamente o cofre BrainNet para contextualização antes de sugerir ou aplicar código.
- Nenhuma resposta gerada por IA substitui testes de execução, inspeção do diff ou validação em ambiente real.

---

## 3. Workflows Operacionais e Ciclo de Vida

A interação entre novas solicitações e implementações na aplicação segue a biblioteca de workflows do BrainNet:

```
[Entrada / Ideia] ──> WF-01 (Intake)
                           │
                           ▼
                      WF-02 (Planning) ──> Backlog / Tarefa no cofre
                           │
                           ▼
                      WF-03 (Agent Handoff) ──> Developer / UI Designer
                           │
                           ▼
                    Implementação no DC-Simu
                           │
                           ▼
                    Testes Locais (CI Core)
                           │
                           ▼
                      WF-05 (QA Review) ──> Documento de Validação
                           │
                           ▼
                      WF-04 (Doc Sync) ──> Atualização do cofre e Submódulo
```

### WF-01 — Project Intake
Receção de novos requisitos de clientes, professores ou utilizadores industriais. O contrato em `automation/lib/contracts.mjs` normaliza o pedido sem aceitar código não confiável ou privilégios de execução direta.

### WF-02 — Project Planning
Desdobramento de requisitos em tarefas delimitadas no cofre (`03-Projects/DC-Simu/Task-YYYY-MM-DD-*.md`), com critérios de aceitação mensuráveis, caminhos de ficheiros previstos e dependências documentadas.

### WF-03 — Agent Handoff
Construção do pacote de contexto para os agentes da equipa Maestri / desenvolvimento:
- Identificação da tarefa e caminhos afetados em `dc-simu/`.
- Injeção obrigatória dos princípios de design (`Design-Principles.md`).
- Delimitação estrita de papéis: `Developer` para código TypeScript/Three.js, `UX-UI-Designer` para componentes React e estilos Tailwind, `QA-Security` para auditoria e testes.

### WF-04 — Documentation Sync
Sincronização entre o cofre e o repositório da aplicação:
- Atualização do submódulo Git com o commit correspondente da aplicação.
- Manutenção de conformidade no frontmatter e links (`check-foundation.mjs`).
- Geração de relatórios de validação no cofre com as evidências executadas.

### WF-05 — QA e Release Review
Avaliação de evidências antes de merge e publicação:
- Rejeição imediata se houver findings críticos ou ausência de testes.
- Validação das suites: `npm test` (núcleo elétrico), `npm run typecheck` (tipagem TypeScript), `npm run test:imported-components` (modelos e serigrafias 3D), `npm run test:thermal-controls`, `npm run test:siemens-plc`, `npm run test:breaker-cut`, `npm run test:panel-accessories` e `npm run test:style`.
- Autorização explícita humana antes de publicação em produção.

---

## 4. Automação e Verificação Contínua

1. **Validação da Fundação BrainNet (`scripts/check-foundation.mjs`):**
   - Garante que todos os documentos Markdown respeitam as regras do cofre (frontmatter YAML obrigatório: `type`, `status`, `created`, `updated`, `tags`).
   - Verifica a validade de todos os wikilinks internos e referências relativas para a aplicação `dc-simu/`.
   - Assegura que nenhum workflow do n8n possui nós não autorizados ou credenciais expostas.

2. **Rastreio do Submódulo Git:**
   - O diretório `03-Projects/DC-Simu/dc-simu` no BrainNet deve ser mantido atualizado com o `HEAD` da branch `main` do repositório `dc-simu`:
     ```bash
     cd 03-Projects/DC-Simu/dc-simu
     git checkout main && git pull origin main
     cd ../..
     git add 03-Projects/DC-Simu/dc-simu
     git commit -m "chore(dc-simu): atualiza apontador do submódulo para o commit mais recente"
     ```

3. **Infraestrutura n8n e SearXNG:**
   - O diretório `infra/n8n/` em `dc-simu` contém a infraestrutura em sandbox isolado para execução de nós com mTLS, SearXNG local e ausência de chamadas externas pagas.

---

## 5. Histórico de Implementação e Evidências

- [[Task-2026-11-17-PLC-Bornes-Leds-Animacoes-DPS-Bucim-Acrilico]] · [[Validation-2026-11-17-Resolucao-Pendentes-GLB-Bucim-DPS-Inspetor]]
- [[Task-2026-11-16-Barramentos-3D-Reais-Acrilico-E-Escada]] · [[Validation-2026-11-16-Filacamento-Industrial-3D-Chicotes-Apertados]]
- [[Task-2026-11-16-Barramento-Pente-Conector-Pino-E-Unioes-T-Calha]]
- [[Task-2026-11-16-Protecoes-3D-Realistas-Hager-TeSysDF-E-Anilhas-IEC60062]]
- [[Task-2026-11-16-Reguas-De-Bornes-PTI6-Plaquetas-ZB-Pontes-FBS-E-Inspetor-Total]]
- [[Task-2026-11-16-Grafcet-Ao-Vivo-Etapa-Ativa-Lado-A-Lado]]
- [[Backlog]] · [[Testing-Plan]] · [[Design-Principles]]
