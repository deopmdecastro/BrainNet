---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED_PENDING_VALIDATION
created: 2026-11-04
updated: 2026-11-04
tags: [dc-simu, marketing, video, demonstracao]
---
# Vídeo publicitário da DC-Simu

## Resultado
Vídeo de 1:46 (1920×1080, H.264/AAC, −14 LUFS) gravado na aplicação real com o projeto nativo «Partida direta com emergência» e o exemplo IEC «Arranque estrela-triângulo»: landing, painel de projetos, simulação 3D (RUN «Simular todos», START), Ladder (FC1 em execução), GRAFCET (STOP/START), Esquema IEC (potência e comando LOGO!), circuito de comando estrela-triângulo, Monitor com falha injetada. Roteiro, legendas SRT, locução por cena, música original, grafismos e projeto de edição reproduzível (Playwright + ffmpeg).

## Onde está
`runtime/dc-simu-video/` (local, ignorado pelo Git — não publicar a partir do cofre). Ver `RELATORIO.md` nessa pasta.

## Pendências
- Locução: voz sintetizada Helia (pt-PT); para campanha paga, regravar com locutor.
- Música: faixa original sintetizada; substituir por faixa licenciada se desejado.
- Acrescentar o URL público oficial no cartão final.
- 4K real exige nova gravação com `deviceScaleFactor: 2`.
- Defeitos visuais da app vistos durante a gravação: texto sobreposto no título do quadro 3D nativo e no cabeçalho do GRAFCET nativo.
- Aprovação do utilizador antes de qualquer publicação (site, YouTube, redes).
