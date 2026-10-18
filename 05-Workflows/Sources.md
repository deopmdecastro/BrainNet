---
type: sources
status: VERIFIED
created: 2026-10-18
updated: 2026-10-18
tags: [brainet, sources]
---
# Fontes e compatibilidade

Verificadas em 2026-10-18:
- [Instalação Docker](https://docs.n8n.io/hosting/installation/docker/) e [Compose](https://docs.n8n.io/deploy/host-n8n/install-options/install-using-docker-compose.md): isolamento, persistência e recomendação de consultar a instalação adequada à versão. Não foi necessário instalar outro n8n.
- [Exportar/importar workflows](https://docs.n8n.io/workflows/export-import/): formato JSON e cuidado com referências de credenciais em exports.
- [Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/): autenticação e resposta devem ser configuradas no adaptador, não presumidas a partir do payload.
- [Workflow static data](https://docs.n8n.io/code/cookbook/builtin/get-workflow-static-data/): limitações para testes e execução frequente; não usado como ledger persistente nesta fundação.

Evidência local prevalece para compatibilidade deste entregável: `docker exec n8n n8n --version` devolveu 2.43.7. Importação e execução dos três fluxos usam a mesma imagem, com volume temporário, sem rede e sem credenciais do utilizador.

As instruções locais do skill maestri-manager serviram para preparar o procedimento de reutilização de papéis e inspeção antes de recrutar. O CLI não estava disponível; não se afirma integração executada.
