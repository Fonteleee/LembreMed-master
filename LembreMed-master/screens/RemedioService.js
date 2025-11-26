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

  registrarUso(nome, acao, remedioInfo) {
    const remedio = remedioInfo || this.remedios.find(item => item.nome === nome);
    this.historico.push({ 
      nome, 
      horario: acao, // agora pode ser 'TOMEI' ou 'PULEI'
      dosagem: remedio?.dosagem || '-',
      cor: remedio?.cor || '#4caf50',
      dataAdicao: remedio?.dataAdicao,
      diasRecomendados: remedio?.diasRecomendados,
      data: new Date()
    });
  }

  listarHistorico() {
    return this.historico;
  }
}

const instancia = new RemedioService();
export default instancia;
