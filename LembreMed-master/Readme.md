# MedAlerta

MedAlerta é um aplicativo para ajudar você a lembrar de tomar seus medicamentos de forma simples, flexível e acessível.

## Funcionalidades

- Cadastro de medicamentos com sugestão automática de nomes.
- Adição de múltiplos horários para cada medicamento.
- Seleção de frequência dos lembretes (diário, semanal, mensal).
- Notificações persistentes (apenas mobile) até confirmação do usuário.
- Histórico de medicamentos tomados, exibido em tela dedicada.
- Suporte a modo escuro e fontes maiores para acessibilidade.

## Como usar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Para rodar no navegador:

   ```bash
   npm run web
   ```

3. Para rodar no celular (Expo Go):

   ```bash
   npm start
   ```

   Escaneie o QR Code com o app Expo Go.

## Estrutura do projeto

- `App.js`: Configuração principal e navegação.
- `screens/AdicionarRemedioScreen.js`: Cadastro de medicamentos.
- `screens/TelaPrincipalScreen.js`: Lista de medicamentos cadastrados.
- `screens/HistoricoScreen.js`: Histórico de uso dos medicamentos.
- `screens/RemedioService.js`: Serviço para gerenciar dados dos medicamentos.

## Observações

- As notificações funcionam apenas em dispositivos móveis.
- Os dados são armazenados apenas em memória (não persistem após fechar o app).
- Recomendo adaptar para uso de banco local ou nuvem para maior segurança.

Feito com carinho para facilitar sua rotina de saúde!
