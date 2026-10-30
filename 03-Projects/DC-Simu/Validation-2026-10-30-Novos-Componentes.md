---
project_id: BN-DCSIMU-001
type: validation
status: TESTED_LOCAL
created: 2026-10-30
updated: 2026-10-30
tags: [dc-simu, cad, componentes, simulacao, validation]
---
# Novos componentes — investigação e integração

## Resultado

Foram inspecionados os 17 pacotes recebidos em `dc-simu/public/models/componentes novos/`.
Implementados localmente 14 GLB reais, com tipos próprios no catálogo, dimensões
medidas, orientação comum e regras de simulação limitadas à informação confirmada.
As outras três referências foram preparadas no catálogo e continuam bloqueadas
até existir um formato neutro utilizável.

Não foram executadas instruções dos anexos. Os metadados foram confrontados com
documentação dos fabricantes; as alegações dos ficheiros não substituíram testes.

## Ficheiros e método

- [Relatório técnico, inventário, fontes e comandos](./dc-simu/docs/COMPONENTES-IMPORTADOS-2026-10-30.md).
- `dc-simu/public/models/importados/`: 14 GLB, 33 039 900 bytes.
- `dc-simu/src/data/imported-component-models.json`: origem, SHA-256 e dimensões.
- `dc-simu/src/electrical/importedComponents.ts`: metadados e regras elétricas.
- `dc-simu/src/data/imported-component-terminals.json`: 20 encaixes medidos em
  cinco referências, aplicados em `realInterfaces.ts`.
- Integração na fábrica, motor/store, manobra Esquema/3D, ficha do inspetor e
  importação editável na Biblioteca 3D.
- Scripts de extração/conversão, medição, auditoria visual e regressão.
- Exclusão da pasta de entrada no build, Git e contexto Docker: os 17 ZIP
  originais (474 047 735 bytes) permanecem preservados localmente.

## Verificações desta sessão

| Verificação | Resultado |
| --- | --- |
| BrainNet `npm test` | 45 testes passaram |
| BrainNet `npm run check` | Passou |
| Aplicação `test:imported-components` | 103 verificações passaram |
| Aplicação `test:ci` | Passou, incluindo os novos testes |
| Geometria/encaixe | 25 modelos e 162 bornes, dos quais 20 novos |
| Importação funcional no editor 3D | 34 verificações passaram, sem rede externa |
| `test:imported-components-ui` | Passou: quatro tipos inseridos/reabertos no editor, biblioteca, bloqueio dos CAD nativos e painel 3D sem exceções |
| Auditoria dos GLB | 14 modelos renderizados em frente, topo, lado direito e isométrica |
| `npm run build` | Passou; avisos de tamanho de chunks |
| Empacotamento | Os 17 ZIP foram excluídos; restantes recursos públicos copiados e originais preservados |

As primeiras regressões encontraram contagens fixas antigas e uma fixture de
migração aplicada indevidamente a componentes que nunca existiram na versão
histórica. As contagens passaram a refletir os novos modelos; a fixture histórica
conserva os tipos antigos e os novos têm testes próprios de guardar/reabrir.
Não se alteraram tolerâncias geométricas para obter os resultados.

Logs e capturas sintéticos: `runtime/new-component-cad-20261030/`, ignorados por Git.
Os percursos de browser bloquearam pedidos externos e usaram uma sessão local
de teste, sem alterar projetos reais ou dados de serviços conectados.

## Estado e pendências

Preparado, implementado e testado localmente. Após o pedido direto de commit
e push, o commit `ffebb5a93ec22c5bb3c239544ac2fe88547e2936` foi enviado para
`main` de `deopmdecastro/dc-simu`, em 2026-10-30 (UTC). Inclui os 14 GLB
novos, cujos hashes foram novamente confirmados antes do commit, e o carimbo
de release 109. O BrainNet fixa essa revisão no submódulo.

Os 17 ZIP de CAD permanecem locais; dois ultrapassam 100 MiB e exigem Git LFS
para envio ao GitHub. Este incremento envia os recursos usados pela aplicação
e não comprova um deployment externo. Limites mostrados no produto e no
relatório técnico:

- Fim de curso, START e STOP: faltam exportações STEP/GLB. O servidor COM do
  Inventor instalado falhou ao iniciar (`0x80080005`).
- Sete referências com ligações elétricas funcionais precisam de calibração
  física completa dos bornes.
- EAO: falta confirmar o bloco de contactos; torre SB2-3011: falta confirmar
  fabricante, tensão e pinagem. Ambos têm modelo visual, sem contactos inventados.
- Calibre do GV2ME, variantes/auxiliares do CWBC65 e fenómenos temporizados,
  térmicos, diferenciais e de surto mantêm os limites documentados.

[[README|DC-Simu]] · [[Design-Principles]]
