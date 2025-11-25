import React, { useEffect, useState, useLayoutEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import RemedioService from './RemedioService';
import styles from './TelaPrincipalScreen.styles';
import { AppThemeContext } from '../App';

export default function TelaPrincipalScreen({ navigation }) {
  const [remedios, setRemedios] = useState([]);
  const isFocused = useIsFocused();
  const { scheme, fontSize } = useContext(AppThemeContext);

  useEffect(() => {
    atualizarLista();
  }, [isFocused]);

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
    <View style={[styles.container, { backgroundColor: scheme === 'dark' ? '#222' : '#fff' }] }>
      <Text style={[styles.titulo, { fontSize, color: scheme === 'dark' ? '#fff' : '#000' }]}>Meus Remédios</Text>
      <FlatList
        data={remedios}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={[styles.nome, { fontSize }]}>{item.nome}</Text>
              <Text style={[styles.horario, { fontSize }]}>Horários: {Array.isArray(item.horarios) ? item.horarios.map(h => typeof h === 'string' ? h : h.toLocaleTimeString()).join(', ') : item.horario}</Text>
              <Text style={[styles.horario, { fontSize }]}>Frequência: {item.frequencia || '-'}</Text>
            </View>
            <TouchableOpacity
              style={styles.botaoRemover}
              onPress={() => removerRemedio(item.nome)}
            >
              <Text style={[styles.removerTexto, { fontSize }]}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
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
    </View>
  );
}
