# Ligação ao TIA Portal (S7-PLCSIM Advanced)

**Data:** 2026-11-22 · **Commit:** `dc-simu@f4fb5bb` (`main`) · **Estado:** implementado e testado com CPU simulada; ensaio real só até à listagem de instâncias.

## Pedido

Simular o TIA Portal no DC-Simu. Já existia a lógica na store e a ponte local, mas nenhum ecrã as usava.

## O que foi feito

- **Inspetor do PLC → «Controlador TIA Portal»:**
  - escolha entre o programa interno (Ladder/GRAFCET) e o TIA Portal;
  - ponte local e chave da sessão (não é guardada);
  - instância PLCSIM com o botão «Procurar»;
  - mapa de E/S validado;
  - botão «Ligar».
- **Painel «Simulação»:** estado ao vivo (CPU, latência, trocas, E/S) e «Desligar». Este é o sítio visível em
  RUN, porque o inspetor esconde-se em RUN (DC-ADR-086).
- **Ponte** (`bridge/tia`, `scripts/Start-TiaBridge.ps1`):
  - só aceita ligações locais e exige a chave;
  - uma sessão de cada vez, com watchdog de 1,5 s;
  - escreve só as entradas I e lê as saídas Q;
  - ao desligar, repõe as entradas a 0.
- **Correção encontrada pelo teste:** `recomputeIfPaused` e o encaixe e desencaixe de relés ainda chamavam
  `step()` em RUN. Por isso, premir um sinal em «Simular sinais» pausava a simulação. É o mesmo defeito de
  [[Validation-2026-11-22-Manobras-RUN-Sem-Pausa]].

## Verificações

- `npm run test:tia-bridge`: 9/9. Usa a ponte **real** com uma CPU simulada (Q0.0 = I0.0, Q0.1 = NOT I0.0).
  Cobre: ▶ bloqueado sem ligação, chave errada, instância inexistente, ligar, troca de E/S em RUN, CPU em
  STOP (saídas a 0), desligar (entradas repostas) e chave fora do projeto. Está na bateria `test:ci:fast`.
- `test:tia-panel-ui`: 15/15 no inspetor e no painel «Simulação» reais. Capturas em `runtime/tia-panel/`.
- `test:sim-run-manobra`: 6/6. O caso 6 é novo e cobre «Simular sinais» em RUN.
- Ensaio com o **PLCSIM Advanced 4.1 instalado**: a ponte arrancou com `Start-TiaBridge.ps1`, respondeu ao
  `/health`, recusou uma chave errada e devolveu `instances: []`.
- `tsc`: OK. `test:ci:fast`: 22/24. As falhas `terminal-geometry` e `terminal-seat` (bornes do MICO) já
  existiam. `plc-signals-sync-ui` falha à espera da barra «Vistas», e falha igual sem estas alterações.

## Notas de utilização

- É preciso o **S7-PLCSIM Advanced**. O S7-PLCSIM normal não tem a API.
- O Chrome pede autorização de acesso à rede local na primeira ligação a `127.0.0.1`.

## Pendências

- Ensaio de ponta a ponta com uma CPU real em RUN no PLCSIM Advanced, com um programa carregado a partir do
  TIA Portal (por exemplo, o mapa %I0.0–%Q0.5 da maquete de estampagem).
- O GRAFCET interno não corre em modo TIA (por desenho: quem decide é a CPU externa).
- Não foi feito deploy.
