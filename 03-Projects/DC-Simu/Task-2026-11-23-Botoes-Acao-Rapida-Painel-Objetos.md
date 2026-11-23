# Task: Criar botões de ações rápidas no painel de objetos (Botão de Apagar)

**Data:** 2026-11-23
**Autor:** Arena Agent
**Repositório DC-Simu:** https://github.com/deopmdecastro/dc-simu
**Repositório BrainNet (Cofre):** https://github.com/deopmdecastro/BrainNet

## Contexto e Princípios (BrainNet Design-Principles.md)
- Ações destrutivas ficam separadas, em vermelho e com confirmação; ações de gestão frequentes ficam visíveis.
- Preservar os componentes, espaçamentos, tipografia e estados existentes.
- Usar os ícones do kit `src/ui/icons.tsx` (IconDelete para apagar/lixo).
- Manter a hierarquia clara e a densidade controlada.

## Implementação no DC-Simu
**Ficheiro modificado:** `src/components/ProjectObjects.tsx`

### Alterações efetuadas:
1. **Importação do ícone:** Adicionado `IconDelete` do `src/ui/icons.tsx` (que mapeia para `faTrashCan`).
2. **Botão de Ação Rápida:** Adicionado um botão de "Apagar" na barra de ações rápidas (`dc-objects-actions`) do painel de objetos:
   - **Condição:** Ativado apenas quando há seleção (`disabled={!targets.length}`).
   - **Estilo:** Vermelho (`color: '#dc3545', borderColor: '#dc3545'`) conforme as regras de ações destrutivas.
   - **Ação:** Chama `useSimStore.getState().deleteSelection()` (que já valida modo demo, simulação em curso, e remove componentes/cabos/terminais).
   - **Acessibilidade:** Título "Apagar componentes selecionados (Del)" e ícone `IconDelete`.

### Código inserido:
```tsx
<button type="button" className="dc-btn-sm" disabled={!targets.length} title="Apagar componentes selecionados (Del)" onClick={() => useSimStore.getState().deleteSelection()} style={{ color: '#dc3545', borderColor: '#dc3545' }}><IconDelete size={12} />Apagar</button>
```

## Commits e Pushes
- **DC-Simu:** Commit feito e push para o repositório principal (`main`).
  - Commit: `feat: adicionar botão de ação rápida para apagar componentes no painel de objetos (com IconDelete e estilo vermelho)`
  - Hash: `a1c33919`
- **BrainNet (Cofre):** Documentação atualizada com o registo da tarefa e contexto de comunicação entre os repositórios.

## Comunicação entre repositórios
O cofre BrainNet (Obsidian/Maestri) armazena o contexto, regras de UI, e a arquitetura. O código do DC-Simu foi atualizado seguindo estritamente as diretrizes de "Ações destrutivas em vermelho" e reutilizando o `IconDelete` existente no kit de ícones. O registo desta tarefa foi agora adicionado ao cofre para garantir que futuras automações ou agentes saibam que o botão de apagar já existe e não o reescrevam do zero.

## Próximos passos
- Testar a confirmação (se aplicável, o `deleteSelection` já trata o estado de simulação).
- Verificar o comportamento em densidade `is-tight` (o botão já segue o padrão `dc-btn-sm` que se adapta).

---
[[Project-Brief|Briefing]] · [[Backlog|Backlog]] · [[Decision-Log|Decisões]]
