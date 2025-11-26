import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity, Text, Platform } from 'react-native';
import RemedioService from './RemedioService';
import AppThemeContext from '../AppThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

const medicamentos = ['Dipirona', 'Paracetamol', 'Ibuprofeno', 'Amoxicilina', 'Omeprazol'];
const frequencias = [
  { label: 'Diário', value: 'diario' },
  { label: 'Semanal', value: 'semanal' },
  { label: 'Mensal', value: 'mensal' }
];

export default function AdicionarRemedioScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [sugestoes, setSugestoes] = useState([]);
  const [frequencia, setFrequencia] = useState('diario');
  const [horarioManual, setHorarioManual] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [cor, setCor] = useState('#4caf50');
  const [diasRecomendados, setDiasRecomendados] = useState('');
  let { scheme, fontSize } = useContext(AppThemeContext);
  if (Platform.OS === 'web') {
    scheme = 'light';
  }

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  const solicitarPermissao = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Ative as notificações para receber lembretes.');
      return false;
    }
    return true;
  };

  const salvar = async () => {
    if (nome.trim() === '' || horarios.length === 0 || dosagem.trim() === '' || diasRecomendados.trim() === '') {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    const permitido = await solicitarPermissao();
    if (!permitido) return;
    const dataAdicao = new Date();
    RemedioService.adicionarRemedio({ nome, horarios, frequencia, dosagem, cor, dataAdicao, diasRecomendados });
    horarios.forEach(async horario => {
      RemedioService.registrarUso(nome, typeof horario === 'string' ? horario : horario.toLocaleTimeString());
      // Agendar notificação local
      let horarioDate;
      if (typeof horario === 'string') {
        // Suporta formato HH:mm
        const [h, m] = horario.split(':');
        horarioDate = new Date();
        horarioDate.setHours(Number(h));
        horarioDate.setMinutes(Number(m));
        horarioDate.setSeconds(0);
        if (horarioDate < new Date()) {
          // Se o horário já passou hoje, agenda para amanhã
          horarioDate.setDate(horarioDate.getDate() + 1);
        }
      } else {
        horarioDate = horario;
        if (horarioDate < new Date()) {
          horarioDate.setDate(horarioDate.getDate() + 1);
        }
      }
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Hora de tomar ${nome}`,
          body: `Dosagem: ${dosagem}. Não esqueça!`,
          sound: true,
        },
        trigger: {
          date: horarioDate,
        },
      });
    });
    navigation.goBack();
  };

  const handleNomeChange = (text) => {
    setNome(text);
    setSugestoes(medicamentos.filter(med => med.toLowerCase().includes(text.toLowerCase())));
  };

  const handleAddHorario = (event, selectedDate) => {
    setShowPicker(false);
    if (Platform.OS === 'web') {
      // No web, usar input manual
      if (horarioManual.trim() !== '') {
        setHorarios([...horarios, horarioManual]);
        setHorarioManual('');
      }
    } else {
      if (selectedDate) {
        setHorarios([...horarios, selectedDate]);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: scheme === 'dark' ? '#222' : '#f7f7f7' }] }>
      <TextInput
        placeholder="Nome do remédio"
        value={nome}
        onChangeText={handleNomeChange}
        style={[styles.input, { fontSize, color: '#222' }]}
      />
      {sugestoes.length > 0 && (
        <FlatList
          data={sugestoes}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => { setNome(item); setSugestoes([]); }}>
              <Text style={{ padding: 8, fontSize, color: scheme === 'dark' ? '#fff' : '#000' }}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <Button title="Adicionar horário" onPress={() => setShowPicker(true)} />
      {showPicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleAddHorario}
        />
      )}
      {showPicker && Platform.OS === 'web' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
          <TextInput
            placeholder="Horário (ex: 08:00)"
            value={horarioManual}
            onChangeText={setHorarioManual}
            style={[styles.input, { width: 100, fontSize, color: scheme === 'dark' ? '#fff' : '#000' }]}
          />
          <Button title="OK" onPress={handleAddHorario} />
        </View>
      )}
      <FlatList
        data={horarios}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <Text style={{ fontSize, color: scheme === 'dark' ? '#fff' : '#000' }}>{typeof item === 'string' ? item : item.toLocaleTimeString()}</Text>
        )}
      />
      <Text style={{ fontSize, marginTop: 10 }}>Frequência:</Text>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        {frequencias.map(item => (
          <TouchableOpacity key={item.value} onPress={() => setFrequencia(item.value)} style={{ margin: 5, padding: 8, backgroundColor: frequencia === item.value ? item.cor || '#4caf50' : '#ccc', borderRadius: 8 }}>
            <Text style={{ fontSize, color: '#fff' }}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        placeholder="Dosagem (ex: 500mg)"
        value={dosagem}
        onChangeText={setDosagem}
        style={[styles.input, { fontSize, color: scheme === 'dark' ? '#fff' : '#000' }]}
      />
      <Text style={{ fontSize, marginTop: 10 }}>Cor do medicamento:</Text>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        {['#4caf50', '#1976d2', '#e53935', '#fbc02d', '#8e24aa'].map(corOption => (
          <TouchableOpacity key={corOption} onPress={() => setCor(corOption)} style={{ backgroundColor: corOption, width: 32, height: 32, borderRadius: 16, margin: 4, borderWidth: cor === corOption ? 2 : 0, borderColor: '#000' }} />
        ))}
      </View>
      <TextInput
        placeholder="Dias recomendados de uso"
        value={diasRecomendados}
        onChangeText={setDiasRecomendados}
        keyboardType="numeric"
        style={[styles.input, { fontSize, color: scheme === 'dark' ? '#fff' : '#000' }]}
      />
      <Button title="Salvar" onPress={salvar} />
    </View>
  );
}

async function agendarNotificacao(medicamento, horario, frequencia) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hora do medicamento!',
      body: `Tomar ${medicamento}`,
      sound: true,
      sticky: true,
    },
    trigger: {
      hour: horario.getHours(),
      minute: horario.getMinutes(),
      repeats: true,
    },
  });
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
  },
});
