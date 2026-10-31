---
project_id: BN-DCSIMU-001
type: task
status: IMPLEMENTED
created: 2026-10-31
updated: 2026-10-31
tags: [dc-simu, iec, biblioteca, pneumatica, hidraulica, animacao]
---

# Biblioteca IEC/ISO própria (recriação de raiz)

Em vez de extrair símbolos do FluidSIM/CADe (proprietários), o DC-Simu passa a ter **53 símbolos** desenhados de raiz.

## Elétrico (IEC 60617 / 81346)
Alimentação, terra, fusíveis, disjuntores 1P/3P, RCD, seccionador, térmico, contactos NA/NF/comutador/temporizados, botões (incl. luminoso), emergência, sensores, bobinas, lâmpada, buzzer, solenoide, aquecedor, motores 3~/6 bornes, diodo, resistência, condensador, transformador, retificador, E/S PLC, pageRef.

## Pneumática (ISO 1219 — estilo DC-Simu)
Fonte de ar, escape, válvulas 3/2 e 5/2, cilindros SE/DE, regulador, anti-retorno. Simulação: pressão propaga-se pelas redes; êmbolo anima 0→1.

## Hidráulica
Bomba, depósito, cilindro DE (mesma lógica de pressão).

## Animações
Contactos abrem/fecham, bobinas energizam, lâmpadas, buzzer, motores a rodar, válvulas mudam de via, cilindros avançam/recolhem, solenoide Y comanda válvula com o mesmo tag.
