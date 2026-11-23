---
type: validation
status: IN_PROGRESS
created: 2026-11-23
updated: 2026-11-23
tags: [dc-simu, esteiras, tubos, ar, continuidade, TrayCableBundle]
---

# Continuidade dos tubos de ar nas esteiras (Passo 1)

## Problema
Os tubos de ar (azul, `kind: 'tube'`) apareciam partidos nas descidas e curvas verticais das esteiras (capturas do utilizador). Causa: `TrayCableBundle` só era chamado em `CableTrayStraight3D`; `CableTrayVerticalBend3D` e `CableTrayRiser903D` não desenhavam segmentos de tubo.

## Alterações (StructuresDevices3D.tsx)
1. **TrayCableBundle**
   - Inset em `fullRun` reduzido (2 mm) para continuidade nas junções.
   - Aberturas de piso: o tubo continua até ao eixo da abertura (em vez de cortar cedo), permitindo continuidade com o troço vertical.
   - Material dos tubos: `meshPhysicalMaterial` com clearcoat/transmission (aparência PU industrial) em vez de Standard simples.
   - Reconhece também `kind: 'pneumatic'`.

2. **Novo helper `TrayTubeSegments`**
   - Renderiza segmentos de tubo/cabo em coordenadas locais (para curvas e verticais).

3. **CableTrayVerticalBend3D**
   - Adicionados dois segmentos aproximados ao longo do pescoço articulado.

4. **CableTrayRiser903D**
   - Adicionados dois segmentos (horizontal + vertical) ao longo da curva 90°.

## Ficheiro de evidência
`Evidence-2026-11-23-Acabamentos-Esteiras-Fluidos/StructuresDevices3D-passo1-continuidade-tubos.tsx`

## Próximo
- Integrar o patch no repositório `dc-simu` (commit + push).
- Verificar visualmente na Maquete Estampagem.
- Passo 2: parafusos das tomadas + acabamentos finais de junções.
