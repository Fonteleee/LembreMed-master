import React, { useEffect, useState, useLayoutEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Animated, Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import RemedioService from './RemedioService';
import styles from './TelaPrincipalScreen.styles';
import AppThemeContext from '../AppThemeContext';

export default function TelaPrincipalScreen({ navigation }) {
  const [remedios, setRemedios] = useState([]);
  const [nomePaciente, setNomePaciente] = useState('');
  const isFocused = useIsFocused();
  let { scheme, fontSize } = useContext(AppThemeContext);
  if (Platform.OS === 'web') {
    scheme = 'light';
  }

  useEffect(() => {
    atualizarLista();
  }, [isFocused]);

  useEffect(() => {
    if (navigation && navigation.getParam) {
      const nome = navigation.getParam('nomePaciente', '');
      setNomePaciente(nome);
    }
    if (navigation && navigation.route && navigation.route.params && navigation.route.params.nomePaciente) {
      setNomePaciente(navigation.route.params.nomePaciente);
    }
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Sair', 'Deseja voltar para o início?', [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Sim',
                onPress: () => navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                }),
              },
            ]);
          }}
          style={{ marginRight: 15 }}
        >
          <Text style={{ color: 'red', fontWeight: 'bold', fontSize }}>Sair</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, fontSize]);

  const atualizarLista = () => {
    const lista = RemedioService.listarRemedios();
    setRemedios([...lista]);
  };

  const removerRemedio = (nome) => {
    RemedioService.removerRemedio(nome);
    atualizarLista();
  };

  return (
    <View style={[styles.container, { backgroundColor: scheme === 'dark' ? '#222' : '#f7f7f7' }] }>
      <Text style={[styles.titulo, { fontSize, color: scheme === 'dark' ? '#fff' : '#1976d2', marginBottom: 8, fontWeight: 'bold' }]}>Meus Remédios</Text>
      {nomePaciente ? (
        <Text style={{ fontSize: fontSize + 2, color: '#1976d2', marginBottom: 12 }}>Bem-vindo, {nomePaciente}!</Text>
      ) : null}
      <FlatList
        data={remedios}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          // Corrige comparação de datas para garantir relação correta
          const checklist = RemedioService.listarHistorico().filter(h => {
            if (h.nome !== item.nome) return false;
            if (h.dataAdicao && item.dataAdicao) {
              const d1 = new Date(h.dataAdicao).toDateString();
              const d2 = new Date(item.dataAdicao).toDateString();
              return d1 === d2;
            }
            return true;
          });
          const diasTomados = checklist.filter(h => h.horario === 'TOMEI').length;
          const diasPulados = checklist.filter(h => h.horario === 'PULEI').length;
          let diasRestantes = '-';
          let aderencia = '-';
          if (item.diasRecomendados && item.dataAdicao) {
            const inicio = new Date(item.dataAdicao);
            const hoje = new Date();
            const diff = Math.floor((hoje - inicio) / (1000 * 60 * 60 * 24));
            diasRestantes = Math.max(parseInt(item.diasRecomendados) - (diasTomados + diasPulados), 0);
            aderencia = ((diasTomados / parseInt(item.diasRecomendados)) * 100).toFixed(0) + '%';
          }
          const scale = new Animated.Value(1);
          const animateButton = () => {
            Animated.sequence([
              Animated.timing(scale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
              Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true })
            ]).start();
          };
          const handleChecklist = (acao) => {
            animateButton();
            RemedioService.registrarUso(item.nome, acao, item);
          };
          return (
            <View style={[styles.card, { borderLeftWidth: 8, borderLeftColor: item.cor || '#4caf50' }] }>
              <View style={styles.cardInfo}>
                <Text style={[styles.nome, { fontSize }]}>{item.nome}</Text>
                <Text style={[styles.horario, { fontSize }]}>Horários: {Array.isArray(item.horarios) ? item.horarios.map(h => typeof h === 'string' ? h : h.toLocaleTimeString()).join(', ') : item.horario}</Text>
                <Text style={[styles.horario, { fontSize }]}>Frequência: {item.frequencia || '-'}</Text>
                <Text style={[styles.horario, { fontSize }]}>Dosagem: {item.dosagem || '-'}</Text>
                <Text style={[styles.horario, { fontSize }]}>Adicionado em: {item.dataAdicao ? new Date(item.dataAdicao).toLocaleString() : '-'}</Text>
                <Text style={[styles.horario, { fontSize }]}>Dias recomendados: {item.diasRecomendados || '-'}</Text>
                <Text style={[styles.horario, { fontSize, color: '#e53935', fontWeight: 'bold' }]}>Dias restantes: {diasRestantes}</Text>
                <Text style={[styles.horario, { fontSize, color: '#1976d2', fontWeight: 'bold' }]}>Aderência: {aderencia}</Text>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <Animated.View style={{ transform: [{ scale }] }}>
                    <TouchableOpacity style={{ backgroundColor: '#4caf50', padding: 10, borderRadius: 20, marginRight: 10 }} onPress={() => handleChecklist('TOMEI')}>
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>TOMEI</Text>
                    </TouchableOpacity>
                  </Animated.View>
                  <Animated.View style={{ transform: [{ scale }] }}>
                    <TouchableOpacity style={{ backgroundColor: '#e53935', padding: 10, borderRadius: 20 }} onPress={() => handleChecklist('PULEI')}>
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>PULEI</Text>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  {checklist.map((h, idx) => (
                    <View key={idx} style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: h.horario === 'TOMEI' ? '#4caf50' : '#e53935', marginRight: 4 }} />
                  ))}
                </View>
              </View>
              <TouchableOpacity
                style={styles.botaoRemover}
                onPress={() => removerRemedio(item.nome)}
              >
                <Text style={[styles.removerTexto, { fontSize }]}>Remover</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={[styles.vazio, { fontSize }]}>Nenhum remédio cadastrado.</Text>}
      />
      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('AdicionarRemedio')}
      >
        <Text style={[styles.botaoTexto, { fontSize }]}>+ Adicionar Remédio</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.botao, { backgroundColor: '#1976d2', marginTop: 10 }]}
        onPress={() => navigation.navigate('Historico')}
      >
        <Text style={[styles.botaoTexto, { fontSize }]}>Ver Histórico</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.botao, { backgroundColor: '#1976d2', marginTop: 10 }]}
        onPress={() => navigation.navigate('Respiro')}
      >
        <Text style={[styles.botaoTexto, { fontSize }]}>Estou Ansioso / Preciso de Ajuda</Text>
      </TouchableOpacity>
    </View>
  );
}
