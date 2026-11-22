---
project_id: BN-DCSIMU-001
type: delivery
status: INTEGRATED_AUTO_VERIFIED
created: 2026-11-22
updated: 2026-11-22
tags: [brainnet, dc-simu, entrega, git, maquetes, tomadas]
---
# Entrega: correções de maquetes e tomadas

## Âmbito e autorização

O utilizador pediu expressamente «commit e push» nesta conversa, em 22 de novembro de 2026. Foram incluídas as correções produzidas nas tarefas de pull/revisão, fidelidade das tomadas e erro TDZ. As configurações pessoais, ficheiros temporários e diagnósticos que já existiam no checkout foram preservados fora dos commits.

## Aplicação

- Repositório: `deopmdecastro/dc-simu`, branch `main`.
- Commit: [`d8fa230201be8aedbe654df284a2e5848a3a9f14`](https://github.com/deopmdecastro/dc-simu/commit/d8fa230201be8aedbe654df284a2e5848a3a9f14).
- Título: `fix: corrigir maquetes e reconstruir tomadas estanques`.
- Push concluído: `fd5071a..d8fa230`, para `origin/main`.
- Hook pre-commit: carimbo de release `#304`, época `mws6vzth`.
- Conteúdo: correção de inicialização `wire`/`term`, regressão minificada no build, proteção dos sinalizadores, perfil IPE100, comprimento das paredes das esteiras, ocultação/undo de objetos e reconstrução das três tomadas, contactos, migração, controlos e capas.

## BrainNet

A referência do submódulo é atualizada para `d8fa230`, acompanhada pelos relatórios e capturas desta entrega. A nota anterior `Validation-2026-11-21-Inspetores-Furos-UX.md`, `eval_main_1.md`, `.obsidian/graph.json` e o cache Python da skill não fazem parte desta entrega.

## Verificações e limitações

- Build TypeScript/Vite/PWA passou, incluindo o novo teste do getter em código minificado.
- `npm test` da aplicação e 8 verificações das maquetes passaram.
- 15 verificações das tomadas e 11 verificações de interação 3D passaram na tarefa de fidelidade.
- O teste minificado reproduz a falha ao usar o fonte antigo e passa com a correção.
- `git diff --cached --check` sem erros de whitespace.
- O `check` do BrainNet mantém 53 falhas documentais anteriores. O teste de geometria MICO e as limitações de junções das esteiras 3D continuam pendentes, conforme os relatórios.

## Integração automática

O push foi concluído sem executar qualquer comando de deploy manual. A verificação GitHub/Vercel de `d8fa230` passou de `pending` para **`success`**: [execução Vercel](https://vercel.com/deopmdecastros-projects/dc-simu/J2RCbwenW5dAFQ6iC9byDzZgU22C).

Às `18:51:07 UTC` de 22 de novembro de 2026 foi confirmada a integração automática:

- As duas branches `origin/main` foram conferidas com `git ls-remote`: DC-Simu em `d8fa230201be8aedbe654df284a2e5848a3a9f14`; BrainNet em `f5b0819a9eefd370de3eec529d4f90574276ed97` antes deste registo final.
- O [version.json público](https://dc-simu.vercel.app/version.json) anuncia `buildId: d8fa230201be8aedbe654df284a2e5848a3a9f14.r304.mws6vzth` e `builtAt: 2026-11-22T18:49:28.435Z`.
- Esta confirmação verifica o commit servido e a conclusão do build automático; não substitui os limites de aceitação visual, os testes de autenticação cloud ou as pendências já documentadas.

## Evidências

- [Diagnóstico TDZ e regressão](./Validation-2026-11-22-Erro-TDZ-Maquetes.md).
- [Fidelidade das tomadas](./Validation-2026-11-22-Tomadas-Fidelidade.md).
- [Capturas dos três modelos](./Evidence-2026-11-22-Tomadas-Fidelidade/README.md).
- [Revisão inicial do pull](./Validation-2026-11-22-Pull-Build-Objetos-Estampagem.md).
