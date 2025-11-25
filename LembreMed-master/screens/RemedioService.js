// src/services/RemedioService.js

class RemedioService {
  constructor() {
    this.remedios = [];
    this.historico = [];
  }

  adicionarRemedio(remedio) {
    this.remedios.push(remedio);
  }

  listarRemedios() {
    return this.remedios;
  }

  limparTudo() {
    this.remedios = [];
    this.historico = [];
  }

  removerRemedio(nome) {
    this.remedios = this.remedios.filter(item => item.nome !== nome);
  }

  registrarUso(nome, horario) {
    this.historico.push({ nome, horario, data: new Date() });
  }

  listarHistorico() {
    return this.historico;
  }
}

const instancia = new RemedioService();
export default instancia;
