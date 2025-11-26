import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList } from 'react-native';
import RemedioService from './RemedioService';
import { AppThemeContext } from '../App';

export default function HistoricoScreen() {
  const [historico, setHistorico] = useState([]);
  const { scheme, fontSize } = useContext(AppThemeContext);

  useEffect(() => {
    setHistorico(RemedioService.listarHistorico());
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: scheme === 'dark' ? '#222' : '#fff' }}>
      <Text style={{ fontSize: fontSize + 4, marginBottom: 12, color: scheme === 'dark' ? '#fff' : '#000' }}>
        Histórico de Medicamentos
      </Text>
      <FlatList
        data={historico}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={{ borderLeftWidth: 8, borderLeftColor: item.cor || '#4caf50', marginBottom: 8, paddingLeft: 8 }}>
            <Text style={{ fontSize, color: scheme === 'dark' ? '#fff' : '#000' }}>
              {item.nome} - {item.horario} - {item.dosagem || '-'}
            </Text>
            <Text style={{ fontSize: fontSize - 2, color: scheme === 'dark' ? '#fff' : '#000' }}>
              Adicionado em: {item.dataAdicao ? new Date(item.dataAdicao).toLocaleString() : '-'}
            </Text>
            <Text style={{ fontSize: fontSize - 2, color: scheme === 'dark' ? '#fff' : '#000' }}>
              Registro: {item.data ? new Date(item.data).toLocaleString() : '-'}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ fontSize, color: scheme === 'dark' ? '#fff' : '#000' }}>Nenhum registro encontrado.</Text>}
      />
    </View>
  );
}
