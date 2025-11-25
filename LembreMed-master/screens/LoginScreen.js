import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AppThemeContext } from '../App';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { scheme, fontSize } = useContext(AppThemeContext);

  const handleLogin = () => {
    // Aqui você pode validar ou navegar
    
    if(!email || !senha){
      alert(`Email e Senha Obrigatórios`);
      return;
    }
    navigation.navigate('BoasVindas');
    //  navigation.navigate('BoasVindas', { nomeUsuario: nome });
  };

  return (
    <View style={[styles.container, { backgroundColor: scheme === 'dark' ? '#222' : '#E8F5E9' }] }>
      <Text style={[styles.title, { fontSize, color: scheme === 'dark' ? '#fff' : '#2E7D32' }]}>Entrar no LembreMed</Text>

      <TextInput
        style={[styles.input, { fontSize, color: scheme === 'dark' ? '#fff' : '#000' }]}
        placeholder="E-mail"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[styles.input, { fontSize, color: scheme === 'dark' ? '#fff' : '#000' }]}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={[styles.buttonText, { fontSize }]}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  button: {
    backgroundColor: '#66BB6A',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
  },
});
