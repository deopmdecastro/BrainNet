---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-04
updated: 2026-11-08
tags: [dc-simu, 3d, quadro, calha-tecnica, din, componentes]
---
# Quadro com porta, calha técnica e perfis DIN

## Pedido
Criar nos componentes, em 3D realista: quadro com tampa e porta com dobradiças, efeito real de abrir e fechar, textura real, calha técnica com tampa, medidas ajustáveis (quadros, calhas e tampas) e perfis para encaixar os aparelhos, personalizados e com textura real.

## Resultado (dc-simu `b98be03`)
- **Quadro metálico** (`panelEnclosure`, grupo «Quadros e calhas»):
  - armário paramétrico com chapa de montagem sobre espaçadores, moldura frontal, fundo de bucins e porta com junta PU;
  - 2 ou 3 dobradiças, conforme a altura, e fechos de ¼ de volta;
  - a porta abre e fecha com animação ao clicar nela no 3D, ou pelo botão do inspetor;
  - inspetor: largura, altura e profundidade, presets comerciais, lado das dobradiças, acabamento da chapa (galvanizado, laranja RAL 2000, branco RAL 9010) e cores RAL.
- **Calha técnica** (`cableDuct`): ranhurada, com dedos e patilhas, e tampa amovível. Comprimento ajustável, larguras e alturas comerciais, orientação horizontal ou vertical, cores.
- **Perfis DIN**: a calha existente passa a ter os perfis 15×5,5, 35×7,5 e 35×15, acabamento galvanizado, bicromatado ou alumínio, e furação opcional. Os aparelhos assentam na face do perfil escolhido.
- **Texturas**: geradas em canvas (epóxi texturado, zinco e PVC), com UV à escala real, por isso não esticam quando se muda o tamanho.
- **Integração**:
  - desenho 2D vetorial; miniaturas GLB e capas/vistas frontais WebP;
  - o quadro fica fora da colisão, do aviso de sobreposição e do encaminhamento dos cabos;
  - a câmara de sombras ajusta-se ao tamanho da cena.

## Verificação
- Testado no browser em modo offline (servidor de desenvolvimento sem Supabase):
  - quadro 600×800 com 3 perfis TS35 e 4 calhas técnicas, vistas de frente e ISO;
  - o clique na porta abre-a e fecha-a;
  - projeto nativo envolvido num quadro: «Tudo OK», sem avisos.
- `tsc`, `test:ci` (verde, com o novo `test:panel-accessories`, 34 verificações), `test:pdf-export`, `build-component-covers --check` (48/48) e `vite build`.

## Iteração 2026-11-08 (dc-simu `4352278`)
- Mover o quadro (rato, 3D ou setas) leva tudo o que está dentro do contorno: calhas DIN, aparelhos, calhas técnicas e aparelhos marcados ou montados na porta.
- O conteúdo é fixado no início do arrasto, por isso o quadro não apanha aparelhos por onde passa. Motores e aparelhos de máquina ficam de fora.
- Os pontos de passagem 2D e 3D dos cabos entre aparelhos do grupo acompanham o quadro.
- Teste novo `test:enclosure-move` no `test:ci` (verde).

## Pendências
- Ainda não há aparelhos montados na porta (botões, HMI); os de frente de painel continuam no plano dos aparelhos.
- Validar em produção e com projetos reais. Os GLB de miniatura geram-se com `npm run build:enclosure-glb`.
