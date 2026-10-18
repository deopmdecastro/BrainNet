# Workflows BraiNet OS

Alvo verificado: **n8n 2.43.7**. Apenas nós nativos: Manual Trigger v1, Code v2 e Sticky Note v1. Sem community nodes, credenciais, endpoints externos, IA ou deploy.

| Ficheiro | Resultado |
| --- | --- |
| `workflows/WF-01.json` | Registo IDEA e briefing Markdown para revisão |
| `workflows/WF-03.json` | Contexto de agente, papel sugerido e restrições |
| `workflows/WF-05.json` | BLOCKED ou APPROVAL_PENDING; nunca autorização |

## Abrir na instância local
1. Em `http://localhost:5678`, criar um workflow novo.
2. No menu do editor, importar um dos ficheiros JSON desta pasta. Confirmar que é uma cópia nova, sem substituir DC-SIMU ou outro workflow.
3. Rever `Synthetic Input` e executar manualmente.
4. Inspecionar output de `Validate and Prepare`.

Todos os inputs são exemplos sintéticos. Os exports estão inativos e não têm triggers externos. Não precisam de ativação para executar manualmente. Output não é gravado no cofre e histórico de execução está desativado nos settings exportados; não inclui limpeza do histórico da instância existente.

## Testes isolados reproduzíveis
Se a imagem estiver local:

```powershell
powershell -NoProfile -File scripts/Test-N8nWorkflows.ps1 -Image <imagem-local-n8n-2.43.7>
```

O script verifica a presença da imagem sem pull, copia inputs com IDs de teste e importa/executa num contentor descartável por workflow. Rede desativada, filesystem principal read-only, diretório n8n em tmpfs. Só monta as cópias sintéticas, nunca o volume da instância ativa. Logs ficam em `runtime/n8n-validation/`.

No n8n 2.43.7, `execute --file` é anunciado como deprecated mas não executa sem `--id`; por isso o script importa e depois usa `execute --id`. O script exige `finished=true` no resultado e falha se a confirmação estiver ausente.

## Evolução
Os exports são gerados de `automation/lib/contracts.mjs` com `npm run build:workflows`. Não editar as regras só no editor sem atualizar a fonte e os testes.

Antes de substituir Synthetic Input por entradas reais: implementar adaptador por origem, autenticação, autorização por projeto, limites de corpo/rate limit e registo idempotente durável. Referência de desenho: `05-Workflows/`. Não ligar o output diretamente a comandos, chamadas de IA, mensagens ou produção.
