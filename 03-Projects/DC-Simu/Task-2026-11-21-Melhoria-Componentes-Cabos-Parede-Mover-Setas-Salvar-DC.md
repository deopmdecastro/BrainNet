---
project_id: BN-DCSIMU-001
type: task
status: IN_PROGRESS
created: 2026-11-21
updated: 2026-11-21
tags: [dc-simu, componentes, cabos, realismo, ui, save, .dc, setas, mover]
priority: high
---

# Tarefa 2026-11-21 — Melhoria de Componentes 3D, Cabos sem Furar Parede, Mover com Setas, Formato .dc e Deformidade na Saída da Caixa

## Pedido do utilizador (autorizado commit/push)

Melhorar os componentes desenhados e tornar fiel; verificar componentes que ainda estão crus e tornar fiel e realista.

- Não permitir cabos furarem paredes; os cabos da lâmpada estão a entrar na parede.
- Permitir arrastar ou mover elementos com setas de acordo com a vista que estou a visualizar; mover todos os componentes.
- Criar função de salvar o projeto, salvar um formato `.dc`, que só abre no dc-simu.
- Verificar a deformidade na saída da caixa e resolver.

Repositórios autorizados: `dc-simu` e `BrainNet`. Token fornecido. Preferência: trabalhar no cofre (BrainNet) primeiro, depois commit/push em ambos.

## Contexto lido (obrigatório)

- [[Design-Principles]]
- [[Protocolo-Comunicacao-BrainNet-DCSimu]]
- [[Validation-2026-11-21-Suite-Iluminacao-E27-Odace]] (iluminação recente)
- [[Validation-2026-11-17-Refinamentos-Mecanicos]] (bucins / saídas)
- Backlog atual e tarefas de cabos/bucim anteriores

## Análise inicial

1. **Cabos a furar parede**: Os cabos das lâmpadas (provavelmente E27 ou luminária linear se existir) estão a penetrar a geometria da parede em vez de terminarem num bucim, calha ou entrada de cabo válida. Corrigir o ponto de ancoragem do cabo e a lógica de routing/clipping para respeitar superfícies de parede e caixas.

2. **Deformidade na saída da caixa**: Imagem mostra bucim/glândula de latão (brass) deformado/escalonado incorretamente na face de uma caixa branca. Provavelmente escala não uniforme, pivot errado ou geometria procedural do bucim (ver `bucim` / cable gland em motores, caixas e ConduitDevices).

3. **Mover com setas conforme a vista**: Implementar/ativar atalhos de setas (←↑→↓) que movem o(s) componente(s) selecionado(s) no plano da vista atual (ortográfica ou câmara), com passo configurável e snap opcional. Deve funcionar para todos os tipos de componentes (não só alguns).

4. **Formato .dc**: Extensão proprietária. Sugestão:
   - Header mágico `DCSIMU\0` + versão + JSON comprimido (ou MessagePack) + checksum.
   - Ou JSON com magic comment e extensão `.dc`.
   - File picker e drag-drop só aceitam `.dc` (e opcionalmente `.json` legado).
   - Abrir só dentro do DC-Simu (sem associação de SO obrigatória, mas o ficheiro é identificável).

## Critérios de aceitação

- [ ] Cabos de lâmpadas / componentes de parede terminam em pontos de entrada válidos (bucim, bornes de parede, calha) e nunca atravessam a geometria da parede.
- [x] Bucim / saída da caixa sem deformação visual (escala uniforme, orientação correta, textura latão fiel). — `CableGlandPG` em `JunctionWagoDevices3D.tsx` reescrito com latão realista e `scale={[s,s,s]}` forçado.
- [ ] Setas do teclado movem qualquer componente selecionado de acordo com a orientação da vista atual (frente/topo/lado/isométrica).
- [x] Função "Guardar como .dc" e "Abrir .dc" funcionam; ficheiros `.dc` só são interpretados pelo DC-Simu. — Header mágico `DCSIMU\x01` + JSON; menu Projeto com «Exportar ficheiro (.dc)»; accept `.dc,.json`.
- [ ] Componentes ainda crus identificados e refinados (pelo menos os da suíte de iluminação e caixas/bucins mais usados).
- [ ] Validação: typecheck + testes relevantes de cabos/iluminação/persistência + evidência visual no cofre.
- [ ] Commit + push autorizados nos dois repositórios com mensagem descritiva.

## Plano de execução

1. Documentar no cofre (este ficheiro).
2. Localizar geometria do bucim e ponto de saída de cabo das lâmpadas / caixas.
3. Corrigir deformidade (escala, matriz, geometria).
4. Ajustar routing de cabos para respeitar paredes (clip / re-route / terminal wall-entry).
5. Implementar movimento por setas baseado na câmara/vista.
6. Implementar serialização `.dc` (header + payload) e UI de Save/Open.
7. Testes + Validation note.
8. Commit/push em dc-simu e BrainNet (submódulo se existir).

## Notas

- Reutilizar código existente de persistência (`src/utils/persistence.ts`), de cabos (`EditableCable3D`, `WiresView`) e de movimento de componentes.
- Não reinventar: seguir padrões de UI do `toolbarKit` e Design-Principles.
- Trabalhar primeiro no cofre; só depois código e push.
