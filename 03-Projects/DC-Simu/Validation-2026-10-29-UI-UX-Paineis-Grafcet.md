---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-29
updated: 2026-10-29
tags: [dc-simu, ui, ux, responsive, grafcet, simulation]
---
# Refinamento de interface e simulação GRAFCET

## Pedido e âmbito

Refinar os ecrãs apresentados pelo utilizador, mantendo o tema e os componentes
existentes. O pedido inclui cabeçalho, barras, painéis, ícones e adaptação a
telemóvel, tablet e desktop, além de controlos de simulação e entradas/saídas
no GRAFCET coerentes com o Esquema e o Ladder.

O pedido direto de 2026-10-29 (UTC) autoriza implementar os anexos, fazer
commit e push nos repositórios da aplicação e do BrainNet. Este registo
não constitui aprovação de publicação. A integração final e as evidências
estão em [[Validation-2026-10-29-Integracao-Bundles]].

## Alterações em validação

- Barras compactas com Simulação sempre visível e ações secundárias em menus.
- Cabeçalho com prioridade ao nome do projeto, ações compactas e ícones
  acessíveis; rodapé com dimensões coerentes.
- Painel inferior de simulação GRAFCET com separadores E/S e Sequência;
  reutiliza as E/S do Esquema, com PLC selecionado/ativo e alternativa virtual.
- Abertura/recolha do simulador sincronizada com o painel efetivamente visível.
- Inspetor GRAFCET e painel inferior Ladder com navegação de secções compacta
  e conteúdo alcançável por scroll.
- Avisos de ajuda recolhíveis e contactos/estados das entradas sem sobreposição.

Não foram alterados autenticação, bases de dados, credenciais ou motores
elétricos/de simulação. A validação de interface usa dados sintéticos e API
bloqueada, sem modificar projetos reais.

## Verificações

- BrainNet: `npm test` (45 testes) e `npm run check` passaram no ponto de partida.
- Aplicação: `npm test`, `test:style`, `test:plc-signals`, `test:grafcet-signals`,
  `test:grafcet-ladder-sync` e `test:grafcet-dialogs` passaram.
- QA de barras em 375, 390, 768, 1024 e 1440 px: sem transbordo, Simulação
  acessível e menus funcionais nas vistas Esquema, Ladder e GRAFCET.
- Regressão de painéis: 375, 390, 768, 1024 e 1440 px, incluindo sinais do PLC,
  entradas virtuais em STOP, preservação de RUN e acesso às saídas por scroll.
- Percurso GRAFCET desktop/telemóvel e texto livre no menu compacto passaram.
- `test:ci` completo passou; build de produção validado na integração final.

## Evidências locais

Capturas sintéticas em `runtime/dcsimu-ui-refine/` e no diretório de
evidências da regressão de painéis. Os ficheiros de runtime não são publicados.
