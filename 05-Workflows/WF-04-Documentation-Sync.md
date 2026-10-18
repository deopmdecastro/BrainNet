---
workflow_id: WF-04
type: workflow-spec
status: PLANNED
owner:
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, workflows]
---
# WF-04 — Documentation Sync

**Objetivo/responsável:** preparar alterações documentais sem perder edições humanas; Documentation Manager.

**Trigger/pré-condições:** resultado revisto de tarefa, caminho permitido e checksum da versão base. Não há watcher implementado.

**Entrada/saída:** project_id, event_id, caminho relativo, base_sha256, conteúdo proposto e origem → proposta/diff para revisão; conflito se o ficheiro atual divergir da base.

**Nós/integrações propostos:** validação → fila de propostas → consumidor local com acesso apenas ao diretório permitido → diff → revisão → escrita atómica. Validar realpath e symlinks além do caminho textual. Não montar o cofre inteiro no n8n.

**Credenciais/permissões:** acesso local ao diretório de propostas; Git/API apenas se escolhidos e autorizados. Sem credenciais configuradas.

**Idempotência:** chave event_id + caminho + checksum do conteúdo; comparar base antes de aplicar. Um evento repetido não repõe uma nota já editada por humano.

**Falhas/recuperação:** divergência gera conflito; manter proposta e ficheiro humano intactos. Backup/versão anterior antes de aplicar e registo do diff.

**Testes futuros:** mudança humana concorrente, symlink para fora da raiz, path traversal, repetição e falha de escrita. Aceitação: nenhum conflito é resolvido por overwrite silencioso. Estado: especificação; sync automática não implementada.
