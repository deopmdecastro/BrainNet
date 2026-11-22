# Ligação ao TIA Portal (S7-PLCSIM Advanced)

**Data:** 2026-11-22 · **Commit:** `dc-simu@f4fb5bb` (`main`) · **Estado:** implementado e testado, incluindo o ensaio real com o TIA Portal V21 e o PLCSIM Advanced 8.0 (CPU em RUN, 9/9 verificações).

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

## Ensaio real com o TIA Portal e o PLCSIM Advanced (testado)

**Comando:** `npm run test:tia-e2e` (`scripts/Test-TiaE2E.ps1`). Passou a 2026-11-22, a partir de um estado
limpo, com o TIA Portal V21 e o S7-PLCSIM Advanced 8.0.

1. Cria a instância `DCSIMU_E2E` (CPU1511C, Softbus, 192.168.0.1).
2. O TIA Portal sem interface, através do Openness (autorizado pelo utilizador em «Openness access»), cria um
   projeto temporário com a CPU 6ES7 511-1CL03-0AB0 V3.1 e importa `bridge/tia/e2e/Estampagem.scl` com o mapa
   %I0.0–%Q0.5 da maquete. A compilação termina com 0 erros.
3. Carrega o programa pelo interface PLCSIM: `Download: Success`, blocos `Ciclo`, `Main` e tabela de tags,
   e `PLC_1 started`. A CPU fica em **RUN**.
4. `scripts/tia-e2e-plcsim.ts` percorre o caminho DC-Simu → ponte → adaptador → CPU com 9/9 verificações:
   homing, Y1, vácuo, braço, prensa, rampa do metal (Q0.4), fim de ciclo, peça polimérica (Q0.5) e eco das
   entradas. Latência: média 2,1 ms, máxima 3 ms, 33 trocas.
5. Remove a instância e o projeto.

**Problemas encontrados e corrigidos:**

- **Adaptador real:** listas JSON chegam como `ArrayList` e não como `object[]`, por isso todas as ligações
  davam «Mapeamento vazio». A CPU simulada da ponte não passa por este código, por isso o defeito não
  aparecia nos outros testes.
- **TIA Portal V21:**
  - a CPU tem de ser a referência que o PLCSIM V8 emula (1CL03);
  - o projeto precisa da gestão de utilizadores e funções com um utilizador de acesso total;
  - o projeto precisa de «Support simulation during block compilation»;
  - é preciso confiar no certificado TLS da CPU virtual;
  - é preciso responder às perguntas de download «Reset module» e gestão de utilizadores.

**Segurança:** as opções abaixo aplicam-se só ao projeto temporário e à CPU simulada.

- Utilizador anónimo com «Full access». O TIA avisa que isto é «only allowed for testing purposes».
- Dados confidenciais sem proteção.
- Certificado TLS aceite, com a impressão digital registada.

Não foi alterado nenhum projeto do utilizador. A sessão do TIA Portal aberta com a maquete (Ex10) ficou
intacta.

## Pendências

- A janela «Openness access» volta a aparecer sempre que `TiaDeploy.cs` muda. Isto é intencional: o script só
  recompila quando a fonte muda.
- O GRAFCET interno não corre em modo TIA (por desenho: quem decide é a CPU externa).
- Não foi feito deploy.
