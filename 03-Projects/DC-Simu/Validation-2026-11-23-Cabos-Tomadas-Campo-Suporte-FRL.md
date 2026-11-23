---
type: validation
status: IMPLEMENTED
created: 2026-11-23
updated: 2026-11-23
tags: [dc-simu, maquete, estampagem, cabos, tomadas, qe1, frl, esteiras]
---
# Cabos 3G2,5 às tomadas, cabos de campo ao QE1, porta do QE1 e suporte do FRL

## Pedido

1. Cabo 3G2,5 do quadro à tomada da maquete; cabo «3G3,5» do quadro à tomada do compressor. Passar pela esteira, filaçar, ponteiras nas ligações, entrar pelo bucim da tomada.
2. QE1 no lado esquerdo, com a porta a abrir para fora.
3. Sistema de ar suspenso: criar um suporte realista de fixação à maquete e acrescentá-lo à biblioteca.
4. Passar os cabos dos botões, sensores e eletroválvulas para os bornes do quadro.

## Solução (dc-simu `f945e24`)

### Alimentação das tomadas (`stampingBenchWiring.ts`, `wallPanelRouting.ts`)
- 3G2,5 H07RN-F em 3 condutores (L castanho, N azul, PE verde/amarelo), ponteiras nas duas pontas, filaçados (`bundleId`).
- Maquete: QGD X1.3 (L), X1.5 (N), PE_BAR PE6 → XS-MAQ. Compressor: X1.6 (L), X1.7 (N), PE_BAR PE7 → XS-COMP.
- Percurso: borne → CT5 → calha vertical CT6 → CT1 → bucim superior do QGD (M25, ±60 mm, sobre a subida) → subida → pescoço → esteira aérea → ramal da bancada / pescoço do compressor → descida → bucim superior da tomada → bornes L/N/PE.
- A secção «3G3,5» não é normalizada; foi usado **3G2,5** também no compressor (circuito Q4 C20). Confirmar se a intenção era 3G4.
- As esteiras deixam de desenhar os cabos decorativos (só o tubo de ar continua desenhado).

### Cabos de campo → QE1
- 26 sinais, 0,75 mm², ponteiras, ponta de campo no borne `2`:
  - X21: B1/B2 (cilindro 3), B3/B4 (prensa), B6 (braço), B8/B9 (cilindro 1), B11 (ótico), FC1, FC2, S.IND.
  - X22: Y1–Y4 (ilhas C1A/C2A) e 0 V.
  - X23: motor (CW, CCW, A, B).
  - X24: EMERG, AUTO, REARME, CICLO, STOP, START.
- Percurso: aparelho → calha perimetral da base (botões pela frontal; sensores e válvulas pela traseira/laterais) → calha vertical da perna (CAMPO) → calha inferior → bucim lateral do QE1 → calha inferior do quadro → borne.
- +24 V de X20 ao comum dos botões, pontes entre operadores e ponte de 0 V entre as duas ilhas.
- Bornes dos operadores passam para o bloco de contactos, atrás e dentro da caixa (antes ficavam na face do botão).

### QE1
- Dobradiça à **esquerda**: a porta abre para fora da mesa (antes abria para o lado das pernas).

### Suporte do FRL
- Novo tipo `pneumaticFrlBracket` · «Suporte em esquadro para FRL · aço galvanizado 3 mm» na Biblioteca → **Pneumática → Tratamento & Distribuição de Ar**.
- Aba superior aparafusada por baixo do tampo (2× M6 em rasgos), chapa traseira atrás do cabeçote com 2× M5 e espaçadores, dobra a 90° e reforço triangular. Dimensões paramétricas.
- Na maquete fixa o FRL junto à perna traseira esquerda.

### Encaminhamento 3D
- Esteiras, calhas da bancada e tomadas deixam de contar como sólidos para os cabos (são canais e caixas ocas). Antes, o passo de afastamento refazia o percurso de cabos que passavam por dentro delas.
- Pontes curtas com percurso explícito: o traçado automático entre botões vizinhos bloqueava o cálculo.

## Verificação

- `npm run test:maquetes`: 9 verificações OK. Novas: 6 condutores 3G2,5 com ponteiras e filaçados, ligações X1/PE certas, 26 sinais de campo no borne 2, dobradiça à esquerda, FRL no suporte. Maquete: 97 peças, 148 componentes, 55 tipos.
- `npm test`, `npm run build`, `wire-lacing`, `wire-isolation`, `solid-cables-meter`, `wire-curves-refresh`, `panel-accessories`, `enclosure-move`, `duct-resize`, `panel-groups`: OK.
- Falham também sem estas alterações (pendências anteriores): `test:wire-locks` (STEP/PAUSA) e `structures-pneumatics-smoke` (verificação 2).
- Cálculo dos 105 cabos em Node: ~26 s, contra ~24 s sem os novos.
- Capturas locais (Playwright, ambiente fabril): cabos a sair dos bucins do QGD pela subida; entrada pelo bucim superior das duas tomadas sem fios por fora; cabos de campo dentro das calhas da bancada, da calha CAMPO e a subir aos bornes do QE1; botões ligados por trás e a sair pelo fundo da caixa; porta do QE1 a abrir para a esquerda; FRL com a chapa do suporte por trás.

## Pendências

- B7 e Y5 sem aparelho elétrico na maquete (ficam livres nas réguas).
- Alimentação +24 V / 0 V dos sensores não foi cablada (precisa de réguas de distribuição).
- Revisão visual do utilizador.

Estado: **implementado, testado e publicado em `origin/main`**; aprovação visual pendente.
