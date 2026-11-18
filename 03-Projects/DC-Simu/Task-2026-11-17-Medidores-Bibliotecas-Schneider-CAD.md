---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_TESTED_LOCAL
created: 2026-11-17
updated: 2026-11-17
tags: [dc-simu, biblioteca, medidores, schneider, cad, compatibilidade]
---
# Medidores nas bibliotecas e diferenciais Schneider fiéis

> **Registo histórico da tarefa.** Para a árvore recuperada, contagens atuais,
> commit/build e estado da publicação, usar
> [[Validation-2026-11-17-Recuperacao-Industrial-Editores]]. Os medidores/TC
> procedurais continuam sem aceitação visual e não são CAD oficial.

## Pedido e aceitação

Pedido direto de Deogracia de Castro: os aparelhos de medir dos quadros
monofásico e trifásico não aparecem nas bibliotecas; o diferencial Schneider
não parece o aparelho real; verificar os modelos monofásico e tetrapolar.

1. D52-2066 e KWS-306 pesquisáveis, disponíveis e inseríveis nas bibliotecas
   do simulador e do Admin, no grupo Aparelhos de medir.
2. Corrigir o modelo 3D efetivo dos diferenciais, não só a miniatura.
3. Preservar tipos, IDs, bornes, cabos, estado e função elétrica, incluindo
   importações e rascunhos ajustados manualmente.
4. Não regredir QGD 47/76, hooks/React #310, permissões Admin nem SVG.

## Implementação

- Construtor comum dos medidores DIN: geometria procedural dimensionada,
  LCD, controlos, especificação física, capas e exportação GLB para o Admin.
- Classificação `measurement`; migração idempotente de `power`; pesquisa
  «medidor» com os dois tipos desbloqueados em Free/Admin.
- iID 4P **A9R11440** e iDPN N Vigi 1P+N **A9D32616** derivados dos STEP
  oficiais, com corpo moldado, patins, cavidades, parafusos, manípulos brancos
  curvos, pega preta, T e serigrafia. As oito capas foram recapturadas.
- **O monofásico é RCBO iDPN N Vigi C16/30 mA/tipo A, não RCCB iID 2P.**
  Não foi alterada silenciosamente a identidade da proteção.
- O STEP iID 4P simplificado tem a alavanca fundida ao corpo. A adaptação usa
  a cavidade/atuador iID comum do STEP 2P, sem substituir corpo/bornes 4P.
  Entradas reabertas e patins recolhidos; não se afirma CAD inalterado nem
  certificação do fabricante. Fontes e hashes no manifest da aplicação.
- T com curso de 1,2 mm, letra solidária e disparo retido; release fora,
  cancelamento e blur repõem só a mola. `ControlDef.holdVar` separa a variável
  física das ações persistentes, sem mudar o legado das botoneiras NA/NF.
- Manípulo com ON/TRIP/OFF e indicadores exportáveis nas três poses.
  Suspensão/restauro de OrbitControls durante a manobra, também no Admin.
- Bornes migrados para as cavidades, conservando IDs e posições manuais;
  relatório focado do detector agora faz merge: 26 → 27 tipos, outros 25 intactos.

## Resultado e evidência

Aplicação: **`10e555bf47a68d8ab7cb7a0a5d1966f2fa13e666`**, commit local,
carimbo `r210.mwlyp78v`. Validação em
[[Validation-2026-11-17-Medidores-Schneider-CAD]].

- 192 verificações de contrato medidores/Schneider.
- 78 verificações no browser: biblioteca Free/Admin e manobra dos quatro aparelhos.
- 44 verificações Admin dos dois diferenciais, incluindo gravar/reabrir/exportar.
- 834 verificações de núcleo; QGD 42; geometria focada 2 CAD/12 encaixes.
- Typecheck, hooks e regressões focadas passaram; build estático concluído.
- Sem exceções React #310 nem perdas de contexto WebGL nos percursos ensaiados.

## Limites e próxima ação

**Não publicado nesta nota.** A produção confirmada anterior continua em
`d474ab3/r209.mwlsnh6v`. Publicação dentro do âmbito anteriormente autorizado
pelo utilizador, mas a sessão de credencial anterior foi encerrada. É necessária
nova autenticação temporária e confirmação do remoto/deployment/version.json.

CI global continua não verde: capacitor/`editors-sweep` e DPS WEG na geometria
global; não foram omitidos gates. Os testes Admin usam armazenamento local
isolado; não provam autenticação real, Supabase, RLS nem gravação cloud.

Nenhum agente Maestri foi iniciado. O checkout pessoal aninhado da aplicação
não deve ser atualizado/limpo; preservar HEAD e alterações locais, mesmo ao
atualizar a referência gitlink do cofre.
