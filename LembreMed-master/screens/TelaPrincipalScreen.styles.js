
// Estilos para a tela principal dos medicamentos
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E8F5E9',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E7D32',
  },
  card: {
    backgroundColor: '#D6F5E9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  horario: {
    fontSize: 16,
  },
  botaoRemover: {
    backgroundColor: '#E53935',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  removerTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  vazio: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
  botao: {
    backgroundColor: '#43a047',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
