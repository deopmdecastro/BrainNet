# Tarefa Concluída: Acabamento Compressor, Som e Cabo Editável (2026-11-23)

## Resumo das Alterações
- **Acabamento Realista (Datasheet Maxxim 24L)**:
  - Substituição de texturas genéricas (Festo) por texturas personalizadas (Maxxim Logo, Specs, Bar Badge, Pressostato, Braided Hose, Bar Gauge).
  - Ajuste de materiais (Blue Tank, Black Cover, Brass, Chrome) conforme a proposta documentada.
  - Geometria mantida mas com decalques e materiais aplicados ao compressor (tanque, carenagem, tubos, motor, ventoinha).
- **Som Realista**:
  - Integração de `PositionalAudio` (Three.js) que reproduz o som de trabalho (`/sounds/compressor-running.mp3`) quando o estado `running` é `true`.
  - Volume proporcional à pressão do tanque (`tankBar / 8`).
- **Cabo Editável e Ficha (Plug)**:
  - Implementação do componente `EditableCable3D` com pontos de controlo (curvas) e ficha ligável à tomada `socket-compressor`.
  - Substituição da mangueira estática no compressor.
  - Lógica de atualização de geometria em tempo real (`onCurveChange`).

## Ficheiros Modificados
- `/home/user/dc-simu/src/three/PneumaticsDevices3D.tsx`: Modificação do componente `AirCompressor3D` e criação do `EditableCable3D`.
- `/home/user/dc-simu/src/electrical/compressor-finish-proposal.md`: Documentação da proposta (já existente).

## Commits
- **dc-simu**: `11d0b56b` (feat: compressor finish (Maxxim 24L), positional audio, and editable cable/plug)

## Próximos Passos
- Adicionar o ficheiro de som `/public/sounds/compressor-running.mp3` (se ainda não existir) para que o áudio funcione no servidor Vite.
- Documentar a integração do cabo editável no BrainNet (se necessário).
- Verificar a visualização no servidor Vite (porta 5174).

## Referências
- `/home/user/dc-simu/src/electrical/compressor-finish-proposal.md`
- `/home/user/uploads/` (Imagens de referência)
- Datasheet Maxxim 24L
