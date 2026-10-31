---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-10-31
tags: [dc-simu, esquema, canvas, maestri, interface]
---
# Esquema — layout e canvas comuns

## Pedido e contexto
Unificar o esquema elétrico com as laterais e ferramentas do esquema 3D: Biblioteca/Inspetor à esquerda; GRAFCET, Entradas/Saídas e Objetos à direita; linguagem visual de canvas igual ao GRAFCET. Referência: [[Design-Principles]]. Autorização direta do proprietário na conversa para commit e push em ambos os repositórios.

## Diagnóstico e implementação
O App já partilha Sidebar, Toolbar e painel direito entre Esquema 2D frontal e Visualização 3D. Não se criou um segundo editor nem se duplicou estado elétrico.
- Reabrir Biblioteca ou painel direito mantém agora o painel oposto aberto no desktop/tablet. No modo compacto conserva exclusividade das gavetas.
- `editorGridBackground` em `src/ui/editorTheme.ts` é a fonte comum do fundo do GRAFCET e do canvas físico do Esquema/3D: cores, pontos/linhas, passo, ocultação e tema escuro.
- O fundo do canvas 3D deixa de impor pontos de 20 px quando a barra pede outro estilo/passo ou desliga a malha.
- GRAFCET conserva transformação visual por pan/zoom e encaixe existente. Não se tentou substituir o renderer WebGL pelo editor GRAFCET.
- As ferramentas existentes continuam partilhadas; não foi realizada uma reformulação integral das barras nem do editor SVG legado.

## Evidências
Commit DC-Simu: `b5bf44d` (main); push confirmado para origin/main.
- `npm run typecheck`: passou.
- `npm test`: passou.
- `npm run test:style`: passou.
- `npm run test:editor3d-functional`: 43 verificações passaram; avisos de texturas blob no ambiente Node.
- `tsx scripts/editor-grid-background-smoke.ts`: passou; disponível como `npm run test:editor-grid-background`.
- `git diff --check`: passou.
- Build de produção: primeira tentativa esgotou heap; segunda com heap aumentado não terminou no tempo disponível e foi interrompida na transformação Vite. Não validado.
- Ambiente tem Node 20, inferior à versão requerida pelo projeto. Dependências instaladas com scripts de instalação desativados. Testes visuais em navegador e deploy não confirmados.

## Handoff Obsidian / Maestri
Código em `03-Projects/DC-Simu/dc-simu` (submódulo); este cofre fixa o commit acima. Incluir esta nota e [[Design-Principles]] no próximo pacote de contexto. Nenhum agente Maestri nem workflow n8n foi iniciado nesta sessão.

Próxima ação QA: com Node 22.22.2+ compatível, executar build e testes UI; conferir abertura/recolha simultânea em desktop, gavetas em telemóvel e estilos/passo/malha desligada nos canvases. Verificar deploy automático e o carimbo de release no destino; push por si só não comprova publicação em produção.

## Segurança
A credencial recebida não foi guardada no cofre nem na configuração Git. Recomendada revogação por ter sido exposta na conversa.
