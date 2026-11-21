---
type: evaluation
status: READY_FOR_REVIEW
created: 2026-11-21
updated: 2026-11-21
tags: [brainet, dc-simu, ai, ux, video, avaliacao]
---
# Avaliação de três vídeos: leis de UX, skills de vídeo e OpenMontage

Três reels públicos vistos localmente em 2026-11-21: frames e, quando existiam, legendas automáticas (vídeo 2 em espanhol, legendado em indonésio; vídeo 3 em pt-BR). O vídeo 1 não tem fala transcrita; foi lido pelo texto no ecrã. São peças de marketing com apelo "comenta e recebes na DM": as alegações não contam como evidência. Ver também o [[Avaliacao-Videos-IA-2026-11-21|lote anterior]].

| # | Vídeo | Proposta |
| --- | --- | --- |
| 1 | "A tua tela funciona e o cliente…" | Passar uma tela (formulário de cadastro) à IA e corrigi-la segundo 7 leis de UX: Fitts, Hick, Zeigarnik, Jakob, gradiente de meta, Von Restorff e Miller. Mostra antes/depois e um marcador de 0/7 a 7/7 |
| 2 | "3 ferramentas do Claude que precisas" | Três skills para Claude Code: editor de vídeo, *Motion Architect* (motion graphics) e *Creative Architect* (criativos e UGC), "grátis para a comunidade" |
| 3 | "Esta skill transforma o teu Claude num sistema de produção" | OpenMontage: equipa de agentes (pesquisa, guião, locução, edição) que entrega o vídeo pronto; "custo R$ 0", "+60 mil estrelas" |

## Decisões

| Tema | Verificação | BrainNet / DC-Simu | Decisão |
| --- | --- | --- | --- |
| **7 leis de UX** | Princípios conhecidos de HCI e psicologia cognitiva (Laws of UX); o vídeo não traz fonte nem medições | Aplica-se diretamente às interfaces do DC-Simu (inspetor, bibliotecas, formulários) e ao website BraiNet. É método de revisão, não ferramenta | **Aplicado**: método acrescentado ao papel [[../04-Agents/UX-UI-Designer]] (UX/UI Designer)\|UX/UI Designer]] |
| **Skills de vídeo do vídeo 2** | Sem repositório público encontrado no GitHub (pesquisa a 2026-11-21); distribuídas por mensagem privada | Instalar skills de origem desconhecida dá a um agente instruções e scripts não revistos | **Não adotar**. Só reavaliar com repositório público, licença e código legível |
| **OpenMontage** | `OpenMontageInc/OpenMontage`, Python, **AGPL-3.0**, ~82 mil estrelas (o vídeo dizia 60 mil). 12 pipelines; storyboard com aprovação e estimativa de custo por cena antes de gerar | Útil para vídeos de marketing e tutoriais do DC-Simu. O caminho sem chaves pagas usa Piper TTS (offline), filmagens abertas (Archive.org, NASA, Wikimedia) e Remotion. Fornecedores pagos (fal.ai/Kling, ElevenLabs, OpenAI…) são opcionais | **Piloto possível, pendente de decisão**. "Custo R$ 0" só é verdade no caminho gratuito |

## OpenMontage: condições para um piloto

1. **Âmbito**: um vídeo curto de demonstração do DC-Simu, só no caminho sem chaves pagas (Piper + capturas do próprio simulador + música livre de direitos).
2. **Isolamento**: instalação num diretório fora do cofre e do repositório do DC-Simu; sem chaves de API no cofre (ficam no gestor da ferramenta, conforme o AGENTS.md).
3. **Licença**: AGPL-3.0 aplica-se ao código da ferramenta. Usá-la localmente não impõe licença aos vídeos produzidos, mas não se deve integrar o código no DC-Simu nem servi-la a terceiros sem rever a AGPL.
4. **Direitos**: confirmar a licença de cada filmagem e música que a ferramenta escolher. Não usar marcas, vozes ou rostos de terceiros.
5. **Despesa e publicação**: qualquer fornecedor pago e qualquer publicação exigem aprovação explícita (pessoa, âmbito, data). O storyboard com custo por cena serve de ponto de aprovação.

## Prioridades propostas

| Prioridade | Ação | Estado |
| --- | --- | --- |
| 1 | Usar a revisão pelas 7 leis nas próximas alterações de interface do DC-Simu (começar pelo modal de etiquetas e pelo inspetor do quadro) | Preparado (papel atualizado) |
| 2 | Decidir o piloto OpenMontage nas condições acima | Pendente do utilizador |
| 3 | Skills de vídeo do vídeo 2 | Rejeitado |

## Evidências
- Frames e legendas: execução local do `/watch` (yt-dlp + ffmpeg), 2026-11-21. Sem transcrição de fala no vídeo 1 (sem WhisperX instalado).
- OpenMontage: metadados do repositório via GitHub e secção "What You Get With Zero API Keys" do README.
- Nenhuma ferramenta foi instalada nem nenhuma conta criada.
