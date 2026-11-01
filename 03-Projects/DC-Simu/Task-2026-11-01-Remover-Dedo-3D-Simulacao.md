---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_TESTED
created: 2026-11-01
updated: 2026-11-01
tags: [dc-simu, simulation, 3d, cursor, ux]
---
# Tarefa 2026-11-01 — Remover o dedo 3D ao simular

## Pedido e autorização

O utilizador pediu «Remover dedo 3d ao simular», com autorização explícita para commit e push nos repositórios `deopmdecastro/dc-simu` e `deopmdecastro/BrainNet`. Prioridade: trabalhar no cofre e manter a ligação entre documentação, código e contexto dos agentes. A autorização abrange o código no GitHub; não confirma um deploy nem alterações à instância n8n ou ao Maestri.

## Diagnóstico

`src/three/SimFinger3D.tsx` cria uma mão/dedo indicador sobre a cena. `Panel3D.tsx` monta-o quando `canActuate && !demoMode`; `panel3d-editor.css` esconde o cursor normal através de `data-sim-finger="true"`. O componente também regista eventos de ponteiro e calcula interseções e animações por quadro. Não é um modelo de equipamento nem uma peça do circuito.

## Caminho escolhido

Remover o componente e as suas ligações à visualização 3D, em vez de o manter montado e invisível. Retirar o atributo e o CSS que escondem o cursor. Assim deixam de existir a geometria, os eventos e o trabalho de renderização desta sobreposição, mantendo o cursor normal e os cursores dos alvos interativos.

### Âmbito

- `03-Projects/DC-Simu/dc-simu/src/three/Panel3D.tsx`.
- `03-Projects/DC-Simu/dc-simu/src/three/SimFinger3D.tsx` (remoção).
- `03-Projects/DC-Simu/dc-simu/src/styles/panel3d-editor.css`.
- Regressão de ausência da sobreposição e preservação da interação; documentação técnica e validação.
- Este cofre: tarefa, decisão, princípios de interface, índice e ponteiro do submódulo.

Não alterar motores elétricos, cabos, modelos GLB, estados RUN/PAUSA/STOP, seleção, animações dos equipamentos, persistência, workflows n8n ou configuração Maestri. Não há necessidade de opção para reativar um cursor que o utilizador pediu para retirar.

## Critérios de aceitação

- [x] Em RUN, PAUSA e STOP não existe o objeto `sim-finger` na cena 3D.
- [x] O cursor normal não é escondido; os cursores de interação existentes são preservados.
- [x] Ligações START/STOP preservadas e comportamento elétrico aprovado em `test:native-sim`; seleção/inspeção em RUN aprovada no browser e bloqueio de movimento mantido.
- [x] Não ficam importações, eventos, geometria ou CSS órfãos do dedo.
- [x] Regressões relevantes e tipos executados; limitações anteriores e checks do cofre registados na validação.
- [x] Commit do código publicado primeiro; commit do BrainNet publicado com o ponteiro para esse commit.

## Coordenação e evidências

Trabalho realizado no submódulo dentro do cofre. Contexto: [[Design-Principles]], [[Project-Brief]], [[Requirements]], [[Testing-Plan]], [[Decision-Log]] e `AGENTS.md` de ambos os repositórios. Papéis aplicáveis: Developer e QA-Security; a execução não representa agentes Maestri ativos. Esta sessão não tem terminal Maestri disponível.

Estado: implementação e validação concluídas no âmbito acima. Publicação GitHub confirmada por `git ls-remote`: código `e9e2a9d36bd7f4db280138df7c2e0442f675257b` e commit de integração do cofre `7310d0371e318072a093843477372c2a499d7aad`, ambos em `main`. O submódulo aponta exatamente para o commit do código. Este recibo fecha a tarefa; sem confirmação de deploy. Resultados e limitações em [[Validation-2026-11-01-Remover-Dedo-3D-Simulacao]].
