---
project_id: BN-DCSIMU-001
type: validation
status: IMPLEMENTED
created: 2026-11-03
updated: 2026-11-03
tags: [brainnet, dc-simu, grafcet, fluidsim, import, free-text]
---
# Validação — Legendas G<>X e transições-fonte na importação

## Pedido
Remover textos livres soltos do tipo `G0 <> X9` (já existem como condição/guarda nas transições). Reduzir notas de «ligações incompletas» em T9/T26/T28 (padrão fonte FluidSIM).

## Alterações

### Importador (`fluidSim4.ts`) — `b0597a0`
- Não importa textos cujo conteúdo é só `G<n> <> X<m>` (ou `=`, `==`, `<=>`).
- Transição só com destino (`from` vazio) → `source: true`, `wireless`, **sem** aviso de ligações incompletas.
- Sumidouro (só origem) também sem esse aviso.

### Concluir revisão (`GrafcetEditor.tsx`) — `ab71a83`
- Ao concluir a revisão, remove automaticamente os textos livres `G… <> X…` ainda presentes no desenho e avisa quantos foram removidos.

## Uso no projeto ATEC
1. Atualizar a app.
2. Clicar **Concluir revisão** — as legendas `G0 <> X9`, `G4 <> X159`, etc. são apagadas do canvas.
3. As 12 notas de importação desaparecem com a conclusão (ficam só no histórico do import se reimportar).
4. Em reimportações futuras, essas legendas já não entram.

[[FluidSIM-Import]] · [[Validation-2026-11-03-Import-Action-Vars-Empty-Trans]]
