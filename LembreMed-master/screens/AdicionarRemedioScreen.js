// AdicionarRemedioScreen.js
import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Button, Alert, FlatList, TouchableOpacity, Text, Platform } from 'react-native';
import RemedioService from './RemedioService';
import AppThemeContext from '../AppThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

// Lista de sugestões para facilitar o cadastro
const listaMedicamentos = ['Dipirona', 'Paracetamol', 'Ibuprofeno', 'Amoxicilina', 'Omeprazol'];
const opcoesFrequencia = [
  { label: 'Diário', value: 'diario' },
  { label: 'Semanal', value: 'semanal' },
  { label: 'Mensal', value: 'mensal' }
];

export default function AdicionarRemedioScreen({ navigation }) {
  // Estados do formulário
  const [nome, setNome] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [sugestoes, setSugestoes] = useState([]);
  const [frequencia, setFrequencia] = useState('diario');
  const [horarioManual, setHorarioManual] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [cor, setCor] = useState('#4caf50');
  const [diasRecomendados, setDiasRecomendados] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [dataAlerta, setDataAlerta] = useState(new Date());
  let { scheme, fontSize } = useContext(AppThemeContext);
  if (Platform.OS === 'web') scheme = 'light';

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  // Função para salvar o remédio e agendar notificação
  const salvar = async () => {
    if (!nome.trim() || horarios.length === 0 || !dosagem.trim() || !diasRecomendados.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    const dataAdicao = new Date();
    RemedioService.adicionarRemedio({ nome, horarios, frequencia, dosagem, cor, dataAdicao, diasRecomendados, dataAlerta });
    // Agenda notificação para cada horário
    horarios.forEach(async horario => {
      let horarioStr;
      let horarioDate;
      if (typeof horario === 'string') {
        horarioStr = horario;
        const [h, m] = horario.split(':');
        horarioDate = new Date(dataAlerta);
        horarioDate.setHours(Number(h));
        horarioDate.setMinutes(Number(m));
        horarioDate.setSeconds(0);
        if (horarioDate < new Date()) {
          if (frequencia === 'diario') horarioDate.setDate(horarioDate.getDate() + 1);
          if (frequencia === 'semanal') horarioDate.setDate(horarioDate.getDate() + 7);
          if (frequencia === 'mensal') horarioDate.setMonth(horarioDate.getMonth() + 1);
        }
      } else {
        horarioStr = horario.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        horarioDate = new Date(dataAlerta);
        horarioDate.setHours(horario.getHours());
        horarioDate.setMinutes(horario.getMinutes());
        horarioDate.setSeconds(0);
        if (horarioDate < new Date()) {
          if (frequencia === 'diario') horarioDate.setDate(horarioDate.getDate() + 1);
          if (frequencia === 'semanal') horarioDate.setDate(horarioDate.getDate() + 7);
          if (frequencia === 'mensal') horarioDate.setMonth(horarioDate.getMonth() + 1);
        }
      }
      RemedioService.registrarUso(nome, horarioStr);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Hora de tomar ${nome}`,
          body: `Dosagem: ${dosagem}. Não esqueça!`,
          sound: true,
        },
        trigger:
          frequencia === 'diario'
            ? { date: horarioDate, repeats: true }
            : frequencia === 'semanal'
            ? { date: horarioDate, repeats: true, interval: 'week' }
            : frequencia === 'mensal'
            ? { date: horarioDate, repeats: true, interval: 'month' }
            : { date: horarioDate, repeats: false },
      });
    });
    navigation.goBack();
  };

  // Sugestão automática de medicamentos
  const handleNomeChange = (texto) => {
    setNome(texto);
    setSugestoes(listaMedicamentos.filter(med => med.toLowerCase().includes(texto.toLowerCase())));
  };

  // Adiciona horário selecionado
  const handleAddHorario = (event, selectedDate) => {
    if (Platform.OS !== 'web') {
      if (selectedDate) setHorarioSelecionado(selectedDate);
      setShowPicker(false);
    } else {
      setShowPicker(false);
      if (horarioManual.trim() !== '') {
        setHorarioSelecionado(horarioManual);
        setHorarioManual('');
      }
    }
  };

  // Render  formulário
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Nome do remédio"
        value={nome}
        onChangeText={handleNomeChange}
        style={{ borderWidth: 1, borderColor: '#aaa', borderRadius: 8, padding: 10, fontSize, marginBottom: 10 }}
      />
      {sugestoes.length > 0 && (
        <FlatList
          data={sugestoes}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => { setNome(item); setSugestoes([]); }}>
              <Text style={{ padding: 8, fontSize }}>{item}</Text>
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
            style={{ borderWidth: 1, borderColor: '#aaa', borderRadius: 8, padding: 10, width: 100, fontSize }}
          />
          <Button title="OK" onPress={handleAddHorario} />
        </View>
      )}
      {horarioSelecionado && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
          <Text style={{ fontSize, marginRight: 8 }}>
            {typeof horarioSelecionado === 'string' ? horarioSelecionado : horarioSelecionado.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Button title="Salvar Horário" onPress={() => {
            setHorarios([...horarios, horarioSelecionado]);
            setHorarioSelecionado(null);
          }} />
          <Button title="Cancelar" onPress={() => setHorarioSelecionado(null)} />
        </View>
      )}
      <FlatList
        data={horarios}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
            <Text style={{ fontSize, flex: 1 }}>
              {typeof item === 'string' ? item : item.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <TouchableOpacity onPress={() => {
              setHorarioSelecionado(item);
              setHorarios(horarios.filter((_, idx) => idx !== index));
            }} style={{ marginHorizontal: 4, backgroundColor: '#1976d2', padding: 6, borderRadius: 4 }}>
              <Text style={{ color: '#fff', fontSize }}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setHorarios(horarios.filter((_, idx) => idx !== index))} style={{ backgroundColor: '#e53935', padding: 6, borderRadius: 4 }}>
              <Text style={{ color: '#fff', fontSize }}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={{ fontSize, marginTop: 10 }}>Frequência:</Text>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        {opcoesFrequencia.map(item => (
          <TouchableOpacity key={item.value} onPress={() => setFrequencia(item.value)} style={{ margin: 5, padding: 8, backgroundColor: frequencia === item.value ? cor : '#ccc', borderRadius: 8 }}>
            <Text style={{ fontSize, color: '#fff' }}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        placeholder="Dosagem (ex: 500mg)"
        value={dosagem}
        onChangeText={setDosagem}
        style={{ borderWidth: 1, borderColor: '#aaa', borderRadius: 8, padding: 10, fontSize, marginBottom: 10 }}
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
        style={{ borderWidth: 1, borderColor: '#aaa', borderRadius: 8, padding: 10, fontSize, marginBottom: 10 }}
      />
      <View style={{ marginVertical: 8 }}>
        <Text style={{ fontSize, marginBottom: 4 }}>Data inicial do alerta:</Text>
        <DateTimePicker
          value={dataAlerta}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) setDataAlerta(selectedDate);
          }}
        />
      </View>
      <Button title="Salvar" onPress={salvar} />
    </View>
  );
}
