---
project_id: BN-DCSIMU-001
type: validation
status: DONE
created: 2026-10-31
updated: 2026-10-31
repo: https://github.com/deopmdecastro/dc-simu
commits:
  - 50a990d
  - e3adec6
  - 97b8d2b
tags: [dc-simu, esquema-iec, textos, cursores, termoretratil, torre, sensor]
---

# Validação 2026-10-31 — IEC textos, cursores, termoretrátil e torre

## Contexto
Sessão no cofre BrainNet + repositório `dc-simu`. Trabalho prioritário no código; registo aqui para sincronizar workflows e contexto Maestri/Obsidian.

## Entregas publicadas em `main` (dc-simu)

### 1. Inspetor de textos no Esquema IEC (`50a990d`)
- Seleção `type: 'text'` no `useCommandsUi`.
- Cartão no inspetor paralelo à formatação da referência IEC (conteúdo, tamanho, rotação, cor, alinhamento, negrito/itálico/sublinhado).
- Cursores: texto a piscar em edição/comentários; pointer nos actuadores em simulação.

### 2. Cursor da ferramenta em todo o canvas (`e3adec6`)
- IEC: a ferramenta (select / wire / erase / pan / placing) vence sobre cursores dos filhos (símbolo, tag, texto, porto).
- Esquema painel: classe `is-tool-*` no SVG + CSS; bornes e cabos respeitam a ferramenta.

### 3. Termoretrátil + brilho da torre (`97b8d2b`)
- Novo `WireEndType` **heatShrink** (2D/3D/inspetor).
- Auto: ligações a bornes `lead` de torre/sensor → ponta **termoretrátil**.
- Pigtails 3D: manga termoretrátil na saída de cada condutor da bainha.
- `TowerLight3D`: mesmo `GlowHalo` `kind="lamp"` + `castLight` e emissivo dos sinaleiros do projeto nativo (LandingShowcase / AD22).

## Push
- `dc-simu`: `92a6d29..97b8d2b` → `main` (2026-10-31).
- Token usado via HTTPS `x-access-token`.

## Relacionados no cofre
- [[Task-2026-10-31-Esquema-IEC-Comentarios-Textos]]
- [[Task-2026-10-31-Cabos-Soltos-Torre-Sensor]]
- [[Task-2026-10-31-Referencias-Simbolos-Comandos]]
