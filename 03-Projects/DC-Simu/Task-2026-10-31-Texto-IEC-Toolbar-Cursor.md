---
project_id: BN-DCSIMU-001
type: task
status: IN_PROGRESS
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, esquema-iec, texto, comentarios, acessibilidade, ui]
---

# Esquema IEC — edição de texto e cursores

## Pedido
Melhorar a edição de textos livres no Esquema IEC, incluindo conteúdo, cor, tamanho, alinhamento e transformação; mostrar cursores coerentes ao abrir comentários e ao interagir com elementos.

## Diagnóstico
- O cartão já expunha tipo de letra, tamanho, estilo, alinhamento e cores, mas «Editar texto» não acionava o editor no Esquema IEC.
- O cursor de arrasto do objeto (`grab`) era herdado pela caixa de edição; os campos do comentário não forçavam o cursor de texto.
- Sem largura configurável, o alinhamento tinha pouco efeito em textos com várias linhas.
- O cofre apontava para um commit de `dc-simu` que o GitHub já não disponibilizava; a inicialização do submódulo falhava.

## Implementação
- [x] Ligar «Editar texto» à edição focada no canvas IEC.
- [x] Acrescentar rotação e largura do bloco ao painel «Layout»; permitir repor ambos.
- [x] Aplicar largura e rotação ao texto renderizado e preservar texto multilinha/alinhamento.
- [x] Mostrar cursor de mão nos comentários/textos selecionáveis e caret de texto nos campos editáveis.
- [x] Criar smoke test de browser para comentário, caret, edição direta, rotação, largura e alinhamento.
- [x] Fazer commit e push do código do DC-Simu para `main` (`92a6d299c57d7496a778f3f054ceb644926c79a2`).
- [ ] Atualizar e publicar no BrainNet a referência ao submódulo e esta nota.
- [ ] Confirmar a deployment de produção no Vercel.

## Ficheiros
Código em `dc-simu/`: `src/commands/CommandsAnnotations.tsx`, `src/commands/CommandsEditor.tsx`, `src/ui/TextStyleBar.tsx`, `src/ui/textStyle.ts`, `src/types/index.ts`, `src/styles/commands.css`, `src/styles/canvas-annotations.css` e `scripts/annotation-toolbar-ui-smoke.mjs`.

## Validação
- Passou o typecheck isolado de `src/ui/TextStyleBar.tsx` com TypeScript 5.9.3 e os tipos React.
- Passou a verificação de sintaxe TypeScript/TSX dos cinco ficheiros alterados e `node --check` do smoke test.
- Passou `git diff --check`.
- O build completo e o smoke test de browser não foram executados: as instalações de dependências foram terminadas pelo limite de memória do ambiente (código 137).

## Publicação
- Código do DC-Simu: commit `92a6d299c57d7496a778f3f054ceb644926c79a2`, enviado para `main`.
- O checkout do BrainNet apontava para um commit que o GitHub já não disponibilizava; o novo ponteiro será guardado neste commit do cofre.
- A ligação Vercel não devolveu um projeto ou deployment acessível para `dc-simu.vercel.app`; a publicação live fica por confirmar até haver acesso ao projeto certo.
