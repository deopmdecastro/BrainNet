---
project_id: BN-DCSIMU-001
type: task
status: DONE
created: 2026-11-02
updated: 2026-11-02
tags: [dc-simu, rele-termico, 3ru1116, test, reset, simulacao]
---
# Tarefa 2026-11-02 — TEST com disparo retido e RESET rotativo do relé térmico

## Pedido e decisão do utilizador

Melhorar o TEST do relé térmico do motor: enquanto premido, parar o motor, apagar o sinalizador verde e acender o vermelho. Criar a manobra do RESET azul, rodando para a esquerda ou para a direita. O utilizador confirmou expressamente que se trata do **relé térmico Siemens F1 (3RU1116)**, não do relé de segurança 3TK2840/Guardmaster, e escolheu **disparo retido: largar TEST não rearma; são necessários RESET e START**.

Autorização explícita para commit e push em `deopmdecastro/dc-simu` e `deopmdecastro/BrainNet`. Não constitui confirmação de deploy nem autorização para alterar serviços externos.

## Contexto e reutilização

- Base limpa: BrainNet `c28937dd1e4a287564fd3dd06c3a82ace67a45f8`; aplicação `d99570cb4986ac1b9912da1353d832e072601dc1`.
- Consultados `AGENTS.md`, Home, Architecture, papéis Developer/QA-Security, Project-Brief, Requirements, Design-Principles, Testing-Plan, Decision-Log e validação anterior do 3RU1116.
- Reutilizar `importedActuationPatch`, `importedBridges`, as zonas medidas de STOP/RESET/TEST, o pivô azul do GLB, os materiais existentes e o programa nativo do LOGO!.
- O projeto nativo já liga 95–96 em série com KM1 e 97–98 a I0.3; Q0.1 alimenta H1 verde e Q0.3 alimenta H3 vermelho. O GRAFCET regressa a X0 com I0.3 e exige uma nova transição START.
- A implementação anterior fazia TEST apenas momentâneo e RESET por pressão. A fotografia e o pedido atual alteram esse contrato.
- Referência técnica: catálogo Siemens SIRIUS, secção 3RU11: TEST simula o disparo e comuta 95–96/97–98; em modo manual exige RESET. No aparelho físico, pressão do botão azul rearma e pressão+rotação seleciona M/A. A rotação livre para rearma pedida aqui é uma **convenção didática desta aplicação**, não uma afirmação sobre o mecanismo físico; não muda silenciosamente o modo M/A nem ativa rearranque automático.

## Âmbito

1. TEST pressiona → `testPressed` e `tripped`; largar → limpa apenas `testPressed`, preservando o disparo.
2. STOP mantém o comportamento momentâneo; o corpo pode simular disparo, mas não substitui o RESET.
3. RESET azul roda nos dois sentidos, com retorno visual ao centro; só rearma depois de libertar TEST/STOP e nunca liga o motor diretamente.
4. Alternativa de teclado/toque no inspetor existente, sem criar painéis nem alterar o sistema visual.
5. Estado partilhado com o esquema IEC nativo; preservação de 3D/LOGO!/Ladder/GRAFCET e projetos gravados.
6. Regressões elétricas, de gestos e de navegador; documentação e publicação dos dois repositórios.

Fora do âmbito: novos modelos/texturas, relé de segurança separado, curva térmica temporizada, certificação funcional PL/SIL, modo automático físico, alterações a workflows ou deploy.

## Critérios de aceitação

- [x] Motor em marcha: TEST abre 95–96, fecha 97–98, deixa KM1/M1 desligados, H1 apagado e H3 aceso.
- [x] Largar TEST mantém o disparo; START sozinho não volta a arrancar.
- [x] RESET só rearma um disparo existente, após libertar os botões; não provoca marcha automática.
- [x] Rotação esquerda/direita funciona; gesto curto, cancelado ou perda de captura não produz rearme acidental.
- [x] STOP, bornes, geometria, materiais e restantes componentes preservados.
- [x] Projetos antigos abrem sem perder ligações nem estado de proteção.
- [x] Verificações reais e limitações registadas; código publicado antes do ponteiro exato no cofre.

## Coordenação

Trabalho no código dentro do cofre, com registo no próprio cofre. Papéis Developer e QA-Security aplicados como regras de trabalho; não há agentes Maestri ativos nem CLI disponível nesta sessão.

Resultados e publicação registados em [[Validation-2026-11-02-Test-Reset-Rele-Termico]].

Publicação: aplicação `f3eec26b0387ea4fb8af15d365940c4c93c7f59d`; cofre atualizado com o ponteiro exato do submodule. Build de produção fica pendente de runner dimensionado; não houve verificação de deploy.
