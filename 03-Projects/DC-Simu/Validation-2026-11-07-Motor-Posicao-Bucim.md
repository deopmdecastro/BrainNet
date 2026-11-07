---
type: validation
status: IMPLEMENTED_LOCAL
created: 2026-11-07
updated: 2026-11-07
tags: [dc-simu, motor, cabos, bucim, animacao, validacao]
---
# Motor visível e bucim alinhado com os cabos

Correção implementada e testada localmente após o utilizador comunicar que o motor continuava a aparecer tarde e os cabos atravessavam a carcaça. A correção anterior do encaminhamento dos cabos não resolvia a posição animada do modelo.

## Causa reproduzida

O CAD está ancorado pela base e precisa de um deslocamento vertical de −1,04 unidades. A animação substituía essa posição por uma oscilação em torno de zero, ou interpolava para zero em repouso. Os cabos continuavam a usar as coordenadas físicas corretas dos bornes e do bucim.

Além disso, o Canvas desenha a pedido: o intervalo entre desenhos pode ser longo. A interpolação com fator `delta * 8` extrapolava para fora da cena quando esse fator ultrapassava um. No navegador, a posição vertical local da carcaça chegou a −10,8302, com etiqueta, cabos e sondas ainda visíveis. Reproduziu-se assim o desaparecimento mostrado pelo utilizador.

## Implementação

- `dc-simu/src/three/motorBodyMotion.ts`: vibração relativa à posição base e retorno exponencial estável mesmo após pausas longas.
- `dc-simu/src/three/Panel3D.tsx`: usa a posição base do modelo na animação; nomes dos nós permitem verificar o CAD efetivamente desenhado; subscreve a conclusão das texturas do motor.
- `dc-simu/src/three/motorEditorTextures.ts`: notifica o Canvas quando os mapas chegam, para os desenhar sem exigir interação com a vista.
- `dc-simu/scripts/motor-fan-textures-smoke.ts`: regressão com os GLB reais, respetivas caixas de bornes e peças físicas do bucim. Abrange motores trifásico e monofásico, primeiro desenho, marcha, paragem, pausas de até 300 s, orientação, espelho e escala desigual.

## Evidência

Navegador isolado, 1440 × 1000, com o projeto nativo Partida direta e o motor deslocado 330 px para baixo, reproduzindo a disposição comunicada. A página temporária de teste foi removida após a inspeção.

- Antes: carcaça fora da vista, cabos e sondas suspensos. Captura local: `runtime/motor-frame-before.png`.
- Depois: carcaça visível, quatro condutores de potência a entrar pelo bucim e sondas nos bornes. Captura local: `runtime/motor-frame-after.png`.
- Primeiro registo do modelo na nova abertura: posição local `[0, -1.04, 0]`, aproximadamente 1376 ms após a navegação nesta execução local. Este valor não é uma garantia de desempenho em produção.
- 240 amostras do modelo renderizado: desvio máximo entre o centro da cúpula física do bucim e a posição usada pelo encaminhamento inferior a `1e-9 mm` em repouso.
- Invocação do callback real de animação com intervalos de 0,5, 30 e 300 s: mesma posição e mesmo alinhamento. Captura local: `runtime/motor-frame-long-idle.png`.
- Sete notificações de texturas concluídas observadas nessa abertura, sem interação com a câmara.

As capturas e logs ficam em `runtime/`, ignorado por Git. Os testes geométricos anteriores dos cabos verificavam um referencial fixo; a nova regressão verifica também a posição animada do modelo e das peças físicas.

## Verificação e pendências

- Aplicação: `npm test`, `npm run test:motor` (16 verificações), `npm run test:native-wires-3d` (inclui 28 verificações de bloqueio e organização) e `npm run build`: passaram.
- O build inclui TypeScript e conserva os avisos existentes sobre tamanho/importações de chunks.
- Os testes de GLB em Node mantêm os avisos de descodificação de imagens embutidas; a geometria foi carregada e validada. As texturas foram também observadas no navegador real.
- Cofre: `npm test`, 45 testes aprovados. `npm run check` mantém os nove erros anteriores: duas propriedades em falta em `Task-2026-11-03-Grafcet-Sem-Painel-Baixo.md`, quatro imagens referidas em `Validation-2026-11-02-PLC-Siemens-Pose-Bornes-Leds.md` e três imagens em `Validation-2026-11-02-Test-Reset-Rele-Termico.md`.
- Código incluído no commit `7fce8846b3747ea658bc921a25ddd9e4f0bcd6e9` da aplicação, enviado para `origin/main` em 2026-11-07 após o pedido explícito de commit e push do utilizador. Sem deploy nesta tarefa. A validação do utilizador no seu ambiente continua pendente. A alteração anterior de alinhamento das condições GRAFCET foi incluída no mesmo commit.
