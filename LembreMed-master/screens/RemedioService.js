
// Serviço para gerenciar os medicamentos e histórico
import AsyncStorage from '@react-native-async-storage/async-storage';

class RemedioService {
  constructor() {
    this.remedios = [];
    this.historico = [];
    this.carregarDados(); // Carrega dados salvos ao iniciar
  }

  //  dados salvos no AsyncStorage
  async carregarDados() {
    const remediosSalvos = await AsyncStorage.getItem('remedios');
    const historicoSalvo = await AsyncStorage.getItem('historico');
    this.remedios = remediosSalvos ? JSON.parse(remediosSalvos) : [];
    this.historico = historicoSalvo ? JSON.parse(historicoSalvo) : [];
  }

  
  async salvarRemedios() {
    await AsyncStorage.setItem('remedios', JSON.stringify(this.remedios));
  }

  
  async salvarHistorico() {
    await AsyncStorage.setItem('historico', JSON.stringify(this.historico));
  }

  
  async adicionarRemedio(remedio) {
    this.remedios.push(remedio);
    await this.salvarRemedios();
  }

  // Retorna lista de medicamentos
  listarRemedios() {
    return this.remedios;
  }

  // Limpa tudo
  async limparTudo() {
    this.remedios = [];
    this.historico = [];
    await AsyncStorage.removeItem('remedios');
    await AsyncStorage.removeItem('historico');
  }

  
  async removerRemedio(nome) {
    this.remedios = this.remedios.filter(item => item.nome !== nome);
    await this.salvarRemedios();
  }

  // Registra uso (TOMEI/PULEI) no histórico
  async registrarUso(nome, acao, remedioInfo) {
    const remedio = remedioInfo || this.remedios.find(item => item.nome === nome);
    let horarios = '-';
    if (remedio && remedio.horarios && remedio.horarios.length > 0) {
      horarios = remedio.horarios.map(h => {
        if (typeof h === 'string' && h.includes('T')) {
          return new Date(h).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return typeof h === 'string' ? h : h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }).join(', ');
    }
    this.historico.push({ 
      nome, 
      horarios, 
      dosagem: remedio?.dosagem || '-',
      cor: remedio?.cor || '#4caf50',
      dataAdicao: remedio?.dataAdicao,
      diasRecomendados: remedio?.diasRecomendados,
      data: new Date(),
      acao // TOMEI/PULEI
    });
    await this.salvarHistorico();
  }

  // Retorna histórico
  listarHistorico() {
    return this.historico;
  }
}

const instancia = new RemedioService();
export default instancia;
