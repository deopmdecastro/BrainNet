---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED_TESTED
created: 2026-11-17
updated: 2026-11-17
tags: [dc-simu, qgd, react310, hooks, svg, permissions, qa, publication]
---
# QGD nativo, React #310, SVG e administração

## Âmbito autorizado

O utilizador pediu a disponibilização do QGD como projeto nativo, a correção do
React #310 ao adicionar elementos e autorizou commits, pushes e publicação de
`deopmdecastro/dc-simu` e `deopmdecastro/BrainNet`. Preservar as alterações
anteriores de ícones SVG e acesso exclusivo do Admin às integrações. Nenhuma
credencial é incluída nesta documentação ou nos repositórios.

## Implementado e reproduzido

- `Sidebar.tsx`: a subscrição Zustand de `detachWiresOnDrag` estava num ramo
  condicional do JSX. A inserção reproduziu «Rendered more hooks than during
  the previous render». Subscrição movida para o topo incondicional.
- `BusbarControls.tsx`: retornos de pente/conector anteriores a
  `useState`/`useEffect`. Todos os hooks executam agora antes dos retornos.
- Auditoria ESLint de todo `src`, apenas com `react-hooks/rules-of-hooks`,
  bloqueante em `test:ci`. O auxiliar de eventos GRAFCET `usePalette`, que não
  era um hook, passa a chamar-se `insertPaletteItem`.
- `Panel3D.tsx`: a montagem DIN de uma peça procedural não prova que existe
  GLB. O despacho CAD exige uma especificação antes de ler `spec.path`;
  as peças Acti9 seguem para o renderizador procedural próprio.
- QGD nativo em Admin e Free, **47 componentes/76 condutores**, diagnóstico
  limpo, proteções e rascunhos isolados. Ver
  [[Task-2026-11-18-Quadro-Geral-Distribuicao-Completo-Multi-Circuitos]].
- Menus/modais de Supabase/n8n reservados a Admin; pictogramas SVG na interface
  e cartão do plano, mantendo notação elétrica e símbolos técnicos legítimos.
- Proteção interior do armário com face de visibilidade independente
  (`innerCover`); ocultar/restaurar todas as chapas e o respetivo raycast passam
  no teste existente, sem alterar os obstáculos físicos dos cabos.

A mensagem de contexto WebGL perdido apareceu depois do erro React no relato.
Não foi assumido que era, por si só, prova de uma falha independente da GPU.

## Evidência local

| Verificação | Resultado observado |
| --- | --- |
| Reprodução anterior da inserção | Falha de ordem de hooks no Sidebar confirmada no navegador |
| `test:hooks` | Sem violações em `src` |
| `typecheck` | Passou com Node 22.23.5 compatível |
| `npm test` | Passou, incluindo as verificações do QGD e peças Acti9 |
| `test:qgd` | 42 verificações passaram |
| `test:inspector-hooks-ui` | 39 verificações passaram com o mesmo root React |
| `test:qgd-ui` | 19 verificações passaram em User e Admin, sem exceções |
| `test:account-icons-ui` | Nova execução final: 67 verificações passaram a 1440/390 px |
| `test:qgd-build-ui` | 20 verificações passaram no build minificado, sem importar `/src` nem alterar a store; inclui inserção real da biblioteca e persistência |
| Build de produção | `npm run build` passou; `VERCEL=1 npm run build` também compilou |
| `test:ci` completo | Não verde: sete suites com falhas também reproduzidas na base pública `a9356e9`; detalhes abaixo |

Para viabilizar o build no ambiente de 2 GB, parou-se o Vite de desenvolvimento
e ativou-se swap temporária de 2 GB apenas no sandbox. Não se alteraram as
opções de build, os limites do projeto nem o ambiente Vercel versionado.

Os testes de navegador usam perfis descartáveis, service workers e pedidos
API/integrações externas bloqueados. O teste minificado usa o build local
normal; o build estático `VERCEL=1` recusa corretamente as sessões locais sem
Supabase configurado. Não se contornou essa proteção. Login com Supabase real,
RLS e gravação numa base de dados de produção não foram exercitados nesta sessão.

Os testes de backend usam identidades locais sintéticas e armazenamento
temporário; não alteram uma base de dados real.

BrainNet: `npm test` terminou sem falhas (**18 aprovados / 27 ignorados** entre
45 entradas; os ignorados dependem dos testes n8n específicos). `npm run check`
na cópia de trabalho preservada aponta dois links para configurações apagadas
localmente no submódulo antigo. A validação de uma extração exata da árvore
preparada, com o commit da aplicação referenciado pelo gitlink, passou:
**380 ficheiros Markdown, 923 ligações, zero erros**. Nessa extração os testes
BrainNet repetiram o resultado de 18 aprovados/27 ignorados. Não se restauraram
as configurações pessoais locais só para disfarçar o estado da cópia antiga.

### Pendências da suite global

Foram executados separadamente todos os comandos restantes de `test:ci`, depois
de corrigir a visibilidade da proteção interior. As seguintes sete suites
falham tanto nesta entrega como numa extração isolada de `origin/main` em
`a9356e9`, com as mesmas dependências/GLBs:

1. `test:editors-sweep`: sobreposição de bornes do condensador `capacitorRun60uF`.
2. `test:terminal-geometry`: encaixe do borne L do DPS WEG SPW02.
3. `test:terminal-seat`: borne L do mesmo DPS classificado como enterrado.
4. `test:builtin-sync`: peças integradas sem GLB marcadas como bloqueadas.
5. `test:native-wires-3d`: expectativas de passagem das sondas no bucim/rotas do motor.
6. `test:grafcet-live-dock`: conjunto de etapas ativas difere da expectativa.
7. `test:native-iec`: migração do GRAFCET/programa/tags do F1/H3.

Não se omitiram testes, não se desligaram regras de diagnóstico e não se
converteu o CI existente em opcional. Estas pendências impedem afirmar que a
suite global está inteiramente verde; não são ocultadas pelo resultado dos
testes específicos desta entrega.

## Repositórios e publicação

Commits locais da aplicação:

- `6fca051c8e5334178d0727e122f718329d27f35b` — QGD, hooks, despacho 3D,
  SVG/admin e regressões.
- `d474ab3e99383e1e8ede6cc75a2b8ae1277b3323` — teste do build minificado.

O gitlink do BrainNet aponta para `d474ab3e99383e1e8ede6cc75a2b8ae1277b3323`.
A cópia de trabalho antiga do submódulo, com alterações locais, foi preservada
integralmente: apenas se atualizou a referência preparada no índice, sem
restaurar/apagar os seus ficheiros. Não deve ser usada como cópia da release
sem primeiro tratar essas alterações locais. O código publicado vem do
repositório principal da aplicação.

**Estado desta nota: commits locais preparados; publicação pendente de
autenticação GitHub, pushes e verificação do deployment.** A versão pública
observada antes desta entrega continuava a corresponder a
`a9356e9b8b004852193c666adcc4f64457dbfb4d.r206.mwlbltqu`.

Depois de autenticar, enviar primeiro a aplicação, depois o BrainNet. Confirmar
o commit remoto, o estado do deployment Vercel e o `buildId` em
`https://dc-simu.vercel.app/version.json`; push não é prova de deploy.
