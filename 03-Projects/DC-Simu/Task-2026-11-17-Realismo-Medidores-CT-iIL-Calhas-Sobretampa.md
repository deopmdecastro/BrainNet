---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VISUAL_ACCEPTANCE
created: 2026-11-17
updated: 2026-11-17
tags: [dc-simu, cad, realismo, medidores, transformador-corrente, schneider, hager, quadro]
---
# Revisão de realismo: medidores, TC, iIL, calhas e sobretampa

## Pedido direto e baseline

Deogracia de Castro rejeita um desenho genérico dos medidores e pede fidelidade
3D às referências, materiais/texturas reais e bornes garantidos. Inclui a peça
por onde passa o condutor (TC), sinalizadores mono/trifásicos Schneider, logótipos
reais Schneider/Hager, disjuntor unipolar Schneider, profundidade regulável das
calhas DIN com fixações/batentes e sobretampa em contorno tracejado sem fundo,
com obturadores nas vagas sem aparelhos. Nova fotografia: `IMG_5810.jpeg`.

A baseline histórica da tarefa anterior
[[Task-2026-11-17-Medidores-Bibliotecas-Schneider-CAD]] citava `10e555b`/`6e031a4`.
Esses apontamentos não aprovam a árvore recuperada. A recuperação atual parte de
`d474ab3` e tem commit local **20150c0**, build estático r212 e regressões verdes;
a publicação remota deve ser confirmada no registo de validação atual.
**A aceitação visual do utilizador continua pendente.** Não apresentar o
protótipo procedural como produto fiel ou CAD oficial.

## Critérios de aceitação

1. D52-2066 e KWS-306 reconstruídos por cotas/fotografias 16–20: corpo, degraus,
   recortes, LCD, teclas, entradas reais e posição dos parafusos. Manter o grupo
   Aparelhos de medir nas bibliotecas e migrações compatíveis.
2. TC com abertura efetiva para o condutor, não um disco opaco; representação
   do núcleo/carcaça/fecho e ligações corretas. Distinguir passagem primária e
   secundário de TC: não unir fase/neutro nem trocar fios antigos silenciosamente.
3. Sinalizadores iIL existentes, mono e trifásico, fiéis a CAD e referência 40;
   manter independência dos LEDs e deteção de ausência de tensão. Não confundir
   sinalização iIL com um relé de proteção com contacto de saída.
4. Logótipos reais locais/vetoriais de Schneider e Hager, sem escrever a marca
   numa fonte aproximada; inventário de todos os aparelhos dessas marcas.
5. iC60H 1P A9F07120 da referência 41: CAD ou reconstrução comprovadamente próxima,
   manípulo/indicadores/bornes e função magnetotérmica preservados.
6. Cada calha DIN com profundidade regulável: calha, suportes/parafusos,
   aparelhos, bornes e pontas dos cabos acompanham-na coerentemente. Batentes
   delimitam os aparelhos; opção para alinhar a frente à janela da sobretampa.
7. Sobretampa alterna sólido/contorno tracejado/oculta sem bloquear o picking
   dos aparelhos; posições e janelas legíveis para montagem. Obturadores nas
   partes livres das janelas, sem cobrir equipamentos instalados.
8. Guardar/reabrir/desfazer, projetos existentes, QGD 47/76, React #310, SVG e
   acesso Admin sem regressões. Não desativar gates globais com falhas de baseline.

## Referências e investigação inicial

- Fotografias locais 16–21, 25, 36–42 e IMG_5810.jpeg.
- [1](https://www.se.com/vn/en/product/A9E18320/acti9-iil-single-indicator-light-red-110230-vac/):
  iIL monofásico A9E18320, CAD MCADFD0000979.
- [2](https://www.se.com/vn/en/product/A9E18327/acti9-iil-threephase-voltage-indicator-light-red-230400-vac/):
  iIL trifásico A9E18327, CAD MCADFD0000980. A referência A9E18324 atualmente
  gravada no tipo trifásico está errada (é sinalizador amarelo simples);
  os dois iIL reais ocupam 18 mm, não 54 mm no trifásico.
- [3](https://www.se.com/sg/en/product/A9F07120/miniature-circuit-breaker-mcb-acti9-ic60h-1p-20a-c-curve-10000a-iec-608981-15ka-iec-609472-double-term-/):
  iC60H unipolar e identificação A9F07120.
- [4](https://www.cncele.com/uploads/YD52-2066-Instructions-23.11.29.pdf):
  D52/YD52, variantes TC interno/externo; externo ligado aos bornes 3/4.
- [5](https://hager.com/es/documentacion-downloads/logotipo):
  pacote oficial Hager RGB/SVG e condições de utilização.

Os medidores podem exigir reconstrução paramétrica calibrada quando não houver
CAD do fabricante: declarar essa origem, sem afirmar certificação ou CAD oficial.
A fotografia de um modelo não substitui volume real nem funcionalidade do LCD.

## Validação e publicação

Implementação e validação focada avançaram. O estado da recuperação e a
separação entre PASS, pendente e publicação estão em
[[Validation-2026-11-17-Recuperacao-Industrial-Editores]]. O contrato atual de
medidores/Schneider tem 53 PASS; a auditoria CAD mede 342 ligações em 48 modelos
(303 cavidades/39 contactos), sem contar os tipos procedurais excluídos como
CAD aprovado. Admin completo passou **110 medidores/Schneider + 78 industriais**;
Panel3D 41 e ciclo de vida ampliado 62 PASS. TypeScript, os 102 comandos de CI
local e build estático do commit 20150c0 passaram. Suites browser executadas em
série por RAM de 2 GB; isso não substitui aceitação visual nem GPU reais.

Commit/push/publicação dos dois repositórios foram autorizados. A aplicação
está committed localmente; push/CI remoto/deploy exigem confirmação separada.
Sem Supabase/RLS/cloud reais aprovados. Preservado integralmente o checkout
pessoal aninhado adf9fbf/122 entradas, os 1039 ficheiros e o gitlink pessoal
preparado. A release BrainNet usa outra worktree e o commit canónico 20150c0.
Não incluir credenciais em notas/logs/ficheiros/comandos/Git config.
Nenhum agente Maestri iniciado.
