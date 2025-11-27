// LoginScreen.js
// Tela de login do usuário
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppThemeContext from '../AppThemeContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  let { scheme, fontSize } = useContext(AppThemeContext);
  if (Platform.OS === 'web') scheme = 'light';

  // Função autenticar usuário
  const handleLogin = async () => {
    if(!email || !senha){
      alert('Email e Senha Obrigatórios');
      return;
    }
    const usuarioSalvo = await AsyncStorage.getItem('usuario');
    if(usuarioSalvo){
      const usuario = JSON.parse(usuarioSalvo);
      if(usuario.email === email && usuario.senha === senha){
        navigation.navigate('TelaPrincipal', { nomePaciente: usuario.nome });
        return;
      }
    }
    alert('Email ou senha incorretos!');
  };

  // Render da tela de login
  return (
    <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: scheme === 'dark' ? '#222' : '#f7f7f7' }]}>
      <Text style={{ fontSize, color: scheme === 'dark' ? '#fff' : '#1976d2', fontWeight: 'bold', marginBottom: 20 }}>Entrar no MedAlerta</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: '#aaa', borderRadius: 8, padding: 10, fontSize, marginBottom: 10, width: 250 }}
        placeholder="E-mail"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: '#aaa', borderRadius: 8, padding: 10, fontSize, marginBottom: 10, width: 250 }}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TouchableOpacity style={{ backgroundColor: '#1976d2', padding: 12, borderRadius: 8, marginTop: 10 }} onPress={handleLogin}>
        <Text style={{ color: '#fff', fontSize, fontWeight: 'bold' }}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}
