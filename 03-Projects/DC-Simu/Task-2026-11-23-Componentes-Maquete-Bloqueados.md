# Task: Componentes da maquete iniciam bloqueados (locked: true)

**Data:** 2026-11-23
**Autor:** Arena Agent
**Repositório DC-Simu:** https://github.com/deopmdecastro/dc-simu
**Repositório BrainNet (Cofre):** https://github.com/deopmdecastro/BrainNet

## Contexto e Princípios (BrainNet Design-Principles.md)
- **Interação e segurança do trabalho:** Distinguir seleção, arrasto, ligação e deslocamento.
- **Ações de gestão frequentes:** Bloquear/desbloquear componentes devem ser visíveis (painel de objetos).
- **Direção visual:** Manter os componentes previsíveis; evitar arrasto acidental ao adicionar na maquete.

## Implementação no DC-Simu
**Ficheiro modificado:** `src/electrical/factory.ts` (função `createComponent`)

### Alterações efetuadas:
1. **Estado Inicial Bloqueado:** Alterado o valor padrão de `locked` de `false` para `true` na criação de novos componentes (incluindo os da maquete).
   - **Efeito:** Ao adicionar um componente (seja via biblioteca, maquete ou arrastar), ele inicia bloqueado (`locked: true`).
   - **Prevenção:** Evita arrasto acidental no canvas logo após a adição.
   - **Desbloqueio:** O utilizador pode desbloquear no painel de objetos (através do botão de bloqueio/desbloqueio já existente no `ProjectObjects.tsx` que alterna o estado `locked`).

### Código alterado:
```typescript
    mirrored: false,
    locked: true, // Alterado de false para true
    bodyColor: presentation3D.bodyColor,
```

## Comunicação entre repositórios
O cofre BrainNet (Obsidian/Maestri) armazena o contexto de segurança de trabalho e interação. A alteração garante que a regra "não permitir arrastar sem querer" é aplicada por padrão, respeitando o princípio de segurança. O utilizador mantém o controlo total através do painel de objetos (já implementado anteriormente com o botão de desbloqueio/bloqueio).

## Commits e Pushes
- **DC-Simu:** Commit feito e push para o repositório principal (`main`).
  - Commit: `feat: componentes da maquete iniciam bloqueados (locked: true) para evitar arrasto acidental; desbloqueio via painel de objetos`
  - Hash: `321a4e55`
- **BrainNet (Cofre):** Documentação atualizada com o registo desta nova regra de comportamento.

## Próximos passos
- Verificar se o desbloqueio no painel de objetos funciona conforme esperado (o botão de bloqueio/desbloqueio já alterna o estado `locked` no `ProjectObjects.tsx`).
- Testar a adição de componentes na maquete e confirmar o estado inicial bloqueado.

---
[[Project-Brief|Briefing]] · [[Backlog|Backlog]] · [[Decision-Log|Decisões]]
