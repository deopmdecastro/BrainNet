---
project_id: BN-DCSIMU-001
type: validation
status: PUBLISHED
created: 2026-10-31
updated: 2026-10-31
repo: https://github.com/deopmdecastro/dc-simu
commits:
  - eacccb4
tags: [dc-simu, 3d-realista, cursor, ferramentas, ui]
---

# Validação 2026-10-31 — Cursor do 3D Realista segue a ferramenta

## Pedido
O cursor no 3D Realista não mudava consoante a ferramenta ativa.

## Diagnóstico
- Os componentes/pontos 3D (`Panel3D.tsx`) escrevem `gl.domElement.style.cursor` (grab/grabbing) em `pointerover/out`; só a ferramenta Fio definia `crosshair` (`WireDraw3D.tsx`). Apagar, Mover vista, Sonda e colocação não tinham cursor próprio.

## Implementação
- `Panel3D.tsx`: o palco expõe `data-grid-drag`, `data-placing` e `data-sim-locked` (já tinha `data-edit-mode`).
- `panel3d-editor.css`: regras por ferramenta com `!important` sobre o `canvas` — Fio/Sonda `crosshair`, Apagar `not-allowed`, Mover vista/Arrastar malha `grab`→`grabbing`, texto `text`, colocar componente `copy`. Em Selecionar mantêm-se os cursores dos alvos 3D.
- Mesmo princípio do Esquema IEC ([[Validation-2026-10-31-IEC-Textos-Cursores-Termoretratil-Torre]]): a ferramenta vence os filhos.

## Verificações
- 2026-10-31 (publicação): `tsc -b` sem erros, `vite build` OK e `npm test` (smoke) «TODOS OS TESTES PASSARAM» sobre o dc-simu `main` com os 3 commits aplicados.
- Teste visual em browser **ainda por fazer** (as linhas «não executados» abaixo referem-se ao ambiente anterior).
- Revisão de código e `git diff`. Typecheck/build completo e teste visual em browser **não executados** (dependências não instaladas neste ambiente).

## Pendências
- Confirmar visualmente cada ferramenta (1–5 e Arrastar malha) e a deployment no Vercel.
- Publicado em `deopmdecastro/dc-simu` `main` (cb32a08..57d3e43); submódulo do cofre atualizado.
