
// Tela inicial do app, mostra opções de login e cadastro
import React, { useContext } from 'react';
import { Text, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import AppThemeContext from '../AppThemeContext';
import styles from './HomeScreen.styles';

export default function HomeScreen({ navigation }) {
  let { scheme, fontSize } = useContext(AppThemeContext);
  // Força modo claro no web
  if (Platform.OS === 'web') scheme = 'light';

  // Render da tela inicial
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: scheme === 'dark' ? '#222' : '#f7f7f7' }] }>
      <Text style={[styles.title, { fontSize, color: scheme === 'dark' ? '#fff' : '#1976d2', fontWeight: 'bold', letterSpacing: 1 }]}>💊 MedAlerta</Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#1976d2' }]} onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.buttonText, { fontSize, color: '#fff', fontWeight: 'bold' }]}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#43a047' }]} onPress={() => navigation.navigate('Cadastro')}>
        <Text style={[styles.buttonText, { fontSize, color: '#fff', fontWeight: 'bold' }]}>Cadastrar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
