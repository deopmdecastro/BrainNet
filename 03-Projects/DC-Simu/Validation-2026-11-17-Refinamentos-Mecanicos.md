---
project_id: BN-DCSIMU-001
type: validation
status: PUBLISHED_CORE_CI_VERIFIED
created: 2026-11-17
updated: 2026-11-17
tags: [dc-simu, mecanica, lcd, admin, catalogo, preservacao, release]
---
# Seis refinamentos mecânicos — release r214

## Autorização e artefacto

O utilizador `deopmdecastro` autorizou expressamente, nesta conversa, o commit, push e publicação nos repositórios `deopmdecastro/dc-simu` e `deopmdecastro/BrainNet`, incluindo a publicação da aplicação no ambiente Vercel existente. A credencial não integra documentação, configurações Git ou commits.

- Aplicação canónica: **`9b8b24e1c89def46b6e3d3298574b8cc30e93d43`**.
- Build final: **`9b8b24e1c89def46b6e3d3298574b8cc30e93d43.r214.mwmqsiqd`**.
- Base LCD preservada e incluída na ancestralidade: `7990560a8873e58561042a7025888a09286bc8a9`.
- **Estado confirmado:** commit e push nos dois repositórios, produção Vercel com o `buildId` exato acima e CI remoto obrigatório aprovado. Não se confunde publicação com certificação de hardware ou ensaio autenticado da cloud.

## Confirmação remota

- Aplicação em `main`: [9b8b24e](https://github.com/deopmdecastro/dc-simu/commit/9b8b24e1c89def46b6e3d3298574b8cc30e93d43).
- BrainNet: release [c31c5ee](https://github.com/deopmdecastro/BrainNet/commit/c31c5ee29446efc7adb6d8fd3198540b4bed7846) enviada para `main`; este registo de confirmação é um commit documental subsequente, com o mesmo gitlink canónico.
- Produção: [DC-SIMU](https://dc-simu.vercel.app) e [version.json](https://dc-simu.vercel.app/version.json), build r214 exato confirmado.
- [CI obrigatório remoto](https://github.com/deopmdecastro/dc-simu/actions/runs/44420402000/job/135211527449): **success** em tipos, 104 comandos CI, servidor, build e auditoria de dependências.
- [Job UI informativo](https://github.com/deopmdecastro/dc-simu/actions/runs/44420402000/job/135211527203): **failure** na etapa `test:grafcet-ui`; cinco suites seguintes ficaram skipped. Não se apresenta o conjunto UI remoto como aprovado, nem se remove o cenário para obter verde.
- Browser na produção real: 10 verificações do guard estático; 6 assets públicos com SHA-256 idêntico aos ficheiros revistos. Não é aceitação de login/projetos Supabase/RLS.
- As duas referências `main` foram verificadas depois do push, sem force push. Autenticação temporária encerrada; nenhuma credencial guardada nos repositórios.

[Comprovativo de push](./Evidence-2026-11-17-Refinamentos-Mecanicos/push-initial-confirmed.json) · [deploy e CI](./Evidence-2026-11-17-Refinamentos-Mecanicos/production-deployment-r214.json) · [recursos em produção](./Evidence-2026-11-17-Refinamentos-Mecanicos/production-asset-parity-r214.json).

## Âmbito entregue

1. CWBC65: frente física corrigida, carcaça e resistências preservadas; apenas a carruagem percorre 2,8 mm para dentro. Alimentação por fios e retorno em STOP confirmados.
2. GEYA GRT8-M1/B1: seis parafusos metálicos por aparelho, cruz rebaixada geométrica de 0,52 mm.
3. D52: ferragem dos bornes melhorada, sem alterar interfaces do LCD e CT interno; passagem de corrente de 15 mm aberta.
4. Seis conjuntos de fontes/bornes: proteção acrílica opcional, editável no Admin, persistida no guardar/reabrir/publicar; exclusões e valores iniciais do autor respeitados.
5. AVEL 411: frente de 1408 × 3200 píxeis, legível e com paridade dos píxeis visíveis entre Admin e publicação local.
6. Pente/conector: entrada vertical na zona frontal da boca de cabo escolhida pelo utilizador, não no acesso da chave; lanes ajustadas aos seis CADs, fases e continuidade verificadas.

[Descrição técnica da aplicação](./dc-simu/REFINAMENTOS-MECANICOS.md).

## Verificação concluída antes do push

| Verificação | Resultado |
| --- | --- |
| CI local | 104 comandos, exit 0 |
| Geometria e montagem | 169 asserções |
| Navegador nativo | 43 verificações, sem exceções React/WebGL |
| Admin/catálogo | 68 verificações; 11 publicações reais em IndexedDB descartável |
| LCD preservado | 76 contratos e 86 verificações no navegador |
| Build canónico r214 | TypeScript/build exit 0; commit e carimbo exatos |
| Guard minificado r214 | 10 verificações; sessões locais fabricadas recusadas |
| Recursos do build | 6 comparações SHA-256 iguais aos assets revistos |
| Servidor | 188 verificações aprovadas |
| Dependências de produção | 0 vulnerabilidades na auditoria |
| Exportação CWBC sem perda | 19 562 544 → 4 484 520 bytes; base64 5 979 360 abaixo do limite de 6 000 000; 447 bufferViews e 95 PNGs idênticos |
| Snapshot de release | 1292 blobs do commit canónico idênticos; sem `.git` interior |
| Checkout pessoal protegido | 1039 ficheiros, 0 diferenças; HEAD, índice e gitlink pessoais preservados |

A heurística global legada de proximidade de bornes conserva exit 1 e os mesmos 15 avisos da base LCD aceite: zero avisos novos ou alterados. Não se alteraram regras nem se ocultou esse resultado. As cavidades e lanes deste incremento têm verificações separadas aprovadas.

[Resultados e capturas](./Evidence-2026-11-17-Refinamentos-Mecanicos/) · [build final](./Evidence-2026-11-17-Refinamentos-Mecanicos/build-version-r214.json) · [manifesto da evidência](./Evidence-2026-11-17-Refinamentos-Mecanicos/sha256.json).

## Limites e preservação

- Os JSON `validation-outcomes.json` e afins preservam o checkpoint anterior à autorização; `PAUSED` e `false` nesses ficheiros são estados históricos, não uma ordem para bloquear a publicação agora autorizada.
- Publicação de componentes foi ensaiada no Admin local, com IndexedDB descartável e rede externa bloqueada. Não se reivindica aceitação autenticada Supabase/RLS nem se alteram contas ou projetos cloud.
- O `breaker4p` genérico não tem CAD: continua bloqueada a inserção normal. Os testes legados não certificam cavidades inexistentes.
- IDs, fios, rotas, cores, bitolas e edições de autor continuam preservados; migrações só reconhecem geometria de fábrica.
- O checkout pessoal `BrainNet`, incluindo o submódulo sujo e o gitlink previamente staged, não é usado para construir a release. Documentação e gitlink são preparados apenas na worktree isolada.
- O job UI remoto falhou em `test:grafcet-ui` e as cinco suites seguintes não foram executadas. O teste GRAFCET legado continua identificado no backlog; não é reparado nem enfraquecido neste âmbito. Os ensaios mecânicos/LCD específicos e o CI obrigatório têm resultados próprios aprovados.
