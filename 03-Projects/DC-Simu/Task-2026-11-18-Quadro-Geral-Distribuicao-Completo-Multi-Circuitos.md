---
project_id: BN-DCSIMU-001
type: task
status: PUBLISHED_VERIFIED
created: 2026-11-18
updated: 2026-11-18
repo: https://github.com/deopmdecastro/dc-simu
tags: [dc-simu, quadro-distribuicao, qgd, native, react, qa]
---
# Quadro Geral de Distribuição Completo Multi-Circuitos (QGD)

## Resultado local

Projeto registado em `nativeProjectSeeds()` com o ID estável
`native-quadro-distribuicao-v1` e o nome
**Quadro Geral de Distribuição Completo Multi-Circuitos (QGD)**.

Disponível no dashboard para Admin e restantes contas, incluindo Free. O Admin
é proprietário da semente; os restantes utilizadores editam rascunhos isolados,
sem consumir a quota de projetos próprios. Guardar, recarregar e repor são
cobertos por testes. Publicação confirmada na Vercel e no `version.json`
público: commit `d474ab3e99383e1e8ede6cc75a2b8ae1277b3323`, release
`r209.mwlsnh6v`. Ver evidência e limitações na nota de validação.

## Conteúdo revisto

**47 componentes e 76 condutores**. A contagem anterior de 45/64 corresponde à
primeira versão local, substituída após a validação elétrica adicional.

| Área | Equipamentos / comportamento |
| --- | --- |
| Entrada | Rede 400 V 3F+N+PE; corte geral 4P `QG1`; DPS 3P+N em derivação, sem pontes permanentes L–N–PE |
| Medida | KWS-306 `PM1` e sinalizador Acti9 trifásico `HL1` |
| Distribuição | Repartidor em escada 4P; pente Acti9 A9XPC712 e pente 3P, com entrada e saída cabladas |
| Diferenciais | Schneider iID 4P `ID_TRIF`, Hager CFC225P 2P `ID_GERAL` e RCBO iDPN Vigi `RCBO_ESP` |
| Iluminação | iC60H C10 `Q_ILUM` e sinalizador/carga `LUM1` |
| Tomadas gerais | Dois circuitos independentes `Q_TOM1` / `Q_TOM2`, com `TOM_GERAL` / `TOM_GERAL2` |
| Tomada especial | RCBO e `Q_ESP`, com carga dedicada `TOM_ESP` |
| Trifásico e motor | `Q_TRIF`, tomada CEE `TOM_TRIF`, disjuntor-motor `QM1` e motor `M1` |
| Armário | 800 × 1000 × 250 mm; quatro calhas DIN; calhas técnicas; dez PTI 6; barras N/PE; cinco furos inferiores |

Os neutros a jusante de diferenciais distintos não se unem. Neste setor
monofásico o A9XPC712 utiliza L1/N; L2/L3 ficam isoladas e os dentes sem uso
cobertos. Os bornes dos barramentos são gerados depois de aplicar o modo e a
quantidade de polos da semente, em vez de conservar o modo 1P do catálogo.

Exemplo **didático**, não um projeto de execução, dimensionamento de uma
instalação real ou certificação de conformidade elétrica.

## Validação

- `npm run test:qgd`: **42 verificações** — IDs, componentes, cabos válidos,
  diagnóstico de fábrica sem erros nem avisos, ausência de curto, alimentação,
  cortes independentes, neutros separados, registo nativo, quota Free cheia,
  rascunhos privados, revisões e reposição.
- `npm run test:qgd-ui`: **19 verificações** de dashboard → abrir → selecionar
  → duplicar → guardar → recarregar, em User e Admin; sem exceções JavaScript.
- `npm run test:inspector-hooks-ui`: **39 verificações** contra o React #310.
- `npm run typecheck`: passou com Node compatível com `package.json`.

- `npm run test:qgd-build-ui`: **20 verificações** no build minificado,
  incluindo inserir pela biblioteca sem importar módulos de desenvolvimento.
- Build de produção concluído com sucesso no sandbox.

A primeira passagem de `test:ci` encontrou ainda a proteção interior do armário
fora do mapa de visibilidade. A correção dá-lhe uma face independente; o teste
existente de ocultar/restaurar todas as chapas passa. A execução dos restantes
comandos identificou sete suites com falhas também reproduzidas no `main`
público anterior. Detalhes e estado de publicação na nota de validação; o CI
global não está inteiramente verde.

## Ficheiros principais

Na aplicação: `src/project/nativeQuadroDistribuicao.ts`, `nativeProjects.ts`,
`freeNativeSandbox.ts`, `nativeWireCurves.ts`, `src/auth/localBackend.ts`,
`src/electrical/engine.ts`, `scripts/quadro-distribuicao-smoke.ts` e
`scripts/qgd-native-ui-smoke.mjs`.

O detalhe da correção de hooks, dos SVG e das permissões consta de
[[Validation-2026-11-17-QGD-Nativo-React310-SVG-Admin]].
