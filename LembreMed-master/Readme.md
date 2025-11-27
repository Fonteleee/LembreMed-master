# MedAlerta

Esse projeto surgiu para atender uma necessidade real e tem como objetivo ajudar qualquer pessoa a lembrar de tomar seus remédios, de um jeito fácil e prático.

## O que o app faz

- Permite cadastrar medicamentos e escolher horários para tomar cada um.
- Dá sugestões de nomes de remédios para facilitar.
- Você pode escolher se o lembrete será diário, semanal ou mensal.
- O app envia notificações no horário certo (funciona melhor no celular).
- Tem uma tela de histórico para ver tudo que já foi tomado ou pulado.
- Dá para usar modo escuro e aumentar a fonte, se preferir.

## Como rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Para testar no navegador:

   ```bash
   npm run web
   ```

3. Para rodar no celular (Expo Go):

   ```bash
   npm start
   ```

   Depois, é só escanear o QR Code com o app Expo Go.

## Estrutura do projeto

- `App.js`: Onde tudo começa, configura as telas e o tema.
- `screens/AdicionarRemedioScreen.js`: Tela para cadastrar/remédios.
- `screens/TelaPrincipalScreen.js`: Lista dos seus medicamentos.
- `screens/HistoricoScreen.js`: Mostra o histórico de uso.
- `screens/RemedioService.js`: Gerencia os dados dos medicamentos.
- Outras telas: Boas-vindas, login, cadastro, respiração guiada para ansiedade.

## Observações

- As notificações funcionam melhor no celular, pois o navegador tem limitações.
- Os dados ficam salvos localmente no aparelho.
- O app foi feito para fins acadêmicos, mas pode ser adaptado para uso real.

Feito com dedicação para ajudar na rotina de saúde!
