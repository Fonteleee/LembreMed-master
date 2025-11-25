import React, { useContext } from 'react';
import { Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { AppThemeContext } from '../App';
import styles from './HomeScreen.styles';  // Importa o arquivo de estilos

export default function HomeScreen({ navigation }) {
  const { scheme, fontSize } = useContext(AppThemeContext);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: scheme === 'dark' ? '#222' : '#fff' }] }>
      <Text style={[styles.title, { fontSize, color: scheme === 'dark' ? '#fff' : '#000' }]}>💊 LembreMed</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.buttonText, { fontSize }]}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Cadastro')}>
        <Text style={[styles.buttonText, { fontSize }]}>Cadastrar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
